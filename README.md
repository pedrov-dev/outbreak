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
