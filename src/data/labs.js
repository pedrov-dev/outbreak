// Laboratory tests. Each reveals one trait of the hidden organism.
//   delay:    days until the result is back (the pathogen may override culture time)
//   needs:    another test whose result must show a growing isolate first
export const LABS = [
  {
    id: "gram",
    name: "Gram stain",
    cost: 1,
    trait: "gram",
    blurb: "Crystal violet, iodine, alcohol, safranin. Shows cell wall type and shape.",
  },
  {
    id: "culture",
    name: "Culture",
    cost: 1,
    delay: 1,
    trait: "culture",
    blurb: "Blood agar, MacConkey and chocolate agar. Results take a day (much longer for mycobacteria).",
  },
  {
    id: "biochem",
    name: "Biochemical panel",
    cost: 1,
    needs: "culture",
    trait: "biochem",
    blurb: "Catalase, coagulase, oxidase, indole. Needs a cultured isolate.",
  },
  {
    id: "susceptibility",
    name: "Susceptibility testing",
    cost: 2,
    delay: 1,
    needs: "culture",
    trait: "susceptibility",
    blurb: "Antibiogram of the cultured isolate: which drugs actually work.",
  },
  {
    id: "afb",
    name: "Acid-fast stain",
    cost: 1,
    trait: "afb",
    blurb: "Ziehl-Neelsen stain for mycolic-acid cell walls.",
  },
  {
    id: "fungal",
    name: "KOH prep / India ink",
    cost: 1,
    trait: "fungal",
    blurb: "KOH dissolves human cells to show fungal elements; India ink outlines capsules.",
  },
  {
    id: "pcr",
    name: "Molecular panel (PCR)",
    cost: 2,
    trait: "pcr",
    blurb: "Multiplex nucleic-acid test: respiratory viruses, HSV, and C. difficile toxin genes.",
  },
  {
    id: "csf",
    name: "Lumbar puncture",
    cost: 1,
    trait: "csf",
    repeatable: true,
    blurb: "CSF cell count, glucose and protein. Only informative once the CNS is involved.",
  },
];

export const labById = Object.fromEntries(LABS.map((lab) => [lab.id, lab]));

export const NORMAL_CSF = "Normal CSF: no CNS involvement yet";
