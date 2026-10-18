// Browser front end. Renders the whole screen from state on every change and
// routes clicks through data-action attributes.
import { CARDS } from "../data/cards.js";
import { DRUGS, DRUG_GROUPS, drugById } from "../data/drugs.js";
import { LABS, labById } from "../data/labs.js";
import { PATHOGENS, pathogenById } from "../data/pathogens.js";
import { SITES, SITE_IDS, siteById } from "../data/sites.js";
import { explainDrug, isSusceptible } from "../engine/explain.js";
import {
  DIFFICULTIES,
  RULES,
  cardClearAmount,
  cardStatus,
  createGame,
  describeIntent,
  differential,
  drugPotency,
  drugStatus,
  endTurn,
  getPathogen,
  getVignette,
  labStatus,
  makeDiagnosis,
  orderLab,
  playCard,
  scoreGame,
  settingsFor,
  siteDamage,
  startDrug,
  stopDrug,
  toggleStrike,
} from "../engine/game.js";
import { L, LANGUAGES, detectLang, getLang, logText, setLang, t } from "../i18n/index.js";

const SAVE_KEY = "outbreak.save.v1";
const PROGRESS_KEY = "outbreak.progress.v1";

const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode or storage full: the game still works, it just won't persist */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

const progress = Object.assign(
  { difficulty: "resident", hints: true, seenHowTo: false, cases: 0, wins: 0, organisms: {}, lang: detectLang() },
  storage.get(PROGRESS_KEY, {}),
);
setLang(progress.lang);

const ui = {
  screen: "menu",
  game: null,
  selected: null,
  ordersTab: "lab",
  mobileTab: "body",
  modal: null,
  expanded: null,
  codexTab: "organisms",
  report: null,
  deltas: {},
  hpDelta: 0,
};

const root = document.getElementById("app");

// ---------------------------------------------------------------------------
// Helpers

const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

function saveProgress() {
  storage.set(PROGRESS_KEY, progress);
}

function saveGame() {
  if (ui.game && ui.game.status === "playing") storage.set(SAVE_KEY, ui.game);
  else storage.remove(SAVE_KEY);
}

function loadSavedGame() {
  const saved = storage.get(SAVE_KEY, null);
  if (saved && saved.version === 1 && pathogenById[saved.pathogenId] && saved.status === "playing") return saved;
  return null;
}

// Text shown for a resulted lab. Susceptibility is rebuilt from its drug lists so it
// follows the active language; everything else is a canonical trait string.
function labResultText(entry) {
  if (entry.susceptible) return t("lab.susc", { s: entry.susceptible, r: entry.resistant });
  return L(entry.result);
}

// Run an engine action, then work out what changed so the board can animate it.
function act(fn) {
  const game = ui.game;
  const sites = { ...game.sites };
  const hp = game.hp;
  const logLength = game.log.length;
  const result = fn(game);
  if (result && !result.ok) {
    toast(result.error);
    return result;
  }
  ui.deltas = Object.fromEntries(SITE_IDS.map((site) => [site, game.sites[site] - sites[site]]));
  ui.hpDelta = game.hp - hp;
  ui.fresh = logLength;
  if (game.status !== "playing") finishCase();
  saveGame();
  render();
  return result;
}

function finishCase() {
  const game = ui.game;
  const { grade, score } = scoreGame(game);
  const record = progress.organisms[game.pathogenId] ?? { played: 0, won: 0, bestGrade: null, bestScore: 0 };
  record.played += 1;
  if (game.status === "won") {
    record.won += 1;
    if (score >= record.bestScore) {
      record.bestScore = score;
      record.bestGrade = grade;
    }
  }
  progress.organisms[game.pathogenId] = record;
  progress.cases += 1;
  if (game.status === "won") progress.wins += 1;
  saveProgress();
  ui.selected = null;
  ui.modal = { type: "end" };
}

let toastTimer = null;
function toast(message) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function startNewCase(pathogenId) {
  const unseen = PATHOGENS.filter((p) => !progress.organisms[p.id]?.won);
  const pool = unseen.length ? unseen : PATHOGENS;
  const pick = pathogenId ?? pool[Math.floor(Math.random() * pool.length)].id;
  ui.game = createGame({ seed: Math.floor(Math.random() * 2 ** 31), difficulty: progress.difficulty, pathogenId: pick });
  ui.screen = "game";
  ui.selected = null;
  ui.modal = null;
  ui.report = null;
  ui.deltas = {};
  ui.hpDelta = 0;
  ui.ordersTab = "lab";
  ui.mobileTab = "body";
  ui.fresh = 0;
  saveGame();
  if (!progress.seenHowTo) {
    ui.modal = { type: "howto" };
    progress.seenHowTo = true;
    saveProgress();
  }
  render();
}

// ---------------------------------------------------------------------------
// Screens

