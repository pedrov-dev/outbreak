import assert from "node:assert/strict";
import { test } from "node:test";
import { CARDS, STARTER_DECK, ADAPTIVE_CARDS } from "../src/data/cards.js";
import { DRUGS, drugById } from "../src/data/drugs.js";
import { LABS } from "../src/data/labs.js";
import { PATHOGENS, possibleSites } from "../src/data/pathogens.js";
import { SITE_IDS } from "../src/data/sites.js";

test("every pathogen has a complete, consistent definition", () => {
  const ids = new Set();
  for (const pathogen of PATHOGENS) {
    assert.ok(!ids.has(pathogen.id), `duplicate id ${pathogen.id}`);
    ids.add(pathogen.id);
    for (const trait of ["gram", "culture", "afb", "fungal", "pcr"]) {
      assert.ok(pathogen.traits[trait], `${pathogen.id} lacks ${trait}`);
    }
    const sites = possibleSites(pathogen);
    for (const site of sites) assert.ok(SITE_IDS.includes(site), `${pathogen.id}: bad site ${site}`);
    assert.equal(Boolean(pathogen.traits.csf), sites.has("cns"), `${pathogen.id}: CSF trait must match CNS reach`);
    assert.equal(pathogen.grows === false, !pathogen.traits.biochem, `${pathogen.id}: biochem needs an isolate`);
    for (const drugId of pathogen.susceptible) assert.ok(drugById[drugId], `${pathogen.id}: unknown drug ${drugId}`);
    for (const drugId of Object.keys(pathogen.notes)) {
      assert.ok(drugId === "default" || drugById[drugId], `${pathogen.id}: note for unknown drug ${drugId}`);
      assert.ok(!pathogen.susceptible.includes(drugId), `${pathogen.id}: resistance note on a working drug ${drugId}`);
    }
    assert.ok(pathogen.vignettes.length >= 2, `${pathogen.id} needs two vignettes`);
    for (const vignette of pathogen.vignettes) {
      for (const site of Object.keys(vignette.start)) {
        assert.ok(vignette.route.includes(site), `${pathogen.id}: start site ${site} must be on the route`);
      }
    }
    assert.ok(pathogen.intents.length >= 2);
    assert.ok(pathogen.pearls.length >= 3);
  }
});

test("each pathogen has at least one drug that reaches every site it can infect", () => {
  for (const pathogen of PATHOGENS) {
    for (const site of possibleSites(pathogen)) {
      const reaches = pathogen.susceptible
        .map((id) => drugById[id])
        .some((drug) => (!drug.sites || drug.sites.includes(site)) && (site !== "cns" || drug.cns));
      assert.ok(reaches, `${pathogen.id} in ${site} has no reachable treatment`);
    }
  }
});

test("cards, labs and drugs are well formed", () => {
  for (const id of [...STARTER_DECK, ...ADAPTIVE_CARDS]) assert.ok(CARDS[id], `unknown card ${id}`);
  for (const card of Object.values(CARDS)) {
    assert.ok(card.text && card.fact && card.cost >= 0);
    if (card.target === "site") assert.ok(card.clear);
  }
  assert.equal(new Set(LABS.map((lab) => lab.id)).size, LABS.length);
  assert.equal(new Set(DRUGS.map((drug) => drug.id)).size, DRUGS.length);
  for (const drug of DRUGS) assert.ok(drug.mechanism && drug.note);
});

test("the full lab workup distinguishes every pathogen", () => {
  const traits = ["gram", "culture", "biochem", "afb", "fungal", "pcr"];
  const signature = (pathogen) =>
    traits.map((t) => pathogen.traits[t] ?? "-").join("|") + "|" + [...pathogen.susceptible].sort().join(",");
  const seen = new Map();
  for (const pathogen of PATHOGENS) {
    const key = signature(pathogen);
    assert.ok(!seen.has(key), `${pathogen.id} is indistinguishable from ${seen.get(key)}`);
    seen.set(key, pathogen.id);
  }
});
