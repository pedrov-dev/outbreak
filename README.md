# OUTBREAK

OUTBREAK is a terminal-based educational strategy game about the biological contest between a pathogen and a host immune system.

The project is currently in Phase 0: setup and tooling. The game engine will be added in Phase 1.

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

## Project layout

- `src/outbreak/`: game package
- `tests/`: automated tests
- `docs/`: design and implementation documents
- `DEVELOPMENT_ROADMAP.md`: project phases and deliverables
