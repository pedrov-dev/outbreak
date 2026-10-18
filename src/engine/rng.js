// Seedable PRNG (mulberry32). The state is a plain number so games can be saved as JSON.
export function nextRandom(holder) {
  holder.rng = (holder.rng + 0x6d2b79f5) | 0;
  let t = holder.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randomInt(holder, max) {
  return Math.floor(nextRandom(holder) * max);
}

export function shuffle(holder, items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = randomInt(holder, i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function weightedPick(holder, options) {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = nextRandom(holder) * total;
  for (const option of options) {
    roll -= option.weight;
    if (roll < 0) return option;
  }
  return options[options.length - 1];
}
