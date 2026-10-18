# OUTBREAK design

The founding principle carries over from the original design documents (now in `archive/`): **biology is the game system.** Players should learn microbiology because the mechanics behave like the real thing, not because facts are printed on cards.

## What changed from the prototype

The original design was a two-player duel (Pathogen player vs Host player) on a shared board. The prototype showed two problems. A student studying alone has no opponent, and the pathogen side taught little: it mostly placed tokens. The redesign keeps the board, the disease pressure, the cards and the asymmetry, but makes the pathogen an automated opponent. Its moves are telegraphed, like intents in a deckbuilder. The player takes the role that carries the learning: the clinician plus the immune system.

The core new idea is the **hidden organism**. In the old design the pathogen's identity was public. Now the player has to identify it, which turns the game into the actual skill a med student practices: going from presentation and lab findings to an organism, and from the organism to a drug.

## Daily loop

1. **Morning.** Pending lab results come back. Once adaptive immunity is online, it clears load in every site. Each running drug doses: if the organism is susceptible, the drug clears load in every infected site it can reach. Drug toxicity lands. You draw 5 cards and get 3 energy.
2. **Your turn.** Spend energy in any order on:
   - **Cards**, usually played on a site. How much a card clears depends on the organism's kind (extracellular, intracellular, virus or yeast), its capsule, and whether it is gram-negative.
   - **Lab tests.** Each reveals one trait. Culture takes a day (three for TB), and biochemistry and susceptibility testing need a cultured isolate.
   - **Drugs.** Up to 2 run at once and keep dosing every morning until stopped.
   - **Diagnosis.** Naming the organism correctly adds +1 to every effective drug. A wrong guess costs 2 health.
3. **Night (the pathogen's turn).** Every infected site grows in proportion to its load, so untreated infections snowball. Then the telegraphed intent fires (growth, spread, or toxin; evasion and biofilm act during your turn instead). Then tissue damage lands, scaled by load, site severity (CNS > blood > lungs/GI > urinary/skin) and the organism's virulence.

You win by clearing every site. You lose if health reaches 0.

## Teaching mechanics

| Mechanic | What it teaches |
| --- | --- |
| Antibacterials do nothing to viruses or fungi | Drug classes have specific targets |
| Susceptibility lists per organism | Spectrum: MRSA vs MSSA, Listeria vs cephalosporins, Pseudomonas needs antipseudomonal drugs |
| CNS penetration and site limits | Cefazolin can't treat meningitis, nitrofurantoin is for cystitis only, oral vancomycin only works in the gut |
| *C. difficile* fed by other antibiotics | Antibiotics disrupt the normal flora |
| Capsule penalty, removed by opsonization | Encapsulated organisms, complement and antibodies |
| Complement bonus vs gram-negatives | The MAC (and Neisseria in complement deficiency) |
| NK/CTL vs viruses and intracellular microbes, neutrophils vs extracellular microbes | Innate and adaptive division of labor |
| Adaptive immunity arrives on day 4–5 | The timescale of clonal expansion; why viral illness is often self-limiting |
| Culture delay; TB culture takes much longer | Lab turnaround shapes empiric therapy |
| MSSA vs MRSA need susceptibility testing | Phenotype vs resistance genotype |
| Drug toxicity (aminoglycosides, amphotericin B) | Therapeutic trade-offs |
| Debrief explaining each drug | Turns every mistake into a lesson |

The differential only crosses off organisms on hard evidence: lab results that don't match, and how the infection responded to a drug. Body site is deliberately not used. The case scripts cover a few presentations per organism, not every site it can infect, so eliminating by site would teach false rules.

## Balance targets

Measured with `npm run simulate` (see the README). Current Resident numbers: the clinician bot wins about 100% of cases in about 4 days, empiric vancomycin + ceftriaxone wins about 51%, and immune-only wins about 31% (mostly self-limiting or skin cases). Human players make mistakes the bot doesn't, so these leave room for a real challenge.

## Ideas for later

- More organisms: *Klebsiella*, *H. influenzae*, Group B Strep, *Enterococcus* (VRE), *Legionella*, *Aspergillus*, *Plasmodium*, *Giardia*, VZV, CMV.
- Patient modifiers (asplenia, HIV with a CD4 count, neutropenia, pregnancy) that change which organisms are likely and which cards work.
- Vaccines and prophylaxis as pre-case choices.
- A "shift" mode: several patients in a row, with deck upgrades between cases.
- A spaced-repetition quiz built from the debrief pearls.
