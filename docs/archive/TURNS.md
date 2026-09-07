# Turn Structure

Players do not take completely independent turns. Each round is a biological
conversation:

Round sequence: Pathogen turn -> Host response -> Host turn -> Pathogen response

The active player may take up to two actions. The opposing player gets one
response window after each action. `SOT.md` defines the card anatomy and
numerical stat rules; this document describes the turn sequence.

## Pathogen Turn

The Pathogen player draws one card, gains one Biological Energy, resolves
automatic replication, and takes up to two actions. After each action, the
Host Defense player may play one legal response.

## Host Turn

The Host Defense player draws one card, gains one Biological Energy, resolves
ongoing treatments and immune effects, and takes up to two actions. After each
action, the Pathogen player may play one legal response.

## Round Resolution

After both active phases and all responses, resolve population, Infection,
tissue damage, Disease, ongoing effects, and the Outbreak check.

The detailed phases below describe an active turn.

I'd make each active turn have five phases.

PHASE 1 — DRAW

Active player draws a card.

Then any "start of turn" effects occur.

DRAW
↓
Resolve ongoing effects
PHASE 2 — BIOLOGY

This is the automatic biological phase.

Pathogens do what pathogens naturally do.

Examples:

Bacteria replicate.
Viruses replicate in infected cells.
Latent viruses remain dormant.
Parasites progress through life cycles.
Infection spreads.

This is important because it makes the game feel like biology rather than simply card effects.

For example:

E. coli

Replication: +2

→ Population increases

The player doesn't necessarily need to spend an action to make bacteria reproduce.

PHASE 3 — ACTIONS

The active player gets up to 2 Actions.

This is the main strategic phase.

Actions might include:

Pathogen

Infect

Move infection into a new location.

Replicate

Increase pathogen population.

Spread

Transmit to another host compartment.

Evolve

Play mutation/resistance cards.

Virulence

Activate a virulence factor.

Host Defense

Investigate

Generate clinical information.

Diagnose

Perform a diagnostic test.

Deploy

Play an immune cell.

Treat

Administer treatment.

Contain

Reduce transmission.

Vaccinate

Create future immunity.

Two actions keeps the exchange compact while leaving room for the opponent's
response windows.

6. PHASE 4 — RESPONSE

After each active action, the non-active player gets one opportunity to
respond. The response resolves immediately; there is no growing stack in the
first prototype.

For example:

Pathogen:

"I'm using Rapid Replication."

Host:

"I play Fever."

Pathogen:

"I'll use Heat Shock Response."

Host:

"Then I'll activate Neutrophils."

This creates reactive biological play without requiring a full stack system.

We can eventually call this:

Biological Response

Cards can have:

Action
Response
Reaction

But I would initially keep it to one response window to avoid rules bloat.

7. PHASE 5 — PROGRESSION

At the end of every turn, the Host's biological state is evaluated.

For example:

INFECTION
   ↓
Does pathogen population exceed threshold?
   ↓
Does tissue damage increase?
   ↓
Does disease progression increase?
   ↓
Does Host reach next stage?

Then:

Symptoms may appear.
Complications may appear.
Outbreak may occur.

This is also when automatic effects like fever, inflammation, or ongoing treatment resolve.

8. Example Turn

Let's take the previous E. coli game.

The board currently looks like:

HOST

🧠 CNS
────────────────

🫁 RESPIRATORY
────────────────

🫃 GI TRACT
🦠 E. coli
Population: 4
Infection: ●●●●○

🩸 BLOOD
────────────────

🧴 SKIN
────────────────

HOST DISEASE

0 1 2 3 4 5 6 7 8 9 10
            ▲
Pathogen Turn
1. Draw

Draw:

Toxin Production

2. Biology

E. coli has:

Replication = 2

Population goes:

4 → 6
3. Actions

Action 1:

Toxin Production

Disease progression +1.

Action 2:

Spread

GI infection increases.

Action 3:

Virulence Factor

Activate Capsule.

4. Host Response

Host responds:

Macrophage

Remove 2 bacterial population.

Then:

Inflammation

Reduce infection.

5. Progression

The system evaluates:

Population: 6 → 4
Infection:  ●●●●○
Disease:    4 → 5

The Host enters:

SEVERE DISEASE

Now the Host Defense player gets an additional clinical penalty next turn.

9. Why the Biology Phase Is Important

This is probably the single biggest thing I'd preserve from the concept.

Most TCGs work like:

"I spend mana → I play creature → creature attacks."

OUTBREAK should feel more like:

"I establish bacteria → bacteria reproduce → the immune system notices → inflammation occurs → I develop resistance → treatment changes → disease progresses."

The biology happens automatically, while players manipulate it.

That's the game's identity.

10. The Information Layer

For medical students, I'd add a small Clinical Information Panel.

Something like:

╔══════════════════════════════╗
║       CLINICAL PICTURE       ║
╠══════════════════════════════╣
║ Location: GI Tract           ║
║ Fever: +                     ║
║ Diarrhea: +                  ║
║ Inflammation: ++             ║
║                              ║
║ Gram: Gram-negative          ║
║ Morphology: Rod              ║
║                              ║
║ PATHOGEN: ???                ║
╚══════════════════════════════╝

The Pathogen player knows what it is.

The Host player gradually uncovers this information through gameplay.

That means diagnosis becomes a genuine strategic resource.

11. The Resulting Game Loop

The entire game can therefore be summarized as:

              PATHOGEN
                  │
                  ▼
              EXPOSURE
                  │
                  ▼
              INFECTION
                  │
                  ▼
              REPLICATION
                  │
          ┌───────┴───────┐
          │               │
     IMMUNE RESPONSE   TRANSMISSION
          │               │
          └───────┬───────┘
                  ▼
             DISEASE
                  │
          ┌───────┴───────┐
          │               │
       TREATMENT       EVOLUTION
          │               │
          └───────┬───────┘
                  ▼
        ┌─────────────────┐
        │                 │
     CLEARANCE         OUTBREAK
        │                 │
       WIN               WIN

And that's starting to feel like a real game system, rather than just a collection of card ideas.