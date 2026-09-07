"""Small web dashboard for the OUTBREAK rules engine."""

from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, render_template, request

from .board import Location
from .cards import Card, CardType, HostDefenseCard, PathogenCard
from .game import GameState, Phase, new_game
from .player import Role


def create_app() -> Flask:
    """Create and configure the OUTBREAK Flask app."""
    app = Flask(
        __name__,
        template_folder=str(Path(__file__).resolve().parent / "templates"),
        static_folder=str(Path(__file__).resolve().parent / "static"),
    )
    app.config["CURRENT_GAME"] = _build_initial_game()

    @app.get("/")
    def index() -> str:
        game = app.config["CURRENT_GAME"]
        return render_template(
            "index.html",
            locations=[location.value for location in Location],
            game=_serialize_game(game),
        )

    @app.post("/api/new-game")
    def new_game_endpoint():
        game = _build_initial_game()
        app.config["CURRENT_GAME"] = game
        return jsonify(_serialize_game(game))

    @app.get("/api/state")
    def state_endpoint():
        game = app.config["CURRENT_GAME"]
        return jsonify(_serialize_game(game))

    @app.post("/api/action")
    def action_endpoint():
        game = app.config["CURRENT_GAME"]
        payload = request.get_json(silent=True) or {}
        action = payload.get("action")
        try:
            _apply_action(game, action, payload)
        except (KeyError, ValueError, TypeError) as exc:
            return jsonify({"ok": False, "error": str(exc)}), 400
        return jsonify({"ok": True, **_serialize_game(game)})

    @app.post("/api/advance-turn")
    def advance_turn_endpoint():
        game = app.config["CURRENT_GAME"]
        try:
            _advance_turn(game)
        except (KeyError, ValueError, TypeError) as exc:
            return jsonify({"ok": False, "error": str(exc)}), 400
        return jsonify({"ok": True, **_serialize_game(game)})

    return app


def _build_initial_game() -> GameState:
    game = new_game()
    game.start_turn(Role.PATHOGEN)
    return game


def _advance_turn(game: GameState) -> None:
    if game.winner is not None:
        raise ValueError("the game is over")
    if game.phase is Phase.RESPONSE:
        game.end_response()
    if game.active_role is Role.PATHOGEN:
        game.end_turn()
        if game.winner is None:
            game.start_turn(Role.HOST)
    else:
        game.end_turn()
        if game.winner is None:
            game.start_turn(Role.PATHOGEN)


def _apply_action(game: GameState, action: str | None, payload: dict[str, object]) -> None:
    if action is None:
        raise ValueError("action is required")
    if game.winner is not None:
        raise ValueError("the game is over")
    if action == "pass_response":
        if game.phase is not Phase.RESPONSE:
            raise ValueError("there is no response window to pass")
        game.end_response()
        return
    if action == "response":
        card_name = str(payload.get("card_name"))
        location = _require_location(payload.get("location"))
        if game.phase is not Phase.RESPONSE:
            raise ValueError("responses are only available after an action")
        game.play_response(card_name, location)
        return
    if action == "start_turn":
        game.start_turn(game.active_role)
        return
    if game.phase is not Phase.ACTIONS:
        raise ValueError("actions are available only during the ACTIONS phase")

    if action == "infect":
        game.perform_action(
            "infect",
            pathogen_name=str(payload.get("pathogen_name")),
            location=_require_location(payload.get("location")),
        )
        return
    if action == "replicate":
        game.perform_action(
            "replicate",
            pathogen_name=str(payload.get("pathogen_name")),
            location=_require_location(payload.get("location")),
        )
        return
    if action == "spread":
        game.perform_action(
            "spread",
            pathogen_name=str(payload.get("pathogen_name")),
            source=_require_location(payload.get("source")),
            target=_require_location(payload.get("target")),
        )
        return
    if action == "virulence":
        game.perform_action("virulence", pathogen_name=str(payload.get("pathogen_name")), amount=int(payload.get("amount", 1)))
        return
    if action == "deploy":
        game.perform_action("deploy", card_name=str(payload.get("card_name")), location=_require_location(payload.get("location")))
        return
    if action == "diagnose":
        game.perform_action("diagnose", card_name=str(payload.get("card_name", "PCR")))
        return
    if action == "treat":
        game.perform_action("treat", card_name=str(payload.get("card_name")), location=_require_location(payload.get("location")))
        return
    if action == "contain":
        game.perform_action("contain", location=_require_location(payload.get("location")))
        return

    raise ValueError(f"unsupported action: {action}")


def _require_location(value: object) -> Location:
    if isinstance(value, Location):
        return value
    if isinstance(value, str):
        return Location(value)
    raise ValueError("location is required")


def _serialize_card(card: Card) -> dict[str, object]:
    payload = {
        "name": card.name,
        "card_type": card.card_type.value,
        "cost": card.cost,
        "fact": card.fact,
    }
    if isinstance(card, PathogenCard):
        payload.update(
            {
                "pathogen_class": card.pathogen_class,
                "infectivity": card.infectivity,
                "replication": card.replication,
                "virulence": card.virulence,
                "persistence": card.persistence,
                "evasion": card.evasion,
                "transmission": card.transmission,
                "tropism": card.tropism,
                "resistance": list(card.resistance),
            }
        )
    elif isinstance(card, HostDefenseCard):
        payload.update(
            {
                "category": card.category,
                "potency": card.potency,
                "target_class": card.target_class,
                "action": card.action,
            }
        )
    return payload


def _serialize_game(game: GameState) -> dict[str, object]:
    return {
        "winner": game.winner.value if game.winner is not None else None,
        "phase": game.phase.value,
        "active_role": game.active_role.value,
        "round_number": game.round_number,
        "disease": game.disease,
        "infection_established": game.infection_established,
        "clearance_confirmed": game.clearance_confirmed,
        "clearance_streak": game.clearance_streak,
        "actions_remaining": game.active_player.actions_remaining,
        "energy": game.active_player.energy,
        "board": {
            location.value: {
                "population": state.population,
                "infection": state.infection,
                "tissue_damage": state.tissue_damage,
                "defense": state.defense,
                "pathogens": dict(state.pathogens),
            }
            for location, state in game.board.locations.items()
        },
        "immune_zone": list(game.board.immune_zone),
        "clinical_zone": list(game.board.clinical_zone),
        "pathogen_discard": list(game.board.pathogen_discard),
        "clinical_discard": list(game.board.clinical_discard),
        "pathogen_hand": [_serialize_card(card) for card in game.pathogen.hand],
        "host_hand": [_serialize_card(card) for card in game.host.hand],
        "events": list(game.events)[-12:],
        "locations": [location.value for location in Location],
    }


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
