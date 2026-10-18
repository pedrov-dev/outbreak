import assert from "node:assert/strict";
import { test } from "node:test";
import { drugById } from "../src/data/drugs.js";
import { LABS } from "../src/data/labs.js";
import { PATHOGENS, pathogenById } from "../src/data/pathogens.js";
import { playGame } from "../src/engine/bot.js";
import { explainDrug } from "../src/engine/explain.js";
import { logText } from "../src/i18n/index.js";
import {
  RULES,
  createGame,
  differential,
  endTurn,
  makeDiagnosis,
  orderLab,
  playCard,
  scoreGame,
  startDrug,
  stopDrug,
  totalLoad,
} from "../src/engine/game.js";

const game = (pathogenId, extra = {}) => createGame({ seed: 7, pathogenId, vignetteIndex: 0, ...extra });

function giveCard(state, id) {
  const card = { uid: state.nextUid++, id };
  state.hand.push(card);
  return card;
}

test("a seed reproduces the same game", () => {
  const a = playGame(createGame({ seed: 42 }));
  const b = playGame(createGame({ seed: 42 }));
  assert.deepEqual(a, b);
});

test("a saved game resumes identically after a JSON round-trip", () => {
  const original = createGame({ seed: 5 });
  endTurn(original);
  const copy = JSON.parse(JSON.stringify(original));
  playGame(original);
  playGame(copy);
  assert.deepEqual(copy, original);
});

test("the vignette sets the starting infection and the first hand", () => {
  const state = game("spneumo");
  assert.equal(state.sites.lungs, pathogenById.spneumo.vignettes[0].start.lungs);
  assert.equal(state.hand.length, RULES.handSize);
  assert.equal(state.energy, RULES.energy);
  assert.equal(state.status, "playing");
});

test("antibiotics do nothing against a virus, and the debrief explains why", () => {
  const state = game("flu");
  const before = state.sites.lungs;
  assert.ok(startDrug(state, "ceftriaxone").ok);
  assert.equal(state.sites.lungs, before);
  assert.equal(state.drugObservations.ceftriaxone, "none");
  assert.equal(state.stats.ineffectiveDrugs, 1);
  assert.match(explainDrug(pathogenById.flu, drugById.ceftriaxone), /Viruses have none/);
});

test("the right drug clears every site it can reach", () => {
  const state = game("ecoli", { vignetteIndex: 1 });
  const { urinary, blood } = state.sites;
  startDrug(state, "ceftriaxone");
  assert.equal(state.sites.urinary, urinary - RULES.drugPotency);
  assert.equal(state.sites.blood, blood - RULES.drugPotency);
});

