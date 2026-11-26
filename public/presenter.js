/* Pantalla de facilitació (projector): PIN, sala, QR, recompte i control de la història */
import { STORY, nodeOf, optOf } from "./story.js";
import { h, $, nodeView, resultView, finalView, mount, storeGet, storeSet, api, countdownEl, setServerNow, serverNow } from "./ui.js";

const POLL_MS = 1000;
let pin = (() => { try { return sessionStorage.getItem("j25n-pin") || ""; } catch { return ""; } })();
let sala = storeGet("j25n-sala-fac", "");
let data = null;           // {estat, joined, votes, storage}
let loginError = "";
let msg = "";
let busy = false;
let confirm = null;        // "reset" | "new"
let pollTimer = null;
let lastStamp = "";

let config = { salaFixa: null, publicUrl: null, storage: null };
const baseUrl = () => config.publicUrl || location.origin;
const joinUrl = () => config.salaFixa && sala === config.salaFixa ? `${baseUrl()}/` : `${baseUrl()}/?sala=${sala}`;
const isFixed = () => !!config.salaFixa && sala === config.salaFixa;
const savePin = (p) => { pin = p; try { sessionStorage.setItem("j25n-pin", p); } catch { /* sense emmagatzematge */ } };
function flash(m) { msg = m; render(); setTimeout(() => { if (msg === m) { msg = ""; render(); } }, 6000); }

async function login(p) {
  try {
    const d = await api("/api/admin", { pin: p, action: "login" });
    savePin(p); loginError = "";
    try { config = { ...config, ...(await api("/api/config")) }; } catch { /* es fa servir l'adreça actual */ }
    if (d.salaFixa) { sala = d.salaFixa; storeSet("j25n-sala-fac", sala); }
    if (sala) await status(); else render();
    startPolling();
  } catch (e) { loginError = e.message || "No s'ha pogut entrar."; render(); }
}

async function createSala() {
  busy = true; render();
  try {
    const d = await api("/api/admin", { pin, action: "create" });
    sala = d.sala; storeSet("j25n-sala-fac", sala); confirm = null;
    await status();
  } catch (e) { flash(e.message); }
  finally { busy = false; render(); }
}

async function status() {
  if (!pin || !sala) return;
  try {
    const d = await api("/api/admin", { pin, sala, action: "status" });
    setServerNow(d.now);
    const stamp = `${d.estat.updatedAt}:${d.joined}:${d.votes}`;
    data = d;
    if (stamp !== lastStamp) { lastStamp = stamp; render(); }
    autoClose();
  } catch (e) {
    if (e.status === 404) { sala = ""; data = null; storeSet("j25n-sala-fac", ""); flash("La sala anterior ha caducat. Crea'n una de nova."); }
    else if (e.status === 401) { savePin(""); data = null; loginError = "Torna a introduir el PIN."; render(); }
  }
}

async function act(action, extra = {}) {
  if (busy) return;
  busy = true; confirm = null; render();
  try { data = await api("/api/admin", { pin, sala, action, ...extra }); setServerNow(data.now); lastStamp = ""; }
  catch (e) { flash(e.message || "No s'ha pogut fer l'acció."); }
  finally { busy = false; render(); }
}

function startPolling() { clearInterval(pollTimer); pollTimer = setInterval(status, POLL_MS); }

/* Tanca la votació sola quan s'acaba el temps */
function autoClose() {
  const e = data?.estat;
  if (!e || e.phase !== "votant" || !e.deadline || busy) return;
  if (serverNow() >= e.deadline) act("close");
}
setInterval(autoClose, 500);

