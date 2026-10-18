// OUTBREAK rules engine. Pure functions over a JSON-serializable state object:
// no DOM, no globals, deterministic for a given seed.
import { ADAPTIVE_CARDS, CARDS, STARTER_DECK } from "../data/cards.js";
import { DRUGS, drugById } from "../data/drugs.js";
import { LABS, NORMAL_CSF, labById } from "../data/labs.js";
import { PATHOGENS, grows, pathogenById } from "../data/pathogens.js";
import { SITE_IDS, siteById } from "../data/sites.js";
import { isSusceptible } from "./explain.js";
import { randomInt, shuffle, weightedPick } from "./rng.js";

export const DIFFICULTIES = {
  intern: {
    name: "Intern",
    hp: 36,
    adaptiveDay: 4,
    autoDifferential: true,
    blurb: "More health, adaptive immunity arrives sooner, and the differential crosses itself off.",
  },
  resident: {
    name: "Resident",
    hp: 30,
    adaptiveDay: 5,
    autoDifferential: true,
    blurb: "The standard case. The differential still crosses itself off.",
  },
  attending: {
    name: "Attending",
    hp: 26,
    adaptiveDay: 5,
    autoDifferential: false,
    blurb: "Less health, and you narrow the differential yourself.",
  },
};

export const RULES = {
  handSize: 5,
  energy: 3,
  maxLoad: 24,
  drugSlots: 2,
  drugPotency: 3,
  diagnosisBonus: 1,
  spreadThreshold: 5,
  spreadAmount: 3,
  multiplyAmount: 3,
  overflowLoad: 18,
  damageDivisor: 8,
  wrongDiagnosisDamage: 2,
  evadePenalty: 2,
};

const ok = { ok: true };
const fail = (error) => ({ ok: false, error });

// ---------------------------------------------------------------------------
// Setup

export function createGame({ seed = Date.now(), difficulty = "resident", pathogenId, vignetteIndex } = {}) {
  const settings = DIFFICULTIES[difficulty] ?? DIFFICULTIES.resident;
  const state = {
    version: 1,
    seed,
    rng: seed | 0,
    difficulty: settings === DIFFICULTIES[difficulty] ? difficulty : "resident",
    pathogenId: null,
    vignetteIndex: 0,
    route: [],
    day: 1,
    hp: settings.hp,
    maxHp: settings.hp,
    energy: 0,
    sites: Object.fromEntries(SITE_IDS.map((id) => [id, 0])),
    everInfected: [],
    nextUid: 1,
    draw: [],
    hand: [],
    discard: [],
    drugs: [],
    drugHistory: [],
    drugObservations: {},
    labs: {},
    diagnosis: { confirmed: null, wrong: [] },
    strikes: [],
    intent: null,
    turn: freshTurnMods(),
    adaptiveOnline: false,
    status: "playing",
    log: [],
    stats: { damageTaken: 0, healed: 0, cardsPlayed: 0, testsOrdered: 0, ineffectiveDrugs: 0 },
  };

  const pathogen = pathogenById[pathogenId] ?? PATHOGENS[randomInt(state, PATHOGENS.length)];
  state.pathogenId = pathogen.id;
  state.vignetteIndex =
    vignetteIndex !== undefined && pathogen.vignettes[vignetteIndex]
      ? vignetteIndex
      : randomInt(state, pathogen.vignettes.length);
  const vignette = pathogen.vignettes[state.vignetteIndex];
  state.route = [...vignette.route];
  for (const [site, load] of Object.entries(vignette.start)) setLoad(state, site, load);

  state.draw = shuffle(
    state,
    STARTER_DECK.map((id) => makeCard(state, id)),
  );
  log(state, "Day 1. The patient is admitted.", "system");
  chooseIntent(state);
  startHostTurn(state, { firstDay: true });
  return state;
}

function freshTurnMods() {
  return { fever: false, interferon: false, opsonized: [] };
}

function makeCard(state, id) {
  const card = { uid: state.nextUid, id };
  state.nextUid += 1;
  return card;
}

export function getPathogen(state) {
  return pathogenById[state.pathogenId];
}

export function getVignette(state) {
  return getPathogen(state).vignettes[state.vignetteIndex];
}

export function settingsFor(state) {
  return DIFFICULTIES[state.difficulty];
}

function log(state, text, kind = "info") {
  state.log.push({ day: state.day, text, kind });
}