test("cefazolin cannot reach the CNS and nitrofurantoin only reaches the bladder", () => {
  const state = game("spneumo", { vignetteIndex: 1 });
  const cns = state.sites.cns;
  startDrug(state, "cefazolin");
  assert.equal(state.sites.cns, cns);
  assert.match(logText(state.log.at(-1)), /Doesn't reach: CNS/);

  const uti = game("ecoli", { vignetteIndex: 1 });
  const blood = uti.sites.blood;
  startDrug(uti, "nitrofurantoin");
  assert.equal(uti.sites.blood, blood);
  assert.ok(uti.sites.urinary < pathogenById.ecoli.vignettes[1].start.urinary);
});

test("Listeria shrugs off cephalosporins", () => {
  const state = game("listeria");
  const load = totalLoad(state);
  startDrug(state, "ceftriaxone");
  assert.equal(totalLoad(state), load);
  assert.match(explainDrug(pathogenById.listeria, drugById.ceftriaxone), /cephalosporins/);
  startDrug(state, "ampicillin");
  assert.ok(totalLoad(state) < load);
});

test("only two drugs run at once, and stopping one frees a slot", () => {
  const state = game("mssa");
  state.energy = 10;
  assert.ok(startDrug(state, "vancomycin").ok);
  assert.ok(startDrug(state, "ceftriaxone").ok);
  assert.equal(startDrug(state, "nafcillin").ok, false);
  assert.ok(stopDrug(state, "ceftriaxone").ok);
  assert.ok(startDrug(state, "nafcillin").ok);
});

test("non-C. difficile antibiotics feed C. difficile", () => {
  const state = game("cdiff");
  startDrug(state, "ceftriaxone");
  state.hand = [];
  const before = state.sites.gi;
  endTurn(state);
  assert.ok(state.log.some((entry) => /disrupts the normal gut flora/.test(logText(entry))));
  assert.ok(state.sites.gi > before);
  assert.match(explainDrug(pathogenById.cdiff, drugById.vancomycin), /orally/);
});

test("drainage only works on skin and capsules blunt neutrophils", () => {
  const skin = game("mssa");
  const drain = giveCard(skin, "drainage");
  skin.energy = 5;
  const before = skin.sites.skin;
  assert.ok(playCard(skin, drain.uid, "skin").ok);
  assert.ok(skin.sites.skin <= before - 6 || skin.intent.type === "evade");

  const lungs = game("spneumo");
  lungs.intent = { type: "multiply", amount: 3 };
  lungs.energy = 5;
  const neutrophil = giveCard(lungs, "neutrophil");
  const start = lungs.sites.lungs;
  playCard(lungs, neutrophil.uid, "lungs");
  assert.equal(lungs.sites.lungs, start - 2, "capsule: 3 - 1");
  const drainLungs = giveCard(lungs, "drainage");
  assert.equal(playCard(lungs, drainLungs.uid, "lungs").ok, false);
});

test("complement opsonizes, then phagocytes ignore the capsule", () => {
  const state = game("nmen");
  state.intent = { type: "multiply", amount: 3 };
  state.energy = 5;
  const complement = giveCard(state, "complement");
  const neutrophil = giveCard(state, "neutrophil");
  const start = state.sites.blood;
  playCard(state, complement.uid, "blood");
  assert.equal(state.sites.blood, start - 4, "gram-negative bonus");
  playCard(state, neutrophil.uid, "blood");
  assert.equal(state.sites.blood, start - 7);
});

test("a telegraphed spread fizzles if the source is knocked down", () => {
  const state = game("spneumo");
  state.intent = { type: "spread", source: "lungs", target: "blood", amount: 3 };
  state.sites.lungs = 2;
  state.hand = [];
  endTurn(state);
  assert.equal(state.sites.blood, 0);
  assert.ok(state.log.some((entry) => /contained/.test(logText(entry))));
});

test("labs reveal traits; culture takes time and gates biochemistry", () => {
  const state = game("ecoli");
  state.energy = 10;
  assert.ok(orderLab(state, "gram").ok);
  assert.equal(state.labs.gram.ready, true);
  assert.equal(orderLab(state, "biochem").ok, false);
  orderLab(state, "culture");
  assert.equal(state.labs.culture.ready, false);
  state.hand = [];
  endTurn(state);
  assert.equal(state.labs.culture.ready, true);
  assert.ok(orderLab(state, "biochem").ok);
  const remaining = differential(state).filter((entry) => !entry.eliminated);
  assert.deepEqual(
    remaining.map((entry) => entry.pathogen.id),
    ["ecoli"],
  );
});

test("TB culture takes three days; viruses give no isolate", () => {
  const tb = game("mtb");
  orderLab(tb, "culture");
  assert.equal(tb.labs.culture.readyDay, tb.day + 3);

  const flu = game("flu");
  flu.energy = 10;
  orderLab(flu, "culture");
  flu.hand = [];
  endTurn(flu);
  flu.energy = 10;
  assert.equal(orderLab(flu, "biochem").ok, false);
});

test("the true pathogen survives a complete workup in every case", () => {
  for (const pathogen of PATHOGENS) {
    for (let vignetteIndex = 0; vignetteIndex < pathogen.vignettes.length; vignetteIndex += 1) {
      const state = createGame({ seed: 3, pathogenId: pathogen.id, vignetteIndex });
      state.sites.cns = Math.max(state.sites.cns, pathogen.traits.csf ? 1 : 0);
      for (let pass = 0; pass < 2; pass += 1) {
        for (const lab of LABS) {
          state.energy = 99;
          orderLab(state, lab.id);
        }
        for (const entry of Object.values(state.labs)) {
          entry.ready = true;
        }
      }
      const truth = differential(state).find((entry) => entry.pathogen.id === pathogen.id);
      assert.deepEqual(truth.reasons, [], `${pathogen.id} eliminated by ${truth.reasons}`);
      const left = differential(state).filter((entry) => !entry.eliminated);
      assert.equal(left.length, 1, `${pathogen.id} workup leaves ${left.map((e) => e.pathogen.id)}`);
    }
  }
});

test("MSSA and MRSA can only be told apart by susceptibility testing", () => {
  const state = game("mrsa");
  state.energy = 99;
  orderLab(state, "gram");
  orderLab(state, "culture");
  state.labs.culture.ready = true;
  orderLab(state, "biochem");
  const left = () =>
    differential(state)
      .filter((entry) => !entry.eliminated)
      .map((entry) => entry.pathogen.id);
  assert.deepEqual(left(), ["mssa", "mrsa"]);
  orderLab(state, "susceptibility");
  state.labs.susceptibility.ready = true;
  assert.deepEqual(left(), ["mrsa"]);
});

test("a correct diagnosis boosts drugs; a wrong one costs health", () => {
  const state = game("spneumo");
  const hp = state.hp;
  makeDiagnosis(state, "nmen");
  assert.equal(state.hp, hp - RULES.wrongDiagnosisDamage);
  assert.ok(state.strikes.includes("nmen"));
  makeDiagnosis(state, "spneumo");
  assert.equal(state.diagnosis.confirmed, "spneumo");
  state.intent = { type: "multiply", amount: 3 };
  const lungs = state.sites.lungs;
  startDrug(state, "ceftriaxone");
  assert.equal(state.sites.lungs, lungs - RULES.drugPotency - RULES.diagnosisBonus);
});

test("doing nothing loses; clearing the infection wins with a grade", () => {
  const idle = game("nmen");
  while (idle.status === "playing") {
    idle.hand = [];
    endTurn(idle);
  }
  assert.equal(idle.status, "lost");
  assert.equal(scoreGame(idle).grade, "F");

  const won = playGame(game("ecoli"));
  assert.equal(won.status, "won");
  assert.match(scoreGame(won).grade, /[SABCD]/);
});

test("adaptive immunity arrives on schedule and adds cards", () => {
  const state = createGame({ seed: 9, pathogenId: "mtb", difficulty: "resident" });
  const deckSize = () => state.draw.length + state.hand.length + state.discard.length;
  const before = deckSize();
  while (state.day < 5 && state.status === "playing") {
    state.hp = state.maxHp;
    endTurn(state);
  }
  assert.equal(state.adaptiveOnline, true);
  assert.equal(deckSize(), before + 4);
});

test("a competent clinician usually saves the patient", () => {
  let wins = 0;
  const games = 140;
  for (let i = 0; i < games; i += 1) {
    const state = playGame(createGame({ seed: 1000 + i, difficulty: "resident" }));
    if (state.status === "won") wins += 1;
  }
  assert.ok(wins / games > 0.9, `clinician won ${wins}/${games}`);
});
