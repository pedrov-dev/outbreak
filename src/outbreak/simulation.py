"""Heuristic game simulation for balance checks and regression testing."""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from random import Random

if __package__:
	from .board import Location
	from .game import GameState, Winner, new_game
	from .player import Role
else:
	sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
	from outbreak.board import Location
	from outbreak.game import GameState, Winner, new_game
	from outbreak.player import Role


@dataclass(frozen=True)
class GameResult:
	"""Summary of one simulated game."""

	winner: Winner | None
	rounds: int
	disease: int
	final_population: int
	events: int


@dataclass(frozen=True)
class SimulationSummary:
	"""Aggregate results from a batch of simulated games."""

	games: int
	pathogen_wins: int
	host_wins: int
	draws: int
	average_rounds: float
	average_disease: float
	average_final_population: float

	@property
	def pathogen_win_rate(self) -> float:
		return self.pathogen_wins / self.games if self.games else 0.0

	@property
	def host_win_rate(self) -> float:
		return self.host_wins / self.games if self.games else 0.0

	def format(self) -> str:
		return "\n".join(
			[
				f"Games: {self.games}",
				f"Pathogen wins: {self.pathogen_wins} ({self.pathogen_win_rate:.1%})",
				f"Host wins: {self.host_wins} ({self.host_win_rate:.1%})",
				f"Draws: {self.draws}",
				f"Average rounds: {self.average_rounds:.2f}",
				f"Average disease: {self.average_disease:.2f}",
				f"Average final population: {self.average_final_population:.2f}",
			]
		)


def play_game(seed: int | None = None, max_rounds: int = 50) -> GameResult:
	"""Run one game with simple deterministic heuristics and a seeded RNG."""
	random = Random(seed)
	game = new_game(seed)
	for _ in range(max_rounds):
		if game.winner is not None:
			break
		_play_pathogen_turn(game, random)
		if game.winner is not None:
			break
		_play_host_turn(game, random)

	return GameResult(
		winner=game.winner,
		rounds=game.round_number,
		disease=game.disease,
		final_population=game.board.total_population(),
		events=len(game.events),
	)


def run_simulation(games: int = 100, seed: int = 0, max_rounds: int = 50) -> SimulationSummary:
	"""Run a reproducible batch of games and calculate balance metrics."""
	if games < 0:
		raise ValueError("games must be non-negative")
	if max_rounds < 1:
		raise ValueError("max_rounds must be positive")

	results = [play_game(seed=seed + index, max_rounds=max_rounds) for index in range(games)]
	pathogen_wins = sum(result.winner is Winner.PATHOGEN for result in results)
	host_wins = sum(result.winner is Winner.HOST for result in results)
	draws = games - pathogen_wins - host_wins
	return SimulationSummary(
		games=games,
		pathogen_wins=pathogen_wins,
		host_wins=host_wins,
		draws=draws,
		average_rounds=_average(result.rounds for result in results),
		average_disease=_average(result.disease for result in results),
		average_final_population=_average(result.final_population for result in results),
	)


def _play_pathogen_turn(game: GameState, random: Random) -> None:
	game.start_turn(Role.PATHOGEN)
	location = _pathogen_location(game)
	pathogen_name = _pathogen_name(game)
	if pathogen_name is None:
		game.end_turn()
		return

	if game.board.locations[location].pathogens:
		game.perform_action("replicate", pathogen_name=pathogen_name, location=location)
	else:
		game.perform_action("infect", pathogen_name=pathogen_name, location=location)
	_pass_response(game)

	if game.active_player.actions_remaining:
		if random.random() < 0.35:
			game.perform_action("virulence", pathogen_name=pathogen_name)
		else:
			game.perform_action("replicate", pathogen_name=pathogen_name, location=location)
		_pass_response(game)
	game.end_turn()


def _play_host_turn(game: GameState, random: Random) -> None:
	game.start_turn(Role.HOST)
	location = _most_populated_location(game)
	if location is None:
		game.end_turn()
		return

	if _can_play_host_card(game, "Macrophage"):
		game.perform_action("deploy", card_name="Macrophage", location=location)
	elif _can_play_host_card(game, "Antibiotic"):
		game.perform_action("treat", card_name="Antibiotic", location=location)
	else:
		game.perform_action("contain", location=location)
	_pass_response(game)

	if game.active_player.actions_remaining:
		if random.random() < 0.5 and _can_play_host_card(game, "PCR"):
			game.perform_action("diagnose", card_name="PCR")
		else:
			game.perform_action("contain", location=location)
		_pass_response(game)
	game.end_turn()


def _pass_response(game: GameState) -> None:
	if game.phase.value == "response":
		game.end_response()


def _pathogen_location(game: GameState) -> Location:
	for location, state in game.board.locations.items():
		if state.population:
			return location
	return Location.GI


def _most_populated_location(game: GameState) -> Location | None:
	populated = [(state.population, location) for location, state in game.board.locations.items() if state.population]
	return max(populated)[1] if populated else None


def _pathogen_name(game: GameState) -> str | None:
	if game.pathogen.hand:
		return next((card.name for card in game.pathogen.hand if card.name in {"E. coli", "Influenza"}), None)
	return next(iter(game._pathogen_cards), None)


def _can_play_host_card(game: GameState, card_name: str) -> bool:
	return any(card.name == card_name and card.cost <= game.host.energy for card in game.host.hand)


def _average(values: object) -> float:
	values = list(values)  # type: ignore[arg-type]
	return sum(values) / len(values) if values else 0.0


def main() -> None:
	parser = argparse.ArgumentParser(description="Run OUTBREAK balance simulations.")
	parser.add_argument("--games", type=int, default=100, help="number of games to run")
	parser.add_argument("--seed", type=int, default=0, help="starting random seed")
	parser.add_argument("--max-rounds", type=int, default=50, help="round limit per game")
	args = parser.parse_args()
	print(run_simulation(args.games, args.seed, args.max_rounds).format())


if __name__ == "__main__":
	main()
