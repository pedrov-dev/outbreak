from outbreak.game import main


def test_game_entry_point(capsys) -> None:
    main()

    assert "not implemented yet" in capsys.readouterr().out
