// Teaching text for the end-of-case debrief: why a drug did or didn't work.
import { isFungus, isVirus } from "../data/pathogens.js";

export function isSusceptible(pathogen, drug) {
  return pathogen.susceptible.includes(drug.id);
}

export function explainDrug(pathogen, drug) {
  if (isSusceptible(pathogen, drug)) return drug.note;
  if (pathogen.notes[drug.id]) return pathogen.notes[drug.id];

  const virus = isVirus(pathogen);
  const fungus = isFungus(pathogen);
  if (virus && drug.kind === "antibacterial") {
    return "Antibiotics target bacterial structures: the cell wall, 70S ribosomes, DNA gyrase. Viruses have none of them.";
  }
  if (virus && drug.kind === "antifungal") {
    return "Antifungals target ergosterol or the fungal cell wall. Viruses have neither.";
  }
  if (fungus && drug.kind === "antibacterial") {
    return "Fungi are eukaryotes with 80S ribosomes and ergosterol membranes. Antibacterials don't touch them.";
  }
  if (!virus && drug.kind === "antiviral") {
    return `${drug.name} blocks a viral enzyme, and only viruses have that target.`;
  }
  if (!fungus && drug.kind === "antifungal") {
    return `${drug.name} targets fungal ergosterol or cell-wall synthesis, which ${virus ? "viruses" : "bacteria"} don't have.`;
  }
  if (pathogen.notes.default) return pathogen.notes.default;
  return `${drug.name} isn't an effective treatment for ${pathogen.short}. ${drug.note}`;
}
