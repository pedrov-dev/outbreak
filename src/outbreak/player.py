"""Player state for the two asymmetric sides of OUTBREAK."""

from dataclasses import dataclass, field
from enum import StrEnum

from .cards import Card


class Role(StrEnum):
    PATHOGEN = "Pathogen"
    HOST = "Host Defense"


@dataclass
class Player:
    role: Role
    deck: list[Card] = field(default_factory=list)
    hand: list[Card] = field(default_factory=list)
    discard: list[Card] = field(default_factory=list)
    energy: int = 0
    actions_remaining: int = 0

    def draw(self) -> Card | None:
        if not self.deck:
            return None
        card = self.deck.pop(0)
        self.hand.append(card)
        return card

    def remove_card(self, card: Card) -> None:
        self.hand.remove(card)
        self.discard.append(card)
