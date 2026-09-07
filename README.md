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

The current starter set uses Replication 1 to prevent early runaway growth, Evasion to reduce immune clearance, and three Antiviral cards so viral infections have reliable counterplay. Host clearance must remain stable through two progression checks. A 1,000-game run with `--seed 0` produced 55.2% Pathogen wins, 44.8% Host wins, 5.22 average rounds, and a median of 7 rounds with a 2-10 range. This supports a 10-15 minute target for human play while preserving meaningful balance variation.

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
- `tests/`: automated tests
- `docs/`: design and implementation documents
- `DEVELOPMENT_ROADMAP.md`: project phases and deliverables
