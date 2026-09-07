1. Card Anatomy

I’d make a Pathogen card look roughly like this:

┌─────────────────────────────────────┐
│ 🦠 ESCHERICHIA COLI                 │
│ BACTERIUM · GRAM-NEGATIVE · ROD     │
├─────────────────────────────────────┤
│                                     │
│  INFECTIVITY       4                 │
│  REPLICATION       5                 │
│  VIRULENCE         2                 │
│  PERSISTENCE       2                 │
│                                     │
├─────────────────────────────────────┤
│ TRANSMISSION                        │
│ Fecal-Oral                          │
│                                     │
│ TROPISM                             │
│ Gastrointestinal Tract              │
├─────────────────────────────────────┤
│ ABILITIES                           │
│                                     │
│ RAPID DIVISION                      │
│ During Biology, gain +2 Population. │
│                                     │
│ OPPORTUNISTIC                       │
│ +1 Infectivity if Host defense is   │
│ compromised.                       │
├─────────────────────────────────────┤
│ RESISTANCES                         │
│ None                                │
├─────────────────────────────────────┤
│ REAL WORLD                          │
│ Some E. coli strains are normal     │
│ gut flora; others cause disease.    │
└─────────────────────────────────────┘

The important distinction is:

Stats describe what the organism does.

Abilities describe how this particular organism behaves.

Facts explain why.

2. The Five Core Stats

I think we should settle on five, rather than six or seven.

INFECTIVITY — 0–5

How easily does this pathogen establish infection?

Used primarily when attempting to enter a Host location.

1 = difficult
2 = low
3 = moderate
4 = high
5 = very high
REPLICATION — 0–5

How effectively does the pathogen increase its population?

This is primarily used during the Biology Phase.

For example:

Replication 4

Gain 4 Population during Biology.

This immediately makes bacteria, viruses, fungi, etc. feel different.

VIRULENCE — 0–5

How much disease progression does an established infection generate?

This should not mean "how dangerous is this organism in real life."

Instead, mechanically:

How efficiently does established infection produce disease?

This distinction matters because virulence is context-dependent.

PERSISTENCE — 0–5

How difficult is the pathogen to eliminate once established?

This affects:

Immune clearance
Treatment
Chronic infection
Latency
Biofilms
Intracellular persistence
EVASION — 0–5

I would add this rather than "Resistance."

How effectively does the pathogen avoid or interfere with host defenses?

Examples:

Capsule
Antigenic variation
Intracellular survival
Complement inhibition
Immune suppression

Resistance then becomes a separate keyword referring specifically to treatment.

That gives us:

EVASION = ability to defeat biology
RESISTANCE = ability to defeat medicine

That's a useful distinction for medical students.

3. The Stat Triangle

These three should drive most pathogen gameplay:

          INFECTIVITY
             /\
            /  \
           /    \
          /      \
         /        \
        ▼          ▼
 REPLICATION ←── VIRULENCE

A pathogen might therefore be:

Highly infectious

Gets into hosts easily.

Highly replicative

Builds a large population.

Highly virulent

Causes substantial disease once established.

Those are not the same thing.

That distinction is educational and strategically useful.

4. Population Is Separate From Stats

This is important.

Don't use HP for pathogens.

Instead, pathogens have:

POPULATION

For example:

E. coli
Population: ●●●●○

Population represents the pathogen burden.

Then:

Replication increases population.

Immune cells decrease population.

Treatment decreases population.

Transmission can move population to another location.

So you get a simple biological relationship:

Replication ↑
     ↓
Pathogen Population ↑
     ↓
Disease Progression ↑
5. Infection Is Also Separate

We should distinguish:

Pathogen Population

from

Host Infection

from

Disease Severity

This gives us three different axes.

PATHOGEN

Population:    ●●●●○


HOST

Infection:     ●●●○○


DISEASE

Severity:      ●●○○○

This is actually quite important educationally.

A large pathogen population doesn't necessarily mean severe disease.

Likewise, severe disease can sometimes result from the host response, not simply pathogen burden.

That opens the door to things like immunopathology later.

6. How the Numbers Actually Work

I'd make the base system extremely simple.

Infection Check

When a pathogen attempts to establish infection:

Infectivity + relevant modifiers

vs.

Host Defense + relevant modifiers

For example:

E. coli Infectivity = 4

Host GI Defense = 2

4 vs 2

SUCCESS

The pathogen establishes infection.

Replication

During Biology:

Population += Replication

So:

E. coli
Replication = 4

Population:

2 → 6

But we can modify this with environment, nutrients, immune pressure, etc.

Disease Progression

Disease progression could be:

Disease Gain =
Pathogen Virulence
+ Population modifier
+ Virulence factors
- Host defenses

We don't want players doing complicated arithmetic every turn, though.

