"""Heuristic game simulation for balance checks and regression testing."""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from random import Random
from statistics import median, pstdev

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
	median_rounds: float
	rounds_stddev: float
	min_rounds: int
	max_rounds: int
	median_disease: float
	disease_stddev: float
	median_final_population: float
	population_stddev: float
	average_pathogen_win_rounds: float
	average_host_win_rounds: float

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
				f"Median rounds: {self.median_rounds:.2f} (range {self.min_rounds}-{self.max_rounds}, σ {self.rounds_stddev:.2f})",
				f"Average disease: {self.average_disease:.2f}",
				f"Median disease: {self.median_disease:.2f} (σ {self.disease_stddev:.2f})",
				f"Average final population: {self.average_final_population:.2f}",
				f"Median final population: {self.median_final_population:.2f} (σ {self.population_stddev:.2f})",
				f"Average rounds to pathogen win: {self.average_pathogen_win_rounds:.2f}",
				f"Average rounds to host win: {self.average_host_win_rounds:.2f}",
			]
		)


def play_game(seed: int | None = None, max_rounds: int = 50) -> GameResult:
	"""Run one game with simple seeded heuristics."""
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
		median_rounds=_median(result.rounds for result in results),
		rounds_stddev=_stddev(result.rounds for result in results),
		min_rounds=min((result.rounds for result in results), default=0),
		max_rounds=max((result.rounds for result in results), default=0),
		median_disease=_median(result.disease for result in results),
		disease_stddev=_stddev(result.disease for result in results),
		median_final_population=_median(result.final_population for result in results),
		population_stddev=_stddev(result.final_population for result in results),
		average_pathogen_win_rounds=_average(
			result.rounds for result in results if result.winner is Winner.PATHOGEN
		),
		average_host_win_rounds=_average(
			result.rounds for result in results if result.winner is Winner.HOST
		),
	)


def _play_pathogen_turn(game: GameState, random: Random) -> None:
	game.start_turn(Role.PATHOGEN)
	location = _pathogen_location(game, random)
	pathogen_name = _pathogen_name(game, random)
	if pathogen_name is None:
		game.end_turn()
		return

	if game.board.locations[location].pathogens:
		game.perform_action("replicate", pathogen_name=pathogen_name, location=location)
	else:
		game.perform_action("infect", pathogen_name=pathogen_name, location=location)
	_pass_response(game)

	if game.active_player.actions_remaining:
		population = game.board.locations[location].population
		if population >= 3 and random.random() < 0.35:
			game.perform_action("virulence", pathogen_name=pathogen_name)
		else:
			game.perform_action("replicate", pathogen_name=pathogen_name, location=location)
		_pass_response(game)
	game.end_turn()


def _play_host_turn(game: GameState, random: Random) -> None:
	game.start_turn(Role.HOST)
	location = _most_populated_location(game, random)
	if location is None:
		game.end_turn()
		return

	if _can_play_host_card(game, "Macrophage"):
		game.perform_action("deploy", card_name="Macrophage", location=location)
	elif _can_play_host_card(game, "Antiviral") and _location_has_pathogen_class(game, location, "virus"):
		game.perform_action("treat", card_name="Antiviral", location=location)
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


def _pathogen_location(game: GameState, random: Random) -> Location:
	locations = [location for location, state in game.board.locations.items() if state.population]
	return random.choice(locations) if locations else Location.GI


def _most_populated_location(game: GameState, random: Random) -> Location | None:
	populated = [
		(location, state.population)
		for location, state in game.board.locations.items()
		if state.population
	]
	if not populated:
		return None
	maximum = max(population for _, population in populated)
	return random.choice([location for location, population in populated if population == maximum])


def _pathogen_name(game: GameState, random: Random) -> str | None:
	available = [card.name for card in game.pathogen.hand if card.name in game._pathogen_cards]
	return random.choice(available) if available else next(iter(game._pathogen_cards), None)


def _can_play_host_card(game: GameState, card_name: str) -> bool:
	return any(card.name == card_name and card.cost <= game.host.energy for card in game.host.hand)


def _location_has_pathogen_class(game: GameState, location: Location, pathogen_class: str) -> bool:
	return any(
		game._pathogen_cards[name].pathogen_class == pathogen_class
		for name in game.board.locations[location].pathogens
	)


def _average(values: object) -> float:
	values = list(values)  # type: ignore[arg-type]
	return sum(values) / len(values) if values else 0.0


def _median(values: object) -> float:
	values = list(values)  # type: ignore[arg-type]
	return float(median(values)) if values else 0.0


def _stddev(values: object) -> float:
	values = list(values)  # type: ignore[arg-type]
	return pstdev(values) if len(values) > 1 else 0.0


def main() -> None:
	parser = argparse.ArgumentParser(description="Run OUTBREAK balance simulations.")
	parser.add_argument("--games", type=int, default=100, help="number of games to run")
	parser.add_argument("--seed", type=int, default=0, help="starting random seed")
	parser.add_argument("--max-rounds", type=int, default=50, help="round limit per game")
	args = parser.parse_args()
	print(run_simulation(args.games, args.seed, args.max_rounds).format())


if __name__ == "__main__":
	main()
