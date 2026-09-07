# Contributing to OUTBREAK

## Development setup

Use Python 3.13 or newer. From the repository root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
```

## Before opening a change

Run the complete test and quality checks:

```powershell
python -m pytest
python -m black --check src tests
python -m flake8 src tests
```

For balance or rules changes, also run a seeded simulation and include the
result in the change description:

```powershell
python -m outbreak.simulation --games 1000 --seed 0
```

## Project conventions

- Keep rules in `src/outbreak/game.py` and keep the Flask layer thin.
- Put tunable card content in `src/outbreak/data/cards.json`.
- Add or update focused tests for every rules change.
- Preserve deterministic behavior when a simulation seed is provided.
- Keep user-facing mechanics and educational facts documented in the card data.
- Avoid unrelated refactors in gameplay changes.

## Pull requests

Describe the behavior changed, the tests run, and any simulation impact. Keep
commits focused and do not commit virtual environments, build artifacts, or
generated coverage files.