function render() {
  const scroll = [...root.querySelectorAll("[data-scroll]")].map((el) => [el.dataset.scroll, el.scrollTop]);
  document.documentElement.lang = LANGUAGES[getLang()].html;
  document.title = t("page.title");
  let html = "";
  if (ui.screen === "menu") html = renderMenu();
  else if (ui.screen === "codex") html = renderCodex();
  else html = renderGame();
  html += renderModal();
  root.innerHTML = html;
  for (const [key, top] of scroll) {
    const el = root.querySelector(`[data-scroll="${key}"]`);
    if (el) el.scrollTop = top;
  }
  const logEl = root.querySelector('[data-scroll="log"]');
  if (logEl && ui.fresh !== undefined) logEl.scrollTop = logEl.scrollHeight;
  ui.deltas = {};
  ui.hpDelta = 0;
}

function logo(size = "") {
  return `<div class="logo ${size}"><svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" stroke-width="4" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="60"/><line x1="4" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="19" y2="19"/><line x1="45" y1="45" x2="52" y2="52"/><line x1="52" y1="12" x2="45" y2="19"/><line x1="19" y1="45" x2="12" y2="52"/></g><circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="27" cy="29" r="3" class="dot"/><circle cx="37" cy="36" r="4" class="dot"/></svg><span>OUTBREAK</span></div>`;
}

function langToggle() {
  const current = getLang();
  return `<div class="lang-toggle" role="group" aria-label="${esc(t("lang.label"))}">${Object.entries(LANGUAGES)
    .map(
      ([id, l]) =>
        `<button class="${id === current ? "active" : ""}" data-action="lang" data-id="${id}" aria-pressed="${id === current}" title="${esc(l.name)}" lang="${l.html}">${l.label}</button>`,
    )
    .join("")}</div>`;
}

function renderMenu() {
  const saved = loadSavedGame();
  const solved = PATHOGENS.filter((p) => progress.organisms[p.id]?.won).length;
  const difficulties = Object.entries(DIFFICULTIES)
    .map(
      ([id, d]) => `
      <button class="difficulty ${progress.difficulty === id ? "active" : ""}" data-action="difficulty" data-id="${id}" aria-pressed="${progress.difficulty === id}">
        <strong>${esc(L(d.name))}</strong><span>${esc(L(d.blurb))}</span>
      </button>`,
    )
    .join("");
  return `
  <main class="menu">
    <div class="menu-lang">${langToggle()}</div>
    <section class="hero">
      ${logo("big")}
      <p class="tagline">${esc(t("menu.tagline"))}</p>
      <div class="menu-actions">
        ${saved ? `<button class="btn primary" data-action="continue">${esc(t("menu.continue", { day: saved.day }))}</button>` : ""}
        <button class="btn ${saved ? "" : "primary"}" data-action="new-case">${esc(t(saved ? "menu.newCase" : "menu.start"))}</button>
        <button class="btn" data-action="codex">${esc(t("menu.codex"))} <span class="pill">${solved}/${PATHOGENS.length}</span></button>
        <button class="btn ghost" data-action="howto">${esc(t("menu.howto"))}</button>
      </div>
      <h2 class="section-title">${esc(t("menu.difficulty"))}</h2>
      <div class="difficulties">${difficulties}</div>
      <label class="toggle"><input type="checkbox" data-action="hints" ${progress.hints ? "checked" : ""}/> ${esc(t("menu.hints"))}</label>
      ${progress.cases ? `<p class="record">${esc(t("menu.record", { cases: progress.cases, wins: progress.wins }))}</p>` : ""}
    </section>
    <footer class="credits">${esc(t("menu.credits"))}</footer>
  </main>`;
}

// ---------------------------------------------------------------------------
// Game screen