/* ---------- Resum descarregable (CSV per a Excel) ---------- */
const TIMER_LABELS = { 0: "Sense límit", 30: "30 s", 60: "60 s", 90: "90 s" };
function csvCell(v) { const t = v == null ? "" : String(v); return /[";\r\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; }
function fmtTime(ms) { return ms ? new Date(ms).toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" }) : ""; }
function downloadSummary() {
  const e = data.estat;
  const rows = [];
  const entries = e.history.map(x => ({ ...x }));
  if (e.phase === "resultat" && e.winner) entries.push({ node: e.node, choice: e.winner, tally: e.tally, joined: data.joined, picked: !!e.tied, current: true });
  const maxJoined = Math.max(data.joined || 0, ...entries.map(x => x.joined || 0));
  const fi = STORY.endings[e.node];
  const durada = e.startedAt ? Math.round(((e.endedAt || serverNow()) - e.startedAt) / 60000) : "";
  rows.push(["Jornada 25N · El xat de l'equip"]);
  rows.push(["Sala", sala]);
  rows.push(["Data", new Date().toLocaleDateString("ca-ES")]);
  rows.push(["Hora d'inici", fmtTime(e.startedAt)]);
  rows.push(["Hora de final", fmtTime(e.endedAt)]);
  rows.push(["Durada (minuts)", durada]);
  rows.push(["Persones connectades (màxim)", maxJoined]);
  rows.push(["Temps per votar", TIMER_LABELS[e.timer] ?? ""]);
  rows.push(["Final de la història", e.phase === "final" && fi ? fi.title : "(no s'ha arribat al final)"]);
  rows.push([]);
  rows.push(["Cruïlla", "Escena", "Opció guanyadora", "Text de l'opció", "Vots A", "Vots B", "Vots C", "Total de vots", "Persones connectades", "Decidida per empat", "Impacte en l'Aina"]);
  let acc = 0;
  entries.forEach((x, i) => {
    const n = nodeOf(x.node), o = optOf(x.node, x.choice), t = x.tally || {};
    acc += o?.aina || 0;
    const total = (t.A || 0) + (t.B || 0) + (t.C || 0);
    rows.push([i + 1, n?.title + (x.current ? " (en curs)" : ""), x.choice, o?.label, t.A ?? "", t.B ?? "", t.C ?? "", x.tally ? total : "", x.joined ?? "", x.picked ? "Sí" : "No", o?.aina]);
  });
  rows.push([]);
  rows.push(["Impacte acumulat en l'Aina", acc]);
  rows.push(["Els vots són anònims: el resum no conté cap dada personal."]);
  const csv = "﻿" + rows.map(r => r.map(csvCell).join(";")).join("\r\n");
  const a = h("a", { href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), download: `resum-jornada-25n-${new Date().toISOString().slice(0, 10)}.csv` });
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------- Pantalla completa ---------- */
function setupFullscreen() {
  const b = $("fs");
  if (!b) return;
  if (!document.fullscreenEnabled) { b.hidden = true; return; }
  const label = () => { b.textContent = document.fullscreenElement ? "Sortir de pantalla completa" : "Pantalla completa"; };
  b.addEventListener("click", async () => {
    try { document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen(); }
    catch { flash("El navegador no ha permès la pantalla completa. Proveu la tecla F11."); }
  });
  document.addEventListener("fullscreenchange", label);
  label();
}

/* ---------- QR ---------- */
let qrCache = { url: "", el: null };
function qrEl(url) {
  if (qrCache.url === url && qrCache.el) return qrCache.el;
  const box = h("div", { class: "qr-code", role: "img", "aria-label": "Codi QR per entrar a la sala" });
  try { new window.QRCode(box, { text: url, width: 320, height: 320, colorDark: "#1e1530", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M }); }
  catch { box.append(h("p", { class: "note", style: "color:#5d4f72" }, "No s'ha pogut generar el QR. Feu servir el codi.")); }
  qrCache = { url, el: box };
  return box;
}

/* ---------- Pantalles ---------- */
function loginScreen() {
  const input = h("input", { id: "pin", class: "code-input", type: "password", inputmode: "numeric", autocomplete: "current-password", placeholder: "PIN", "aria-label": "PIN de facilitació" });
  setTimeout(() => input.focus(), 50);
  return [h("div", { class: "col lobby-solo" },
    h("p", { class: "eyebrow" }, "Facilitació"),
    h("h1", null, "Entra com a persona facilitadora"),
    h("form", { class: "code-form", onsubmit: (e) => { e.preventDefault(); login(input.value.trim()); } },
      input, h("button", { class: "btn join-btn", type: "submit" }, "Entrar")),
    loginError ? h("p", { class: "status err", role: "alert" }, loginError) : null,
    h("p", { class: "note" }, "El PIN es configura al servidor (variable FACILITATOR_PIN)."))];
}

function newSalaScreen() {
  return [h("div", { class: "col lobby-solo" },
    h("p", { class: "eyebrow" }, "Facilitació"),
    h("h1", null, "Crea la sala"),
    h("p", { class: "story" }, "Es generarà un codi de 4 xifres i un QR perquè les persones participants s'hi connectin des del mòbil."),
    h("button", { class: "btn join-btn", type: "button", onclick: createSala, disabled: busy }, busy ? "Creant…" : "Crear la sala"))];
}

function storageWarning() {
  const local = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (!data || data.storage !== "memory" || local) return null;
  return h("div", { class: "panel warn-panel", role: "alert" },
    h("b", null, "Falta connectar la base de dades."),
    h("p", { class: "note" }, "Sense Upstash Redis, els vots es poden perdre. Reviseu el pas 3 del README."));
}

function lobbyScreen() {
  const url = joinUrl();
  const n = data.joined;
  return [
    h("div", { class: "col" },
      h("div", { class: "lobby-qr" }, qrEl(url)),
      h("p", { class: "url-text" }, url.replace(/^https?:\/\//, "")),
      config.publicUrl && config.publicUrl !== location.origin
        ? h("p", { class: "note" }, "Estàs en una adreça diferent de la de producció. El QR apunta a la de producció.") : null),
    h("div", { class: "col" },
      h("p", { class: "eyebrow" }, "Activitat participativa"),
      h("h1", null, "Connecteu-vos per votar"),
      h("div", { class: "sala-code" }, h("span", { class: "tag" }, "Codi de la sala"), h("b", null, sala)),
      h("div", { class: "howto" },
        h("div", null, h("b", null, "1 · Escaneja el QR"), h("span", null, isFixed() ? "O entra a l'adreça de sota el QR." : "O entra a la web i escriu el codi.")),
        h("div", null, h("b", null, "2 · Prem «Em connecto»"), h("span", null, "Encara no veuràs la història.")),
        h("div", null, h("b", null, "3 · Espera"), h("span", null, "Quan comencem, el contingut apareixerà sol."))),
      h("div", { class: "count-box" },
        h("span", { class: "big-count" }, String(n)),
        h("span", { class: "count-lbl" }, n === 1 ? "persona connectada" : "persones connectades")),
      storageWarning())
  ];
}

function voteScreen() {
  const votes = () => h("p", { class: "status big-status" },
    h("strong", null, String(data.votes)), data.votes === 1 ? " vot rebut" : " vots rebuts",
    ` de ${data.joined} ${data.joined === 1 ? "persona connectada" : "persones connectades"}`);
  const top = h("div", { class: "vote-status" }, countdownEl(data.estat.deadline, data.estat.timer, { big: true }), votes());
  return nodeView(data.estat, { mine: null, canVote: false, status: votes(), countdown: top });
}

function resultScreen() {
  const e = data.estat;
  const keys = e.tied || STORY.nodes[e.node].options.map(o => o.key);
  const tie = h("div", { class: "btns" }, keys.map(k => h("button", { class: "btn ghost", type: "button", disabled: busy, onclick: () => act("pick", { choice: k }) }, "Continuar per " + k)));
  return resultView(e, { tieControls: tie });
}

function renderFacbar() {
  const bar = $("facbar"), btns = $("facbtns");
  bar.hidden = !(pin && sala && data);
  if (bar.hidden) return;
  btns.replaceChildren();
  const add = (label, fn, cls) => btns.append(h("button", { class: "btn " + (cls || ""), type: "button", onclick: fn, disabled: busy }, label));
  if (confirm) {
    btns.append(h("span", { class: "status", style: "align-self:center" }, confirm === "reset"
      ? "Reiniciar la sala? Es buiden els vots i les connexions: tots els mòbils hauran de tornar a prémer «Em connecto»."
      : "Crear una sala nova amb un codi diferent?"));
    add(confirm === "reset" ? "Sí, reiniciar la sala" : "Sí, crear-la", confirm === "reset" ? () => act("reset") : createSala, "warn");
    add("Cancel·lar", () => { confirm = null; render(); }, "ghost");
    return;
  }
  const e = data.estat;
  if (e.phase === "inici") {
    add("Començar la història", () => act("start"));
    if (!isFixed()) add("Sala nova", () => { confirm = "new"; render(); }, "ghost");
  }
  if (e.phase === "votant") add("Tancar votació i mostrar resultat", () => act("close"));
  if (e.phase === "resultat") {
    add("Reobrir votació", () => act("reopen"), "ghost");
    const o = optOf(e.node, e.winner);
    if (o) add(o.next === "END" || STORY.endings[o.next] ? "Veure el final" : "Continuar la història", () => act("advance"));
  }
  if (e.phase !== "inici") add("Descarregar resum", downloadSummary, "ghost");
  add("Reiniciar la sala", () => { confirm = "reset"; render(); }, "ghost");
  if (e.phase !== "votant") {
    const sel = h("select", { id: "timer", class: "timer-select", "aria-label": "Temps per votar", disabled: busy,
      onchange: (ev) => act("timer", { seconds: Number(ev.target.value) }) },
      [0, 30, 60, 90].map(v => h("option", { value: String(v), ...(v === (e.timer ?? 90) ? { selected: true } : {}) }, TIMER_LABELS[v])));
    btns.prepend(h("label", { class: "timer-field" }, h("span", null, "Temps per votar"), sel));
  }
}

function render() {
  let content;
  if (!pin) content = loginScreen();
  else if (!sala) content = newSalaScreen();
  else if (!data) content = [h("div", { class: "col lobby-solo" }, h("p", { class: "note" }, "Carregant la sala…"))];
  else if (data.estat.phase === "votant") content = voteScreen();
  else if (data.estat.phase === "resultat") content = resultScreen();
  else if (data.estat.phase === "final") content = finalView(data.estat);
  else content = lobbyScreen();
  if (msg) content.push(h("p", { class: "status err toast", role: "alert" }, msg));
  mount($("stage"), content, data?.estat);
  renderFacbar();
  const chip = $("conn");
  chip.className = "chip" + (data ? " live" : "");
  chip.textContent = data ? `Sala ${sala} · ${location.host}` : "Facilitació";
}

setupFullscreen();
render();
if (pin) login(pin);
