import pytest

from outbreak.board import Location
from outbreak.cards import CardType
from outbreak.game import GameState, Phase, Winner
from outbreak.player import Role


def make_game() -> GameState:
    game = GameState()
    game.pathogen.hand = list(game.pathogen.deck)
    game.host.hand = list(game.host.deck)
    game.pathogen.energy = 5
    game.host.energy = 5
    game.pathogen.actions_remaining = 2
    game.host.actions_remaining = 2
    return game


def test_pathogen_biology_replication_increases_population() -> None:
    game = make_game()
    game.infect("E. coli", Location.GI)

    game.resolve_biology()

    assert game.board.locations[Location.GI].population == 2


def test_macrophage_clearance_is_reduced_by_persistence() -> None:
    game = make_game()
    game.infect("E. coli", Location.GI)
    game.board.locations[Location.GI].add_population("E. coli", 3)
    game.phase = Phase.ACTIONS
    game.active_role = Role.HOST

    game.perform_action("deploy", card_name="Macrophage", location=Location.GI)

    assert game.board.locations[Location.GI].population == 2


def test_macrophage_clearance_is_reduced_by_evasion() -> None:
    game = make_game()
    game.board.locations[Location.RESPIRATORY].add_population("Influenza", 3)
    game.phase = Phase.ACTIONS
    game.active_role = Role.HOST

    game.perform_action("deploy", card_name="Macrophage", location=Location.RESPIRATORY)

    assert game.board.locations[Location.RESPIRATORY].population == 2


def test_progression_runs_once_per_complete_round() -> None:
    game = make_game()
    game.board.locations[Location.GI].add_population("E. coli", 3)

    game.start_turn(Role.PATHOGEN)
    assert game.end_turn() is None
    assert game.disease == 0

    game.start_turn(Role.HOST)
    game.end_turn()

    assert game.disease == 1


def test_host_clearance_requires_two_progressions() -> None:
    game = make_game()
    game.infection_established = True

    assert game.progression() is None
    assert game.clearance_streak == 1
    assert game.progression() is Winner.HOST


def test_antibiotic_does_not_clear_influenza() -> None:
    game = make_game()
    game.board.locations[Location.RESPIRATORY].add_population("Influenza", 3)
    game.phase = Phase.ACTIONS
    game.active_role = Role.HOST

    game.perform_action("treat", card_name="Antibiotic", location=Location.RESPIRATORY)

    assert game.board.locations[Location.RESPIRATORY].population == 3


def test_antiviral_clears_influenza() -> None:
    game = make_game()
    game.board.locations[Location.RESPIRATORY].add_population("Influenza", 3)
    game.phase = Phase.ACTIONS
    game.active_role = Role.HOST

    game.perform_action("treat", card_name="Antiviral", location=Location.RESPIRATORY)

    assert game.board.locations[Location.RESPIRATORY].population == 0


def test_progression_uses_population_and_high_virulence() -> None:
    game = make_game()
    game.board.locations[Location.RESPIRATORY].add_population("Influenza", 6)

    winner = game.progression()

    assert game.disease == 2
    assert winner is None
    assert game.board.locations[Location.RESPIRATORY].infection == 5


def test_response_window_allows_one_host_response() -> None:
    game = make_game()
    game.infect("E. coli", Location.GI)
    game.phase = Phase.ACTIONS
    game.active_role = Role.PATHOGEN

    game.perform_action("replicate", pathogen_name="E. coli", location=Location.GI)
    game.play_response("Fever", Location.GI)

    assert game.phase is Phase.ACTIONS
    assert game.board.locations[Location.GI].population == 2


def test_outbreak_sets_pathogen_winner() -> None:
    game = make_game()
    game.disease = 8

    game.activate_virulence("E. coli")

    assert game.disease == 9
    assert game.progression() is Winner.PATHOGEN


def test_action_requires_actions_phase() -> None:
    game = make_game()

    with pytest.raises(ValueError, match="ACTIONS phase"):
        game.perform_action("infect", pathogen_name="E. coli", location=Location.GI)