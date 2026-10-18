import assert from "node:assert/strict";
import { test } from "node:test";
import { CARDS } from "../src/data/cards.js";
import { DRUGS, drugById } from "../src/data/drugs.js";
import { LABS, NORMAL_CSF } from "../src/data/labs.js";
import { PATHOGENS, pathogenById } from "../src/data/pathogens.js";
import { SITES } from "../src/data/sites.js";
import { explainDrug } from "../src/engine/explain.js";
import { DIFFICULTIES, createGame, describeIntent, endTurn, startDrug } from "../src/engine/game.js";
import * as en from "../src/i18n/en.js";
import * as es from "../src/i18n/es.js";
import { logText, setLang, t } from "../src/i18n/index.js";

// Every English content string the UI shows, gathered from the data files.
function contentStrings() {
  const out = new Set([NORMAL_CSF]);
  const add = (...values) => values.flat().forEach((v) => v && out.add(v));
  for (const d of Object.values(DIFFICULTIES)) add(d.name, d.blurb);
  for (const s of SITES) add(s.name, s.short, s.blurb);
  for (const l of LABS) add(l.name, l.blurb);
  for (const c of Object.values(CARDS)) add(c.name, c.text, c.fact);
  for (const d of DRUGS) add(d.name, d.group, d.mechanism, d.note);
  for (const p of PATHOGENS) {
    add(p.group, Object.values(p.traits), Object.values(p.notes), p.virulenceFactors, p.treatment, p.pearls);
    add(p.vignettes.map((v) => v.text), p.intents.map((i) => i.name));
  }
  return [...out];
}

test("every content string has a Spanish translation", () => {
  const missing = contentStrings().filter((text) => !(text in es.content));
  assert.deepEqual(missing, []);
});

test("Spanish has no stale content keys", () => {
  const known = new Set([...contentStrings(), ...PATHOGENS.flatMap((p) => [p.name, p.short])]);
  const stale = Object.keys(es.content).filter((key) => !known.has(key));
  assert.deepEqual(stale, []);
});

test("both locales define the same message keys", () => {
  assert.deepEqual(Object.keys(es.messages).sort(), Object.keys(en.messages).sort());
});

test("a case renders fully in Spanish and switches back", () => {
  setLang("es");
  try {
    const state = createGame({ seed: 7, pathogenId: "spneumo", vignetteIndex: 1 });
    startDrug(state, "cefazolin");
    assert.equal(logText(state.log.at(-1)), "Cefazolina: Vías respiratorias −3, Sangre −3. No llega a: SNC.");
    endTurn(state);
    for (const entry of state.log) assert.doesNotMatch(logText(entry), /\{\w+\}/);
    assert.ok(describeIntent(state).title);
    assert.match(explainDrug(pathogenById.flu, drugById.ceftriaxone), /Los virus no tienen ninguna/);
    assert.equal(t("adaptive.in", { n: 1 }), "Inmunidad adaptativa en 1 día");
    setLang("en");
    assert.equal(logText(state.log[0]), "Day 1. The patient is admitted.");
  } finally {
    setLang("en");
  }
});