function setLoad(state, site, load) {
  state.sites[site] = Math.max(0, Math.min(RULES.maxLoad, Math.round(load)));
  if (state.sites[site] > 0 && !state.everInfected.includes(site)) state.everInfected.push(site);
}

export function totalLoad(state) {
  return SITE_IDS.reduce((sum, site) => sum + state.sites[site], 0);
}

function damage(state, amount) {
  if (amount <= 0) return;
  state.hp = Math.max(0, state.hp - amount);
  state.stats.damageTaken += amount;
}

function heal(state, amount) {
  const before = state.hp;
  state.hp = Math.min(state.maxHp, state.hp + amount);
  state.stats.healed += state.hp - before;
  return state.hp - before;
}

function checkOutcome(state) {
  if (state.status !== "playing") return;
  if (totalLoad(state) === 0) {
    state.status = "won";
    log(state, "The infection is cleared. The patient recovers.", "good");
  } else if (state.hp <= 0) {
    state.status = "lost";
    log(state, "The patient has died.", "bad");
  }
}

// ---------------------------------------------------------------------------
// Host turn

function startHostTurn(state, { firstDay = false } = {}) {
  resolveLabs(state);
  if (!firstDay) {
    adaptiveResponse(state);
    doseDrugs(state);
    checkOutcome(state);
    if (state.status !== "playing") return;
  }
  state.energy = RULES.energy;
  for (let i = 0; i < RULES.handSize; i += 1) drawCard(state);
}

function drawCard(state) {
  if (state.draw.length === 0) {
    if (state.discard.length === 0) return;
    state.draw = shuffle(state, state.discard);
    state.discard = [];
  }
  state.hand.push(state.draw.pop());
}

function adaptiveResponse(state) {
  const settings = settingsFor(state);
  if (!state.adaptiveOnline && state.day >= settings.adaptiveDay) {
    state.adaptiveOnline = true;
    const cards = ADAPTIVE_CARDS.map((id) => makeCard(state, id));
    state.draw = shuffle(state, [...state.draw, ...cards]);
    log(
      state,
      "Adaptive immunity is online: clonal B and T cells have expanded. Antibodies and cytotoxic T cells join your deck.",
      "adaptive",
    );
  }
  if (!state.adaptiveOnline) return;
  const amount = getPathogen(state).adaptiveClear ?? 2;
  const cleared = [];
  for (const site of SITE_IDS) {
    if (state.sites[site] > 0) {
      const removed = Math.min(amount, state.sites[site]);
      setLoad(state, site, state.sites[site] - removed);
      cleared.push(`${siteById[site].name} −${removed}`);
    }
  }
  if (cleared.length) log(state, `Adaptive response: ${cleared.join(", ")}.`, "adaptive");
}

function drugReaches(drug, site) {
  if (drug.sites && !drug.sites.includes(site)) return false;
  if (site === "cns" && !drug.cns) return false;
  return true;
}

export function drugPotency(state) {
  let potency = RULES.drugPotency;
  if (state.diagnosis.confirmed === state.pathogenId) potency += RULES.diagnosisBonus;
  if (state.intent?.type === "biofilm") potency -= 1;
  return Math.max(1, potency);
}

function doseDrug(state, drugId) {
  const drug = drugById[drugId];
  const pathogen = getPathogen(state);
  const effective = isSusceptible(pathogen, drug);
  const reached = [];
  const blocked = [];
  for (const site of SITE_IDS) {
    if (state.sites[site] === 0) continue;
    if (drugReaches(drug, site)) reached.push(site);
    else blocked.push(site);
  }
  const blockedText = blocked.length
    ? ` Doesn't reach: ${blocked.map((site) => siteById[site].name).join(", ")}.`
    : "";
  if (reached.length === 0) {
    log(state, `${drug.name}: no infected site within reach.${blockedText}`, "drug");
    return;
  }
  state.drugObservations[drugId] = effective ? "response" : "none";
  if (!effective) {
    log(state, `${drug.name}: no clinical response.${blockedText}`, "drug-bad");
    return;
  }
  const potency = drugPotency(state);
  const parts = reached.map((site) => {
    const removed = Math.min(potency, state.sites[site]);
    setLoad(state, site, state.sites[site] - removed);
    return `${siteById[site].name} −${removed}`;
  });
  log(state, `${drug.name}: ${parts.join(", ")}.${blockedText}`, "drug-good");
}