function renderGame() {
  const game = ui.game;
  const settings = settingsFor(game);
  const hpPct = Math.round((game.hp / game.maxHp) * 100);
  const hpClass = hpPct > 60 ? "good" : hpPct > 30 ? "warn" : "bad";
  const adaptiveIn = settings.adaptiveDay - game.day;
  const adaptive = game.adaptiveOnline
    ? `<span class="adaptive on" title="${esc(t("adaptive.onTitle", { n: getPathogen(game).adaptiveClear ?? 2 }))}">${esc(t("adaptive.on"))}</span>`
    : `<span class="adaptive" title="${esc(t("adaptive.inTitle"))}">${esc(t("adaptive.in", { n: adaptiveIn }))}</span>`;
  const selected = ui.selected ? game.hand.find((card) => card.uid === ui.selected) : null;

  return `
  <div class="game tab-${ui.mobileTab}">
    <header class="topbar">
      <button class="icon-btn" data-action="menu" aria-label="${esc(t("game.back"))}">←</button>
      ${logo()}
      <div class="day">${esc(t("game.day"))} <strong>${game.day}</strong><span class="diff">${esc(L(settings.name))}</span></div>
      <div class="hp ${hpClass}" title="${esc(t("game.health"))}">
        <span class="hp-label">${esc(t("game.patient"))}</span>
        <div class="hp-bar"><div style="width:${hpPct}%"></div></div>
        <span class="hp-num">${game.hp}/${game.maxHp}</span>
        ${ui.hpDelta ? `<span class="float ${ui.hpDelta > 0 ? "up" : "down"}">${ui.hpDelta > 0 ? "+" : ""}${ui.hpDelta}</span>` : ""}
      </div>
      ${adaptive}
      ${langToggle()}
      <button class="icon-btn" data-action="howto" aria-label="${esc(t("menu.howto"))}">?</button>
    </header>

    <nav class="mobile-tabs" aria-label="${esc(t("game.panels"))}">
      ${["body", "chart", "orders", "log"]
        .map((id) => `<button class="${ui.mobileTab === id ? "active" : ""}" data-action="mobile-tab" data-id="${id}">${esc(t(`tab.${id}`))}</button>`)
        .join("")}
    </nav>

    <main class="board">
      <aside class="chart panel-col" data-scroll="chart">${renderChart()}</aside>
      <section class="patient">
        ${renderIntent()}
        ${renderHint()}
        <div class="sites ${selected && CARDS[selected.id].target === "site" ? "targeting" : ""}">${SITES.map(renderSite).join("")}</div>
        ${renderActiveDrugs()}
        <div class="log-wrap">${renderLog()}</div>
      </section>
      <aside class="orders panel-col" data-scroll="orders">${renderOrders()}</aside>
    </main>

    <footer class="hand-bar">
      <div class="energy" title="${esc(t("game.energyTitle"))}">
        ${Array.from({ length: RULES.energy }, (_, i) => `<span class="pip ${i < game.energy ? "full" : ""}"></span>`).join("")}
        <span class="energy-num">${game.energy}</span>
      </div>
      <div class="hand">${game.hand.map(renderHandCard).join("") || `<p class="muted">${esc(t("game.noCards"))}</p>`}</div>
      <div class="end-wrap">
        <button class="btn primary end-turn" data-action="end-turn">${esc(t("game.endDay"))}</button>
        <span class="deck-count" title="${esc(t("game.deckTitle"))}">🂠 ${game.draw.length} · ♻ ${game.discard.length}</span>
      </div>
    </footer>
  </div>`;
}

function renderChart() {
  const game = ui.game;
  const vignette = getVignette(game);
  const confirmed = game.diagnosis.confirmed ? pathogenById[game.diagnosis.confirmed] : null;
  const results = Object.entries(game.labs)
    .map(([id, entry]) => {
      const lab = labById[id];
      if (!entry.ready) return `<li class="pending"><span>${esc(L(lab.name))}</span><em>${esc(t("lab.pending", { day: entry.readyDay }))}</em></li>`;
      return `<li><span>${esc(L(lab.name))}</span><strong>${esc(labResultText(entry))}</strong></li>`;
    })
    .join("");
  return `
    <section class="panel">
      <h2>${esc(t("chart.presentation"))}</h2>
      <p class="vignette">${esc(L(vignette.text))}</p>
    </section>
    <section class="panel">
      <h2>${esc(t("chart.results"))}</h2>
      ${results ? `<ul class="results">${results}</ul>` : `<p class="muted">${esc(t("chart.noTests"))}</p>`}
    </section>
    <section class="panel">
      <div class="panel-head">
        <h2>${esc(t("chart.differential"))}</h2>
        ${confirmed ? "" : `<button class="btn small primary" data-action="open-diagnose">${esc(t("chart.diagnose"))}</button>`}
      </div>
      ${confirmed ? `<p class="confirmed">✔ ${esc(L(confirmed.name))}</p>` : ""}
      ${renderDifferential()}
    </section>`;
}

function renderDifferential() {
  const game = ui.game;
  const auto = settingsFor(game).autoDifferential;
  const entries = differential(game);
  const remaining = entries.filter((e) => !(auto && e.eliminated) && !game.strikes.includes(e.pathogen.id)).length;
  const groups = {};
  for (const entry of entries) (groups[entry.pathogen.group] ??= []).push(entry);
  const rows = Object.entries(groups)
    .map(
      ([group, items]) => `
      <li class="ddx-group">${esc(L(group))}</li>
      ${items
        .map(({ pathogen, eliminated, reasons }) => {
          const struck = game.strikes.includes(pathogen.id);
          const out = (auto && eliminated) || struck;
          const why = auto && eliminated ? reasons[0] : struck ? t("ddx.struck") : "";
          const isDx = game.diagnosis.confirmed === pathogen.id;
          return `<li><button class="ddx ${out ? "out" : ""} ${isDx ? "dx" : ""}" data-action="strike" data-id="${pathogen.id}" title="${esc(t(out ? "ddx.ruledOut" : "ddx.strike"))}">
            <span class="name">${esc(L(pathogen.short))}</span>${why ? `<span class="why">${esc(why)}</span>` : ""}
          </button></li>`;
        })
        .join("")}`,
    )
    .join("");
  const count = t("ddx.remaining", { n: remaining, total: PATHOGENS.length });
  return `<p class="muted small">${esc(count)}${auto ? "" : ` · ${esc(t("ddx.manual"))}`}</p><ul class="ddx-list">${rows}</ul>`;
}

