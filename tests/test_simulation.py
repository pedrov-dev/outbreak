import pytest

from outbreak.game import Winner
from outbreak.simulation import play_game, run_simulation


def test_simulation_is_reproducible() -> None:
    assert play_game(seed=7) == play_game(seed=7)


def test_simulation_summary_counts_all_games() -> None:
    summary = run_simulation(games=12, seed=7, max_rounds=10)

    assert summary.games == 12
    assert summary.pathogen_wins + summary.host_wins + summary.draws == 12
    assert 0.0 <= summary.pathogen_win_rate <= 1.0
    assert 0.0 <= summary.host_win_rate <= 1.0
    assert summary.median_rounds >= 0
    assert summary.rounds_stddev >= 0
    assert summary.min_rounds <= summary.max_rounds
    assert "Median rounds:" in summary.format()


def test_single_game_produces_result_within_round_limit() -> None:
    result = play_game(seed=3, max_rounds=4)

    assert result.winner in (None, Winner.PATHOGEN, Winner.HOST)
    assert result.rounds <= 4
    assert result.events > 0


@pytest.mark.parametrize("games", [-1])
def test_simulation_rejects_negative_game_count(games: int) -> None:
    with pytest.raises(ValueError, match="non-negative"):
        run_simulation(games=games)