function doseDrugs(state) {
  const pathogen = getPathogen(state);
  for (const drugId of state.drugs) doseDrug(state, drugId);
  for (const drugId of state.drugs) {
    const drug = drugById[drugId];
    if (drug.toxicity) {
      damage(state, drug.toxicity);
      log(state, `${drug.name} toxicity: −${drug.toxicity} health.`, "bad");
    }
    if (
      pathogen.fedByAntibiotics &&
      drug.kind === "antibacterial" &&
      !isSusceptible(pathogen, drug) &&
      state.sites.gi > 0
    ) {
      setLoad(state, "gi", state.sites.gi + 1);
      log(state, `${drug.name} disrupts the normal gut flora: GI tract +1.`, "bad");
    }
  }
}

function resolveLabs(state) {
  for (const [labId, entry] of Object.entries(state.labs)) {
    if (!entry.ready && entry.readyDay <= state.day) {
      entry.ready = true;
      log(state, `${labById[labId].name} result: ${entry.result}`, "lab");
    }
  }
}

// ---------------------------------------------------------------------------
// Player actions. Each returns { ok } or { ok: false, error }.

export function cardStatus(state, uid, site) {
  if (state.status !== "playing") return fail("The case is over.");
  const instance = state.hand.find((card) => card.uid === uid);
  if (!instance) return fail("That card isn't in your hand.");
  const card = CARDS[instance.id];
  if (state.energy < card.cost) return fail("Not enough energy.");
  if (card.target === "site") {
    if (site === undefined) return { ok: true, needsTarget: true };
    if (!SITE_IDS.includes(site)) return fail("Choose a body site.");
    if (card.onlySite && site !== card.onlySite) return fail(`${card.name} only works on ${siteById[card.onlySite].name}.`);
    if (state.sites[site] === 0) return fail("Nothing to clear there.");
  }
  if (card.heal && state.hp >= state.maxHp) return fail("The patient is already at full health.");
  return ok;
}

export function cardClearAmount(state, cardId, site) {
  const card = CARDS[cardId];
  const pathogen = getPathogen(state);
  let amount = card.clear?.[pathogen.kind] ?? 0;
  if (amount === 0) return 0;
  if (card.gramNegativeBonus && pathogen.gramNegative) amount += card.gramNegativeBonus;
  if (card.phagocyte && pathogen.capsule && !state.turn.opsonized.includes(site)) amount -= 1;
  if (state.intent?.type === "evade") amount -= RULES.evadePenalty;
  return Math.max(0, amount);
}

export function playCard(state, uid, site) {
  const status = cardStatus(state, uid, site);
  if (!status.ok) return status;
  if (status.needsTarget) return fail("Choose a body site for this card.");
  const index = state.hand.findIndex((card) => card.uid === uid);
  const [instance] = state.hand.splice(index, 1);
  const card = CARDS[instance.id];
  state.energy -= card.cost;
  state.discard.push(instance);
  state.stats.cardsPlayed += 1;

  if (card.target === "site") {
    const amount = Math.min(cardClearAmount(state, instance.id, site), state.sites[site]);
    if (card.opsonizes && !state.turn.opsonized.includes(site)) state.turn.opsonized.push(site);
    setLoad(state, site, state.sites[site] - amount);
    const where = siteById[site].name;
    log(
      state,
      amount > 0 ? `${card.name} → ${where}: −${amount}.` : `${card.name} → ${where}: no effect.`,
      amount > 0 ? "good" : "info",
    );
  }
  if (instance.id === "interferon") {
    state.turn.interferon = true;
    log(state, "Interferon: infected cells enter an antiviral state.", "good");
  }
  if (instance.id === "fever") {
    state.turn.fever = true;
    damage(state, card.selfDamage);
    log(state, `Fever: replication slows. The patient takes ${card.selfDamage} damage.`, "info");
  }
  if (card.heal) {
    const healed = heal(state, card.heal);
    log(state, `${card.name}: +${healed} health.`, "good");
  }
  checkOutcome(state);
  return ok;
}

