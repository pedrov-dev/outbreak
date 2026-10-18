// Automated players used by the balance simulation and the tests.
// The "clinician" bot reasons only from revealed information when choosing tests,
// drugs and diagnoses; it peeks at true card effectiveness to approximate a
// player who knows the immune system well.
import { CARDS } from "../data/cards.js";
import { DRUGS } from "../data/drugs.js";
import { SITE_IDS } from "../data/sites.js";
import { isSusceptible } from "./explain.js";
import {
  cardClearAmount,
  cardStatus,
  differential,
  drugStatus,
  endTurn,
  labStatus,
  makeDiagnosis,
  orderLab,
  playCard,
  siteDamage,
  startDrug,
  stopDrug,
} from "./game.js";

const MAX_DAYS = 40;

export function playGame(state, strategy = "clinician") {
  const turn = STRATEGIES[strategy];
  while (state.status === "playing" && state.day <= MAX_DAYS) {
    turn(state);
    if (state.status === "playing") endTurn(state);
  }
  return state;
}

const STRATEGIES = {
  clinician: (state) => {
    diagnoseIfCertain(state);
    orderUsefulLabs(state, state.day === 1 ? 2 : 1);
    diagnoseIfCertain(state);
    chooseDrugs(state);
    playCards(state);
  },
  // Empiric "vanc + ceftriaxone" forever, no workup.
  empiric: (state) => {
    for (const drugId of ["vancomycin", "ceftriaxone"]) {
      if (drugStatus(state, drugId).ok) startDrug(state, drugId);
    }
    playCards(state);
  },
  // Immune system alone.
  immuneOnly: (state) => playCards(state),
};

function candidates(state) {
  return differential(state)
    .filter((entry) => !entry.eliminated)
    .map((entry) => entry.pathogen);
}

function diagnoseIfCertain(state) {
  if (state.diagnosis.confirmed || state.status !== "playing") return;
  const remaining = candidates(state);
  if (remaining.length === 1) makeDiagnosis(state, remaining[0].id);
}

function labPlan(state) {
  const gram = state.labs.gram?.result;
  if (!gram) return ["gram"];
  const plan = [];
  if (state.sites.cns > 0) plan.push("csf");
  if (gram === "No organisms seen") plan.push("pcr", "afb", "culture");
  else if (gram === "Budding yeast cells") plan.push("fungal");
  else plan.push("culture", "biochem", "pcr", "susceptibility");
  return plan;
}

function orderUsefulLabs(state, budget) {
  let spent = 0;
  for (const labId of labPlan(state)) {
    if (candidates(state).length <= 1) return;
    if (state.labs[labId] && labId !== "csf") continue;
    const status = labStatus(state, labId);
    if (!status.ok) continue;
    const before = state.energy;
    orderLab(state, labId);
    spent += before - state.energy;
    if (spent >= budget) return;
  }
}

// Score each drug by how much of the remaining differential it would treat.
function chooseDrugs(state) {
  const remaining = candidates(state);
  const infected = SITE_IDS.filter((site) => state.sites[site] > 0);
  const coverage = (drug) => {
    const reach = infected.filter(
      (site) => (!drug.sites || drug.sites.includes(site)) && (site !== "cns" || drug.cns),
    ).length;
    if (reach === 0) return 0;
    const covered = remaining.filter((pathogen) => isSusceptible(pathogen, drug)).length;
    return (covered / remaining.length) * (reach / infected.length) - (drug.toxicity ?? 0) * 0.05;
  };
  for (const drugId of [...state.drugs]) {
    if (state.drugObservations[drugId] === "none" || coverage(DRUGS.find((d) => d.id === drugId)) === 0) {
      stopDrug(state, drugId);
    }
  }
  const ranked = DRUGS.filter((drug) => !state.drugs.includes(drug.id) && state.drugObservations[drug.id] !== "none")
    .map((drug) => ({ drug, value: coverage(drug) }))
    .filter((entry) => entry.value > 0.3)
    .sort((a, b) => b.value - a.value);
  for (const { drug } of ranked) {
    if (state.drugs.length >= 2 || state.energy < 2) break;
    const covered = remaining.filter((pathogen) => isSusceptible(pathogen, drug));
    const redundant = state.drugs.some((id) =>
      covered.every((pathogen) => isSusceptible(pathogen, DRUGS.find((d) => d.id === id))),
    );
    if (!redundant && drugStatus(state, drug.id).ok) startDrug(state, drug.id);
  }
}

function playCards(state) {
  let progress = true;
  while (progress && state.status === "playing") {
    progress = false;
    if (state.hp < state.maxHp * 0.45) {
      const fluids = state.hand.find((card) => card.id === "fluids");
      if (fluids && cardStatus(state, fluids.uid).ok) {
        playCard(state, fluids.uid);
        progress = true;
        continue;
      }
    }
    let best = null;
    for (const card of state.hand) {
      const definition = CARDS[card.id];
      if (definition.target !== "site") continue;
      for (const site of SITE_IDS) {
        if (!cardStatus(state, card.uid, site).ok) continue;
        const cleared = Math.min(cardClearAmount(state, card.id, site), state.sites[site]);
        const urgency = siteDamage(state, site) + (state.intent?.source === site ? 2 : 0);
        const value = cleared * (1 + urgency * 0.3);
        if (cleared > 0 && (!best || value > best.value)) best = { card, site, value };
      }
    }
    if (best) {
      playCard(state, best.card.uid, best.site);
      progress = true;
      continue;
    }
    const utility = state.hand.find(
      (card) => ["interferon", "fever"].includes(card.id) && cardStatus(state, card.uid).ok && state.hp > 6,
    );
    if (utility) {
      playCard(state, utility.uid);
      progress = true;
    }
  }
}
