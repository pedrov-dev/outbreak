# OUTBREAK: MASTER DESIGN DOCUMENT
## Consolidated Game Model

This document synthesizes the core design elements from BOARD.md, CARDS.md, SOT.md, and TURNS.md into a cohesive framework for implementation.

---

## 1. GAME FOUNDATION (from SOT.md)
**Core Principle:** Biology is the game system. Educational value emerges from gameplay mechanics.

**Primary Objective:** 
- Pathogen Player wins by progressing infection to Outbreak Threshold (Host Disease ≥ 9)
- Host Defense Player wins by eliminating all pathogen populations and clearing Infection to 0 before Outbreak

**Gameplay Loop:** Exposure → Infection → Replication → Immune Response → Progression → Outcome

**Player Asymmetry:**
- Pathogen Player: Focus on establishing/replicating/spreading infection, evading immunity, developing resistance
- Host Defense Player: Focus on detection, diagnosis, immune activation, treatment, containment

---

## 2. BOARD LAYOUT (from BOARD.md)
The board centers the Host as the dynamic battlefield, divided into five functional zones:

### 2.1 Pathogen Zone (Top)
- Active pathogens with attributes (Population, Virulence Factors, Resistance, etc.)
- Example: 🦠 E. coli with Capsule, Antibiotic Resistance, Population: 3

### 2.2 Host Zone (Center) - THE BATTLEFIELD
Five anatomical compartments:
```
              🧠 CNS
       🫁 RESPIRATORY TRACT
       🫃 GI TRACT
          🩸 BLOOD
       🧴 SKIN / OTHER
```
Each location tracks:
- Pathogen Presence (which pathogens established)
- Infection Level (0-5 scale, ●○○○○ to ●●●●●)
- Tissue Damage
- Symptoms
- Complications

### 2.3 Immune Zone (Left of Host)
Host Defense player's active biological defenses (Neutrophil, Macrophage, B Cell, etc.)
- Persistent board pieces that interact with pathogens
- Distinguished from temporary Immune Responses (effects like Fever, Inflammation)

### 2.4 Clinical Zone (Right of Host)
- Diagnostics (PCR, Culture, Gram Stain, etc.)
- Treatments (Antibiotic, Antiviral, Supportive Care, etc.)
- Represents: "What do we know, and what are we doing about it?"

### 2.5 Discard / Graveyard (Bottom)
- Pathogen Discard pile
- Clinical Discard pile (for cards that may interact with previous events)

### 2.6 Host Status Track (Prominent Display)
Continuous progression bar (0-10 scale):
```
HOST DISEASE
0    1    2    3    4    5    6    7    8    9    10
│----│----│----│----│----│----│----│----│----│----│
                         ↑
               SEVERE (threshold 6)
                                             ↑
                                    OUTBREAK (threshold 9)
```
- 0-2: Exposure/contained infection
- 3-5: Active disease
- 6-8: Severe disease
- 9-10: Outbreak (Pathogen win condition)

---

## 3. TURN STRUCTURE (from TURNS.md)
Each round is a biological conversation: **Pathogen Turn → Host Response → Host Turn → Pathogen Response**

### Phase Breakdown (per active turn):
1. **DRAW**: Draw 1 card, gain 1 Biological Energy, resolve start-of-turn effects
2. **BIOLOGY**: Automatic pathogen actions (replication, lifecycle progression, spread)
   - *Example*: E. coli with Replication=1 → Population +1 during Biology phase
3. **ACTIONS**: Active player performs up to 2 actions (Infect, Replicate, Spread, Evolve, Virulence, Investigate, Diagnose, Deploy, Treat, Contain, Vaccinate)
4. **RESPONSE**: After each action, opposing player gets 1 response window to play 1 legal Response card/ability
5. **PROGRESSION**: Evaluate Host state:
   - Check population thresholds → update Infection levels
   - Calculate Disease progression from Infection + Virulence
   - Apply symptoms/complications
   - Check for Outbreak (Disease ≥ 9) or clear state (Host win)

**Key Design Notes:**
- Biology phase makes game feel alive ("I establish bacteria → bacteria reproduce → immune system notices...")
- Response windows create meaningful decisions without stack complexity
- Progression phase resolves all state changes before next round

---

## 4. CARD SYSTEM & STATS (from CARDS.md & SOT.md)
### 4.1 Pathogen Card Anatomy
```
┌─────────────────────────────────────┐
│ 🦠 [PATHOGEN NAME]                  │
│ [CLASS] · [GRAM STAIN] · [MORPHOLOGY]│
├─────────────────────────────────────┤
│  INFECTIVITY   [0-5]   REPLICATION  [0-5]  │
│  VIRULENCE     [0-5]   PERSISTENCE  [0-5]  │
│  EVASION       [0-5]                     │
├─────────────────────────────────────┤
│ TRANSMISSION: [route]               │
│ TROPISM:    [target tissue]         │
├─────────────────────────────────────┤
│ ABILITIES                             │
│ [Special rules text]                │
├─────────────────────────────────────┤
│ RESISTANCES                           │
│ [Treatment resistances]             │
├─────────────────────────────────────┤
│ REAL WORLD                            │
│ [Concise educational fact]          │
└─────────────────────────────────────┘
```