export function labStatus(state, labId) {
  const lab = labById[labId];
  if (!lab) return fail("Unknown test.");
  if (state.status !== "playing") return fail("The case is over.");
  const existing = state.labs[labId];
  if (existing) {
    const repeatable = lab.repeatable && existing.ready && existing.result === NORMAL_CSF;
    if (!repeatable) return fail(existing.ready ? "Already resulted." : "Pending.");
  }
  if (lab.needs) {
    const prerequisite = state.labs[lab.needs];
    if (!prerequisite) return fail(`Needs a ${labById[lab.needs].name.toLowerCase()} first.`);
    if (!prerequisite.ready) return fail(`Waiting for the ${labById[lab.needs].name.toLowerCase()}.`);
    if (!grows(getPathogen(state))) return fail("No isolate to test.");
  }
  if (state.energy < lab.cost) return fail("Not enough energy.");
  return ok;
}

export function susceptibilityKey(pathogen) {
  return [...pathogen.susceptible].sort().join(",");
}

function labResult(state, lab) {
  const pathogen = getPathogen(state);
  if (lab.id === "csf") {
    if (state.sites.cns === 0) return { result: NORMAL_CSF, clue: null };
    return { result: pathogen.traits.csf, clue: { trait: "csf", value: pathogen.traits.csf } };
  }
  if (lab.id === "susceptibility") {
    const kind = pathogen.kind === "yeast" ? "antifungal" : "antibacterial";
    const tested = DRUGS.filter((drug) => drug.kind === kind);
    const susceptible = tested.filter((drug) => isSusceptible(pathogen, drug)).map((drug) => drug.name);
    const resistant = tested.filter((drug) => !isSusceptible(pathogen, drug)).map((drug) => drug.name);
    return {
      result: `Susceptible: ${susceptible.join(", ")}. Resistant: ${resistant.join(", ")}.`,
      clue: { trait: "susceptibility", value: susceptibilityKey(pathogen) },
    };
  }
  const value = pathogen.traits[lab.trait];
  return { result: value, clue: { trait: lab.trait, value } };
}

export function orderLab(state, labId) {
  const status = labStatus(state, labId);
  if (!status.ok) return status;
  const lab = labById[labId];
  const pathogen = getPathogen(state);
  state.energy -= lab.cost;
  state.stats.testsOrdered += 1;
  const delay = labId === "culture" ? (pathogen.cultureDelay ?? lab.delay) : (lab.delay ?? 0);
  const { result, clue } = labResult(state, lab);
  state.labs[labId] = { orderedDay: state.day, readyDay: state.day + delay, ready: false, result, clue };
  if (delay === 0) {
    resolveLabs(state);
  } else {
    log(state, `${lab.name} sent. Result expected on day ${state.day + delay}.`, "lab");
  }
  return ok;
}

export function drugStatus(state, drugId) {
  const drug = drugById[drugId];
  if (!drug) return fail("Unknown drug.");
  if (state.status !== "playing") return fail("The case is over.");
  if (state.drugs.includes(drugId)) return fail("Already running.");
  if (state.drugs.length >= RULES.drugSlots) return fail(`Only ${RULES.drugSlots} drugs at once. Stop one first.`);
  if (state.energy < drug.cost) return fail("Not enough energy.");
  return ok;
}

export function startDrug(state, drugId) {
  const status = drugStatus(state, drugId);
  if (!status.ok) return status;
  const drug = drugById[drugId];
  state.energy -= drug.cost;
  state.drugs.push(drugId);
  const effective = isSusceptible(getPathogen(state), drug);
  if (!effective) state.stats.ineffectiveDrugs += 1;
  state.drugHistory.push({ drugId, day: state.day, effective });
  log(state, `Started ${drug.name}.`, "drug");
  doseDrug(state, drugId);
  checkOutcome(state);
  return ok;
}

export function stopDrug(state, drugId) {
  if (!state.drugs.includes(drugId)) return fail("That drug isn't running.");
  state.drugs = state.drugs.filter((id) => id !== drugId);
  log(state, `Stopped ${drugById[drugId].name}.`, "drug");
  return ok;
}

