"""Board and host-compartment models."""

from dataclasses import dataclass, field
from enum import StrEnum


class Location(StrEnum):
    """Location compartments for the board."""

    CNS = "CNS"
    RESPIRATORY = "Respiratory tract"
    GI = "GI tract"
    BLOOD = "Blood"
    SKIN = "Skin / other"


@dataclass
class LocationState:
    """The pathogen burden and host response in one compartment."""

    pathogens: dict[str, int] = field(default_factory=dict)
    infection: int = 0
    tissue_damage: int = 0
    defense: int = 1

    @property
    def population(self) -> int:
        return sum(self.pathogens.values())

    def add_population(self, pathogen: str, amount: int) -> None:
        self.pathogens[pathogen] = max(0, self.pathogens.get(pathogen, 0) + amount)
        if self.pathogens[pathogen] == 0:
            del self.pathogens[pathogen]

    def clear(self) -> None:
        self.pathogens.clear()
        self.infection = 0
        self.tissue_damage = 0


@dataclass
class Board:
    locations: dict[Location, LocationState] = field(
        default_factory=lambda: {location: LocationState() for location in Location}
    )
    immune_zone: list[str] = field(default_factory=list)
    clinical_zone: list[str] = field(default_factory=list)
    pathogen_discard: list[str] = field(default_factory=list)
    clinical_discard: list[str] = field(default_factory=list)

    def total_population(self) -> int:
        return sum(state.population for state in self.locations.values())

    def total_infection(self) -> int:
        return sum(state.infection for state in self.locations.values())
