// Pathogen catalog: the hidden opponent in each case and the study content of the game.
//
// kind:  extracellular | intracellular | virus | yeast  (decides which immune cards work)
// growth:      fraction of the current load added per infected site each day
// virulence:   multiplier on the harm each unit of load does
// intents:     what the organism may do on its turn; names are shown after diagnosis
// traits:      the result each lab test returns for this organism
// susceptible: formulary drugs that work; everything else gets "no clinical response"
// notes:       why a specific drug fails (shown in the debrief)
// vignettes:   case presentations; `start` is the initial load, `route` the spread path

const NO_GROWTH = {
  gram: "No organisms seen",
  culture: "No growth",
  afb: "No acid-fast organisms",
  fungal: "No fungal elements",
  pcr: "No targets detected",
};

const BACTERIAL_DEFAULTS = {
  afb: "No acid-fast organisms",
  fungal: "No fungal elements",
  pcr: "No targets detected",
};

const BACTERIAL_CSF = "↑ neutrophils, ↓ glucose, ↑ protein";

const BETA_LACTAMS = ["penicillin", "ampicillin", "nafcillin", "cefazolin", "ceftriaxone", "cefepime", "piptazo"];
const CEPHALOSPORINS = ["cefazolin", "ceftriaxone", "cefepime"];

const notesFor = (ids, text) => Object.fromEntries(ids.map((id) => [id, text]));

const ORAL_VANCO = { vanco_oral: "Oral vancomycin stays in the gut lumen and only treats C. difficile." };

const GRAM_NEGATIVE_VANCO = {
  vancomycin: "Vancomycin is too large to cross the gram-negative outer membrane.",
  vanco_oral: "Oral vancomycin stays in the gut lumen and only treats C. difficile.",
};