So I'd eventually compress this into a small number of thresholds.

7. Thresholds Instead of Lots of Math

For example:

POPULATION

0–2   Low
3–5   Established
6–8   High
9+    Overwhelming

Then cards interact with thresholds.

Example:

Toxin Production
If Population ≥ 6, increase Disease by 2.

This is much easier than calculating formulas.

8. Card Types Should Have Different Anatomy

We shouldn't force every card to have the same five stats.

Pathogen
Name
Classification
Infectivity
Replication
Virulence
Persistence
Evasion
Transmission
Tropism
Abilities
Resistance
Clinical Fact
Immune Cell
Name
Immune Class
Activation Cost
Clearance
Specificity
Abilities
Clinical Fact
Treatment
Name
Treatment Class
Target
Potency
Mechanism
Resistance Interaction
Clinical Fact
Diagnostic
Name
Test Type
Cost
Information Revealed
Sensitivity / Specificity
Clinical Fact

That last part could be particularly interesting.

9. Diagnostics Should Have Numbers Too

For medical students, I think this could become one of the game's best systems.

Instead of:

"PCR reveals the pathogen."

We could eventually have:

PCR

Sensitivity: 95
Specificity: 98

Cost: 2

Reveal:
Pathogen identity

And a different test might have:

Culture

Sensitivity: 80
Specificity: 99

Cost: 2

Reveal:
Bacterial identity
Susceptibility

Now players are making actual clinical tradeoffs.

We could even introduce false positives/negatives in advanced play.

10. Treatments Need Potency + Target

For example:

PENICILLIN

Class:
β-lactam antibiotic

Target:
Susceptible bacteria

Potency:
4

Mechanism:
Cell-wall synthesis inhibition

Restriction:
Does not affect viruses.

But Potency 4 doesn't mean:

"Penicillin is 4 times stronger."

It means something mechanically defined, such as:

Remove up to 4 Population from a susceptible target.

This keeps the number functional.

11. Resistance Should Be Keywords

I'd avoid giving every pathogen a numerical "Resistance 3."

Instead:

RESISTANT:
Penicillin

RESISTANT:
Macrolides

SUSCEPTIBLE:
Fluoroquinolones

That makes the pharmacology much more recognizable.

Later we can have:

Multidrug Resistant

Resistant to 3+ antibiotic classes.

And:

Pan-resistant

as a genuinely terrifying late-game mechanic.

12. Anatomy of an Example Card

Here's what I think the final visual hierarchy should roughly be:

┌─────────────────────────────────────┐
│                                     │
│        🦠 MYCOBACTERIUM             │
│        TUBERCULOSIS                 │
│                                     │
│ BACTERIUM · ACID-FAST · ROD         │
├─────────────────────────────────────┤
│                                     │
│  INFECTIVITY   3     REPLICATION  2 │
│  VIRULENCE     4     PERSISTENCE 5  │
│  EVASION       4                    │
│                                     │
├─────────────────────────────────────┤
│ TRANSMISSION                         │
│ Airborne                             │
│                                     │
│ TROPISM                              │
│ Respiratory Tract                    │
├─────────────────────────────────────┤
│ ABILITY                              │
│                                     │
│ LATENT RESERVOIR                    │
│ May enter a latent state and avoid  │
│ normal clearance.                   │
│                                     │
│ GRANULOMA                            │
│ ...                                  │
├─────────────────────────────────────┤
│ TREATMENT                            │
│ Requires combination therapy.        │
│                                     │
│ REAL WORLD                           │
│ M. tuberculosis can establish        │
│ persistent infection and remain      │
│ latent for years.                   │
└─────────────────────────────────────┘
13. One Thing I Would Not Do

I wouldn't put a generic:

HP: 120

Attack: 45

Defense: 37

system on this.

It would immediately make the game feel like a reskinned Pokémon/TCG.

Instead, the numbers should correspond to biological quantities or concepts:

Infectivity
Replication
Virulence
Persistence
Evasion
Population
Infection
Disease

Those are meaningful.

14. The Core Numerical Model

I'd currently lock in this preliminary model:

System	Range	Meaning
Infectivity	0–5	Establish infection
Replication	0–5	Increase pathogen population
Virulence	0–5	Produce disease
Persistence	0–5	Resist clearance
Evasion	0–5	Avoid host defenses
Population	0–10+	Current pathogen burden
Infection	0–10	Host infection burden
Disease	0–10	Clinical severity/progression

And the fundamental flow becomes:

Infectivity → Infection → Replication → Population → Virulence → Disease

while the Host tries:

Detection → Immunity → Clearance → Treatment → Recovery

That gives us a very clean foundation for the next step: designing 10 actual cards and assigning numbers to them, then running them through a simulated game to see where the system breaks.