export function makeDiagnosis(state, pathogenId) {
  if (state.status !== "playing") return fail("The case is over.");
  if (state.diagnosis.confirmed) return fail("Already diagnosed.");
  const guess = pathogenById[pathogenId];
  if (!guess) return fail("Unknown organism.");
  if (state.diagnosis.wrong.includes(pathogenId)) return fail("You already ruled that out.");
  if (pathogenId === state.pathogenId) {
    state.diagnosis.confirmed = pathogenId;
    log(
      state,
      `Diagnosis confirmed: ${guess.name}. Targeted therapy: effective drugs clear +${RULES.diagnosisBonus}.`,
      "good",
    );
  } else {
    state.diagnosis.wrong.push(pathogenId);
    if (!state.strikes.includes(pathogenId)) state.strikes.push(pathogenId);
    damage(state, RULES.wrongDiagnosisDamage);
    log(
      state,
      `Not ${guess.short}: the picture doesn't fit. The delay costs ${RULES.wrongDiagnosisDamage} health.`,
      "bad",
    );
    checkOutcome(state);
  }
  return ok;
}

export function toggleStrike(state, pathogenId) {
  if (state.strikes.includes(pathogenId)) {
    if (state.diagnosis.wrong.includes(pathogenId)) return fail("Already ruled out by a wrong diagnosis.");
    state.strikes = state.strikes.filter((id) => id !== pathogenId);
  } else {
    state.strikes.push(pathogenId);
  }
  return ok;
}

// ---------------------------------------------------------------------------
// Pathogen turn

export function endTurn(state) {
  if (state.status !== "playing") return fail("The case is over.");
  state.discard.push(...state.hand);
  state.hand = [];
  pathogenTurn(state);
  if (state.status !== "playing") return ok;
  state.day += 1;
  state.turn = freshTurnMods();
  log(state, `Day ${state.day}.`, "system");
  chooseIntent(state);
  startHostTurn(state);
  return ok;
}

function pathogenTurn(state) {
  const pathogen = getPathogen(state);
  const intracellular = pathogen.kind === "virus" || pathogen.kind === "intracellular";
  let rate = pathogen.growth;
  if (state.turn.fever) rate /= 2;
  if (state.turn.interferon && intracellular) rate = 0;
  if (rate > 0) {
    const parts = [];
    for (const site of SITE_IDS) {
      const load = state.sites[site];
      if (load === 0) continue;
      const growth = Math.max(1, Math.round(load * rate));
      setLoad(state, site, load + growth);
      parts.push(`${siteById[site].name} +${growth}`);
    }
    if (parts.length) log(state, `The organism replicates: ${parts.join(", ")}.`, "threat");
  } else {
    log(state, "Replication is suppressed this turn.", "good");
  }

  executeIntent(state);

  for (const site of SITE_IDS) {
    if (state.sites[site] >= RULES.overflowLoad) {
      const next = nextOnRoute(state, site);
      if (next) {
        setLoad(state, next, state.sites[next] + 1);
        log(state, `Overwhelming burden in ${siteById[site].name} seeds ${siteById[next].name}.`, "threat");
      }
    }
  }

  const harm = SITE_IDS.reduce((sum, site) => sum + siteDamage(state, site), 0);
  if (harm > 0) {
    damage(state, harm);
    log(state, `Tissue damage: −${harm} health.`, "bad");
  }
  checkOutcome(state);
}

export function siteDamage(state, site) {
  const load = state.sites[site];
  if (load === 0) return 0;
  const pathogen = getPathogen(state);
  return Math.ceil((load * siteById[site].weight * pathogen.virulence) / RULES.damageDivisor);
}

function nextOnRoute(state, site) {
  const index = state.route.indexOf(site);
  if (index === -1 || index === state.route.length - 1) return null;
  return state.route[index + 1];
}

function spreadOptions(state) {
  return state.route
    .filter((site) => state.sites[site] >= RULES.spreadThreshold && nextOnRoute(state, site))
    .sort((a, b) => state.sites[b] - state.sites[a]);
}

function heaviestSite(state) {
  return SITE_IDS.filter((site) => state.sites[site] > 0).sort((a, b) => state.sites[b] - state.sites[a])[0];
}

function chooseIntent(state) {
  const pathogen = getPathogen(state);
  let options = pathogen.intents.filter((intent) => intent.type !== "spread" || spreadOptions(state).length > 0);
  if (options.length > 1 && state.intent) {
    const varied = options.filter((intent) => intent.type !== state.intent.type);
    if (varied.length) options = varied;
  }
  const picked = weightedPick(state, options);
  const intent = { type: picked.type, name: picked.name ?? null };
  if (picked.type === "multiply") intent.amount = picked.amount ?? RULES.multiplyAmount;
  if (picked.type === "toxin") intent.amount = picked.amount;
  if (picked.type === "spread") {
    intent.source = spreadOptions(state)[0];
    intent.target = nextOnRoute(state, intent.source);
    intent.amount = RULES.spreadAmount;
  }
  state.intent = intent;
}

