// Localization. Two kinds of text:
//   L(str)          content strings from src/data (organism traits, drug notes, vignettes...).
//                   The English text is the key; each locale maps it to a translation.
//   t(key, params)  interface and engine messages, looked up by key.
// Log entries are stored as { key, params } so a saved case re-renders in whichever
// language is active. String params are passed through L(); arrays are joined lists.
import * as en from "./en.js";
import * as es from "./es.js";

export const LANGUAGES = { en: { label: "EN", name: "English", html: "en" }, es: { label: "ES", name: "Español", html: "es-MX" } };

const LOCALES = { en, es };

let lang = "en";

export function getLang() {
  return lang;
}

export function setLang(next) {
  if (LOCALES[next]) lang = next;
  return lang;
}

export function detectLang() {
  const browser = typeof navigator !== "undefined" ? (navigator.language ?? "") : "";
  return browser.toLowerCase().startsWith("es") ? "es" : "en";
}

export function L(text) {
  if (typeof text !== "string") return text;
  return LOCALES[lang].content?.[text] ?? text;
}

function formatParam(value) {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return L(value);
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === "object" ? `${L(item.site)} ${item.n}` : L(item))).join(", ");
  }
  return value ?? "";
}

export function t(key, params = {}) {
  const msg = LOCALES[lang].messages[key] ?? en.messages[key] ?? key;
  const formatted = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, formatParam(v)]));
  if (typeof msg === "function") return msg(formatted, params);
  return msg.replace(/\{(\w+)\}/g, (_, name) => formatted[name] ?? `{${name}}`);
}

// Render a timeline entry. Entries from saves made before localization only have `text`.
export function logText(entry) {
  return entry.key ? t(entry.key, entry.params) : entry.text;
}