### 4.2 Core Stats (0-5 Scale)
| Stat          | Meaning                                                                 | Mechanical Effect                                                                 |
|---------------|-------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Infectivity** | Ability to establish infection in compatible location                   | Determines success of Exposure/Infect actions (vs Host Defense modifiers)       |
| **Replication** | Rate of autonomous population increase                                  | Added to Population during Biology phase (viruses require infected host cells)  |
| **Virulence**   | Efficiency of converting pathogen presence to clinical harm             | Disease gain = (Population ÷ 3, floored) + (1 if Virulence ≥4) + modifiers     |
| **Persistence** | Resistance to clearance by immunity/treatment                           | Reduces effectiveness of clearance effects by (Persistence - 1), min 0          |
| **Evasion**     | Ability to avoid/interfere with host defenses                           | Reduces immune clearance; targeted treatments still interact through Persistence |

### 4.3 Critical Distinctions
- **Population**: Pathogen burden (e.g., E. coli Population: ●●●●○)
- **Infection**: Host's infection burden per location (0-5 scale)
- **Disease**: Shared clinical severity (0-10 Host track)
  - *Key Insight*: High Population ≠ automatic severe disease; Immunopathology possible

### 4.4 Non-Pathogen Card Adaptations
- **Immune Cards**: Replace stats with Clearance, Specificity, Activation Cost
- **Treatment Cards**: Target, Potency, Mechanism, Resistance Interaction
- **Diagnostic Cards**: Sensitivity, Specificity, Cost, Information Revealed
- **Event/Environment Cards**: Modify transmission, survival, or progression conditions

---

## 5. INTEGRATED MECHANICS EXAMPLE
**Scenario**: E. coli (Infectivity 4, Replication 1, Virulence 2, Persistence 2) in GI Tract

1. **Pathogen Turn - Biology Phase**:
   - Automatic Replication: Population increases by 1 (e.g., 2 → 3)
   - Infection check: Population 4 → Infection increases to ●●●○○ (if not already infected)

2. **Pathogen Action - Toxin Production** (Virulence Factor):
   - Disease progression +1 (based on card effect)

3. **Host Response**:
   - Plays Macrophage (Clearance 3): Reduces Population by 3
   - Persistence 2 reduces clearance by (2-1)=1 → actual Population reduction = 2
   - New Population: 4 - 2 = 2

4. **Progression Phase**:
   - Population 2 → Infection ●●○○○ (low)
   - Disease gain: (2÷3=0) + (Virulence 2<4?0:1) = 0 → Disease unchanged
   - No symptoms triggered

**Strategic Insight**: Host successfully contained low-virulence infection. Pathogen would need higher Replication/Virulence or immune evasion to progress.

---

## 6. RESOURCE SYSTEM (Implied from SOT.md & TURNS.md)
**Biological Energy** (shared, simple prototype):
- Gain 1 at start of each active phase (Pathogen Turn & Host Turn)
- Used to play cards (cost varies by card)
- *Note*: Designed to be replaced with thematic system (Replication Capacity, Immune Capacity, Clinical Capacity) after core validation

---

## 7. IMPLEMENTATION PRIORITIES
Based on SOT.md Section 35 (Simulation Protocol):
1. Create 10 representative pathogen cards (virus, bacterium, etc.)
2. Simulate 5+ rounds per matchup
3. Track: pathogen population/location, Infection, Host Disease, Biological Energy, cards played
4. Validate:
   - Can Host respond before pathogen runaway?
   - Do stats create visibly different strategies?
   - Do response windows create decisions?
   - Can diagnosis/treatment change outcome without making pathogen irrelevant?

**First Prototype Suggestion** (SOT.md Section 31):
- Pathogen Deck (30 cards): 10 Pathogens, 5 Transmission, 5 Virulence, 5 Replication/Evolution, 5 Resistance/Support
- Host Defense Deck (30 cards): 8 Innate Immunity, 6 Adaptive Immunity, 5 Diagnostics, 6 Treatments, 5 Prevention/Support

---

## 8. EDUCATIONAL DESIGN CHECKPOINTS
Ensure mechanics teach through repetition:
- ❌ Antibiotics on virus → ✅ Learn: Antibiotics don't treat viruses
- ❌ Vaccine play → ✅ Learn: Vaccines train adaptive immunity
- ❌ Virus replication without host cell → ✅ Learn: Viruses need host cells
- ❌ Resistance development → ✅ Learn: Selection pressure drives resistance

---

## NEXT STEPS
1. Use this model to create card prototypes (physical or digital)
2. Run initial simulations per Section 7
3. Iterate on stats, costs, and effects based on gameplay feel
4. Develop digital implementation using this as specification

> **Remember**: The game must be fun first. Educational value emerges when players *experience* biological concepts through strategic decisions.