function executeIntent(state) {
  const intent = state.intent;
  if (!intent) return;
  if (intent.type === "multiply") {
    const site = heaviestSite(state);
    if (site) {
      setLoad(state, site, state.sites[site] + intent.amount);
      log(state, `Rapid growth in ${siteById[site].name}: +${intent.amount}.`, "threat");
    }
  } else if (intent.type === "spread") {
    if (state.sites[intent.source] >= RULES.spreadThreshold) {
      setLoad(state, intent.target, state.sites[intent.target] + intent.amount);
      log(
        state,
        `The organism spreads from ${siteById[intent.source].name} to ${siteById[intent.target].name}: +${intent.amount}.`,
        "threat",
      );
    } else {
      log(state, `Spread to ${siteById[intent.target].name} was contained.`, "good");
    }
  } else if (intent.type === "toxin") {
    damage(state, intent.amount);
    log(state, `Toxin release: −${intent.amount} health.`, "bad");
  }
}

// What the UI tells the player about the organism's next move.
export function describeIntent(state) {
  const intent = state.intent;
  if (!intent) return null;
  const named = state.diagnosis.confirmed && intent.name ? `${intent.name}: ` : "";
  switch (intent.type) {
    case "multiply":
      return { icon: "📈", title: "Rapid growth", text: `${named}+${intent.amount} in the most infected site at the end of your turn.` };
    case "spread":
      return {
        icon: "➡️",
        title: "Spreading",
        text: `${named}will seed ${siteById[intent.target].name} from ${siteById[intent.source].name}. Bring ${siteById[intent.source].name} below ${RULES.spreadThreshold} to stop it.`,
      };
    case "toxin":
      return { icon: "☠️", title: "Toxin", text: `${named}${intent.amount} damage at the end of your turn.` };
    case "evade":
      return { icon: "🛡️", title: "Immune evasion", text: `${named}immune cards clear ${RULES.evadePenalty} less this turn.` };
    case "biofilm":
      return { icon: "🧱", title: "Biofilm", text: `${named}drugs cleared 1 less today.` };
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Differential diagnosis

export function differential(state) {
  const clues = [];
  for (const [labId, entry] of Object.entries(state.labs)) {
    if (entry.ready && entry.clue) clues.push({ ...entry.clue, label: labById[labId].name });
  }
  return PATHOGENS.map((pathogen) => {
    const reasons = [];
    for (const clue of clues) {
      const value = clue.trait === "susceptibility" ? susceptibilityKey(pathogen) : pathogen.traits[clue.trait];
      if (value !== clue.value) reasons.push(clue.label);
    }
    // Only lab evidence and treatment response rule organisms out. Sites are deliberately
    // not used: the case scripts cover a few presentations, not every site a microbe can reach.
    for (const [drugId, observation] of Object.entries(state.drugObservations)) {
      const susceptible = isSusceptible(pathogen, drugById[drugId]);
      if ((observation === "response") !== susceptible) reasons.push(`Response to ${drugById[drugId].name}`);
    }
    if (state.diagnosis.wrong.includes(pathogen.id)) reasons.push("Wrong diagnosis");
    return { pathogen, eliminated: reasons.length > 0, reasons };
  });
}

// ---------------------------------------------------------------------------
// Scoring

export function scoreGame(state) {
  const days = state.day;
  const lines = [];
  if (state.status !== "won") {
    return { score: 0, grade: "F", lines: [{ label: "The patient died", value: 0 }] };
  }
  let score = 100;
  const add = (label, value) => {
    if (value !== 0) lines.push({ label, value });
    score += value;
  };
  add("Days beyond 4", -5 * Math.max(0, days - 4));
  add("Health lost", -Math.round(30 * (1 - state.hp / state.maxHp)));
  add("Wrong diagnoses", -10 * state.diagnosis.wrong.length);
  add("Ineffective drugs started", -6 * state.stats.ineffectiveDrugs);
  if (!state.diagnosis.confirmed) add("No confirmed diagnosis", -15);
  score = Math.max(0, Math.min(100, score));
  const grade = score >= 90 ? "S" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
  return { score, grade, lines };
}

export { LABS, DRUGS, PATHOGENS };