function renderIntent() {
  const game = ui.game;
  const report = ui.report?.length
    ? `<div class="report"><h3>${esc(t("report.title"))}</h3><ul>${ui.report.map((e) => `<li class="${e.kind}">${esc(logText(e))}</li>`).join("")}</ul></div>`
    : "";
  const intent = describeIntent(game);
  if (!intent) return report;
  const expected =
    SITE_IDS.reduce((sum, site) => sum + siteDamage(game, site), 0) + (game.intent.type === "toxin" ? game.intent.amount : 0);
  return `
    ${report}
    <div class="intent intent-${game.intent.type}">
      <span class="intent-icon" aria-hidden="true">${intent.icon}</span>
      <div><strong>${esc(intent.title)}</strong><p>${esc(intent.text)}</p></div>
      <div class="expected" title="${esc(t("intent.expectedTitle"))}">≈${expected}<small>${esc(t("intent.expected"))}</small></div>
    </div>`;
}

function renderHint() {
  if (!progress.hints) return "";
  const game = ui.game;
  const auto = settingsFor(game).autoDifferential;
  const left = differential(game).filter((e) => !e.eliminated);
  const failing = game.drugs.find((id) => game.drugObservations[id] === "none");
  const selected = ui.selected && game.hand.find((c) => c.uid === ui.selected);
  let hint = "";
  if (selected) {
    hint = t(CARDS[selected.id].target === "site" ? "hint.site" : "hint.tapAgain");
  } else if (failing) {
    hint = t("hint.failing", { drug: drugById[failing].name });
  } else if (game.day === 1 && Object.keys(game.labs).length === 0) {
    hint = t("hint.start");
  } else if (game.drugs.length === 0 && game.day >= 1 && Object.keys(game.labs).length > 0) {
    hint = t("hint.empiric");
  } else if (auto && left.length === 1 && !game.diagnosis.confirmed) {
    hint = t("hint.onlyOne", { name: left[0].pathogen.short });
  } else if (game.intent?.type === "spread") {
    hint = t("hint.spread", { site: siteById[game.intent.source].name, n: RULES.spreadThreshold });
  }
  return hint ? `<p class="hint">💡 ${esc(hint)}</p>` : "";
}

function renderSite(site) {
  const game = ui.game;
  const load = game.sites[site.id];
  const selected = ui.selected ? game.hand.find((card) => card.uid === ui.selected) : null;
  const targetable = selected && CARDS[selected.id].target === "site" && cardStatus(game, selected.uid, site.id).ok;
  const preview = targetable ? Math.min(cardClearAmount(game, selected.id, site.id), load) : null;
  const delta = ui.deltas[site.id];
  const pct = Math.min(100, (load / RULES.maxLoad) * 100);
  const severity = load === 0 ? "clear" : load < 6 ? "low" : load < 12 ? "mid" : "high";
  const intent = game.intent;
  const spreadTag =
    intent?.type === "spread" && intent.source === site.id
      ? `<span class="tag threat">${esc(t("site.spreading", { site: siteById[intent.target].name }))}</span>`
      : intent?.type === "spread" && intent.target === site.id
        ? `<span class="tag threat">${esc(t("site.seeded"))}</span>`
        : "";
  const dmg = siteDamage(game, site.id);
  const meta = load ? t("site.dmg", { n: dmg }) : t(game.everInfected.includes(site.id) ? "site.cleared" : "site.clear");
  return `
    <button class="site ${severity} ${targetable ? "targetable" : ""} ${delta ? (delta < 0 ? "hit" : "grow") : ""}"
      data-action="site" data-id="${site.id}" ${selected && CARDS[selected.id].target === "site" && !targetable ? "disabled" : ""}
      aria-label="${esc(t("site.aria", { site: site.name, n: load }))}">
      <span class="site-icon" aria-hidden="true">${site.icon}</span>
      <span class="site-name">${esc(L(site.name))}</span>
      <span class="site-load">${load}</span>
      <span class="load-bar"><span style="width:${pct}%"></span></span>
      <span class="site-meta">${esc(meta)}</span>
      ${spreadTag}
      ${preview !== null ? `<span class="preview">−${preview}</span>` : ""}
      ${delta ? `<span class="float ${delta < 0 ? "down" : "up"}">${delta > 0 ? "+" : ""}${delta}</span>` : ""}
    </button>`;
}

function responseTag(obs, fallback = "") {
  if (obs === "response") return `<span class="tag good">${esc(t("drug.responding"))}</span>`;
  if (obs === "none") return `<span class="tag bad">${esc(t("drug.noResponse"))}</span>`;
  return fallback;
}

