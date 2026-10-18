// Body compartments. `weight` scales how much harm a given pathogen load does there.
export const SITES = [
  { id: "cns", name: "CNS", icon: "🧠", weight: 2, blurb: "Meninges and brain. Infection here is an emergency." },
  { id: "lungs", name: "Respiratory tract", icon: "🫁", weight: 1, blurb: "Pharynx, airways and lungs." },
  { id: "blood", name: "Blood", icon: "🩸", weight: 1.5, blurb: "Bacteremia can seed distant organs and cause sepsis." },
  { id: "gi", name: "GI tract", icon: "🥨", weight: 1, blurb: "Esophagus to colon." },
  { id: "urinary", name: "Urinary tract", icon: "💧", weight: 0.75, blurb: "Bladder and kidneys." },
  { id: "skin", name: "Skin & soft tissue", icon: "🖐️", weight: 0.75, blurb: "Skin, mucosa and subcutaneous tissue." },
];

export const SITE_IDS = SITES.map((site) => site.id);

export const siteById = Object.fromEntries(SITES.map((site) => [site.id, site]));
