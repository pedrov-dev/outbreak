# Contributing to OUTBREAK

## Setup

Install Node 22 or newer. There are no dependencies to install.

```bash
npm start      # play locally at http://127.0.0.1:8417
npm test
npm run simulate
```

## Before opening a change

- Run `npm test`.
- For balance or rules changes, run `npm run simulate` and include the before/after win rates in the description.

## Adding or editing content

All content lives in `src/data/`. The engine reads it generically, so most additions need no rules changes.

- **A new organism** goes in `pathogens.js`. Give it every lab trait (`gram`, `culture`, `afb`, `fungal`, `pcr`, plus `biochem` if it grows in culture and `csf` if it can reach the CNS), a `susceptible` list, `notes` explaining the classic wrong choices, two vignettes, virulence factors, treatment and pearls. The data tests check consistency, and they fail if the full workup can't tell the new organism apart from an existing one.
- **A new drug** goes in `drugs.js`. Then decide, for every organism, whether it belongs in that organism's `susceptible` list.
- **Medical accuracy matters more than anything else.** Stick to textbook-level facts (the kind in First Aid or Sketchy). When something is genuinely debated, leave it out rather than teach it wrong. Never mark a drug ineffective in-game for an organism it actually treats.

## Conventions

- The engine (`src/engine/`) stays pure: no DOM, no globals, deterministic for a given seed, JSON-serializable state.
- The UI (`src/ui/`) never changes game state directly. It calls engine actions.
- Add a focused test for every rules change.
