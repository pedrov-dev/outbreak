// Español de México. `messages` mirrors en.js key for key; `content` maps each English
// content string from src/data to its translation (tests/i18n.test.js checks coverage).

const s = (n, one, many) => (Number(n) === 1 ? one : many);
const reach = (blocked) => (blocked ? ` No llega a: ${blocked}.` : "");

export const messages = {
  "page.title": "OUTBREAK: un juego de cartas de microbiología",
  "lang.label": "Idioma",

  // Menú
  "menu.tagline":
    "Un juego de cartas de microbiología. Llega un paciente con una infección misteriosa. Estúdialo, identifica al bicho, elige el fármaco correcto y mantenlo con vida.",
  "menu.continue": "Continuar caso: día {day}",
  "menu.newCase": "Caso nuevo",
  "menu.start": "Empezar un caso",
  "menu.codex": "Expedientes",
  "menu.howto": "Cómo jugar",
  "menu.difficulty": "Dificultad",
  "menu.hints": "Mostrar pistas durante los casos",
  "menu.record": (p, raw) =>
    `${p.cases} ${s(raw.cases, "caso jugado", "casos jugados")} · ${p.wins} ${s(raw.wins, "paciente salvado", "pacientes salvados")}`,
  "menu.credits":
    "Solo con fines educativos. No es consejo médico. El tratamiento real depende de los patrones locales de resistencia y de las guías vigentes.",
  "leave.title": "¿Salir del caso?",
  "leave.text": "Tu avance está guardado. Puedes continuar desde el menú.",
  "leave.stay": "Quedarme",
  "leave.go": "Ir al menú",
  "modal.close": "Cerrar",

  // Pantalla de juego
  "game.back": "Volver al menú",
  "game.day": "Día",
  "game.health": "Salud del paciente",
  "game.patient": "Paciente",
  "game.panels": "Paneles",
  "game.energyTitle": "Energía: se gasta en cartas, estudios y fármacos. Se recarga cada día.",
  "game.noCards": "No tienes cartas en la mano.",
  "game.endDay": "Terminar día",
  "game.deckTitle": "Mazo / descarte",
  "adaptive.on": "Inmunidad adaptativa activa",
  "adaptive.onTitle": "Los linfocitos B y T eliminan {n} de cada sitio cada mañana",
  "adaptive.in": (p, raw) => `Inmunidad adaptativa en ${p.n} ${s(raw.n, "día", "días")}`,
  "adaptive.inTitle": "La expansión clonal de linfocitos B y T tarda días",
  "tab.body": "Paciente",
  "tab.chart": "Expediente",
  "tab.orders": "Órdenes",
  "tab.log": "Bitácora",
  "tab.lab": "Laboratorio",
  "tab.pharmacy": "Farmacia",
  "chart.presentation": "Cuadro clínico",
  "chart.results": "Resultados",
  "chart.noTests": "Aún no hay estudios. Pídelos en el Laboratorio.",
  "chart.differential": "Diagnóstico diferencial",
  "chart.diagnose": "Diagnosticar",
  "ddx.remaining": "{n} de {total} siguen siendo posibles",
  "ddx.manual": "descártalos tú",
  "ddx.struck": "descartado por ti",
  "ddx.ruledOut": "Descartado",
  "ddx.strike": "Haz clic para descartar",
  "ddx.lab": "{lab}",
  "ddx.response": "Respuesta a {drug}",
  "ddx.wrong": "Diagnóstico equivocado",
  "report.title": "Durante la noche y esta mañana",
  "intent.expected": "daño esta noche",
  "intent.expectedTitle": "Daño con la carga actual más cualquier toxina, antes del crecimiento nocturno",
  "intent.named": "{name}: {text}",
  "intent.multiply.title": "Crecimiento rápido",
  "intent.multiply.text": "+{n} en el sitio más infectado al final de tu turno.",
  "intent.spread.title": "Diseminación",
  "intent.spread.text": "sembrará {to} desde {from}. Baja {from} a menos de {threshold} para detenerlo.",
  "intent.toxin.title": "Toxina",
  "intent.toxin.text": "{n} de daño al final de tu turno.",
  "intent.evade.title": "Evasión inmune",
  "intent.evade.text": "las cartas inmunes eliminan {n} menos este turno.",
  "intent.biofilm.title": "Biopelícula",
  "intent.biofilm.text": "los fármacos eliminaron 1 menos hoy.",
  "hint.site": "Ahora elige un sitio del cuerpo para la carta.",
  "hint.tapAgain": "Toca la carta otra vez para jugarla.",
  "hint.failing": "{drug} no está funcionando. Suspende el fármaco para liberar el espacio.",
  "hint.start": "Empieza el abordaje: pide una tinción de Gram en el Laboratorio. Cada resultado acota el diferencial.",
  "hint.empiric": "Inicia tratamiento empírico en la Farmacia contra tus principales sospechosos. Puedes cambiarlo después.",
  "hint.onlyOne": "Solo {name} encaja. Haz el diagnóstico: tus fármacos funcionan mejor cuando lo nombras.",
  "hint.spread": "Baja {site} a menos de {n} para frenar la diseminación.",
  "site.spreading": "diseminándose → {site}",
  "site.seeded": "a punto de sembrarse",
  "site.aria": "{site}: carga {n}",
  "site.dmg": "≈{n} de daño/día",
  "site.cleared": "limpio",
  "site.clear": "sano",
  "slot.empty": "Espacio libre para fármaco",
  "slot.hint": "Farmacia → inicia un fármaco",
  "slot.title":
    "Cada fármaco activo se administra cada mañana: −{n} en cada sitio infectado al que llega, si el organismo es sensible",
  "drug.responding": "con respuesta",
  "drug.noResponse": "sin respuesta",
  "drug.awaiting": "esperando respuesta",
  "drug.stop": "Suspender",
  "drug.start": "Iniciar",
  "badge.cns": "SNC",
  "badge.only": "solo {sites}",
  "badge.toxic": "tóxico −{n}/día",
  "lab.pending": "pendiente, listo el día {day}",
  "lab.repeat": "repetir",
  "lab.resulted": "con resultado",
  "lab.susc": "Sensible: {s}. Resistente: {r}.",
  "log.title": "Bitácora",
  "card.tapAgain": "Toca otra vez para jugar",
  "type.innate": "innata",
  "type.adaptive": "adaptativa",
  "type.support": "soporte",
  "type.response": "respuesta",

  // Expedientes
  "codex.organisms": "Organismos",
  "codex.drugs": "Formulario",
  "codex.cards": "Cartas inmunes",
  "codex.locked": "Enfréntalo en un caso para desbloquearlo",
  "codex.best": "Mejor calificación {grade}",
  "codex.notCured": "Aún sin curar",
  "codex.cases": (p, raw) => `${p.n} ${s(raw.n, "caso", "casos")}`,
  "codex.treats": "Aquí trata: {list}",
  "codex.treatsNone": "Aquí trata: ninguno de los organismos del juego",
  "trait.gram": "Tinción de Gram",
  "trait.culture": "Cultivo",
  "trait.biochem": "Bioquímica",
  "trait.afb": "Ácido-alcohol resistencia",
  "trait.fungal": "KOH / tinta china",
  "trait.pcr": "PCR",
  "trait.csf": "LCR",
  "pc.virulence": "Factores de virulencia",
  "pc.treatment": "Tratamiento",
  "pc.works": "Funciona en este juego: {list}",
  "pc.pearls": "Perlas clave",
  "pc.presentations": "Presentaciones",

  // Cómo jugar (HTML confiable)
  "howto.steps": (p) => `
      <li><strong>Llega un paciente</strong> con un organismo desconocido. Lee el cuadro clínico: es tu primera pista. El mapa del cuerpo muestra la carga microbiana en cada sitio y cuánto daño hace aproximadamente por día.</li>
      <li><strong>Cada día tienes ${p.energy} de energía</strong> para gastar en tres cosas:
        <ul>
          <li><strong>Cartas inmunes</strong> de tu mano, jugadas sobre un sitio. Empata la célula con el microbio: neutrófilos para bacterias extracelulares y hongos, células NK y linfocitos T para virus e intracelulares, complemento para gramnegativos.</li>
          <li><strong>Estudios de laboratorio</strong> que revelan los rasgos del organismo. El diferencial tacha lo que ya no encaja.</li>
          <li><strong>Fármacos</strong>, hasta ${p.slots} a la vez. Un fármaco al que el organismo es sensible elimina ${p.potency} de cada sitio al que llega, todos los días. ¡Revisa la penetración al SNC!</li>
        </ul>
      </li>
      <li><strong>Vigila la intención del organismo.</strong> Te dice qué pasará al terminar el día: crecimiento, diseminación a un sitio nuevo o una toxina. Baja el sitio de origen a menos de ${p.threshold} para frenar la diseminación.</li>
      <li><strong>Durante la noche</strong> el organismo se replica en proporción a su carga y luego llega el daño. Las infecciones sin tratar se salen de control.</li>
      <li><strong>Haz el diagnóstico</strong> cuando estés seguro. Si aciertas, tus fármacos eliminan +${p.bonus}. Si te equivocas, pierdes ${p.wrong} de salud.</li>
      <li><strong>La inmunidad adaptativa</strong> llega después de unos días: elimina carga cada mañana y agrega anticuerpos y linfocitos T citotóxicos a tu mazo.</li>
      <li><strong>Limpia todos los sitios para ganar.</strong> Si la salud llega a 0, el paciente muere. En ambos casos, el resumen final explica el organismo y cada fármaco que elegiste.</li>`,
  "howto.keys": "Teclas: 1-5 eligen una carta, E termina el día, Esc cancela.",
  "howto.ok": "Entendido",

  // Diagnóstico y resumen
  "dx.title": "Hacer el diagnóstico",
  "dx.rules": "Si aciertas: los fármacos eliminan +{bonus}. Si fallas: −{wrong} de salud.",
  "dx.notYet": "Todavía no",
  "end.saved": "Paciente salvado",
  "end.lost": "Paciente perdido",
  "end.cured": "Curado el día {day} con {hp}/{max} de salud.",
  "end.died": "Falleció el día {day}.",
  "end.dxRight": (p, raw) =>
    raw.n
      ? `Diagnóstico correcto después de ${p.n} ${s(raw.n, "intento fallido", "intentos fallidos")}.`
      : "Diagnóstico correcto.",
  "end.dxWrong": "Intentos fallidos: {list}.",
  "end.noDx": "No se hizo un diagnóstico.",
  "end.score": "Puntuación {score}",
  "end.flawless": "impecable",
  "end.reveal": "El organismo era",
  "end.yourDrugs": "Tus fármacos",
  "end.noDrugs": "No se dio ningún fármaco",
  "end.noDrugsText": "Nunca se iniciaron antimicrobianos.",
  "end.wouldWork": "Habría funcionado: {list}.",
  "end.menu": "Menú",
  "end.retry": "Repetir este organismo",
  "end.next": "Siguiente caso",
  "score.died": "El paciente murió",
  "score.days": "Días después del 4",
  "score.health": "Salud perdida",
  "score.wrong": "Diagnósticos equivocados",
  "score.ineffective": "Fármacos ineficaces iniciados",
  "score.noDx": "Sin diagnóstico confirmado",

  // Motor: errores
  "err.over": "El caso terminó.",
  "err.noCard": "Esa carta no está en tu mano.",
  "err.energy": "No tienes suficiente energía.",
  "err.chooseSite": "Elige un sitio del cuerpo.",
  "err.onlySite": "{card} solo funciona en {site}.",
  "err.nothing": "No hay nada que eliminar ahí.",
  "err.fullHp": "El paciente ya tiene la salud completa.",
  "err.needsTarget": "Elige un sitio del cuerpo para esta carta.",
  "err.unknownTest": "Estudio desconocido.",
  "err.resulted": "Ya tiene resultado.",
  "err.pending": "Pendiente.",
  "err.needs": (p) => `Primero necesitas: ${p.lab.toLowerCase()}.`,
  "err.waiting": (p) => `Esperando resultado: ${p.lab.toLowerCase()}.`,
  "err.noIsolate": "No hay aislamiento que estudiar.",
  "err.unknownDrug": "Fármaco desconocido.",
  "err.running": "Ya está activo.",
  "err.slots": "Solo {n} fármacos a la vez. Suspende uno primero.",
  "err.notRunning": "Ese fármaco no está activo.",
  "err.diagnosed": "Ya hiciste el diagnóstico.",
  "err.unknownOrganism": "Organismo desconocido.",
  "err.ruledOut": "Ya lo descartaste.",
  "err.strikeLocked": "Ya quedó descartado por un diagnóstico equivocado.",

  // Motor: bitácora
  "log.admitted": "Día 1. El paciente ingresa.",
  "log.day": "Día {day}.",
  "log.cleared": "La infección se eliminó. El paciente se recupera.",
  "log.died": "El paciente falleció.",
  "log.adaptiveOnline":
    "La inmunidad adaptativa está activa: los clones de linfocitos B y T se expandieron. Los anticuerpos y los linfocitos T citotóxicos se suman a tu mazo.",
  "log.adaptive": "Respuesta adaptativa: {parts}.",
  "log.drugNoSite": (p) => `${p.drug}: ningún sitio infectado a su alcance.${reach(p.blocked)}`,
  "log.drugNone": (p) => `${p.drug}: sin respuesta clínica.${reach(p.blocked)}`,
  "log.drugGood": (p) => `${p.drug}: ${p.parts}.${reach(p.blocked)}`,
  "log.toxicity": "Toxicidad de {drug}: −{n} de salud.",
  "log.flora": "{drug} altera la flora intestinal normal: tubo digestivo +1.",
  "log.labSent": "{lab} enviado. Resultado esperado el día {day}.",
  "log.labResult": "Resultado de {lab}: {result}",
  "log.suscResult": "Resultado de {lab}: Sensible: {s}. Resistente: {r}.",
  "log.cardHit": "{card} → {site}: −{n}.",
  "log.cardNoEffect": "{card} → {site}: sin efecto.",
  "log.interferon": "Interferón: las células infectadas entran en estado antiviral.",
  "log.fever": "Fiebre: la replicación se frena. El paciente recibe {n} de daño.",
  "log.heal": "{card}: +{n} de salud.",
  "log.started": "Se inició {drug}.",
  "log.stopped": "Se suspendió {drug}.",
  "log.dxRight": "Diagnóstico confirmado: {name}. Tratamiento dirigido: los fármacos eficaces eliminan +{n}.",
  "log.dxWrong": "No es {name}: el cuadro no encaja. El retraso cuesta {n} de salud.",
  "log.replicates": "El organismo se replica: {parts}.",
  "log.suppressed": "La replicación queda suprimida este turno.",
  "log.overflow": "La carga abrumadora en {from} siembra {to}.",
  "log.tissue": "Daño tisular: −{n} de salud.",
  "log.rapid": "Crecimiento rápido en {site}: +{n}.",
  "log.spread": "El organismo se disemina de {from} a {to}: +{n}.",
  "log.contained": "Se contuvo la diseminación a {site}.",
  "log.toxin": "Liberación de toxina: −{n} de salud.",

  // Explicaciones del resumen
  "explain.virusAntibacterial":
    "Los antibióticos atacan estructuras bacterianas: la pared celular, los ribosomas 70S, la ADN girasa. Los virus no tienen ninguna.",
  "explain.virusAntifungal": "Los antifúngicos atacan el ergosterol o la pared celular fúngica. Los virus no tienen ninguno de los dos.",
  "explain.fungusAntibacterial":
    "Los hongos son eucariontes con ribosomas 80S y membranas con ergosterol. Los antibacterianos no los tocan.",
  "explain.antiviral": "{drug} bloquea una enzima viral, y solo los virus tienen ese blanco.",
  "explain.antifungalVirus": "{drug} ataca el ergosterol o la síntesis de la pared fúngica, que los virus no tienen.",
  "explain.antifungalBacteria": "{drug} ataca el ergosterol o la síntesis de la pared fúngica, que las bacterias no tienen.",
  "explain.generic": "{drug} no es un tratamiento eficaz para {organism}. {note}",
};

