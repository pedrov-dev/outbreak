from outbreak.web import create_app


def test_web_app_serves_dashboard() -> None:
    app = create_app()
    client = app.test_client()

    response = client.get("/")

    assert response.status_code == 200
    assert b"OUTBREAK" in response.data


def test_web_api_creates_game_state() -> None:
    app = create_app()
    client = app.test_client()

    response = client.post("/api/new-game")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["winner"] is None
    assert payload["phase"] in {"draw", "biology", "actions", "response", "progression"}
    assert "board" in payload
    assert "active_role" in payload
