# OUTBREAK

A solo card game for learning clinical microbiology.

A patient arrives with a mystery infection. You are both the immune system and the clinician. Each day you spend energy on immune cards, lab tests and drugs. You work up the organism, narrow the differential, choose an antimicrobial that actually covers it and reaches the infected site, and keep the patient alive while the pathogen grows, spreads and releases toxins. Every case ends with a debrief: the organism's lab profile, virulence factors, treatment and high-yield pearls, plus an explanation of why each drug you chose did or didn't work.

It runs entirely in the browser with no build step and no dependencies, and works on phones.

## Play

```bash
npm start
```

Then open http://127.0.0.1:8417. Any static file server works too (`python -m http.server`). The page uses ES modules, so opening `index.html` straight from disk won't work.

## What's in it

- **14 organisms** across gram-positive and gram-negative bacteria, mycobacteria, viruses and fungi: MSSA, MRSA, *S. pyogenes*, *S. pneumoniae*, *N. meningitidis*, *E. coli*, *P. aeruginosa*, *L. monocytogenes*, *C. difficile*, *M. tuberculosis*, influenza A, HSV-1, *C. albicans* and *C. neoformans*. Each has two USMLE-style presentations.
- **8 lab tests**: Gram stain, culture (which takes a day, or three for TB), biochemistry, susceptibility testing, acid-fast stain, KOH/India ink, a PCR panel, and lumbar puncture.
- **21 drugs**, each with its real mechanism, spectrum, CNS penetration and site limits. Cefazolin won't reach the meninges, nitrofurantoin only works in the bladder, IV vancomycin does nothing for *C. difficile*, and broad antibiotics make *C. difficile* worse.
- **Immune cards** that follow real immunology: neutrophils fail against viruses, capsules blunt phagocytes until complement or antibodies opsonize, NK and cytotoxic T cells handle intracellular microbes, and adaptive immunity only arrives after several days.
- **Three difficulties.** Intern and Resident cross off the differential automatically. Attending makes you do it yourself.
- **English and Mexican Spanish**, switchable at any time with the EN/ES toggle, even mid-case. It defaults to the browser's language. Translations live in `src/i18n/`, and a test fails if any game text is missing a translation.
- **Case files**, a study reference that unlocks each organism once you've met it, plus the full formulary and immune card reference.

Progress and an in-progress case are saved in the browser's local storage.

## Publish

The repository deploys itself to GitHub Pages. In the GitHub repository settings, go to **Pages**, set **Source** to **GitHub Actions**, then push to `master`. `.github/workflows/pages.yml` runs the tests and publishes the static files. Netlify, Cloudflare Pages or any static host also works: serve the repository root.

## Develop

Requires Node 22 or newer (only for tests and tooling; the game itself has no dependencies).

```bash
npm test            # rules and content tests
npm run simulate    # balance report: bot win rates per organism and difficulty
```

The simulation plays thousands of games with three bots: a **clinician** that works up the case and treats from the evidence, an **empiric** bot that gives vancomycin + ceftriaxone forever, and an **immune-only** bot that never prescribes. A healthy balance keeps the clinician near 100%, empiric therapy around 50% (it misses Listeria, Pseudomonas, *C. difficile*, TB, viruses and fungi), and immune-only well below that.

## Project layout

- `index.html`, `favicon.svg`: the page
- `src/data/`: all game content. Organisms, drugs, labs, cards and body sites live here as plain data.
- `src/engine/`: the rules (`game.js`), drug explanations (`explain.js`), seeded RNG, and the simulation bots. No DOM code.
- `src/ui/`: the browser front end (`app.js`, `styles.css`)
- `scripts/`: local server and balance simulation
- `tests/`: `node:test` suites
- `docs/DESIGN.md`: rules and design notes. `docs/archive/` holds the original design documents.

The original Python/Flask prototype is preserved at the `python-prototype` git tag.

## Disclaimer

OUTBREAK is a study aid, not clinical guidance. Real treatment depends on local resistance patterns, patient factors and current guidelines.