export const content = {
  // Difficulties
  Intern: "Interno",
  Resident: "Residente",
  Attending: "Adscrito",
  "More health, adaptive immunity arrives sooner, and the differential crosses itself off.":
    "Más salud, la inmunidad adaptativa llega antes y el diferencial se tacha solo.",
  "The standard case. The differential still crosses itself off.": "El caso estándar. El diferencial todavía se tacha solo.",
  "Less health, and you narrow the differential yourself.": "Menos salud, y tú acotas el diferencial.",

  // Body sites
  CNS: "SNC",
  "Meninges and brain. Infection here is an emergency.": "Meninges y cerebro. Una infección aquí es una urgencia.",
  "Respiratory tract": "Vías respiratorias",
  Lungs: "Pulmón",
  "Pharynx, airways and lungs.": "Faringe, vías aéreas y pulmones.",
  Blood: "Sangre",
  "Bacteremia can seed distant organs and cause sepsis.": "La bacteriemia puede sembrar órganos distantes y causar sepsis.",
  "GI tract": "Tubo digestivo",
  GI: "Digestivo",
  "Esophagus to colon.": "Del esófago al colon.",
  "Urinary tract": "Vías urinarias",
  Urinary: "Urinario",
  "Bladder and kidneys.": "Vejiga y riñones.",
  "Skin & soft tissue": "Piel y tejidos blandos",
  Skin: "Piel",
  "Skin, mucosa and subcutaneous tissue.": "Piel, mucosas y tejido subcutáneo.",

  // Labs
  "Gram stain": "Tinción de Gram",
  "Crystal violet, iodine, alcohol, safranin. Shows cell wall type and shape.":
    "Cristal violeta, lugol, alcohol y safranina. Muestra el tipo de pared celular y la forma.",
  Culture: "Cultivo",
  "Blood agar, MacConkey and chocolate agar. Results take a day (much longer for mycobacteria).":
    "Agar sangre, MacConkey y agar chocolate. El resultado tarda un día (mucho más para micobacterias).",
  "Biochemical panel": "Pruebas bioquímicas",
  "Catalase, coagulase, oxidase, indole. Needs a cultured isolate.":
    "Catalasa, coagulasa, oxidasa, indol. Requiere un aislamiento en cultivo.",
  "Susceptibility testing": "Antibiograma",
  "Antibiogram of the cultured isolate: which drugs actually work.":
    "Sensibilidad del aislamiento cultivado: qué fármacos sí funcionan.",
  "Acid-fast stain": "Baciloscopia (Ziehl-Neelsen)",
  "Ziehl-Neelsen stain for mycolic-acid cell walls.": "Tinción ácido-alcohol resistente para paredes con ácidos micólicos.",
  "KOH prep / India ink": "KOH / tinta china",
  "KOH dissolves human cells to show fungal elements; India ink outlines capsules.":
    "El KOH disuelve las células humanas y deja ver elementos fúngicos; la tinta china resalta las cápsulas.",
  "Molecular panel (PCR)": "Panel molecular (PCR)",
  "Multiplex nucleic-acid test: respiratory viruses, HSV, and C. difficile toxin genes.":
    "Prueba multiplex de ácidos nucleicos: virus respiratorios, VHS y genes de toxina de C. difficile.",
  "Lumbar puncture": "Punción lumbar",
  "CSF cell count, glucose and protein. Only informative once the CNS is involved.":
    "Citoquímico de LCR: células, glucosa y proteínas. Solo es informativo cuando el SNC ya está afectado.",
  "Normal CSF: no CNS involvement yet": "LCR normal: aún sin afección del SNC",

  // Immune cards
  Neutrophil: "Neutrófilo",
  "Clear 3 bacteria or fungi. Weak against intracellular microbes; useless against viruses.":
    "Elimina 3 bacterias u hongos. Débil contra microbios intracelulares; inútil contra virus.",
  "The first responders. Neutrophils phagocytose and kill with a respiratory burst (NADPH oxidase).":
    "Los primeros en llegar. Los neutrófilos fagocitan y matan con el estallido respiratorio (NADPH oxidasa).",
  Macrophage: "Macrófago",
  "Clear 2 of anything (1 for intracellular microbes or viruses).":
    "Elimina 2 de lo que sea (1 si son microbios intracelulares o virus).",
  "Macrophages engulf microbes and present antigen. Some pathogens, like M. tuberculosis, survive inside them.":
    "Los macrófagos engullen microbios y presentan antígenos. Algunos patógenos, como M. tuberculosis, sobreviven dentro de ellos.",
  Complement: "Complemento",
  "Clear 2 (+2 against gram-negatives via the MAC). Opsonizes: capsules no longer block phagocytes here this turn.":
    "Elimina 2 (+2 contra gramnegativos gracias al CAM). Opsoniza: las cápsulas ya no frenan a los fagocitos aquí este turno.",
  "C3b opsonizes and C5b-9 (the MAC) lyses gram-negatives. MAC deficiency predisposes to Neisseria.":
    "C3b opsoniza y C5b-9 (el complejo de ataque a la membrana, CAM) lisa a los gramnegativos. La deficiencia del CAM predispone a Neisseria.",
  "NK Cell": "Célula NK",
  "Clear 3 viruses (2 intracellular bacteria). No effect on extracellular microbes.":
    "Elimina 3 virus (2 bacterias intracelulares). Sin efecto sobre microbios extracelulares.",
  "Natural killer cells kill infected cells that have lost MHC I, without needing prior sensitization.":
    "Las células asesinas naturales matan células infectadas que perdieron el MHC I, sin necesidad de sensibilización previa.",
  Interferon: "Interferón",
  "Viruses and intracellular microbes don't replicate on the pathogen's next turn.":
    "Los virus y microbios intracelulares no se replican en el siguiente turno del patógeno.",
  "Type I interferons put neighboring cells into an antiviral state; IFN-gamma activates macrophages.":
    "Los interferones tipo I ponen a las células vecinas en estado antiviral; el IFN-gamma activa a los macrófagos.",
  Fever: "Fiebre",
  "Halves replication on the pathogen's next turn. The patient takes 1 damage.":
    "Reduce a la mitad la replicación en el siguiente turno del patógeno. El paciente recibe 1 de daño.",
  "IL-1, IL-6 and TNF-alpha reset the hypothalamic set point. Fever slows many microbes but costs the host.":
    "La IL-1, la IL-6 y el TNF-alfa reajustan el termostato hipotalámico. La fiebre frena a muchos microbios, pero le cuesta al huésped.",
  "IV Fluids": "Soluciones IV",
  "Restore 4 health.": "Recupera 4 de salud.",
  "Early fluid resuscitation is a cornerstone of sepsis care: 30 mL/kg crystalloid for hypotension.":
    "La reanimación hídrica temprana es pilar del manejo de la sepsis: 30 mL/kg de cristaloides si hay hipotensión.",
  "Incision & Drainage": "Incisión y drenaje",
  "Skin only. Clear 6 bacteria. Source control.": "Solo en piel. Elimina 6 bacterias. Control del foco.",
  "Antibiotics penetrate pus poorly. An abscess needs to be drained.":
    "Los antibióticos penetran mal en el pus. Un absceso hay que drenarlo.",
  Antibodies: "Anticuerpos",
  "Clear 4 extracellular microbes or viruses. Opsonizes the site.":
    "Elimina 4 microbios extracelulares o virus. Opsoniza el sitio.",
  "Plasma cells secrete IgM first, then class-switched IgG. Antibodies neutralize, opsonize and fix complement.":
    "Las células plasmáticas secretan primero IgM y luego IgG tras el cambio de isotipo. Los anticuerpos neutralizan, opsonizan y fijan complemento.",
  "Cytotoxic T Cell": "Linfocito T citotóxico",
  "Clear 4 viruses or intracellular microbes.": "Elimina 4 virus o microbios intracelulares.",
  "CD8+ T cells recognize antigen on MHC I and kill infected cells with perforin and granzymes.":
    "Los linfocitos T CD8+ reconocen antígeno en el MHC I y matan células infectadas con perforina y granzimas.",

  // Drug groups and drugs
  "Beta-lactams": "Betalactámicos",
  "Other antibacterials": "Otros antibacterianos",
  Antivirals: "Antivirales",
  Antifungals: "Antifúngicos",
  "Penicillin G": "Penicilina G",
  "Beta-lactam: binds penicillin-binding proteins (transpeptidases) and blocks peptidoglycan cross-linking.":
    "Betalactámico: se une a las proteínas fijadoras de penicilina (transpeptidasas) y bloquea el entrecruzamiento del peptidoglucano.",
  "Gram-positive cocci, N. meningitidis, T. pallidum. Destroyed by beta-lactamases.":
    "Cocos grampositivos, N. meningitidis, T. pallidum. Lo destruyen las betalactamasas.",
  Ampicillin: "Ampicilina",
  "Aminopenicillin: a beta-lactam with a wider gram-negative reach than penicillin G.":
    "Aminopenicilina: un betalactámico con mayor alcance contra gramnegativos que la penicilina G.",
  "Drug of choice for Listeria and Enterococcus. Many E. coli are now resistant.":
    "De elección para Listeria y Enterococcus. Muchas E. coli ya son resistentes.",
  Nafcillin: "Nafcilina",
  "Penicillinase-resistant penicillin: a bulky side chain shields the beta-lactam ring.":
    "Penicilina resistente a penicilinasa: una cadena lateral voluminosa protege el anillo betalactámico.",
  "Narrow anti-staphylococcal drug for MSSA. Useless against MRSA.":
    "Antiestafilocócico de espectro reducido para MSSA. Inútil contra MRSA.",
  Cefazolin: "Cefazolina",
  "1st-generation cephalosporin.": "Cefalosporina de 1.ª generación.",
  "Gram-positive cocci and some gram-negatives (Proteus, E. coli, Klebsiella). Surgical prophylaxis. Does not cross the blood-brain barrier.":
    "Cocos grampositivos y algunos gramnegativos (Proteus, E. coli, Klebsiella). Profilaxis quirúrgica. No cruza la barrera hematoencefálica.",
  Ceftriaxone: "Ceftriaxona",
  "3rd-generation cephalosporin.": "Cefalosporina de 3.ª generación.",
  "Meningitis, community pneumonia, gonorrhea. No activity against Pseudomonas, MRSA, Listeria or Enterococcus.":
    "Meningitis, neumonía adquirida en la comunidad, gonorrea. Sin actividad contra Pseudomonas, MRSA, Listeria ni Enterococcus.",
  Cefepime: "Cefepima",
  "4th-generation cephalosporin.": "Cefalosporina de 4.ª generación.",
  "Broad gram-negative coverage including Pseudomonas. Still no MRSA, Listeria or Enterococcus.":
    "Amplia cobertura contra gramnegativos, incluida Pseudomonas. Sigue sin cubrir MRSA, Listeria ni Enterococcus.",
  "Piperacillin-tazobactam": "Piperacilina-tazobactam",
  "Antipseudomonal penicillin combined with a beta-lactamase inhibitor.":
    "Penicilina antipseudomonas combinada con un inhibidor de betalactamasas.",
  "Very broad: Pseudomonas, gram-negatives, anaerobes, MSSA. Poor CNS penetration.":
    "Muy amplio: Pseudomonas, gramnegativos, anaerobios, MSSA. Mala penetración al SNC.",
  "Vancomycin (IV)": "Vancomicina (IV)",
  "Glycopeptide: binds D-Ala-D-Ala termini and blocks cell-wall synthesis.":
    "Glucopéptido: se une a los extremos D-Ala-D-Ala y bloquea la síntesis de la pared celular.",
  "Gram-positives only, including MRSA. Too large to cross the gram-negative outer membrane. IV doses don't reach the colon lumen. Nephrotoxic; can cause red man syndrome.":
    "Solo grampositivos, incluido MRSA. Es demasiado grande para cruzar la membrana externa de los gramnegativos. La vía IV no llega a la luz del colon. Nefrotóxica; puede causar síndrome del hombre rojo.",
  "Vancomycin (oral)": "Vancomicina (oral)",
  "Same glycopeptide, but not absorbed: it stays in the gut lumen.":
    "El mismo glucopéptido, pero no se absorbe: se queda en la luz intestinal.",
  "First-line for C. difficile colitis. Has no systemic effect.":
    "Primera línea para la colitis por C. difficile. No tiene efecto sistémico.",
  Metronidazole: "Metronidazol",
  "Reduced inside anaerobes and protozoa to free radicals that damage DNA.":
    "Dentro de anaerobios y protozoarios se reduce a radicales libres que dañan el ADN.",
  "Anaerobes, Giardia, Trichomonas, alternative for C. difficile. Disulfiram-like reaction with alcohol.":
    "Anaerobios, Giardia, Trichomonas, alternativa para C. difficile. Reacción tipo disulfiram con el alcohol.",
  Doxycycline: "Doxiciclina",
  "Tetracycline: binds the 30S subunit and blocks aminoacyl-tRNA attachment. Bacteriostatic.":
    "Tetraciclina: se une a la subunidad 30S y bloquea la unión del aminoacil-ARNt. Bacteriostática.",
  "Community MRSA skin infections, atypicals, rickettsiae, Lyme. Not for bacteremia or meningitis.":
    "Infecciones de piel por MRSA comunitario, atípicos, rickettsias, Lyme. No sirve para bacteriemia ni meningitis.",
  "TMP-SMX": "TMP-SMX",
  "Sequential blockade of bacterial folate synthesis (dihydropteroate synthase and dihydrofolate reductase).":
    "Bloqueo secuencial de la síntesis bacteriana de folato (dihidropteroato sintasa y dihidrofolato reductasa).",
  "UTIs, MRSA skin infections, Pneumocystis, alternative for Listeria. Weak against Strep. pyogenes.":
    "IVU, infecciones de piel por MRSA, Pneumocystis, alternativa para Listeria. Débil contra Strep. pyogenes.",
  Ciprofloxacin: "Ciprofloxacino",
  "Fluoroquinolone: inhibits DNA gyrase (topoisomerase II) and topoisomerase IV.":
    "Fluoroquinolona: inhibe la ADN girasa (topoisomerasa II) y la topoisomerasa IV.",
  "Gram-negatives including Pseudomonas. Weak against S. pneumoniae. Tendon rupture risk.":
    "Gramnegativos, incluida Pseudomonas. Débil contra S. pneumoniae. Riesgo de rotura de tendones.",
  Nitrofurantoin: "Nitrofurantoína",
  "Reduced to reactive intermediates that damage bacterial DNA and ribosomes.":
    "Se reduce a intermediarios reactivos que dañan el ADN y los ribosomas bacterianos.",
  "Only reaches useful levels in the bladder. Cystitis only, not pyelonephritis or bacteremia.":
    "Solo alcanza niveles útiles en la vejiga. Únicamente cistitis, no pielonefritis ni bacteriemia.",
  Gentamicin: "Gentamicina",
  "Aminoglycoside: binds the 30S subunit and causes mRNA misreading. Uptake needs oxygen.":
    "Aminoglucósido: se une a la subunidad 30S y provoca errores de lectura del ARNm. Su captación requiere oxígeno.",
  "Aerobic gram-negatives. Useless against anaerobes. Nephrotoxic and ototoxic.":
    "Gramnegativos aerobios. Inútil contra anaerobios. Nefrotóxica y ototóxica.",
  "RIPE therapy": "Esquema HRZE (RIPE)",
  "Rifampin, isoniazid, pyrazinamide and ethambutol given together.":
    "Rifampicina, isoniazida, pirazinamida y etambutol administrados juntos.",
  "Combination therapy prevents resistance in M. tuberculosis. Given for months. Hepatotoxic.":
    "La terapia combinada evita la resistencia en M. tuberculosis. Se da durante meses. Hepatotóxica.",
  Oseltamivir: "Oseltamivir",
  "Neuraminidase inhibitor: new virions can't detach from the infected cell.":
    "Inhibidor de neuraminidasa: los nuevos viriones no pueden desprenderse de la célula infectada.",
  "Influenza A and B. Most useful within 48 hours of symptom onset.":
    "Influenza A y B. Más útil en las primeras 48 horas desde el inicio de los síntomas.",
  Acyclovir: "Aciclovir",
  "Guanosine analog. Viral thymidine kinase activates it, and it terminates viral DNA chains.":
    "Análogo de guanosina. La timidina cinasa viral lo activa y termina las cadenas de ADN viral.",
  "HSV and VZV. Start empirically when encephalitis is suspected. Hydrate: crystal nephropathy.":
    "VHS y VVZ. Inícialo empíricamente ante sospecha de encefalitis. Hidrata: nefropatía por cristales.",
  Fluconazole: "Fluconazol",
  "Azole: inhibits 14-alpha-demethylase, blocking ergosterol synthesis.":
    "Azol: inhibe la 14-alfa-desmetilasa y bloquea la síntesis de ergosterol.",
  "C. albicans, cryptococcal maintenance therapy. C. krusei and many C. glabrata are resistant.":
    "C. albicans, terapia de mantenimiento contra criptococo. C. krusei y muchas C. glabrata son resistentes.",
  "Amphotericin B": "Anfotericina B",
  "Binds ergosterol and punches pores in the fungal membrane.": "Se une al ergosterol y abre poros en la membrana fúngica.",
  "Severe systemic mycoses; with flucytosine for cryptococcal meningitis. Nephrotoxic, infusion reactions.":
    "Micosis sistémicas graves; con flucitosina para la meningitis criptocócica. Nefrotóxica, reacciones a la infusión.",
  Caspofungin: "Caspofungina",
  "Echinocandin: inhibits beta-(1,3)-glucan synthase in the fungal cell wall.":
    "Equinocandina: inhibe la beta-(1,3)-glucano sintasa de la pared celular fúngica.",
  "Candida (including candidemia) and Aspergillus. No activity against Cryptococcus.":
    "Candida (incluida la candidemia) y Aspergillus. Sin actividad contra Cryptococcus.",

  // Organism groups and names
  "Gram-positive cocci": "Cocos grampositivos",
  "Gram-negative cocci": "Cocos gramnegativos",
  "Gram-negative rods": "Bacilos gramnegativos",
  "Gram-positive rods": "Bacilos grampositivos",
  "Acid-fast bacilli": "Bacilos ácido-alcohol resistentes",
  "RNA viruses": "Virus ARN",
  "DNA viruses": "Virus ADN",
  Fungi: "Hongos",
  "Streptococcus pyogenes (Group A Strep)": "Streptococcus pyogenes (estreptococo del grupo A)",
  "Influenza A virus": "Virus de la influenza A",
  "Herpes simplex virus 1": "Virus del herpes simple tipo 1",
  "HSV-1": "VHS-1",

  // Shared lab results
  "No organisms seen": "No se observan microorganismos",
  "No growth": "Sin crecimiento",
  "No acid-fast organisms": "Sin bacilos ácido-alcohol resistentes",
  "No fungal elements": "Sin elementos fúngicos",
  "No targets detected": "No se detectaron blancos",
  "↑ neutrophils, ↓ glucose, ↑ protein": "↑ neutrófilos, ↓ glucosa, ↑ proteínas",
  "Oral vancomycin stays in the gut lumen and only treats C. difficile.":
    "La vancomicina oral se queda en la luz intestinal y solo trata C. difficile.",
  "Vancomycin is too large to cross the gram-negative outer membrane.":
    "La vancomicina es demasiado grande para cruzar la membrana externa de los gramnegativos.",
  "Nafcillin is a narrow anti-staphylococcal drug.": "La nafcilina es un antiestafilocócico de espectro reducido.",
  "Streptococci are intrinsically resistant to aminoglycosides on their own.":
    "Los estreptococos son intrínsecamente resistentes a los aminoglucósidos solos.",
  "Biofilm": "Biopelícula",
  "Gram-positive cocci in clusters": "Cocos grampositivos en racimos",
  "Beta-hemolytic golden colonies on blood agar": "Colonias doradas betahemolíticas en agar sangre",
  "Catalase +, coagulase +": "Catalasa +, coagulasa +",
  "Catalase −": "Catalasa −",
  "Catalase +": "Catalasa +",
  "Budding yeast cells": "Levaduras en gemación",
  "Not applicable (yeast isolate)": "No aplica (aislamiento de levadura)",
  "Protein A": "Proteína A",
  "Polysaccharide capsule": "Cápsula de polisacárido",
  "IgA protease": "Proteasa de IgA",
  Endotoxin: "Endotoxina",

  // MSSA
  "Alpha-toxin": "Toxina alfa",
  "Over 90% of S. aureus make penicillinase, a beta-lactamase that destroys penicillin and ampicillin.":
    "Más del 90% de S. aureus produce penicilinasa, una betalactamasa que destruye la penicilina y la ampicilina.",
  "A 34-year-old man has a hot, painful, fluctuant 3-cm nodule on his thigh draining thick yellow pus. Temperature 38.4 °C.":
    "Un hombre de 34 años tiene en el muslo un nódulo de 3 cm caliente, doloroso y fluctuante que drena pus amarillo espeso. Temperatura 38.4 °C.",
  "A 45-year-old man who injects drugs has 5 days of fever and rigors. There is a new holosystolic murmur at the left lower sternal border.":
    "Un hombre de 45 años que se inyecta drogas tiene 5 días con fiebre y escalofríos. Hay un soplo holosistólico nuevo en el borde esternal inferior izquierdo.",
  "Protein A (binds IgG Fc)": "Proteína A (se une al Fc de la IgG)",
  Coagulase: "Coagulasa",
  "TSST-1": "TSST-1",
  "Drain abscesses. Nafcillin/oxacillin or cefazolin for MSSA; vancomycin until MRSA is ruled out.":
    "Drenar abscesos. Nafcilina/oxacilina o cefazolina para MSSA; vancomicina hasta descartar MRSA.",
  "Catalase + and coagulase + separate S. aureus from the other staphylococci.":
    "Catalasa + y coagulasa + distinguen a S. aureus de los demás estafilococos.",
  "Protein A binds the Fc portion of IgG and blocks opsonization.":
    "La proteína A se une a la porción Fc de la IgG y bloquea la opsonización.",
  "Causes abscesses, cellulitis, osteomyelitis and endocarditis (tricuspid valve in people who inject drugs), plus toxin diseases: toxic shock (TSST-1), food poisoning, scalded skin.":
    "Causa abscesos, celulitis, osteomielitis y endocarditis (válvula tricúspide en personas que se inyectan drogas), además de enfermedades por toxinas: choque tóxico (TSST-1), intoxicación alimentaria, piel escaldada.",
  "Antibiotics penetrate pus poorly. Abscesses need incision and drainage.":
    "Los antibióticos penetran mal en el pus. Los abscesos requieren incisión y drenaje.",

  // MRSA
  "Panton-Valentine leukocidin": "Leucocidina de Panton-Valentine",
  "The mecA gene encodes PBP2a, a penicillin-binding protein with low affinity for beta-lactams. Only ceftaroline (not stocked here) still works.":
    "El gen mecA codifica PBP2a, una proteína fijadora de penicilina con baja afinidad por los betalactámicos. Solo la ceftarolina (no disponible aquí) sigue funcionando.",
  "A 19-year-old college wrestler has a painful, red, swollen boil on his forearm with a central pustule. Two teammates have had similar lesions.":
    "Un luchador universitario de 19 años tiene en el antebrazo un forúnculo doloroso, rojo e inflamado con una pústula central. Dos compañeros del equipo han tenido lesiones similares.",
  "A 62-year-old woman on hemodialysis spikes a fever with rigors during dialysis. The skin around her tunneled catheter is red and tender. She has been hospitalized twice this year.":
    "Una mujer de 62 años en hemodiálisis presenta fiebre con escalofríos durante la sesión. La piel alrededor de su catéter tunelizado está roja y dolorosa. Ha estado hospitalizada dos veces este año.",
  "PBP2a (mecA)": "PBP2a (mecA)",
  "Vancomycin (or daptomycin) for serious infection. TMP-SMX, doxycycline or clindamycin for uncomplicated skin infection after drainage.":
    "Vancomicina (o daptomicina) para infección grave. TMP-SMX, doxiciclina o clindamicina para infección de piel no complicada después del drenaje.",
  "MSSA and MRSA look identical on Gram stain, culture and biochemistry. Only susceptibility testing (or mecA PCR) tells them apart.":
    "MSSA y MRSA se ven idénticos en Gram, cultivo y bioquímica. Solo el antibiograma (o la PCR de mecA) los distingue.",
  "Resistance comes from mecA, which encodes PBP2a.": "La resistencia viene de mecA, que codifica PBP2a.",
  "Community MRSA (often PVL+) causes boils and necrotizing pneumonia. Hospital MRSA follows catheters, dialysis and surgery.":
    "El MRSA comunitario (a menudo PVL+) causa forúnculos y neumonía necrosante. El MRSA hospitalario sigue a catéteres, diálisis y cirugías.",

  // S. pyogenes
  "Streptococcal pyrogenic exotoxin": "Exotoxina pirogénica estreptocócica",
  "M protein": "Proteína M",
  "Gram-positive cocci in chains": "Cocos grampositivos en cadenas",
  "Small colonies with clear beta-hemolysis; bacitracin-sensitive":
    "Colonias pequeñas con betahemólisis clara; sensible a bacitracina",
  "TMP-SMX is unreliable against Group A Strep.": "El TMP-SMX no es confiable contra el estreptococo del grupo A.",
  "Many S. pyogenes strains are tetracycline-resistant.": "Muchas cepas de S. pyogenes son resistentes a tetraciclinas.",
  "Ciprofloxacin has weak gram-positive activity.": "El ciprofloxacino tiene poca actividad contra grampositivos.",
  "A 9-year-old girl has a sore throat, fever of 39 °C, tonsillar exudates and tender anterior cervical lymph nodes. She has no cough.":
    "Una niña de 9 años tiene dolor de garganta, fiebre de 39 °C, exudado amigdalino y ganglios cervicales anteriores dolorosos. No tiene tos.",
  "A 50-year-old man scraped his shin gardening 2 days ago. Now the leg has spreading redness with pain out of proportion to the exam, and he is tachycardic.":
    "Un hombre de 50 años se raspó la espinilla haciendo jardinería hace 2 días. Ahora la pierna tiene un enrojecimiento que avanza, con dolor desproporcionado a la exploración, y está taquicárdico.",
  "M protein (antiphagocytic)": "Proteína M (antifagocítica)",
  "Streptolysins O and S": "Estreptolisinas O y S",
  "Pyrogenic exotoxins (SpeA, SpeC)": "Exotoxinas pirogénicas (SpeA, SpeC)",
  Streptokinase: "Estreptocinasa",
  "Hyaluronic acid capsule": "Cápsula de ácido hialurónico",
  "Penicillin or amoxicillin. Necrotizing fasciitis: surgical debridement plus clindamycin to stop toxin production.":
    "Penicilina o amoxicilina. Fascitis necrosante: desbridamiento quirúrgico más clindamicina para frenar la producción de toxinas.",
  "Beta-hemolytic and bacitracin-sensitive. Group B Strep is bacitracin-resistant.":
    "Betahemolítico y sensible a bacitracina. El estreptococo del grupo B es resistente a bacitracina.",
  "Antibodies against M protein cross-react with heart tissue, which causes rheumatic fever.":
    "Los anticuerpos contra la proteína M tienen reacción cruzada con el tejido cardiaco, lo que causa fiebre reumática.",
  "Post-streptococcal glomerulonephritis can follow throat or skin infection. Rheumatic fever follows only pharyngitis.":
    "La glomerulonefritis postestreptocócica puede seguir a una infección de garganta o de piel. La fiebre reumática solo sigue a la faringitis.",
  "Group A Strep has never developed resistance to penicillin.":
    "El estreptococo del grupo A nunca ha desarrollado resistencia a la penicilina.",

  // S. pneumoniae
  Pneumolysin: "Neumolisina",
  "Gram-positive lancet-shaped diplococci": "Diplococos grampositivos lanceolados",
  "Alpha-hemolytic (green) colonies; optochin-sensitive, bile-soluble":
    "Colonias alfahemolíticas (verdes); sensibles a optoquina, solubles en bilis",
  "Ciprofloxacin is weak against S. pneumoniae. The 'respiratory' fluoroquinolones are levofloxacin and moxifloxacin.":
    "El ciprofloxacino es débil contra S. pneumoniae. Las fluoroquinolonas 'respiratorias' son levofloxacino y moxifloxacino.",
  "Pneumococcal resistance to TMP-SMX is common.": "La resistencia del neumococo al TMP-SMX es común.",
  "A 67-year-old man has sudden fever, shaking chills, pleuritic chest pain and a cough productive of rust-colored sputum. Chest X-ray: right lower lobe consolidation.":
    "Un hombre de 67 años presenta fiebre súbita, escalofríos intensos, dolor torácico pleurítico y tos con esputo color herrumbre. Radiografía de tórax: consolidación del lóbulo inferior derecho.",
  "A 58-year-old man who had a splenectomy after a car accident has fever, a severe headache and neck stiffness, 2 days after an ear infection.":
    "Un hombre de 58 años al que le quitaron el bazo tras un accidente de coche tiene fiebre, cefalea intensa y rigidez de nuca, 2 días después de una infección de oído.",
  "Community pneumonia: beta-lactam (± macrolide) or a respiratory fluoroquinolone. Meningitis: ceftriaxone + vancomycin + dexamethasone.":
    "Neumonía comunitaria: betalactámico (± macrólido) o una fluoroquinolona respiratoria. Meningitis: ceftriaxona + vancomicina + dexametasona.",
  "The most common cause of community-acquired pneumonia, adult meningitis, otitis media and sinusitis.":
    "La causa más común de neumonía adquirida en la comunidad, meningitis en adultos, otitis media y sinusitis.",
  "The capsule is the key virulence factor (positive Quellung reaction). Asplenic patients are at high risk and should be vaccinated.":
    "La cápsula es el factor de virulencia clave (reacción de Quellung positiva). Los pacientes asplénicos tienen alto riesgo y deben vacunarse.",
  "IgA protease lets it colonize the mucosa.": "La proteasa de IgA le permite colonizar la mucosa.",
  "Optochin-sensitive and bile-soluble, unlike the viridans streptococci.":
    "Sensible a optoquina y soluble en bilis, a diferencia de los estreptococos del grupo viridans.",

  // N. meningitidis
  "Endotoxin (LOS): septic shock": "Endotoxina (LOS): choque séptico",
  "Gram-negative diplococci": "Diplococos gramnegativos",
  "Grows on chocolate and Thayer-Martin agar; ferments glucose and maltose":
    "Crece en agar chocolate y Thayer-Martin; fermenta glucosa y maltosa",
  "Oxidase +, catalase +": "Oxidasa +, catalasa +",
  "Meningococcal resistance to sulfonamides is widespread.": "La resistencia del meningococo a las sulfonamidas está muy extendida.",
  "An 18-year-old college freshman living in a dormitory has fever, severe headache, neck stiffness and a non-blanching petechial rash on his legs.":
    "Un estudiante de 18 años de primer semestre que vive en una residencia universitaria tiene fiebre, cefalea intensa, rigidez de nuca y un exantema petequial en las piernas que no desaparece a la presión.",
  "A 22-year-old military recruit becomes acutely ill with fever and confusion. Purpura spreads across his trunk within hours. Blood pressure 80/40.":
    "Un recluta militar de 22 años enferma de forma aguda con fiebre y confusión. En pocas horas aparece púrpura que se extiende por el tronco. Presión arterial 80/40.",
  "Lipooligosaccharide (LOS) endotoxin": "Endotoxina lipooligosacárido (LOS)",
  Pili: "Pili",
  "Ceftriaxone. Prophylaxis for close contacts: rifampin, ciprofloxacin or ceftriaxone.":
    "Ceftriaxona. Profilaxis para contactos cercanos: rifampicina, ciprofloxacino o ceftriaxona.",
  "Ferments maltose and glucose. N. gonorrhoeae ferments glucose only.":
    "Fermenta maltosa y glucosa. N. gonorrhoeae solo fermenta glucosa.",
  "LOS endotoxin drives septic shock and DIC. Adrenal hemorrhage is Waterhouse-Friderichsen syndrome.":
    "La endotoxina LOS provoca choque séptico y CID. La hemorragia suprarrenal es el síndrome de Waterhouse-Friderichsen.",
  "Terminal complement (C5-C9, the MAC) deficiency predisposes to recurrent Neisseria infections.":
    "La deficiencia del complemento terminal (C5-C9, el CAM) predispone a infecciones recurrentes por Neisseria.",

  // E. coli
  "Endotoxin (LPS)": "Endotoxina (LPS)",
  "P fimbriae": "Fimbrias P",
  "Pink colonies on MacConkey agar (lactose fermenter); green metallic sheen on EMB":
    "Colonias rosas en agar MacConkey (fermentadora de lactosa); brillo verde metálico en EMB",
  "Oxidase −, indole +": "Oxidasa −, indol +",
  "Penicillin G barely penetrates the gram-negative outer membrane, and many E. coli make beta-lactamase.":
    "La penicilina G apenas penetra la membrana externa de los gramnegativos, y muchas E. coli producen betalactamasa.",
  "About half of E. coli carry plasmid beta-lactamases. Ampicillin isn't reliable empirically.":
    "Cerca de la mitad de las E. coli portan betalactamasas plasmídicas. La ampicilina no es confiable como tratamiento empírico.",
  "Doxycycline isn't a reliable treatment for E. coli infection.":
    "La doxiciclina no es un tratamiento confiable para la infección por E. coli.",
  "A 26-year-old sexually active woman has had 3 days of dysuria, frequency and suprapubic pain. Today she has fever, chills and right flank pain.":
    "Una mujer de 26 años con vida sexual activa lleva 3 días con disuria, polaquiuria y dolor suprapúbico. Hoy tiene fiebre, escalofríos y dolor en el flanco derecho.",
  "A 74-year-old man with an indwelling urinary catheter becomes febrile, hypotensive and confused.":
    "Un hombre de 74 años con sonda urinaria a permanencia presenta fiebre, hipotensión y confusión.",
  "LPS endotoxin (lipid A)": "Endotoxina LPS (lípido A)",
  "K1 capsule (some strains)": "Cápsula K1 (algunas cepas)",
  "Shiga-like toxin (EHEC)": "Toxina tipo Shiga (ECEH)",
  "Cystitis: nitrofurantoin or TMP-SMX. Pyelonephritis or urosepsis: ceftriaxone or a fluoroquinolone, adjusted to susceptibilities.":
    "Cistitis: nitrofurantoína o TMP-SMX. Pielonefritis o urosepsis: ceftriaxona o una fluoroquinolona, ajustadas al antibiograma.",
  "The most common cause of UTI. P fimbriae help it ascend to the kidney.":
    "La causa más común de IVU. Las fimbrias P le ayudan a ascender al riñón.",
  "Strains differ: EHEC O157:H7 (Shiga-like toxin, HUS), ETEC (traveler's diarrhea), K1 capsule (neonatal meningitis).":
    "Las cepas varían: ECEH O157:H7 (toxina tipo Shiga, SUH), ECET (diarrea del viajero), cápsula K1 (meningitis neonatal).",
  "Lactose fermenter: pink on MacConkey, metallic green sheen on EMB.":
    "Fermentadora de lactosa: rosa en MacConkey, brillo verde metálico en EMB.",
  "Nitrofurantoin treats cystitis but not pyelonephritis. It doesn't reach the kidney or the blood.":
    "La nitrofurantoína trata la cistitis pero no la pielonefritis. No llega al riñón ni a la sangre.",

  // P. aeruginosa
  "Exotoxin A": "Exotoxina A",
  "Alginate biofilm": "Biopelícula de alginato",
  "Non-lactose-fermenting colonies; blue-green pigment and grape-like odor":
    "Colonias no fermentadoras de lactosa; pigmento azul verdoso y olor a uva",
  "Oxidase +": "Oxidasa +",
  "Pseudomonas needs an antipseudomonal beta-lactam such as piperacillin-tazobactam or cefepime.":
    "Pseudomonas requiere un betalactámico antipseudomonas como piperacilina-tazobactam o cefepima.",
  "Cefazolin has no antipseudomonal activity.": "La cefazolina no tiene actividad antipseudomonas.",
  "Ceftriaxone has no antipseudomonal activity. Cefepime and ceftazidime do.":
    "La ceftriaxona no tiene actividad antipseudomonas. La cefepima y la ceftazidima sí.",
  "Pseudomonas is intrinsically resistant to TMP-SMX.": "Pseudomonas es intrínsecamente resistente al TMP-SMX.",
  "Pseudomonas is intrinsically resistant to tetracyclines.": "Pseudomonas es intrínsecamente resistente a las tetraciclinas.",
  "Pseudomonas is intrinsically resistant to nitrofurantoin.": "Pseudomonas es intrínsecamente resistente a la nitrofurantoína.",
  "A 58-year-old man intubated in the ICU for 6 days develops new fever, a rising oxygen requirement and purulent green tracheal secretions.":
    "Un hombre de 58 años intubado en terapia intensiva desde hace 6 días presenta fiebre nueva, mayor requerimiento de oxígeno y secreciones traqueales verdes y purulentas.",
  "A 30-year-old man with deep burns over 30% of his body develops fever on hospital day 8. The burn wounds have a blue-green exudate with a sweet, fruity smell.":
    "Un hombre de 30 años con quemaduras profundas en el 30% del cuerpo presenta fiebre al octavo día de hospitalización. Las quemaduras tienen un exudado azul verdoso con olor dulce y afrutado.",
  "Exotoxin A (inactivates EF-2)": "Exotoxina A (inactiva el EF-2)",
  Pyocyanin: "Piocianina",
  "Antipseudomonal agents: piperacillin-tazobactam, cefepime or ceftazidime, carbapenems (not ertapenem), fluoroquinolones, aminoglycosides.":
    "Antipseudomonas: piperacilina-tazobactam, cefepima o ceftazidima, carbapenémicos (no ertapenem), fluoroquinolonas, aminoglucósidos.",
  "Aerobic, oxidase +, non-lactose fermenter. Pyocyanin gives the blue-green color.":
    "Aerobio, oxidasa +, no fermentador de lactosa. La piocianina da el color azul verdoso.",
  "Causes ventilator-associated pneumonia, burn infections, pneumonia in cystic fibrosis, hot-tub folliculitis, otitis externa, and osteomyelitis after a nail goes through a sneaker.":
    "Causa neumonía asociada al ventilador, infecciones de quemaduras, neumonía en fibrosis quística, foliculitis por jacuzzi, otitis externa y osteomielitis después de que un clavo atraviesa un tenis.",
  "Exotoxin A inactivates EF-2, the same target as diphtheria toxin.":
    "La exotoxina A inactiva el EF-2, el mismo blanco que la toxina diftérica.",

  // L. monocytogenes
  "Listeriolysin O": "Listeriolisina O",
  "Actin rocket tails": "Colas de actina tipo cohete",
  "Small colonies with narrow beta-hemolysis; tumbling motility; grows at 4 °C":
    "Colonias pequeñas con betahemólisis estrecha; movilidad en volteretas; crece a 4 °C",
  "Listeria is intrinsically resistant to all cephalosporins. Empiric meningitis therapy for neonates, adults over 50 and the immunocompromised must add ampicillin.":
    "Listeria es intrínsecamente resistente a todas las cefalosporinas. El tratamiento empírico de meningitis en neonatos, mayores de 50 años e inmunocomprometidos debe agregar ampicilina.",
  "Vancomycin isn't a recommended treatment for Listeria.": "La vancomicina no es un tratamiento recomendado para Listeria.",
  "Piperacillin-tazobactam isn't a recommended treatment for Listeria.":
    "La piperacilina-tazobactam no es un tratamiento recomendado para Listeria.",
  "Gentamicin is only added for synergy with ampicillin. Alone it can't reach intracellular Listeria.":
    "La gentamicina solo se agrega por sinergia con la ampicilina. Sola no alcanza a la Listeria intracelular.",
  "A 72-year-old woman on prednisone for polymyalgia rheumatica has 2 days of fever, headache and confusion. She eats deli meat daily. Her neck is stiff.":
    "Una mujer de 72 años que toma prednisona por polimialgia reumática tiene 2 días con fiebre, cefalea y confusión. Come carnes frías a diario. Tiene rigidez de nuca.",
  "A woman 30 weeks pregnant has fever, myalgias and diarrhea a week after eating soft cheese made from unpasteurized milk.":
    "Una mujer con 30 semanas de embarazo tiene fiebre, mialgias y diarrea una semana después de comer queso fresco de leche bronca (sin pasteurizar).",
  "Listeriolysin O (escapes the phagosome)": "Listeriolisina O (escapa del fagosoma)",
  "ActA (actin rocket tails)": "ActA (colas de actina tipo cohete)",
  Internalin: "Internalina",
  "Ampicillin (± gentamicin for synergy). TMP-SMX if penicillin-allergic.":
    "Ampicilina (± gentamicina por sinergia). TMP-SMX si hay alergia a la penicilina.",
  "Facultative intracellular gram-positive rod with tumbling motility. It grows in the fridge (cold enrichment).":
    "Bacilo grampositivo intracelular facultativo con movilidad en volteretas. Crece en el refrigerador (enriquecimiento en frío).",
  "It moves from cell to cell on actin rockets, hidden from antibodies. Cell-mediated immunity is what clears it.":
    "Pasa de célula a célula sobre cohetes de actina, oculta de los anticuerpos. La inmunidad celular es la que la elimina.",
  "Risk groups: pregnancy, neonates, the elderly, the immunosuppressed. Sources: deli meat, soft cheese, unpasteurized milk.":
    "Grupos de riesgo: embarazo, neonatos, adultos mayores, inmunosuprimidos. Fuentes: carnes frías, quesos frescos, leche bronca.",
  "Cephalosporins do not work. This is why ampicillin is added to empiric meningitis coverage in at-risk patients.":
    "Las cefalosporinas no funcionan. Por eso se agrega ampicilina a la cobertura empírica de meningitis en pacientes de riesgo.",

  // C. difficile
  "Toxins A and B": "Toxinas A y B",
  Sporulation: "Esporulación",
  "Grows only anaerobically; spore-forming rods": "Crece solo en anaerobiosis; bacilos esporulados",
  "C. difficile toxin B gene detected": "Se detectó el gen de la toxina B de C. difficile",
  "IV vancomycin isn't excreted into the colon, so it does nothing for C. difficile colitis. Give it orally.":
    "La vancomicina IV no se excreta al colon, así que no hace nada contra la colitis por C. difficile. Dala por vía oral.",
  "Other antibiotics kill the competing gut flora and feed C. difficile. Stop the offending antibiotic.":
    "Otros antibióticos matan a la flora intestinal competidora y alimentan a C. difficile. Suspende el antibiótico causante.",
  "A 70-year-old nursing-home resident just finished 10 days of clindamycin for cellulitis. Now she has 8 watery stools a day, cramping, and a WBC of 22,000/µL.":
    "Una residente de asilo de 70 años acaba de terminar 10 días de clindamicina por celulitis. Ahora tiene 8 evacuaciones líquidas al día, cólicos y leucocitos de 22,000/µL.",
  "A 55-year-old man in hospital for pneumonia, on ceftriaxone for a week, develops foul-smelling watery diarrhea and fever. Colonoscopy shows yellow-white plaques.":
    "Un hombre de 55 años hospitalizado por neumonía, con ceftriaxona desde hace una semana, presenta diarrea líquida fétida y fiebre. La colonoscopia muestra placas blanco-amarillentas.",
  "Toxin A (enterotoxin)": "Toxina A (enterotoxina)",
  "Toxin B (cytotoxin)": "Toxina B (citotoxina)",
  Spores: "Esporas",
  "Stop the inciting antibiotic. Oral vancomycin or fidaxomicin. Fecal microbiota transplant for recurrences.":
    "Suspender el antibiótico causante. Vancomicina oral o fidaxomicina. Trasplante de microbiota fecal para las recurrencias.",
  "A spore-forming, toxin-producing anaerobic gram-positive rod.":
    "Bacilo grampositivo anaerobio, esporulado y productor de toxinas.",
  "Toxins A and B damage the colonic mucosa and cause pseudomembranous colitis.":
    "Las toxinas A y B dañan la mucosa del colon y causan colitis pseudomembranosa.",
  "Classic triggers: clindamycin, fluoroquinolones, cephalosporins, PPIs, hospitalization.":
    "Desencadenantes clásicos: clindamicina, fluoroquinolonas, cefalosporinas, IBP, hospitalización.",
  "Diagnose with a stool toxin or PCR test. Alcohol hand rub doesn't kill spores; wash with soap and water.":
    "Se diagnostica con toxina o PCR en heces. El gel con alcohol no mata las esporas; lávate con agua y jabón.",

  // M. tuberculosis
  "Blocks phagolysosome fusion": "Bloquea la fusión del fagolisosoma",
  "Cord factor": "Factor cordón",
  "Slow-growing buff colonies on Lowenstein-Jensen agar (weeks)":
    "Colonias color crema de crecimiento lento en Löwenstein-Jensen (semanas)",
  "Niacin +": "Niacina +",
  "Acid-fast bacilli seen": "Se observan bacilos ácido-alcohol resistentes",
  "↑ lymphocytes, ↓ glucose, ↑↑ protein": "↑ linfocitos, ↓ glucosa, ↑↑ proteínas",
  "Ciprofloxacin is a poor antituberculous drug. Moxifloxacin and levofloxacin are second-line options, never alone.":
    "El ciprofloxacino es un mal antituberculoso. Moxifloxacino y levofloxacino son opciones de segunda línea, nunca solos.",
  "M. tuberculosis has a waxy mycolic-acid wall, divides slowly inside macrophages, and needs a multidrug regimen (RIPE).":
    "M. tuberculosis tiene una pared cerosa de ácidos micólicos, se divide lentamente dentro de los macrófagos y requiere un esquema de varios fármacos (HRZE).",
  "A 45-year-old man who emigrated from the Philippines a year ago has 2 months of productive cough, night sweats, an 8-kg weight loss and blood-streaked sputum. Chest X-ray: right upper lobe cavity.":
    "Un hombre de 45 años que emigró de Filipinas hace un año tiene 2 meses con tos productiva, sudoración nocturna, pérdida de 8 kg y esputo con estrías de sangre. Radiografía de tórax: caverna en el lóbulo superior derecho.",
  "A 60-year-old man who recently started infliximab for Crohn disease has weeks of fever, weight loss and cough. Chest X-ray: countless tiny nodules throughout both lungs.":
    "Un hombre de 60 años que inició hace poco infliximab por enfermedad de Crohn tiene semanas con fiebre, pérdida de peso y tos. Radiografía de tórax: incontables nódulos diminutos en ambos pulmones.",
  "Mycolic acids": "Ácidos micólicos",
  "Cord factor (trehalose dimycolate)": "Factor cordón (dimicolato de trehalosa)",
  "Sulfatides (block phagolysosome fusion)": "Sulfátidos (bloquean la fusión del fagolisosoma)",
  "RIPE (rifampin, isoniazid, pyrazinamide, ethambutol) for 2 months, then rifampin + isoniazid for 4. Airborne isolation.":
    "HRZE (isoniazida, rifampicina, pirazinamida, etambutol) por 2 meses, luego isoniazida + rifampicina por 4. Aislamiento respiratorio.",
  "Mycolic acids make it acid-fast and invisible on Gram stain.":
    "Los ácidos micólicos la hacen ácido-alcohol resistente e invisible en la tinción de Gram.",
  "Th1 cells release IFN-gamma to activate macrophages and form caseating granulomas. TNF-alpha blockers can reactivate latent TB.":
    "Los linfocitos Th1 liberan IFN-gamma para activar macrófagos y formar granulomas caseificantes. Los bloqueadores del TNF-alfa pueden reactivar una TB latente.",
  "RIPE toxicities: rifampin turns fluids orange and induces P450; isoniazid causes neuropathy (give B6) and hepatitis; ethambutol causes optic neuritis.":
    "Toxicidades del HRZE: la rifampicina pinta de naranja los líquidos e induce el P450; la isoniazida causa neuropatía (da B6) y hepatitis; el etambutol causa neuritis óptica.",
  "Culture takes weeks. Start treatment on clinical suspicion and a positive AFB smear.":
    "El cultivo tarda semanas. Inicia el tratamiento ante la sospecha clínica y una baciloscopia positiva.",

  // Influenza
  "Antigenic drift": "Deriva antigénica",
  "Cytokine storm": "Tormenta de citocinas",
  "Influenza A RNA detected": "Se detectó ARN de influenza A",
  "A 30-year-old teacher in January has an abrupt fever of 39.5 °C, severe myalgias, headache, dry cough and exhaustion. Several of her students are sick.":
    "Una maestra de 30 años presenta en enero fiebre súbita de 39.5 °C, mialgias intensas, cefalea, tos seca y agotamiento. Varios de sus alumnos están enfermos.",
  "A 78-year-old nursing-home resident who skipped this year's vaccine develops sudden fever, cough and confusion during a local outbreak.":
    "Un residente de asilo de 78 años que no se puso la vacuna de este año presenta fiebre súbita, tos y confusión durante un brote local.",
  "Hemagglutinin (binds sialic acid)": "Hemaglutinina (se une al ácido siálico)",
  "Neuraminidase (releases virions)": "Neuraminidasa (libera viriones)",
  "Supportive care. Oseltamivir for severe illness, high-risk patients, or within 48 hours of onset.":
    "Tratamiento de sostén. Oseltamivir en enfermedad grave, pacientes de alto riesgo o en las primeras 48 horas.",
  "Orthomyxovirus: enveloped, segmented, negative-sense single-stranded RNA.":
    "Ortomixovirus: envuelto, segmentado, ARN de cadena sencilla y sentido negativo.",
  "Antigenic drift (point mutations) causes seasonal epidemics. Antigenic shift (segment reassortment) causes pandemics.":
    "La deriva antigénica (mutaciones puntuales) causa epidemias estacionales. El cambio antigénico (reordenamiento de segmentos) causa pandemias.",
  "Antibiotics do nothing to viruses, but watch for secondary bacterial pneumonia (S. aureus, S. pneumoniae).":
    "Los antibióticos no le hacen nada a los virus, pero vigila la neumonía bacteriana secundaria (S. aureus, S. pneumoniae).",
  "The annual vaccine is the best prevention.": "La vacuna anual es la mejor prevención.",

  // HSV-1
  "Latency in sensory ganglia": "Latencia en ganglios sensitivos",
  "HSV-1 DNA detected": "Se detectó ADN de VHS-1",
  "↑ lymphocytes, normal glucose, RBCs present": "↑ linfocitos, glucosa normal, eritrocitos presentes",
  "A 25-year-old woman has had 3 days of fever and headache. Now she has bizarre behavior, trouble finding words, and a seizure. MRI: right temporal lobe hyperintensity.":
    "Una mujer de 25 años lleva 3 días con fiebre y cefalea. Ahora tiene conducta extraña, dificultad para encontrar palabras y una convulsión. Resonancia magnética: hiperintensidad en el lóbulo temporal derecho.",
  "A 21-year-old man has painful grouped vesicles on a red base at the edge of his lip, with fever and tender submandibular nodes.":
    "Un hombre de 21 años tiene vesículas agrupadas y dolorosas sobre una base roja en el borde del labio, con fiebre y ganglios submandibulares dolorosos.",
  "Cell-to-cell spread": "Diseminación de célula a célula",
  "Acyclovir (or valacyclovir). Encephalitis: IV acyclovir started on suspicion.":
    "Aciclovir (o valaciclovir). Encefalitis: aciclovir IV desde la sospecha.",
  "Herpesvirus: enveloped, double-stranded DNA, replicates in the nucleus.":
    "Herpesvirus: envuelto, ADN de doble cadena, se replica en el núcleo.",
  "Latent in sensory ganglia (trigeminal for HSV-1). Reactivates with stress, fever or UV light.":
    "Latente en ganglios sensitivos (el trigémino para VHS-1). Se reactiva con estrés, fiebre o luz UV.",
  "The most common cause of sporadic viral encephalitis, with a predilection for the temporal lobes.":
    "La causa más común de encefalitis viral esporádica, con predilección por los lóbulos temporales.",
  "Tzanck smear shows multinucleated giant cells. CSF PCR is the diagnostic test. Acyclovir treats active disease but cannot cure latency.":
    "El frotis de Tzanck muestra células gigantes multinucleadas. La PCR en LCR es la prueba diagnóstica. El aciclovir trata la enfermedad activa, pero no cura la latencia.",

  // C. albicans
  "Biofilm on the central line": "Biopelícula en el catéter central",
  "Hyphal tissue invasion": "Invasión tisular por hifas",
  "Creamy white yeast colonies; germ tube positive at 37 °C":
    "Colonias de levadura blancas y cremosas; tubo germinal positivo a 37 °C",
  "Pseudohyphae and budding yeast on KOH prep": "Seudohifas y levaduras en gemación en el KOH",
  "A 60-year-old ICU patient with a central venous catheter, on TPN and broad-spectrum antibiotics for 10 days, has a fever that persists despite the antibiotics.":
    "Un paciente de 60 años en terapia intensiva con catéter venoso central, con NPT y antibióticos de amplio espectro desde hace 10 días, tiene fiebre que persiste a pesar de los antibióticos.",
  "A 35-year-old man with untreated HIV has painful swallowing and white plaques on his tongue and palate that scrape off, leaving a red base.":
    "Un hombre de 35 años con VIH sin tratamiento tiene dolor al tragar y placas blancas en la lengua y el paladar que se desprenden al rasparlas y dejan una base roja.",
  "Pseudohyphae and hyphae": "Seudohifas e hifas",
  Adhesins: "Adhesinas",
  "Thrush or esophagitis: fluconazole. Candidemia: an echinocandin, remove the line, and get an eye exam.":
    "Algodoncillo o esofagitis: fluconazol. Candidemia: una equinocandina, retirar el catéter y revisión de fondo de ojo.",
  "Yeast at 20 °C, germ tubes and pseudohyphae at 37 °C.": "Levadura a 20 °C; tubos germinales y seudohifas a 37 °C.",
  "Normal flora. It invades when barriers or immunity fail: antibiotics, catheters, TPN, diabetes, HIV, neutropenia.":
    "Es flora normal. Invade cuando fallan las barreras o la inmunidad: antibióticos, catéteres, NPT, diabetes, VIH, neutropenia.",
  "Neutrophils defend against invasive candidiasis. T cells protect the mucosa (thrush in HIV).":
    "Los neutrófilos defienden contra la candidiasis invasiva. Los linfocitos T protegen la mucosa (algodoncillo en el VIH).",

  // C. neoformans
  "Raised intracranial pressure": "Hipertensión intracraneal",
  "Mucoid yeast colonies; urease +": "Colonias mucoides de levadura; ureasa +",
  "Encapsulated yeast with a clear halo on India ink": "Levadura encapsulada con halo claro en tinta china",
  "↑ lymphocytes, ↓ glucose, ↑ protein, very high opening pressure":
    "↑ linfocitos, ↓ glucosa, ↑ proteínas, presión de apertura muy alta",
  "Echinocandins have no activity against Cryptococcus.": "Las equinocandinas no tienen actividad contra Cryptococcus.",
  "A 38-year-old man with HIV (CD4 count 45/µL) has 2 weeks of worsening headache, fever and confusion. Opening pressure on lumbar puncture is very high.":
    "Un hombre de 38 años con VIH (CD4 de 45/µL) tiene 2 semanas con cefalea progresiva, fiebre y confusión. La presión de apertura en la punción lumbar es muy alta.",
  "A 50-year-old kidney transplant recipient who keeps pigeons has cough and fever, and now headache and blurred vision.":
    "Un receptor de trasplante renal de 50 años que cría palomas tiene tos y fiebre, y ahora cefalea y visión borrosa.",
  Melanin: "Melanina",
  Urease: "Ureasa",
  "Induction with amphotericin B + flucytosine, then fluconazole. Serial lumbar punctures to relieve pressure.":
    "Inducción con anfotericina B + flucitosina, luego fluconazol. Punciones lumbares seriadas para bajar la presión.",
  "An encapsulated yeast in soil and pigeon droppings. It is inhaled, then spreads to the meninges.":
    "Levadura encapsulada presente en la tierra y en el excremento de paloma. Se inhala y luego se disemina a las meninges.",
  "India ink shows the capsule halo. CSF cryptococcal antigen is the most sensitive test.":
    "La tinta china muestra el halo de la cápsula. El antígeno criptocócico en LCR es la prueba más sensible.",
  "Classic in AIDS with CD4 < 100/µL.": "Clásico en sida con CD4 < 100/µL.",
};
