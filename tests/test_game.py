from outbreak.game import run_cli


def test_game_entry_point(capsys) -> None:
    run_cli(input_fn=lambda _prompt: "quit")

    assert "OUTBREAK: Pathogen vs Host Defense" in capsys.readouterr().out