function renderActiveDrugs() {
  const game = ui.game;
  const slots = Array.from({ length: RULES.drugSlots }, (_, i) => {
    const drugId = game.drugs[i];
    if (!drugId) return `<div class="drug-slot empty">${esc(t("slot.empty"))}<small>${esc(t("slot.hint"))}</small></div>`;
    const drug = drugById[drugId];
    const status = responseTag(game.drugObservations[drugId], `<span class="tag">${esc(t("drug.awaiting"))}</span>`);
    return `<div class="drug-slot"><span class="pill-icon" aria-hidden="true">💊</span><div><strong>${esc(L(drug.name))}</strong>${status}</div><button class="btn small ghost" data-action="stop-drug" data-id="${drugId}">${esc(t("drug.stop"))}</button></div>`;
  }).join("");
  return `<div class="drug-slots" title="${esc(t("slot.title", { n: drugPotency(game) }))}">${slots}</div>`;
}

function renderLog() {
  const game = ui.game;
  const recent = game.log.slice(-40);
  const startIndex = game.log.length - recent.length;
  return `<h2 class="log-title">${esc(t("log.title"))}</h2><ol class="log" data-scroll="log">${recent
    .map((entry, i) => `<li class="${entry.kind} ${startIndex + i >= (ui.fresh ?? Infinity) ? "fresh" : ""}">${esc(logText(entry))}</li>`)
    .join("")}</ol>`;
}

function renderOrders() {
  const tab = ui.ordersTab;
  return `
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected="${tab === "lab"}" class="${tab === "lab" ? "active" : ""}" data-action="orders-tab" data-id="lab">🔬 ${esc(t("tab.lab"))}</button>
      <button role="tab" aria-selected="${tab === "pharmacy"}" class="${tab === "pharmacy" ? "active" : ""}" data-action="orders-tab" data-id="pharmacy">💊 ${esc(t("tab.pharmacy"))}</button>
    </div>
    ${tab === "lab" ? renderLabs() : renderPharmacy()}`;
}

function renderLabs() {
  const game = ui.game;
  return `<ul class="order-list">${LABS.map((lab) => {
    const status = labStatus(game, lab.id);
    const entry = game.labs[lab.id];
    const state =
      entry && !entry.ready
        ? t("lab.pending", { day: entry.readyDay })
        : entry && status.ok
          ? t("lab.repeat")
          : entry
            ? t("lab.resulted")
            : status.ok
              ? ""
              : status.error;
    return `<li class="order ${entry?.ready && !status.ok ? "done" : ""}">
      <div class="order-main">
        <strong>${esc(L(lab.name))}</strong>
        <p>${esc(L(lab.blurb))}</p>
        ${state ? `<em>${esc(state)}</em>` : ""}
      </div>
      <button class="btn small" data-action="order-lab" data-id="${lab.id}" ${status.ok ? "" : "disabled"}>${lab.cost}⚡</button>
    </li>`;
  }).join("")}</ul>`;
}

function renderPharmacy() {
  const game = ui.game;
  return DRUG_GROUPS.map(
    (group) => `
    <h3 class="group-title">${esc(L(group))}</h3>
    <ul class="order-list">${DRUGS.filter((drug) => drug.group === group)
      .map((drug) => {
        const running = game.drugs.includes(drug.id);
        const status = drugStatus(game, drug.id);
        const badges = [
          `<span class="tag ${drug.cns ? "" : "dim"}">${esc(t("badge.cns"))} ${drug.cns ? "✓" : "✗"}</span>`,
          drug.sites
            ? `<span class="tag dim">${esc(t("badge.only", { sites: drug.sites.map((s) => L(siteById[s].short)).join("/") }))}</span>`
            : "",
          drug.toxicity ? `<span class="tag bad">${esc(t("badge.toxic", { n: drug.toxicity }))}</span>` : "",
          responseTag(game.drugObservations[drug.id]),
        ].join("");
        const open = ui.expanded === drug.id;
        return `<li class="order drug ${running ? "running" : ""}">
          <div class="order-main">
            <button class="link" data-action="expand" data-id="${drug.id}" aria-expanded="${open}">${esc(L(drug.name))}</button>
            <div class="badges">${badges}</div>
            ${open ? `<p>${esc(L(drug.mechanism))}</p><p class="muted">${esc(L(drug.note))}</p>` : ""}
          </div>
          ${
            running
              ? `<button class="btn small ghost" data-action="stop-drug" data-id="${drug.id}">${esc(t("drug.stop"))}</button>`
              : `<button class="btn small" data-action="start-drug" data-id="${drug.id}" ${status.ok ? "" : "disabled"} title="${esc(status.ok ? t("drug.start") : status.error)}">${drug.cost}⚡</button>`
          }
        </li>`;
      })
      .join("")}</ul>`,
  ).join("");
}

