"""Rules engine and terminal entry point for the Phase 1 MVP."""

from dataclasses import dataclass, field
from enum import StrEnum
from pathlib import Path
from random import Random
import sys
from typing import Callable

if __package__:
    from .board import Board, Location
    from .cards import CardType, HostDefenseCard, PathogenCard, starter_host_deck, starter_pathogen_deck
    from .player import Player, Role
else:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from outbreak.board import Board, Location
    from outbreak.cards import CardType, HostDefenseCard, PathogenCard, starter_host_deck, starter_pathogen_deck
    from outbreak.player import Player, Role


class Phase(StrEnum):
    DRAW = "draw"
    BIOLOGY = "biology"
    ACTIONS = "actions"
    RESPONSE = "response"
    PROGRESSION = "progression"


class Winner(StrEnum):
    PATHOGEN = "Pathogen"
    HOST = "Host Defense"


class GameOverError(RuntimeError):
    """Raised when an action is attempted after a win condition."""


@dataclass
class GameState:
    board: Board = field(default_factory=Board)
    pathogen: Player = field(default_factory=lambda: Player(Role.PATHOGEN, starter_pathogen_deck()))
    host: Player = field(default_factory=lambda: Player(Role.HOST, starter_host_deck()))
    disease: int = 0
    round_number: int = 0
    phase: Phase = Phase.DRAW
    active_role: Role = Role.PATHOGEN
    winner: Winner | None = None
    infection_established: bool = False
    events: list[str] = field(default_factory=list)
    _pathogen_cards: dict[str, PathogenCard] = field(default_factory=dict, repr=False)

    def __post_init__(self) -> None:
        self._pathogen_cards = {card.name: card for card in self.pathogen.deck if isinstance(card, PathogenCard)}

    @property
    def active_player(self) -> Player:
        return self.pathogen if self.active_role is Role.PATHOGEN else self.host

    @property
    def opposing_player(self) -> Player:
        return self.host if self.active_role is Role.PATHOGEN else self.pathogen

    def log(self, message: str) -> None:
        self.events.append(message)

    def start_turn(self, role: Role) -> None:
        self._ensure_playing()
        self.active_role = role
        self.phase = Phase.DRAW
        self.round_number += 1 if role is Role.PATHOGEN else 0
        player = self.active_player
        player.draw()
        player.energy += 1
        player.actions_remaining = 2
        self.log(f"{role.value} turn begins: energy +1")
        self.phase = Phase.BIOLOGY
        if role is Role.PATHOGEN:
            self.resolve_biology()
        self.phase = Phase.ACTIONS

    def resolve_biology(self) -> None:
        self._ensure_playing()
        for location, state in self.board.locations.items():
            for name, population in list(state.pathogens.items()):
                card = self._pathogen_cards[name]
                state.add_population(name, card.replication)
                self.log(f"{name} replicates in {location.value}: population +{card.replication}")

    def perform_action(self, action: str, **kwargs: object) -> bool:
        self._ensure_playing()
        if self.phase is not Phase.ACTIONS:
            raise ValueError("actions are only available during the ACTIONS phase")
        if self.active_player.actions_remaining <= 0:
            raise ValueError("the active player has no actions remaining")
        handlers = {
            "infect": self.infect,
            "replicate": self.replicate,
            "spread": self.spread,
            "virulence": self.activate_virulence,
            "deploy": self.deploy,
            "diagnose": self.diagnose,
            "treat": self.treat,
            "contain": self.contain,
        }
        if action not in handlers:
            raise ValueError(f"unknown action: {action}")
        result = handlers[action](**kwargs)
        self.active_player.actions_remaining -= 1
        self.phase = Phase.RESPONSE
        return result

    def end_response(self) -> None:
        if self.phase is not Phase.RESPONSE:
            raise ValueError("there is no response window")
        self.phase = Phase.ACTIONS

    def play_response(self, card_name: str, location: Location) -> bool:
        if self.phase is not Phase.RESPONSE:
            raise ValueError("responses are only available after an action")
        card = next((card for card in self.opposing_player.hand if card.name == card_name), None)
        if not isinstance(card, HostDefenseCard) or card.card_type is not CardType.RESPONSE:
            raise ValueError(f"{card_name} is not a response card in hand")
        if self.opposing_player.energy < card.cost:
            raise ValueError("insufficient Biological Energy")
        self.opposing_player.energy -= card.cost
        self.opposing_player.remove_card(card)
        if card.action == "clear":
            self._clear_location(location, card.potency)
        self.log(f"{card.name} responds in {location.value}")
        self.phase = Phase.ACTIONS
        return True

    def progression(self) -> Winner | None:
        self.phase = Phase.PROGRESSION
        for location, state in self.board.locations.items():
            state.infection = min(5, state.population // 1)
            state.tissue_damage = min(5, state.population // 3)
        gain = sum(
            state.population // 3
            + sum(1 for name in state.pathogens if self._pathogen_cards[name].virulence >= 4)
            for state in self.board.locations.values()
        )
        self.disease = min(10, self.disease + gain)
        self.log(f"Progression: disease +{gain} (now {self.disease})")
        if self.disease >= 9:
            self.winner = Winner.PATHOGEN
        elif self.infection_established and self.board.total_population() == 0 and self.board.total_infection() == 0:
            self.winner = Winner.HOST
        return self.winner

    def run_round(self) -> Winner | None:
        self.start_turn(Role.PATHOGEN)
        self.end_turn()
        if self.winner:
            return self.winner
        self.start_turn(Role.HOST)
        self.end_turn()
        return self.winner

    def end_turn(self) -> Winner | None:
        if self.phase is Phase.RESPONSE:
            self.end_response()
        return self.progression()

    def infect(self, pathogen_name: str, location: Location) -> bool:
        card = self._pathogen_cards.get(pathogen_name)
        if card is None:
            raise ValueError(f"unknown pathogen: {pathogen_name}")
        state = self.board.locations[location]
        if card.infectivity + card.evasion <= state.defense:
            self.log(f"{pathogen_name} fails to infect {location.value}")
            return False
        state.add_population(pathogen_name, 1)
        self.infection_established = True
        self.log(f"{pathogen_name} infects {location.value}: population +1")
        return True

    def replicate(self, pathogen_name: str, location: Location) -> bool:
        card = self._pathogen_cards[pathogen_name]
        self.board.locations[location].add_population(pathogen_name, card.replication)
        self.log(f"{pathogen_name} replicates by action: population +{card.replication}")
        return True

    def spread(self, pathogen_name: str, source: Location, target: Location) -> bool:
        source_state = self.board.locations[source]
        if source_state.pathogens.get(pathogen_name, 0) < 1:
            raise ValueError(f"{pathogen_name} is not present in {source.value}")
        source_state.add_population(pathogen_name, -1)
        self.board.locations[target].add_population(pathogen_name, 1)
        self.log(f"{pathogen_name} spreads from {source.value} to {target.value}")
        return True

    def activate_virulence(self, pathogen_name: str, amount: int = 1) -> bool:
        if pathogen_name not in self._pathogen_cards:
            raise ValueError(f"unknown pathogen: {pathogen_name}")
        self.disease = min(10, self.disease + amount)
        self.log(f"{pathogen_name} activates a virulence factor: disease +{amount}")
        return True

    def deploy(self, card_name: str, location: Location) -> bool:
        card = self._take_host_card(card_name, CardType.IMMUNE)
        self._clear_location(location, card.potency)
        self.board.immune_zone.append(card.name)
        self.log(f"{card.name} deploys in {location.value}")
        return True

    def diagnose(self, card_name: str = "PCR") -> bool:
        card = self._take_host_card(card_name, CardType.DIAGNOSTIC)
        self.board.clinical_zone.append(card.name)
        self.log(f"{card.name} identifies {self.board.total_population()} total pathogen population")
        return True

    def treat(self, card_name: str, location: Location) -> bool:
        card = self._take_host_card(card_name, CardType.TREATMENT)
        state = self.board.locations[location]
        for name in list(state.pathogens):
            pathogen = self._pathogen_cards[name]
            if pathogen.pathogen_class == card.target_class:
                self._clear_pathogen(location, name, card.potency, pathogen.persistence)
        self.board.clinical_discard.append(card.name)
        self.log(f"{card.name} treats {location.value}")
        return True

    def contain(self, location: Location) -> bool:
        self.board.locations[location].defense += 1
        self.log(f"Containment strengthens defense in {location.value}")
        return True

    def _take_host_card(self, name: str, card_type: CardType) -> HostDefenseCard:
        card = next((card for card in self.host.hand if card.name == name), None)
        if not isinstance(card, HostDefenseCard) or card.card_type is not card_type:
            raise ValueError(f"{name} is not a {card_type.value} card in hand")
        if self.host.energy < card.cost:
            raise ValueError("insufficient Biological Energy")
        self.host.energy -= card.cost
        self.host.remove_card(card)
        return card

    def _clear_location(self, location: Location, potency: int) -> None:
        state = self.board.locations[location]
        for name in list(state.pathogens):
            pathogen = self._pathogen_cards[name]
            self._clear_pathogen(location, name, potency, pathogen.persistence)

    def _clear_pathogen(self, location: Location, name: str, potency: int, persistence: int) -> None:
        amount = max(0, potency - max(0, persistence - 1))
        self.board.locations[location].add_population(name, -amount)

    def _ensure_playing(self) -> None:
        if self.winner is not None:
            raise GameOverError(f"game already won by {self.winner.value}")


def new_game(seed: int | None = None) -> GameState:
    random = Random(seed)
    pathogen_deck = starter_pathogen_deck()
    host_deck = starter_host_deck()
    random.shuffle(pathogen_deck)
    random.shuffle(host_deck)
    game = GameState(
        pathogen=Player(Role.PATHOGEN, pathogen_deck),
        host=Player(Role.HOST, host_deck),
    )
    for _ in range(2):
        game.pathogen.draw()
        game.host.draw()
    return game


def run_cli(input_fn: Callable[[str], str] = input, output_fn: Callable[[str], None] = print) -> None:
    game = new_game()
    output_fn("OUTBREAK: Pathogen vs Host Defense")
    output_fn("Type 'help' for commands, or 'quit' to leave.")
    while game.winner is None:
        role = game.active_role
        game.start_turn(role)
        output_fn(f"\n{role.value} turn | energy={game.active_player.energy}")
        while game.active_player.actions_remaining and game.winner is None:
            command = input_fn("action> ").strip()
            command_name = command.lower()
            if command_name == "quit":
                return
            if command_name == "help":
                output_fn("Commands: status, end, infect, replicate, deploy, diagnose, treat, quit")
                continue
            if command_name == "status":
                output_fn(_status(game))
                continue
            if command_name == "end":
                break
            if command_name == "pass":
                continue
            try:
                _run_cli_action(game, command, output_fn)
            except (KeyError, ValueError) as error:
                output_fn(f"Invalid action: {error}")
                continue
            if game.phase is Phase.RESPONSE and game.winner is None:
                response = input_fn("response (pass or CARD | LOCATION)> ").strip()
                if response.lower() != "pass":
                    try:
                        card_name, location_text = response.split("|", maxsplit=1)
                        game.play_response(card_name.strip(), _parse_location(location_text))
                    except (ValueError, KeyError) as error:
                        output_fn(f"Response skipped: {error}")
                        game.end_response()
                else:
                    game.end_response()
        game.end_turn()
        if game.winner is None:
            game.active_role = Role.HOST if role is Role.PATHOGEN else Role.PATHOGEN
    output_fn(f"Winner: {game.winner.value}")


def _status(game: GameState) -> str:
    locations = ", ".join(
        f"{location.value}: {state.population} population / infection {state.infection}"
        for location, state in game.board.locations.items()
        if state.population
    ) or "no active infection"
    return f"Disease {game.disease}/10 | {locations}"


def _parse_location(text: str) -> Location:
    aliases = {
        "cns": Location.CNS,
        "respiratory": Location.RESPIRATORY,
        "respiratory tract": Location.RESPIRATORY,
        "gi": Location.GI,
        "gi tract": Location.GI,
        "blood": Location.BLOOD,
        "skin": Location.SKIN,
        "skin / other": Location.SKIN,
    }
    return aliases[text.strip().lower()]


def _run_cli_action(game: GameState, command: str, output_fn: Callable[[str], None]) -> None:
    parts = [part.strip() for part in command.split("|", maxsplit=2)]
    action = parts[0].lower()
    if action in {"infect", "replicate", "deploy", "treat"} and len(parts) == 3:
        if action in {"infect", "replicate"}:
            game.perform_action(action, pathogen_name=parts[1], location=_parse_location(parts[2]))
        else:
            game.perform_action(action, card_name=parts[1], location=_parse_location(parts[2]))
    elif action == "diagnose" and len(parts) == 2:
        game.perform_action(action, card_name=parts[1])
    elif action == "contain" and len(parts) == 2:
        game.perform_action(action, location=_parse_location(parts[1]))
    else:
        raise ValueError("use ACTION | NAME | LOCATION, or diagnose | PCR")
    output_fn(game.events[-1])


def main() -> None:
    """Start the OUTBREAK command-line game."""
    run_cli()


if __name__ == "__main__":
    main()