export const PATHOGENS = [
  {
    id: "mssa",
    name: "Staphylococcus aureus (MSSA)",
    short: "MSSA",
    group: "Gram-positive cocci",
    kind: "extracellular",
    growth: 0.45,
    virulence: 1,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 2 },
      { type: "toxin", weight: 2, amount: 3, name: "Alpha-toxin" },
      { type: "biofilm", weight: 1, name: "Biofilm" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-positive cocci in clusters",
      culture: "Beta-hemolytic golden colonies on blood agar",
      biochem: "Catalase +, coagulase +",
    },
    susceptible: ["nafcillin", "cefazolin", "ceftriaxone", "cefepime", "piptazo", "vancomycin", "doxycycline", "tmpsmx"],
    notes: notesFor(
      ["penicillin", "ampicillin"],
      "Over 90% of S. aureus make penicillinase, a beta-lactamase that destroys penicillin and ampicillin.",
    ),
    vignettes: [
      {
        text: "A 34-year-old man has a hot, painful, fluctuant 3-cm nodule on his thigh draining thick yellow pus. Temperature 38.4 °C.",
        start: { skin: 20 },
        route: ["skin", "blood"],
      },
      {
        text: "A 45-year-old man who injects drugs has 5 days of fever and rigors. There is a new holosystolic murmur at the left lower sternal border.",
        start: { blood: 16, skin: 8 },
        route: ["skin", "blood"],
      },
    ],
    virulenceFactors: ["Protein A (binds IgG Fc)", "Coagulase", "Alpha-toxin", "TSST-1", "Biofilm"],
    treatment: "Drain abscesses. Nafcillin/oxacillin or cefazolin for MSSA; vancomycin until MRSA is ruled out.",
    pearls: [
      "Catalase + and coagulase + separate S. aureus from the other staphylococci.",
      "Protein A binds the Fc portion of IgG and blocks opsonization.",
      "Causes abscesses, cellulitis, osteomyelitis and endocarditis (tricuspid valve in people who inject drugs), plus toxin diseases: toxic shock (TSST-1), food poisoning, scalded skin.",
      "Antibiotics penetrate pus poorly. Abscesses need incision and drainage.",
    ],
  },
  {
    id: "mrsa",
    name: "Staphylococcus aureus (MRSA)",
    short: "MRSA",
    group: "Gram-positive cocci",
    kind: "extracellular",
    growth: 0.45,
    virulence: 1.1,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 2 },
      { type: "toxin", weight: 2, amount: 3, name: "Panton-Valentine leukocidin" },
      { type: "biofilm", weight: 1, name: "Biofilm" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-positive cocci in clusters",
      culture: "Beta-hemolytic golden colonies on blood agar",
      biochem: "Catalase +, coagulase +",
    },
    susceptible: ["vancomycin", "doxycycline", "tmpsmx"],
    notes: notesFor(
      BETA_LACTAMS,
      "The mecA gene encodes PBP2a, a penicillin-binding protein with low affinity for beta-lactams. Only ceftaroline (not stocked here) still works.",
    ),
    vignettes: [
      {
        text: "A 19-year-old college wrestler has a painful, red, swollen boil on his forearm with a central pustule. Two teammates have had similar lesions.",
        start: { skin: 20 },
        route: ["skin", "blood"],
      },
      {
        text: "A 62-year-old woman on hemodialysis spikes a fever with rigors during dialysis. The skin around her tunneled catheter is red and tender. She has been hospitalized twice this year.",
        start: { blood: 12, skin: 12 },
        route: ["skin", "blood"],
      },
    ],
    virulenceFactors: ["PBP2a (mecA)", "Protein A", "Panton-Valentine leukocidin", "Biofilm"],
    treatment: "Vancomycin (or daptomycin) for serious infection. TMP-SMX, doxycycline or clindamycin for uncomplicated skin infection after drainage.",
    pearls: [
      "MSSA and MRSA look identical on Gram stain, culture and biochemistry. Only susceptibility testing (or mecA PCR) tells them apart.",
      "Resistance comes from mecA, which encodes PBP2a.",
      "Community MRSA (often PVL+) causes boils and necrotizing pneumonia. Hospital MRSA follows catheters, dialysis and surgery.",
    ],
  },
  {
    id: "spyogenes",
    name: "Streptococcus pyogenes (Group A Strep)",
    short: "S. pyogenes",
    group: "Gram-positive cocci",
    kind: "extracellular",
    growth: 0.5,
    virulence: 1.2,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 2 },
      { type: "toxin", weight: 2, amount: 4, name: "Streptococcal pyrogenic exotoxin" },
      { type: "evade", weight: 1, name: "M protein" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-positive cocci in chains",
      culture: "Small colonies with clear beta-hemolysis; bacitracin-sensitive",
      biochem: "Catalase −",
    },
    susceptible: ["penicillin", "ampicillin", "nafcillin", "cefazolin", "ceftriaxone", "cefepime", "piptazo", "vancomycin"],
    notes: {
      tmpsmx: "TMP-SMX is unreliable against Group A Strep.",
      doxycycline: "Many S. pyogenes strains are tetracycline-resistant.",
      ciprofloxacin: "Ciprofloxacin has weak gram-positive activity.",
      gentamicin: "Streptococci are intrinsically resistant to aminoglycosides on their own.",
      ...ORAL_VANCO,
    },
    vignettes: [
      {
        text: "A 9-year-old girl has a sore throat, fever of 39 °C, tonsillar exudates and tender anterior cervical lymph nodes. She has no cough.",
        start: { lungs: 16 },
        route: ["lungs", "blood"],
      },
      {
        text: "A 50-year-old man scraped his shin gardening 2 days ago. Now the leg has spreading redness with pain out of proportion to the exam, and he is tachycardic.",
        start: { skin: 20 },
        route: ["skin", "blood"],
      },
    ],
    virulenceFactors: ["M protein (antiphagocytic)", "Streptolysins O and S", "Pyrogenic exotoxins (SpeA, SpeC)", "Streptokinase", "Hyaluronic acid capsule"],
    treatment: "Penicillin or amoxicillin. Necrotizing fasciitis: surgical debridement plus clindamycin to stop toxin production.",
    pearls: [
      "Beta-hemolytic and bacitracin-sensitive. Group B Strep is bacitracin-resistant.",
      "Antibodies against M protein cross-react with heart tissue, which causes rheumatic fever.",
      "Post-streptococcal glomerulonephritis can follow throat or skin infection. Rheumatic fever follows only pharyngitis.",
      "Group A Strep has never developed resistance to penicillin.",
    ],
  },
  {
    id: "spneumo",
    name: "Streptococcus pneumoniae",
    short: "S. pneumoniae",
    group: "Gram-positive cocci",
    kind: "extracellular",
    capsule: true,
    growth: 0.5,
    virulence: 1.2,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 3 },
      { type: "toxin", weight: 1, amount: 3, name: "Pneumolysin" },
      { type: "evade", weight: 2, name: "Polysaccharide capsule" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-positive lancet-shaped diplococci",
      culture: "Alpha-hemolytic (green) colonies; optochin-sensitive, bile-soluble",
      biochem: "Catalase −",
      csf: BACTERIAL_CSF,
    },
    susceptible: ["penicillin", "ampicillin", "cefazolin", "ceftriaxone", "cefepime", "piptazo", "vancomycin", "doxycycline"],
    notes: {
      ciprofloxacin: "Ciprofloxacin is weak against S. pneumoniae. The 'respiratory' fluoroquinolones are levofloxacin and moxifloxacin.",
      tmpsmx: "Pneumococcal resistance to TMP-SMX is common.",
      gentamicin: "Streptococci are intrinsically resistant to aminoglycosides on their own.",
      ...ORAL_VANCO,
    },
    vignettes: [
      {
        text: "A 67-year-old man has sudden fever, shaking chills, pleuritic chest pain and a cough productive of rust-colored sputum. Chest X-ray: right lower lobe consolidation.",
        start: { lungs: 20 },
        route: ["lungs", "blood", "cns"],
      },
      {
        text: "A 58-year-old man who had a splenectomy after a car accident has fever, a severe headache and neck stiffness, 2 days after an ear infection.",
        start: { lungs: 8, blood: 8, cns: 8 },
        route: ["lungs", "blood", "cns"],
      },
    ],
    virulenceFactors: ["Polysaccharide capsule", "IgA protease", "Pneumolysin"],
    treatment: "Community pneumonia: beta-lactam (± macrolide) or a respiratory fluoroquinolone. Meningitis: ceftriaxone + vancomycin + dexamethasone.",
    pearls: [
      "The most common cause of community-acquired pneumonia, adult meningitis, otitis media and sinusitis.",
      "The capsule is the key virulence factor (positive Quellung reaction). Asplenic patients are at high risk and should be vaccinated.",
      "IgA protease lets it colonize the mucosa.",
      "Optochin-sensitive and bile-soluble, unlike the viridans streptococci.",
    ],
  },
  {
    id: "nmen",
    name: "Neisseria meningitidis",
    short: "N. meningitidis",
    group: "Gram-negative cocci",
    kind: "extracellular",
    capsule: true,
    gramNegative: true,
    growth: 0.55,
    virulence: 1.4,
    intents: [
      { type: "multiply", weight: 2 },
      { type: "spread", weight: 3 },
      { type: "toxin", weight: 2, amount: 4, name: "Endotoxin (LOS): septic shock" },
      { type: "evade", weight: 1, name: "IgA protease" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-negative diplococci",
      culture: "Grows on chocolate and Thayer-Martin agar; ferments glucose and maltose",
      biochem: "Oxidase +, catalase +",
      csf: BACTERIAL_CSF,
    },
    susceptible: ["penicillin", "ampicillin", "ceftriaxone", "cefepime", "piptazo", "ciprofloxacin"],
    notes: {
      ...GRAM_NEGATIVE_VANCO,
      nafcillin: "Nafcillin is a narrow anti-staphylococcal drug.",
      tmpsmx: "Meningococcal resistance to sulfonamides is widespread.",
    },
    vignettes: [
      {
        text: "An 18-year-old college freshman living in a dormitory has fever, severe headache, neck stiffness and a non-blanching petechial rash on his legs.",
        start: { lungs: 8, blood: 16 },
        route: ["lungs", "blood", "cns"],
      },
      {
        text: "A 22-year-old military recruit becomes acutely ill with fever and confusion. Purpura spreads across his trunk within hours. Blood pressure 80/40.",
        start: { blood: 20 },
        route: ["lungs", "blood", "cns"],
      },
    ],
    virulenceFactors: ["Polysaccharide capsule", "Lipooligosaccharide (LOS) endotoxin", "IgA protease", "Pili"],
    treatment: "Ceftriaxone. Prophylaxis for close contacts: rifampin, ciprofloxacin or ceftriaxone.",
    pearls: [
      "Ferments maltose and glucose. N. gonorrhoeae ferments glucose only.",
      "LOS endotoxin drives septic shock and DIC. Adrenal hemorrhage is Waterhouse-Friderichsen syndrome.",
      "Terminal complement (C5-C9, the MAC) deficiency predisposes to recurrent Neisseria infections.",
    ],
  },
  {
    id: "ecoli",
    name: "Escherichia coli",
    short: "E. coli",
    group: "Gram-negative rods",
    kind: "extracellular",
    gramNegative: true,
    growth: 0.5,
    virulence: 1,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 2 },
      { type: "toxin", weight: 1, amount: 3, name: "Endotoxin (LPS)" },
      { type: "evade", weight: 1, name: "P fimbriae" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-negative rods",
      culture: "Pink colonies on MacConkey agar (lactose fermenter); green metallic sheen on EMB",
      biochem: "Oxidase −, indole +",
    },
    susceptible: ["cefazolin", "ceftriaxone", "cefepime", "piptazo", "ciprofloxacin", "tmpsmx", "nitrofurantoin", "gentamicin"],
    notes: {
      ...GRAM_NEGATIVE_VANCO,
      penicillin: "Penicillin G barely penetrates the gram-negative outer membrane, and many E. coli make beta-lactamase.",
      ampicillin: "About half of E. coli carry plasmid beta-lactamases. Ampicillin isn't reliable empirically.",
      nafcillin: "Nafcillin is a narrow anti-staphylococcal drug.",
      doxycycline: "Doxycycline isn't a reliable treatment for E. coli infection.",
    },
    vignettes: [
      {
        text: "A 26-year-old sexually active woman has had 3 days of dysuria, frequency and suprapubic pain. Today she has fever, chills and right flank pain.",
        start: { urinary: 20 },
        route: ["urinary", "blood"],
      },
      {
        text: "A 74-year-old man with an indwelling urinary catheter becomes febrile, hypotensive and confused.",
        start: { urinary: 16, blood: 8 },
        route: ["urinary", "blood"],
      },
    ],
    virulenceFactors: ["P fimbriae", "LPS endotoxin (lipid A)", "K1 capsule (some strains)", "Shiga-like toxin (EHEC)"],
    treatment: "Cystitis: nitrofurantoin or TMP-SMX. Pyelonephritis or urosepsis: ceftriaxone or a fluoroquinolone, adjusted to susceptibilities.",
    pearls: [
      "The most common cause of UTI. P fimbriae help it ascend to the kidney.",
      "Strains differ: EHEC O157:H7 (Shiga-like toxin, HUS), ETEC (traveler's diarrhea), K1 capsule (neonatal meningitis).",
      "Lactose fermenter: pink on MacConkey, metallic green sheen on EMB.",
      "Nitrofurantoin treats cystitis but not pyelonephritis. It doesn't reach the kidney or the blood.",
    ],
  },
  {
    id: "pseudomonas",
    name: "Pseudomonas aeruginosa",
    short: "P. aeruginosa",
    group: "Gram-negative rods",
    kind: "extracellular",
    gramNegative: true,
    growth: 0.5,
    virulence: 1.1,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 2 },
      { type: "toxin", weight: 1, amount: 3, name: "Exotoxin A" },
      { type: "biofilm", weight: 2, name: "Alginate biofilm" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-negative rods",
      culture: "Non-lactose-fermenting colonies; blue-green pigment and grape-like odor",
      biochem: "Oxidase +",
    },
    susceptible: ["cefepime", "piptazo", "ciprofloxacin", "gentamicin"],
    notes: {
      ...GRAM_NEGATIVE_VANCO,
      ...notesFor(["penicillin", "ampicillin", "nafcillin"], "Pseudomonas needs an antipseudomonal beta-lactam such as piperacillin-tazobactam or cefepime."),
      cefazolin: "Cefazolin has no antipseudomonal activity.",
      ceftriaxone: "Ceftriaxone has no antipseudomonal activity. Cefepime and ceftazidime do.",
      tmpsmx: "Pseudomonas is intrinsically resistant to TMP-SMX.",
      doxycycline: "Pseudomonas is intrinsically resistant to tetracyclines.",
      nitrofurantoin: "Pseudomonas is intrinsically resistant to nitrofurantoin.",
    },
    vignettes: [
      {
        text: "A 58-year-old man intubated in the ICU for 6 days develops new fever, a rising oxygen requirement and purulent green tracheal secretions.",
        start: { lungs: 20 },
        route: ["lungs", "blood"],
      },
      {
        text: "A 30-year-old man with deep burns over 30% of his body develops fever on hospital day 8. The burn wounds have a blue-green exudate with a sweet, fruity smell.",
        start: { skin: 20 },
        route: ["skin", "blood"],
      },
    ],
    virulenceFactors: ["Exotoxin A (inactivates EF-2)", "Pyocyanin", "Alginate biofilm", "Endotoxin"],
    treatment: "Antipseudomonal agents: piperacillin-tazobactam, cefepime or ceftazidime, carbapenems (not ertapenem), fluoroquinolones, aminoglycosides.",
    pearls: [
      "Aerobic, oxidase +, non-lactose fermenter. Pyocyanin gives the blue-green color.",
      "Causes ventilator-associated pneumonia, burn infections, pneumonia in cystic fibrosis, hot-tub folliculitis, otitis externa, and osteomyelitis after a nail goes through a sneaker.",
      "Exotoxin A inactivates EF-2, the same target as diphtheria toxin.",
    ],
  },
  {
    id: "listeria",
    name: "Listeria monocytogenes",
    short: "L. monocytogenes",
    group: "Gram-positive rods",
    kind: "intracellular",
    growth: 0.4,
    virulence: 1.3,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 3 },
      { type: "toxin", weight: 1, amount: 2, name: "Listeriolysin O" },
      { type: "evade", weight: 1, name: "Actin rocket tails" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-positive rods",
      culture: "Small colonies with narrow beta-hemolysis; tumbling motility; grows at 4 °C",
      biochem: "Catalase +",
      csf: BACTERIAL_CSF,
    },
    susceptible: ["ampicillin", "penicillin", "tmpsmx"],
    notes: {
      ...notesFor(
        CEPHALOSPORINS,
        "Listeria is intrinsically resistant to all cephalosporins. Empiric meningitis therapy for neonates, adults over 50 and the immunocompromised must add ampicillin.",
      ),
      vancomycin: "Vancomycin isn't a recommended treatment for Listeria.",
      piptazo: "Piperacillin-tazobactam isn't a recommended treatment for Listeria.",
      gentamicin: "Gentamicin is only added for synergy with ampicillin. Alone it can't reach intracellular Listeria.",
      nafcillin: "Nafcillin is a narrow anti-staphylococcal drug.",
    },
    vignettes: [
      {
        text: "A 72-year-old woman on prednisone for polymyalgia rheumatica has 2 days of fever, headache and confusion. She eats deli meat daily. Her neck is stiff.",
        start: { gi: 8, blood: 12, cns: 4 },
        route: ["gi", "blood", "cns"],
      },
      {
        text: "A woman 30 weeks pregnant has fever, myalgias and diarrhea a week after eating soft cheese made from unpasteurized milk.",
        start: { gi: 16, blood: 4 },
        route: ["gi", "blood", "cns"],
      },
    ],
    virulenceFactors: ["Listeriolysin O (escapes the phagosome)", "ActA (actin rocket tails)", "Internalin"],
    treatment: "Ampicillin (± gentamicin for synergy). TMP-SMX if penicillin-allergic.",
    pearls: [
      "Facultative intracellular gram-positive rod with tumbling motility. It grows in the fridge (cold enrichment).",
      "It moves from cell to cell on actin rockets, hidden from antibodies. Cell-mediated immunity is what clears it.",
      "Risk groups: pregnancy, neonates, the elderly, the immunosuppressed. Sources: deli meat, soft cheese, unpasteurized milk.",
      "Cephalosporins do not work. This is why ampicillin is added to empiric meningitis coverage in at-risk patients.",
    ],
  },
  {
    id: "cdiff",
    name: "Clostridioides difficile",
    short: "C. difficile",
    group: "Gram-positive rods",
    kind: "extracellular",
    fedByAntibiotics: true,
    growth: 0.45,
    virulence: 1.2,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "toxin", weight: 3, amount: 3, name: "Toxins A and B" },
      { type: "biofilm", weight: 1, name: "Sporulation" },
    ],
    traits: {
      ...BACTERIAL_DEFAULTS,
      gram: "Gram-positive rods",
      culture: "Grows only anaerobically; spore-forming rods",
      biochem: "Catalase −",
      pcr: "C. difficile toxin B gene detected",
    },
    susceptible: ["vanco_oral", "metronidazole"],
    notes: {
      vancomycin: "IV vancomycin isn't excreted into the colon, so it does nothing for C. difficile colitis. Give it orally.",
      default: "Other antibiotics kill the competing gut flora and feed C. difficile. Stop the offending antibiotic.",
    },
    vignettes: [
      {
        text: "A 70-year-old nursing-home resident just finished 10 days of clindamycin for cellulitis. Now she has 8 watery stools a day, cramping, and a WBC of 22,000/µL.",
        start: { gi: 20 },
        route: ["gi"],
      },
      {
        text: "A 55-year-old man in hospital for pneumonia, on ceftriaxone for a week, develops foul-smelling watery diarrhea and fever. Colonoscopy shows yellow-white plaques.",
        start: { gi: 20 },
        route: ["gi"],
      },
    ],
    virulenceFactors: ["Toxin A (enterotoxin)", "Toxin B (cytotoxin)", "Spores"],
    treatment: "Stop the inciting antibiotic. Oral vancomycin or fidaxomicin. Fecal microbiota transplant for recurrences.",
    pearls: [
      "A spore-forming, toxin-producing anaerobic gram-positive rod.",
      "Toxins A and B damage the colonic mucosa and cause pseudomembranous colitis.",
      "Classic triggers: clindamycin, fluoroquinolones, cephalosporins, PPIs, hospitalization.",
      "Diagnose with a stool toxin or PCR test. Alcohol hand rub doesn't kill spores; wash with soap and water.",
    ],
  },
  {
    id: "mtb",
    name: "Mycobacterium tuberculosis",
    short: "M. tuberculosis",
    group: "Acid-fast bacilli",
    kind: "intracellular",
    growth: 0.2,
    virulence: 1.3,
    cultureDelay: 3,
    adaptiveClear: 1,
    intents: [
      { type: "multiply", weight: 2 },
      { type: "spread", weight: 2 },
      { type: "evade", weight: 2, name: "Blocks phagolysosome fusion" },
      { type: "toxin", weight: 1, amount: 2, name: "Cord factor" },
    ],
    traits: {
      gram: "No organisms seen",
      culture: "Slow-growing buff colonies on Lowenstein-Jensen agar (weeks)",
      biochem: "Niacin +",
      afb: "Acid-fast bacilli seen",
      fungal: "No fungal elements",
      pcr: "No targets detected",
      csf: "↑ lymphocytes, ↓ glucose, ↑↑ protein",
    },
    susceptible: ["ripe"],
    notes: {
      ciprofloxacin: "Ciprofloxacin is a poor antituberculous drug. Moxifloxacin and levofloxacin are second-line options, never alone.",
      default: "M. tuberculosis has a waxy mycolic-acid wall, divides slowly inside macrophages, and needs a multidrug regimen (RIPE).",
    },
    vignettes: [
      {
        text: "A 45-year-old man who emigrated from the Philippines a year ago has 2 months of productive cough, night sweats, an 8-kg weight loss and blood-streaked sputum. Chest X-ray: right upper lobe cavity.",
        start: { lungs: 20 },
        route: ["lungs", "blood", "cns"],
      },
      {
        text: "A 60-year-old man who recently started infliximab for Crohn disease has weeks of fever, weight loss and cough. Chest X-ray: countless tiny nodules throughout both lungs.",
        start: { lungs: 12, blood: 12 },
        route: ["lungs", "blood", "cns"],
      },
    ],
    virulenceFactors: ["Mycolic acids", "Cord factor (trehalose dimycolate)", "Sulfatides (block phagolysosome fusion)"],
    treatment: "RIPE (rifampin, isoniazid, pyrazinamide, ethambutol) for 2 months, then rifampin + isoniazid for 4. Airborne isolation.",
    pearls: [
      "Mycolic acids make it acid-fast and invisible on Gram stain.",
      "Th1 cells release IFN-gamma to activate macrophages and form caseating granulomas. TNF-alpha blockers can reactivate latent TB.",
      "RIPE toxicities: rifampin turns fluids orange and induces P450; isoniazid causes neuropathy (give B6) and hepatitis; ethambutol causes optic neuritis.",
      "Culture takes weeks. Start treatment on clinical suspicion and a positive AFB smear.",
    ],
  },
  {
    id: "flu",
    name: "Influenza A virus",
    short: "Influenza A",
    group: "RNA viruses",
    kind: "virus",
    grows: false,
    growth: 0.6,
    virulence: 0.9,
    adaptiveClear: 3,
    intents: [
      { type: "multiply", weight: 3, amount: 3 },
      { type: "evade", weight: 2, name: "Antigenic drift" },
      { type: "toxin", weight: 1, amount: 2, name: "Cytokine storm" },
    ],
    traits: { ...NO_GROWTH, pcr: "Influenza A RNA detected" },
    susceptible: ["oseltamivir"],
    notes: {},
    vignettes: [
      {
        text: "A 30-year-old teacher in January has an abrupt fever of 39.5 °C, severe myalgias, headache, dry cough and exhaustion. Several of her students are sick.",
        start: { lungs: 20 },
        route: ["lungs"],
      },
      {
        text: "A 78-year-old nursing-home resident who skipped this year's vaccine develops sudden fever, cough and confusion during a local outbreak.",
        start: { lungs: 20 },
        route: ["lungs"],
      },
    ],
    virulenceFactors: ["Hemagglutinin (binds sialic acid)", "Neuraminidase (releases virions)"],
    treatment: "Supportive care. Oseltamivir for severe illness, high-risk patients, or within 48 hours of onset.",
    pearls: [
      "Orthomyxovirus: enveloped, segmented, negative-sense single-stranded RNA.",
      "Antigenic drift (point mutations) causes seasonal epidemics. Antigenic shift (segment reassortment) causes pandemics.",
      "Antibiotics do nothing to viruses, but watch for secondary bacterial pneumonia (S. aureus, S. pneumoniae).",
      "The annual vaccine is the best prevention.",
    ],
  },
  {
    id: "hsv",
    name: "Herpes simplex virus 1",
    short: "HSV-1",
    group: "DNA viruses",
    kind: "virus",
    grows: false,
    growth: 0.45,
    virulence: 1.2,
    adaptiveClear: 1,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 3 },
      { type: "evade", weight: 2, name: "Latency in sensory ganglia" },
    ],
    traits: { ...NO_GROWTH, pcr: "HSV-1 DNA detected", csf: "↑ lymphocytes, normal glucose, RBCs present" },
    susceptible: ["acyclovir"],
    notes: {},
    vignettes: [
      {
        text: "A 25-year-old woman has had 3 days of fever and headache. Now she has bizarre behavior, trouble finding words, and a seizure. MRI: right temporal lobe hyperintensity.",
        start: { cns: 12, skin: 4 },
        route: ["skin", "cns"],
      },
      {
        text: "A 21-year-old man has painful grouped vesicles on a red base at the edge of his lip, with fever and tender submandibular nodes.",
        start: { skin: 20 },
        route: ["skin", "cns"],
      },
    ],
    virulenceFactors: ["Latency in sensory ganglia", "Cell-to-cell spread"],
    treatment: "Acyclovir (or valacyclovir). Encephalitis: IV acyclovir started on suspicion.",
    pearls: [
      "Herpesvirus: enveloped, double-stranded DNA, replicates in the nucleus.",
      "Latent in sensory ganglia (trigeminal for HSV-1). Reactivates with stress, fever or UV light.",
      "The most common cause of sporadic viral encephalitis, with a predilection for the temporal lobes.",
      "Tzanck smear shows multinucleated giant cells. CSF PCR is the diagnostic test. Acyclovir treats active disease but cannot cure latency.",
    ],
  },
  {
    id: "candida",
    name: "Candida albicans",
    short: "C. albicans",
    group: "Fungi",
    kind: "yeast",
    growth: 0.4,
    virulence: 1,
    intents: [
      { type: "multiply", weight: 3 },
      { type: "spread", weight: 2 },
      { type: "biofilm", weight: 2, name: "Biofilm on the central line" },
      { type: "toxin", weight: 1, amount: 2, name: "Hyphal tissue invasion" },
    ],
    traits: {
      gram: "Budding yeast cells",
      culture: "Creamy white yeast colonies; germ tube positive at 37 °C",
      biochem: "Not applicable (yeast isolate)",
      afb: "No acid-fast organisms",
      fungal: "Pseudohyphae and budding yeast on KOH prep",
      pcr: "No targets detected",
    },
    susceptible: ["fluconazole", "amphotericin", "caspofungin"],
    notes: {},
    vignettes: [
      {
        text: "A 60-year-old ICU patient with a central venous catheter, on TPN and broad-spectrum antibiotics for 10 days, has a fever that persists despite the antibiotics.",
        start: { blood: 16, skin: 8 },
        route: ["skin", "blood", "urinary"],
      },
      {
        text: "A 35-year-old man with untreated HIV has painful swallowing and white plaques on his tongue and palate that scrape off, leaving a red base.",
        start: { gi: 20 },
        route: ["gi", "blood"],
      },
    ],
    virulenceFactors: ["Pseudohyphae and hyphae", "Adhesins", "Biofilm"],
    treatment: "Thrush or esophagitis: fluconazole. Candidemia: an echinocandin, remove the line, and get an eye exam.",
    pearls: [
      "Yeast at 20 °C, germ tubes and pseudohyphae at 37 °C.",
      "Normal flora. It invades when barriers or immunity fail: antibiotics, catheters, TPN, diabetes, HIV, neutropenia.",
      "Neutrophils defend against invasive candidiasis. T cells protect the mucosa (thrush in HIV).",
    ],
  },
  {
    id: "crypto",
    name: "Cryptococcus neoformans",
    short: "C. neoformans",
    group: "Fungi",
    kind: "yeast",
    capsule: true,
    growth: 0.25,
    virulence: 1.4,
    adaptiveClear: 1,
    intents: [
      { type: "multiply", weight: 2 },
      { type: "spread", weight: 3 },
      { type: "evade", weight: 2, name: "Polysaccharide capsule" },
      { type: "toxin", weight: 1, amount: 2, name: "Raised intracranial pressure" },
    ],
    traits: {
      gram: "Budding yeast cells",
      culture: "Mucoid yeast colonies; urease +",
      biochem: "Not applicable (yeast isolate)",
      afb: "No acid-fast organisms",
      fungal: "Encapsulated yeast with a clear halo on India ink",
      pcr: "No targets detected",
      csf: "↑ lymphocytes, ↓ glucose, ↑ protein, very high opening pressure",
    },
    susceptible: ["amphotericin", "fluconazole"],
    notes: { caspofungin: "Echinocandins have no activity against Cryptococcus." },
    vignettes: [
      {
        text: "A 38-year-old man with HIV (CD4 count 45/µL) has 2 weeks of worsening headache, fever and confusion. Opening pressure on lumbar puncture is very high.",
        start: { lungs: 8, cns: 12 },
        route: ["lungs", "blood", "cns"],
      },
      {
        text: "A 50-year-old kidney transplant recipient who keeps pigeons has cough and fever, and now headache and blurred vision.",
        start: { lungs: 16, cns: 4 },
        route: ["lungs", "blood", "cns"],
      },
    ],
    virulenceFactors: ["Polysaccharide capsule", "Melanin", "Urease"],
    treatment: "Induction with amphotericin B + flucytosine, then fluconazole. Serial lumbar punctures to relieve pressure.",
    pearls: [
      "An encapsulated yeast in soil and pigeon droppings. It is inhaled, then spreads to the meninges.",
      "India ink shows the capsule halo. CSF cryptococcal antigen is the most sensitive test.",
      "Classic in AIDS with CD4 < 100/µL.",
    ],
  },
];

export const pathogenById = Object.fromEntries(PATHOGENS.map((pathogen) => [pathogen.id, pathogen]));

// Sites each pathogen can ever occupy, across all its vignettes.
export function possibleSites(pathogen) {
  const sites = new Set();
  for (const vignette of pathogen.vignettes) {
    vignette.route.forEach((site) => sites.add(site));
    Object.keys(vignette.start).forEach((site) => sites.add(site));
  }
  return sites;
}

export function isFungus(pathogen) {
  return pathogen.kind === "yeast";
}

export function isVirus(pathogen) {
  return pathogen.kind === "virus";
}

export function grows(pathogen) {
  return pathogen.grows !== false;
}
