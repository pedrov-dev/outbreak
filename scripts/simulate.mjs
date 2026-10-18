// Balance report: node scripts/simulate.mjs [--games 200] [--seed 1] [--difficulty resident]
import { PATHOGENS } from "../src/data/pathogens.js";
import { playGame } from "../src/engine/bot.js";
import { DIFFICULTIES, createGame, scoreGame } from "../src/engine/game.js";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .join(" ")
    .split("--")
    .filter(Boolean)
    .map((pair) => pair.trim().split(/\s+/)),
);
const games = Number(args.games ?? 200);
const seed = Number(args.seed ?? 1);
const difficulties = args.difficulty ? [args.difficulty] : Object.keys(DIFFICULTIES);
const strategies = (args.strategy ?? "clinician,empiric,immuneOnly").split(",");

for (const difficulty of difficulties) {
  console.log(`\n=== ${DIFFICULTIES[difficulty].name} (${games} games per pathogen) ===`);
  const header = ["pathogen".padEnd(16), ...strategies.map((s) => s.padStart(18))].join("");
  console.log(header);
  const totals = Object.fromEntries(strategies.map((s) => [s, { wins: 0, games: 0 }]));
  for (const pathogen of PATHOGENS) {
    const cells = [];
    for (const strategy of strategies) {
      let wins = 0;
      let days = 0;
      let scores = 0;
      for (let i = 0; i < games; i += 1) {
        const state = playGame(
          createGame({ seed: seed * 100003 + i, difficulty, pathogenId: pathogen.id }),
          strategy,
        );
        if (state.status === "won") {
          wins += 1;
          days += state.day;
          scores += scoreGame(state).score;
        }
      }
      totals[strategy].wins += wins;
      totals[strategy].games += games;
      const rate = `${Math.round((wins / games) * 100)}%`;
      const detail = wins ? ` d${(days / wins).toFixed(1)} s${Math.round(scores / wins)}` : "";
      cells.push(`${rate}${detail}`.padStart(18));
    }
    console.log(pathogen.short.padEnd(16) + cells.join(""));
  }
  console.log(
    "ALL".padEnd(16) +
      strategies.map((s) => `${Math.round((totals[s].wins / totals[s].games) * 100)}%`.padStart(18)).join(""),
  );
}
