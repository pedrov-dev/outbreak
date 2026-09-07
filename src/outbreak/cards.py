"""Card models and the representative Phase 1 card set."""

from dataclasses import dataclass
from enum import StrEnum


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


def starter_pathogen_deck() -> list[PathogenCard]:
	return [
		PathogenCard(
			name="E. coli",
			card_type=CardType.PATHOGEN,
			pathogen_class="bacterium",
			infectivity=4,
			replication=2,
			virulence=2,
			persistence=2,
			tropism="GI tract",
			transmission="fecal-oral",
			fact="Some E. coli strains are normal gut flora; others cause disease.",
		),
		PathogenCard(
			name="Influenza",
			card_type=CardType.PATHOGEN,
			pathogen_class="virus",
			infectivity=4,
			replication=2,
			virulence=3,
			persistence=1,
			evasion=2,
			tropism="Respiratory tract",
			transmission="airborne",
			resistance=("antibiotic",),
			fact="Influenza viruses replicate inside host cells and change over time.",
		),
	]


def starter_host_deck() -> list[HostDefenseCard]:
	return [
		HostDefenseCard(
			name="Macrophage",
			card_type=CardType.IMMUNE,
			category="innate immunity",
			potency=3,
			action="clear",
			fact="Macrophages engulf pathogens and damaged cells.",
		),
		HostDefenseCard(
			name="PCR",
			card_type=CardType.DIAGNOSTIC,
			category="diagnostic",
			cost=1,
			action="diagnose",
			fact="PCR detects genetic material from a target organism.",
		),
		HostDefenseCard(
			name="Antibiotic",
			card_type=CardType.TREATMENT,
			category="treatment",
			potency=3,
			target_class="bacterium",
			action="treat",
			fact="Antibiotics target bacteria, not viruses.",
		),
		HostDefenseCard(
			name="Antiviral",
			card_type=CardType.TREATMENT,
			category="treatment",
			potency=3,
			target_class="virus",
			action="treat",
			fact="Antiviral medicines interrupt specific stages of viral replication.",
		),
		HostDefenseCard(
			name="Antiviral",
			card_type=CardType.TREATMENT,
			category="treatment",
			potency=3,
			target_class="virus",
			action="treat",
			fact="Antiviral medicines interrupt specific stages of viral replication.",
		),
		HostDefenseCard(
			name="Fever",
			card_type=CardType.RESPONSE,
			category="response",
			potency=1,
			action="clear",
			fact="Fever can make conditions less favorable for some pathogens.",
		),
	]