function renderHandCard(instance, index) {
  const game = ui.game;
  const card = CARDS[instance.id];
  const playable = game.energy >= card.cost;
  const selected = ui.selected === instance.uid;
  return `
    <button class="card type-${card.type} ${selected ? "selected" : ""} ${playable ? "" : "unaffordable"}"
      data-action="card" data-uid="${instance.uid}" title="${esc(L(card.fact))}" aria-pressed="${selected}">
      <span class="cost">${card.cost}</span>
      <span class="key" aria-hidden="true">${index + 1}</span>
      <span class="card-type">${esc(t(`type.${card.type}`))}</span>
      <strong class="card-name">${esc(L(card.name))}</strong>
      <span class="card-text">${esc(L(card.text))}</span>
      ${selected && card.target === "none" ? `<span class="card-cta">${esc(t("card.tapAgain"))}</span>` : ""}
    </button>`;
}

// ---------------------------------------------------------------------------
// Codex

function renderCodex() {
  const tab = ui.codexTab;
  let body = "";
  if (tab === "organisms") {
    body = `<div class="codex-grid">${PATHOGENS.map((p) => {
      const record = progress.organisms[p.id];
      if (!record) {
        return `<div class="codex-tile locked"><span class="q">?</span><span>${esc(L(p.group))}</span><small>${esc(t("codex.locked"))}</small></div>`;
      }
      const status = record.won ? t("codex.best", { grade: record.bestGrade }) : t("codex.notCured");
      return `<button class="codex-tile" data-action="codex-entry" data-id="${p.id}">
        <strong>${esc(L(p.short))}</strong><span>${esc(L(p.group))}</span>
        <small>${esc(status)} · ${esc(t("codex.cases", { n: record.played }))}</small>
      </button>`;
    }).join("")}</div>`;
  } else if (tab === "drugs") {
    body = DRUG_GROUPS.map(
      (group) => `<h3 class="group-title">${esc(L(group))}</h3><div class="ref-grid">${DRUGS.filter((d) => d.group === group)
        .map((d) => {
          const treats = PATHOGENS.filter((p) => isSusceptible(p, d)).map((p) => p.short);
          return `<article class="ref"><h4>${esc(L(d.name))}</h4><p>${esc(L(d.mechanism))}</p><p class="muted">${esc(L(d.note))}</p>
          <p class="small">${esc(treats.length ? t("codex.treats", { list: treats }) : t("codex.treatsNone"))}</p></article>`;
        })
        .join("")}</div>`,
    ).join("");
  } else {
    body = `<div class="ref-grid">${Object.values(CARDS)
      .map(
        (c) =>
          `<article class="ref type-${c.type}"><h4>${esc(L(c.name))} <span class="tag">${esc(t(`type.${c.type}`))}</span></h4><p>${esc(L(c.text))}</p><p class="muted">${esc(L(c.fact))}</p></article>`,
      )
      .join("")}</div>`;
  }
  return `
  <main class="codex">
    <header class="topbar">
      <button class="icon-btn" data-action="menu" aria-label="${esc(t("game.back"))}">←</button>
      ${logo()}
      <h1>${esc(t("menu.codex"))}</h1>
      ${langToggle()}
    </header>
    <div class="tabs codex-tabs" role="tablist">
      ${["organisms", "drugs", "cards"]
        .map((id) => `<button role="tab" aria-selected="${tab === id}" class="${tab === id ? "active" : ""}" data-action="codex-tab" data-id="${id}">${esc(t(`codex.${id}`))}</button>`)
        .join("")}
    </div>
    <section class="codex-body">${body}</section>
  </main>`;
}

function renderPathogenCard(pathogen) {
  const traits = pathogen.traits;
  const rows = ["gram", "culture", "biochem", "afb", "fungal", "pcr", "csf"].filter((trait) => traits[trait]);
  const drugs = DRUGS.filter((d) => isSusceptible(pathogen, d)).map((d) => d.name);
  return `
    <article class="pathogen-card">
      <header><h3>${esc(L(pathogen.name))}</h3><span class="tag">${esc(L(pathogen.group))}</span></header>
      <dl class="traits">${rows.map((trait) => `<dt>${esc(t(`trait.${trait}`))}</dt><dd>${esc(L(traits[trait]))}</dd>`).join("")}</dl>
      <h4>${esc(t("pc.virulence"))}</h4>
      <div class="chips">${pathogen.virulenceFactors.map((v) => `<span class="chip">${esc(L(v))}</span>`).join("")}</div>
      <h4>${esc(t("pc.treatment"))}</h4>
      <p>${esc(L(pathogen.treatment))}</p>
      <p class="small muted">${esc(t("pc.works", { list: drugs }))}</p>
      <h4>${esc(t("pc.pearls"))}</h4>
      <ul class="pearls">${pathogen.pearls.map((p) => `<li>${esc(L(p))}</li>`).join("")}</ul>
      <h4>${esc(t("pc.presentations"))}</h4>
      <ul class="pearls">${pathogen.vignettes.map((v) => `<li>${esc(L(v.text))}</li>`).join("")}</ul>
    </article>`;
}

