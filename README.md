# OUTBREAK

OUTBREAK is a terminal-based educational strategy game about the biological contest between a pathogen and a host immune system.

The project currently includes the Phase 1 terminal MVP: a pathogen and Host Defense player, five host compartments, starter cards, biological replication, response windows, and win conditions.

## Setup

Create and activate the virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the project and development dependencies:

```powershell
python -m pip install -e ".[dev]"
```

## Test

Run the test suite from the repository root:

```powershell
python -m pytest
```

Run the Phase 2 simulation batch:

```powershell
python -m outbreak.simulation --games 100 --seed 0
```

The simulation reports pathogen and Host win rates, draws caused by the round limit, average and median rounds, standard deviation, outcome ranges, winner-specific game length, disease, and final pathogen population. Use a fixed `--seed` to reproduce a result.

### Phase 3 balance baseline

The current starter set uses Replication 1 to prevent early runaway growth, Evasion to reduce immune clearance, and three Antiviral cards so viral infections have reliable counterplay. Cleared infection recovers one level per progression, and Host clearance requires a clean PCR confirmation plus two progression checks. A 1,000-game run with `--seed 0` produced 46.2% Pathogen wins, 53.8% Host wins, 5.77 average rounds, and a median of 6 rounds with a 3-11 range. Pathogen wins averaged 7.68 rounds and Host wins averaged 4.14 rounds, supporting the 10-15 minute target for human play.

## Play

Start the terminal game:

```powershell
python -m outbreak.game
```

CLI actions use `|` separators, for example:

```text
infect | E. coli | GI
replicate | E. coli | GI
deploy | Macrophage | GI
diagnose | PCR
```

After an action, enter `pass` or respond with `CARD | LOCATION`. Use `status` to inspect the board and `end` to finish the active player's actions.

## Project layout

- `src/outbreak/`: game package
- `src/outbreak/data/cards.json`: JSON card definitions for the starter decks
- `tests/`: automated tests
- `docs/`: design and implementation documents
- `DEVELOPMENT_ROADMAP.md`: project phases and deliverables

## Card definitions

Cards are stored in `src/outbreak/data/cards.json` and grouped into two top-level arrays:

- `pathogen`: pathogen cards with biological stats such as `infectivity`, `replication`, and `virulence`
- `host`: immune, diagnostic, treatment, and response cards with fields such as `category`, `potency`, and `action`

Each card uses a `card_type` value from the engine's `CardType` enum. Optional fields use the same defaults as the Python card models, and repeated entries represent multiple copies in a deck. The loader constructs the existing `PathogenCard` and `HostDefenseCard` objects, so adding or tuning content does not require changing game rules.
