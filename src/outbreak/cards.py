"""Card models and JSON-backed card definitions."""

from dataclasses import dataclass
from enum import StrEnum
import json
from importlib.resources import files
from pathlib import Path
from typing import Any


class CardType(StrEnum):
	PATHOGEN = "pathogen"
	IMMUNE = "immune"
	DIAGNOSTIC = "diagnostic"
	TREATMENT = "treatment"
	RESPONSE = "response"


@dataclass(frozen=True)
class Card:
	name: str
	card_type: CardType
	cost: int = 1
	fact: str = ""


@dataclass(frozen=True)
class PathogenCard(Card):
	pathogen_class: str = "bacterium"
	infectivity: int = 3
	replication: int = 1
	virulence: int = 1
	persistence: int = 1
	evasion: int = 0
	transmission: str = "contact"
	tropism: str = ""
	resistance: tuple[str, ...] = ()

	def __post_init__(self) -> None:
		if self.card_type is not CardType.PATHOGEN:
			raise ValueError("PathogenCard must have card_type=PATHOGEN")


@dataclass(frozen=True)
class HostDefenseCard(Card):
	category: str = "immune"
	potency: int = 0
	target_class: str | None = None
	action: str = ""


DEFAULT_CARD_FILE = files("outbreak").joinpath("data", "cards.json")


def load_card_definitions(path: str | Path | None = None) -> dict[str, list[Card]]:
	"""Load card definitions grouped by the ``pathogen`` and ``host`` decks."""
	card_file = Path(path) if path is not None else DEFAULT_CARD_FILE
	with card_file.open(encoding="utf-8") as file:
		payload = json.load(file)

	if not isinstance(payload, dict):
		raise ValueError("card definitions must be a JSON object")
	decks: dict[str, list[Card]] = {}
	for deck_name in ("pathogen", "host"):
		definitions = payload.get(deck_name)
		if not isinstance(definitions, list):
			raise ValueError(f"card deck '{deck_name}' must be a JSON array")
		decks[deck_name] = [_card_from_definition(definition) for definition in definitions]
	return decks


def _card_from_definition(definition: Any) -> Card:
	if not isinstance(definition, dict):
		raise ValueError("each card definition must be a JSON object")
	try:
		card_type = CardType(definition["card_type"])
		common = {
			"name": definition["name"],
			"card_type": card_type,
			"cost": definition.get("cost", 1),
			"fact": definition.get("fact", ""),
		}
		if card_type is CardType.PATHOGEN:
			return PathogenCard(
				**common,
				pathogen_class=definition.get("pathogen_class", "bacterium"),
				infectivity=definition.get("infectivity", 3),
				replication=definition.get("replication", 1),
				virulence=definition.get("virulence", 1),
				persistence=definition.get("persistence", 1),
				evasion=definition.get("evasion", 0),
				transmission=definition.get("transmission", "contact"),
				tropism=definition.get("tropism", ""),
				resistance=tuple(definition.get("resistance", [])),
			)
		return HostDefenseCard(
			**common,
			category=definition.get("category", "immune"),
			potency=definition.get("potency", 0),
			target_class=definition.get("target_class"),
			action=definition.get("action", ""),
		)
	except (KeyError, TypeError, ValueError) as error:
		raise ValueError(f"invalid card definition: {definition!r}") from error


def starter_pathogen_deck() -> list[PathogenCard]:
	return [card for card in load_card_definitions()["pathogen"] if isinstance(card, PathogenCard)]


def starter_host_deck() -> list[HostDefenseCard]:
	return [card for card in load_card_definitions()["host"] if isinstance(card, HostDefenseCard)]