// ---------------------------------------------------------------------------
// Modals

function renderModal() {
  const modal = ui.modal;
  if (!modal) return "";
  let content = "";
  if (modal.type === "howto") content = renderHowTo();
  if (modal.type === "diagnose") content = renderDiagnose();
  if (modal.type === "end") content = renderEnd();
  if (modal.type === "codex-entry") {
    content = `${renderPathogenCard(pathogenById[modal.id])}<div class="modal-actions"><button class="btn primary" data-action="close-modal">${esc(t("modal.close"))}</button></div>`;
  }
  if (modal.type === "confirm-menu") {
    content = `<h2>${esc(t("leave.title"))}</h2><p>${esc(t("leave.text"))}</p>
      <div class="modal-actions"><button class="btn ghost" data-action="close-modal">${esc(t("leave.stay"))}</button><button class="btn primary" data-action="to-menu">${esc(t("leave.go"))}</button></div>`;
  }
  const dismissable = modal.type !== "end";
  return `<div class="overlay" ${dismissable ? 'data-action="overlay"' : ""}><div class="modal modal-${modal.type}" role="dialog" aria-modal="true">${content}</div></div>`;
}

// The how-to steps are trusted HTML from the locale files.
function renderHowTo() {
  const params = {
    energy: RULES.energy,
    slots: RULES.drugSlots,
    potency: RULES.drugPotency,
    threshold: RULES.spreadThreshold,
    bonus: RULES.diagnosisBonus,
    wrong: RULES.wrongDiagnosisDamage,
  };
  return `
    <h2>${esc(t("menu.howto"))}</h2>
    <ol class="howto">${t("howto.steps", params)}</ol>
    <p class="muted small">${esc(t("howto.keys"))}</p>
    <div class="modal-actions"><button class="btn primary" data-action="close-modal">${esc(t("howto.ok"))}</button></div>`;
}

function renderDiagnose() {
  const game = ui.game;
  const auto = settingsFor(game).autoDifferential;
  const entries = differential(game);
  return `
    <h2>${esc(t("dx.title"))}</h2>
    <p class="muted">${esc(t("dx.rules", { bonus: RULES.diagnosisBonus, wrong: RULES.wrongDiagnosisDamage }))}</p>
    <div class="dx-grid">${entries
      .map(({ pathogen, eliminated }) => {
        const out = (auto && eliminated) || game.strikes.includes(pathogen.id);
        const wrong = game.diagnosis.wrong.includes(pathogen.id);
        return `<button class="dx-option ${out ? "out" : ""}" data-action="diagnose" data-id="${pathogen.id}" ${wrong ? "disabled" : ""}>
          <strong>${esc(L(pathogen.name))}</strong><span>${esc(L(pathogen.group))}</span></button>`;
      })
      .join("")}</div>
    <div class="modal-actions"><button class="btn ghost" data-action="close-modal">${esc(t("dx.notYet"))}</button></div>`;
}

function renderEnd() {
  const game = ui.game;
  const pathogen = getPathogen(game);
  const won = game.status === "won";
  const { score, grade, lines } = scoreGame(game);
  const tried = [...new Set(game.drugHistory.map((h) => h.drugId))];
  const drugReview = tried.length
    ? tried
        .map((id) => {
          const drug = drugById[id];
          const good = isSusceptible(pathogen, drug);
          return `<li class="${good ? "good" : "bad"}"><strong>${good ? "✔" : "✘"} ${esc(L(drug.name))}</strong><span>${esc(explainDrug(pathogen, drug))}</span></li>`;
        })
        .join("")
    : `<li class="bad"><strong>✘ ${esc(t("end.noDrugs"))}</strong><span>${esc(t("end.noDrugsText"))}</span></li>`;
  const missed = !tried.some((id) => isSusceptible(pathogen, drugById[id]))
    ? `<p class="small">${esc(t("end.wouldWork", { list: DRUGS.filter((d) => isSusceptible(pathogen, d)).map((d) => d.name) }))}</p>`
    : "";
  const wrong = game.diagnosis.wrong.length;
  const dx = game.diagnosis.confirmed
    ? t("end.dxRight", { n: wrong })
    : wrong
      ? t("end.dxWrong", { list: game.diagnosis.wrong.map((id) => pathogenById[id].short) })
      : t("end.noDx");
  const scoreLine = lines.map((l) => `${l.label} ${l.value}`).join(" · ") || t("end.flawless");
  return `
    <div class="end-head ${won ? "won" : "lost"}">
      <div class="grade">${grade}</div>
      <div>
        <h2>${esc(t(won ? "end.saved" : "end.lost"))}</h2>
        <p>${esc(won ? t("end.cured", { day: game.day, hp: game.hp, max: game.maxHp }) : t("end.died", { day: game.day }))} ${esc(dx)}</p>
        ${won ? `<p class="small muted">${esc(t("end.score", { score }))} · ${esc(scoreLine)}</p>` : ""}
      </div>
    </div>
    <p class="reveal">${esc(t("end.reveal"))} <strong>${esc(L(pathogen.name))}</strong>.</p>
    <h3>${esc(t("end.yourDrugs"))}</h3>
    <ul class="review">${drugReview}</ul>
    ${missed}
    ${renderPathogenCard(pathogen)}
    <div class="modal-actions">
      <button class="btn ghost" data-action="to-menu">${esc(t("end.menu"))}</button>
      <button class="btn" data-action="retry">${esc(t("end.retry"))}</button>
      <button class="btn primary" data-action="new-case">${esc(t("end.next"))}</button>
    </div>`;
}

