import json

import pytest

from outbreak.cards import (
	CardType,
	HostDefenseCard,
	PathogenCard,
	load_card_definitions,
	starter_host_deck,
	starter_pathogen_deck,
)


def test_starter_decks_are_loaded_from_json() -> None:
	pathogen_deck = starter_pathogen_deck()
	host_deck = starter_host_deck()

	assert [card.name for card in pathogen_deck] == ["E. coli", "Influenza"]
	assert all(isinstance(card, PathogenCard) for card in pathogen_deck)
	assert all(card.card_type is CardType.PATHOGEN for card in pathogen_deck)
	assert [card.name for card in host_deck].count("Antiviral") == 3
	assert all(isinstance(card, HostDefenseCard) for card in host_deck)


def test_card_loader_rejects_missing_deck(tmp_path) -> None:
	card_file = tmp_path / "cards.json"
	card_file.write_text(json.dumps({"pathogen": []}), encoding="utf-8")

	with pytest.raises(ValueError, match="card deck 'host'"):
		load_card_definitions(card_file)
