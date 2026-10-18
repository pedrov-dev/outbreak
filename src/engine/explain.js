// Teaching text for the end-of-case debrief: why a drug did or didn't work.
import { isFungus, isVirus } from "../data/pathogens.js";
import { L, t } from "../i18n/index.js";

export function isSusceptible(pathogen, drug) {
  return pathogen.susceptible.includes(drug.id);
}

export function explainDrug(pathogen, drug) {
  if (isSusceptible(pathogen, drug)) return L(drug.note);
  if (pathogen.notes[drug.id]) return L(pathogen.notes[drug.id]);

  const virus = isVirus(pathogen);
  const fungus = isFungus(pathogen);
  if (virus && drug.kind === "antibacterial") {
    return t("explain.virusAntibacterial");
  }
  if (virus && drug.kind === "antifungal") {
    return t("explain.virusAntifungal");
  }
  if (fungus && drug.kind === "antibacterial") {
    return t("explain.fungusAntibacterial");
  }
  if (!virus && drug.kind === "antiviral") {
    return t("explain.antiviral", { drug: drug.name });
  }
  if (!fungus && drug.kind === "antifungal") {
    return t(virus ? "explain.antifungalVirus" : "explain.antifungalBacteria", { drug: drug.name });
  }
  if (pathogen.notes.default) return L(pathogen.notes.default);
  return t("explain.generic", { drug: drug.name, organism: pathogen.short, note: drug.note });
}
