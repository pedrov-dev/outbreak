# OUTBREAK: Development Roadmap

This roadmap outlines the steps to implement the OUTBREAK game based on the Master Design Document, prioritizing simple architecture and automation.

## Guiding Principles
- **Start Simple**: Begin with a minimal viable product (MVP) that captures the core gameplay loop.
- **Automate Early**: Implement testing and simulation from the start to ensure stability and enable rapid iteration.
- **Iterate Based on Feedback**: Use simulation results to refine mechanics before expanding content.
- **Focus on Core Mechanics**: Validate the biological game system before adding graphical polish or extensive content.

## Phase 0: Project Setup and Tooling (Estimated: 1 day)
**Goal**: Establish a reproducible development environment with version control, dependency management, and automated testing.

### Tasks:
1. Initialize a Git repository in the `outbreak` folder.
2. Set up a Python virtual environment (recommended for simplicity and automation).
3. Install core dependencies:
   - `pytest` for unit testing
   - `pyyaml` or similar for card data (if using external files)
   - Optional: `rich` for better terminal output (if staying terminal-based)
4. Create project structure:
   ```
   outbreak/
   ├── src/                  # Source code
   │   ├── game.py           # Core game engine
   │   ├── board.py          # Board and zone logic
   │   ├── cards.py          # Card definitions and effects
   │   ├── player.py         # Player logic (Pathogen/Host)
   │   └── simulation.py     # Automation/simulation scripts
   ├── tests/                # Unit and integration tests
   │   ├── test_game.py
   │   ├── test_cards.py
   │   └── test_board.py
   ├── docs/                 # Existing design documents
   ├── DEVELOPMENT_ROADMAP.md
   └── README.md             # Project overview and setup instructions
   ```
5. Create a basic `README.md` with setup and run instructions.
6. Configure `pytest` to run tests automatically (e.g., via a `Makefile` or `scripts/test.sh`).

## Phase 1: Core Game Engine (Terminal-Based MVP) (Estimated: 3-5 days)
**Goal**: Implement a playable, text-based version of the game that enforces the turn structure and core mechanics.

### Tasks:
1. **Data Models**:
   - Define `Card` class with attributes from the design (name, class, stats, abilities, etc.).
   - Define `PathogenCard` and `HostDefenseCard` subclasses or use a type field.
   - Define `GameState` to track:
     - Board zones (as dictionaries or simple objects)
     - Host Disease track (0-10)
     - Player hands, decks, discard piles
     - Biological Energy (shared resource)
     - Active player and phase
2. **Turn Structure**:
   - Implement the phase sequence: DRAW → BIOLOGY → ACTIONS → RESPONSE → PROGRESSION.
   - Ensure automatic Biology phase actions (replication, etc.).
   - Limit active player to 2 actions per turn.
   - Implement response windows (opposing player can play 1 response card after each action).
3. **Core Mechanics**:
   - Implement stat effects (Infectivity, Replication, Virulence, Persistence, Evasion) as described.
   - Implement Infection level updates based on pathogen population.
   - Implement Disease progression calculation: `(Population // 3) + (1 if Virulence >= 4 else 0) + modifiers`.
   - Implement Host win condition (clear all infection to 0 before Outbreak) and Pathogen win condition (Disease >= 9).
4. **Basic Card Set**:
   - Create 5-10 representative pathogen cards (e.g., E. coli, Influenza) and host defense cards (e.g., Macrophage, PCR, Antibiotic).
   - Hardcode these initially for simplicity; later move to data files.
5. **Text Interface**:
   - Create a simple command-line interface to:
     - Display the board state (zones, Host Disease track).
     - Show player hand and available actions.
     - Prompt for player choices.
     - Log game events (e.g., "E. coli replicates: Population +2").
6. **Playable Game Loop**:
   - Allow two human players to play a full game via the terminal.
   - Enforce rules and validate actions.

### Deliverables:
- A runnable `python -m src.game` that starts a terminal-based game.
- Basic unit tests for card effects and phase transitions.
- A `simulation.py` script that can run automated games (for Phase 2).

## Phase 2: Automation and Testing (Estimated: 2-3 days, overlaps with Phase 1)
**Goal**: Establish a robust testing suite and simulation framework to validate balance and catch regressions.

### Tasks:
1. **Unit Tests**:
   - Test individual card effects (e.g., "Macrophage reduces population by 3, modified by Persistence").
   - Test phase transitions (e.g., "After Biology phase, pathogen population increases by Replication value").
   - Test win condition calculations.
