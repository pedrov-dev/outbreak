// Body compartments. `weight` scales how much harm a given pathogen load does there.
// `short` is the compact label used on drug badges.
export const SITES = [
  { id: "cns", name: "CNS", short: "CNS", icon: "🧠", weight: 2, blurb: "Meninges and brain. Infection here is an emergency." },
  { id: "lungs", name: "Respiratory tract", short: "Lungs", icon: "🫁", weight: 1, blurb: "Pharynx, airways and lungs." },
  { id: "blood", name: "Blood", short: "Blood", icon: "🩸", weight: 1.5, blurb: "Bacteremia can seed distant organs and cause sepsis." },
  { id: "gi", name: "GI tract", short: "GI", icon: "🥨", weight: 1, blurb: "Esophagus to colon." },
  { id: "urinary", name: "Urinary tract", short: "Urinary", icon: "💧", weight: 0.75, blurb: "Bladder and kidneys." },
  { id: "skin", name: "Skin & soft tissue", short: "Skin", icon: "🖐️", weight: 0.75, blurb: "Skin, mucosa and subcutaneous tissue." },
];

export const SITE_IDS = SITES.map((site) => site.id);

export const siteById = Object.fromEntries(SITES.map((site) => [site.id, site]));