// ---------------------------------------------------------------------------
// Input

const actions = {
  "new-case": () => startNewCase(),
  continue: () => {
    ui.game = loadSavedGame();
    if (!ui.game) return startNewCase();
    ui.screen = "game";
    ui.modal = null;
    ui.report = null;
    render();
  },
  retry: () => startNewCase(ui.game.pathogenId),
  codex: () => {
    ui.screen = "codex";
    ui.modal = null;
    render();
  },
  "codex-tab": ({ id }) => {
    ui.codexTab = id;
    render();
  },
  "codex-entry": ({ id }) => {
    ui.modal = { type: "codex-entry", id };
    render();
  },
  howto: () => {
    ui.modal = { type: "howto" };
    render();
  },
  lang: ({ id }) => {
    progress.lang = setLang(id);
    saveProgress();
    render();
  },
  difficulty: ({ id }) => {
    progress.difficulty = id;
    saveProgress();
    render();
  },
  // The hints checkbox is handled by the change listener below.
  hints: () => {},
  menu: () => {
    if (ui.screen === "game" && ui.game?.status === "playing") ui.modal = { type: "confirm-menu" };
    else ui.screen = "menu";
    render();
  },
  "to-menu": () => {
    ui.screen = "menu";
    ui.modal = null;
    render();
  },
  "close-modal": () => {
    ui.modal = null;
    render();
  },
  overlay: (_, event) => {
    if (event.target.classList.contains("overlay")) actions["close-modal"]();
  },
  "mobile-tab": ({ id }) => {
    ui.mobileTab = id;
    render();
  },
  "orders-tab": ({ id }) => {
    ui.ordersTab = id;
    render();
  },
  expand: ({ id }) => {
    ui.expanded = ui.expanded === id ? null : id;
    render();
  },
  card: ({ uid }) => {
    const game = ui.game;
    const id = Number(uid);
    const instance = game.hand.find((card) => card.uid === id);
    if (!instance) return;
    const card = CARDS[instance.id];
    if (ui.selected === id) {
      if (card.target === "none") {
        ui.selected = null;
        act((g) => playCard(g, id));
      } else {
        ui.selected = null;
        render();
      }
      return;
    }
    const status = cardStatus(game, id);
    if (!status.ok) return toast(status.error);
    ui.selected = id;
    if (card.target === "site") ui.mobileTab = "body";
    render();
  },
  site: ({ id }) => {
    const game = ui.game;
    if (!ui.selected) return;
    const instance = game.hand.find((card) => card.uid === ui.selected);
    if (!instance || CARDS[instance.id].target !== "site") return;
    const uid = ui.selected;
    ui.selected = null;
    act((g) => playCard(g, uid, id));
  },
  "order-lab": ({ id }) => act((g) => orderLab(g, id)),
  "start-drug": ({ id }) => act((g) => startDrug(g, id)),
  "stop-drug": ({ id }) => act((g) => stopDrug(g, id)),
  strike: ({ id }) => act((g) => toggleStrike(g, id)),
  "open-diagnose": () => {
    ui.modal = { type: "diagnose" };
    render();
  },
  diagnose: ({ id }) => {
    ui.modal = null;
    act((g) => makeDiagnosis(g, id));
  },
  "end-turn": () => {
    const game = ui.game;
    if (game.status !== "playing") return;
    ui.selected = null;
    const from = game.log.length;
    act(endTurn);
    ui.report = game.log.slice(from).filter((e) => e.kind !== "system");
    if (game.status === "playing") render();
  },
};

root.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const handler = actions[el.dataset.action];
  if (handler) handler(el.dataset, event);
});

root.addEventListener("change", (event) => {
  if (event.target.dataset.action === "hints") {
    progress.hints = event.target.checked;
    saveProgress();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.closest?.("input, textarea")) return;
  if (event.key === "Escape") {
    if (ui.modal && ui.modal.type !== "end") ui.modal = null;
    else ui.selected = null;
    render();
    return;
  }
  if (ui.screen !== "game" || ui.modal || !ui.game || ui.game.status !== "playing") return;
  const index = Number(event.key) - 1;
  if (index >= 0 && index < ui.game.hand.length) {
    actions.card({ uid: String(ui.game.hand[index].uid) });
  } else if (event.key === "e" || event.key === "E") {
    actions["end-turn"]();
  }
});

render();