2. **Integration Tests**:
   - Test full turns for specific scenarios (e.g., "Pathogen plays Infect action, Host responds with Macrophage").
   - Test end-to-end games with predefined decks.
3. **Simulation Framework**:
   - Create `simulation.py` that can:
     - Run multiple games automatically (e.g., 100 games).
     - Track win rates, average game length, key events.
     - Use simple AI (e.g., random or heuristic-based) for both players to generate data.
   - Run initial simulations with the basic card set to answer design questions:
     - Can the Host respond before pathogen runaway?
     - Do stats create visibly different strategies?
     - Do response windows create meaningful decisions?
     - Can diagnosis/treatment change outcome without making pathogen irrelevant?
4. **Continuous Integration (Local)**:
   - Set up a pre-commit hook to run tests before committing (optional but recommended).
   - Create a `Makefile` or script to run tests and simulations with one command.

### Deliverables:
- Test suite with >80% coverage of core logic.
- Simulation script that outputs summary statistics.
- Documentation on how to run tests and simulations.

## Phase 3: Refinement and Expansion (Estimated: 5-7 days)
**Goal**: Refine mechanics based on simulation results, expand content, and consider optional graphical enhancements.

### Tasks:
1. **Mechanic Refinement**:
   - Adjust card costs, stats, and effects based on simulation data.
   - Address any imbalance (e.g., pathogen too strong/weak).
   - Clarify ambiguous rules from the design document through implementation.

   **Current refinement target:** 6-10 rounds per game, with a median near 6-7 rounds and a roughly even win rate. Cleared infection recovers gradually, and Host victory requires clean diagnosis plus two progression checks. The current baseline achieves a 6-round median and 46.2% Pathogen wins across 1,000 seeded games.
2. **Content Expansion**:
   - Implement the full suggested deck sizes:
     - Pathogen Deck (30 cards): 10 Pathogens, 5 Transmission, 5 Virulence, 5 Replication/Evolution, 5 Resistance/Support.
     - Host Defense Deck (30 cards): 8 Innate Immunity, 6 Adaptive Immunity, 5 Diagnostics, 6 Treatments, 5 Prevention/Support.
   - Move card definitions to external files (YAML/JSON) for easier modification.
   - Ensure each card has a concise educational fact (REAL WORLD field).
3. **Optional: Graphical Interface** (Only if core is solid and time permits):
   - Evaluate lightweight options: 
     - Web-based (HTML/CSS/JS) for broad accessibility.
     - Pygame for a desktop application.
   - Implement a minimal GUI that mirrors the terminal interface initially.
   - Focus on clarity: show board zones, cards, and game state clearly.
4. **Advanced Automation**:
   - Enhance simulation to test specific matchups (e.g., "E. coli vs. Macrophage-heavy deck").
   - Implement logging to file for deeper analysis.
   - Consider property-based testing (e.g., with `hypothesis`) for edge cases.

### Deliverables:
- Complete, balanced card set.
- Refined mechanics that satisfy educational checkpoints (e.g., antibiotics don't work on viruses).
- Optional: A playable graphical version.
- Updated simulation results showing improved balance.

## Phase 4: Documentation and Finalization (Complete)
**Goal**: Polish the project for sharing and potential future development.

### Tasks:
1. Update `README.md` with:
   - Clear setup instructions.
   - How to play the game (terminal and/or GUI).
   - How to run tests and simulations.
   - Overview of architecture and design decisions.
2. Create a `CONTRIBUTING.md` if planning open collaboration.
3. Ensure all code is well-commented and follows Python PEP8 standards (use `flake8` or `black` for formatting).
4. Archive any experimental branches and finalize the main branch.
5. Optionally, create a short video or GIF demonstrating gameplay.

## Success Criteria
By the end of this roadmap, we should have:
1. A playable game that enforces the core OUTBREAK mechanics as per the design document.
2. A robust test suite that prevents regressions.
3. Automation tools to simulate and balance the game.
4. Clear documentation for future contributors or personal reference.
5. A foundation that can be extended with graphical enhancements, AI opponents, or online play.

## Notes on Simplicity and Automation
- **Architecture**: We start with a simple, modular Python structure. Avoid over-engineering; refactor only when complexity hinders progress.
- **Automation**: Tests and simulations are written alongside features, not as an afterthought. This ensures we can change code with confidence.
- **Scope Creep**: Resist adding features (like networking or advanced graphics) until the MVP is validated via simulation.
- **Educational Value**: Constantly check that mechanics teach biological concepts through gameplay (per Section 8 of the design doc).

---
*Roadmap created: 2026-09-07*
*Based on: OUTBREAK: MASTER DESIGN DOCUMENT*