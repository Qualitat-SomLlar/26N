/* Pantalla de participant (mòbil): entrar amb codi o QR, connectar-se i votar */
import { h, $, nodeView, resultView, finalView, mount, storeGet, storeSet, api, countdownEl, setServerNow } from "./ui.js";

const POLL_MS = 2000;
const newPid = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("")).toLowerCase();
let pid = storeGet("j25n-pid", null);
if (typeof pid !== "string" || !/^[a-z0-9]{12,48}$/.test(pid)) { pid = newPid(); storeSet("j25n-pid", pid); }

const salaParam = (new URLSearchParams(location.search).get("sala") || "").trim();
let sala = (salaParam || storeGet("j25n-sala", "") || "").trim();
let config = { salaFixa: null, storage: null };
let estat = null;
let codeError = "";
let msg = "";
let offline = false;
let joining = false;
let lastKey = "";
let pollTimer = null;
let lastUpdated = 0;

const votesKey = () => `j25n-vots-${sala}`;
const myVotes = () => storeGet(votesKey(), {});
const joinedKey = () => `j25n-joined-${sala}-${estat?.session}`;
const amJoined = () => !!storeGet(joinedKey(), false);

function flash(m) { msg = m; render(); setTimeout(() => { if (msg === m) { msg = ""; render(); } }, 5000); }

async function enterCode(code) {
  code = String(code || "").replace(/\D/g, "");
  if (code.length !== 4) { codeError = "El codi té 4 xifres."; render(); return; }
  try {
    const d = await api(`/api/state?sala=${code}`);
    sala = code; estat = d.estat; codeError = "";
    storeSet("j25n-sala", sala);
    history.replaceState(null, "", `?sala=${sala}`);
    render(); startPolling();
  } catch (e) {
    codeError = e.status === 404 ? "No hi ha cap sala amb aquest codi. Revisa'l a la pantalla." : "No s'ha pogut connectar. Torna-ho a provar.";
    render();
  }
}

function leave() {
  stopPolling(); sala = ""; estat = null; storeSet("j25n-sala", "");
  history.replaceState(null, "", location.pathname); render();
}

async function poll() {
  if (!sala) return;
  try {
    const d = await api(`/api/state?sala=${sala}`);
    setServerNow(d.now);
    offline = false;
    if (d.estat.updatedAt !== lastUpdated || !estat) { estat = d.estat; lastUpdated = d.estat.updatedAt; render(); }
    else updateChip();
  } catch (e) {
    if (e.status === 404) { codeError = "La sala s'ha tancat o ha caducat. Introdueix el codi nou."; leave(); return; }
    offline = true; updateChip();
  }
}
function startPolling() { stopPolling(); poll(); pollTimer = setInterval(poll, POLL_MS); }
function stopPolling() { clearInterval(pollTimer); pollTimer = null; }
document.addEventListener("visibilitychange", () => { if (!document.hidden && sala) poll(); });

async function join() {
  if (joining) return;
  joining = true; render();
  try { await api("/api/join", { sala, pid }); storeSet(joinedKey(), true); }
  catch (e) { flash(e.message || "No s'ha pogut fer la connexió. Torna-ho a provar."); }
  finally { joining = false; render(); }
}

async function vote(choice) {
  if (!estat || estat.phase !== "votant") return;
  const round = estat.round;
  const prev = myVotes();
  storeSet(votesKey(), { ...prev, [round]: choice });
  render();
  try { await api("/api/vote", { sala, pid, round, choice }); }
  catch (e) {
    storeSet(votesKey(), prev);
    flash(e.code === "tancada" || e.code === "temps" ? e.message : (e.message || "No s'ha pogut enviar el vot."));
    poll();
  }
}

/* ---------- Pantalles ---------- */
function codeScreen() {
  const input = h("input", { id: "code", class: "code-input", type: "text", inputmode: "numeric", autocomplete: "off", maxlength: "4", placeholder: "0000", "aria-label": "Codi de la sala" });
  const form = h("form", { class: "code-form", onsubmit: (e) => { e.preventDefault(); enterCode(input.value); } },
    input, h("button", { class: "btn join-btn", type: "submit" }, "Entrar"));
  setTimeout(() => input.focus(), 50);
  return [h("div", { class: "col lobby-solo" },
    h("p", { class: "eyebrow" }, "Jornada 25N"),
    h("h1", null, "Entra a la sala"),
    h("p", { class: "story" }, "Escriu el codi de 4 xifres que veus a la pantalla, o escaneja el QR."),
    form,
    codeError ? h("p", { class: "status err", role: "alert" }, codeError) : null,
    h("p", { class: "note" }, "No cal cap compte ni cap dada personal. Els vots són anònims."))];
}

function lobbyScreen() {
  const block = amJoined()
    ? h("div", { class: "panel joined" },
        h("span", { class: "check", "aria-hidden": "true" }, "✓"),
        h("div", null, h("b", null, "Ja estàs a dins."), h("p", { class: "note" }, "Quan comenci l'activitat, la veuràs aquí. No cal que recarreguis la pàgina.")))
    : h("button", { class: "btn join-btn", id: "join", type: "button", onclick: join, disabled: joining }, joining ? "Connectant…" : "Em connecto");
  return [h("div", { class: "col lobby-solo" },
    h("p", { class: "eyebrow" }, "Activitat participativa"),
    h("h1", null, "Connecta't per votar"),
    h("p", { class: "story" }, "D'aquí a una estona decidirem entre totes les persones de la sala com continua una història. Cada persona vota des del seu dispositiu i l'opció més votada decideix."),
    block,
    dbWarning(),
    h("p", { class: "note" }, "Els vots són anònims i no es mostren noms."))];
}

function dbWarning() {
  const local = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (config.storage !== "memory" || local) return null;
  return h("div", { class: "panel warn-panel", role: "alert" },
    h("b", null, "La web no té la base de dades connectada."),
    h("p", { class: "note" }, "És possible que no vegis el mateix que la pantalla. Avisa la persona facilitadora."));
}

function voteScreen() {
  const mine = myVotes()[estat.round] || null;
  const status = h("div", { class: "vote-status" },
    countdownEl(estat.deadline, estat.timer),
    h("p", { class: "status" }, mine ? `El teu vot: ${mine}. Pots canviar-lo fins que es tanqui la votació.` : "Toca una opció per votar."));
  return nodeView(estat, { mine, canVote: true, onVote: vote, status, countdown: countdownEl(estat.deadline, estat.timer) });
}

function updateChip() {
  const chip = $("conn");
  if (!chip) return;
  chip.className = "chip" + (sala && !offline ? " live" : "");
  chip.textContent = !sala ? "Sense sala" : offline ? "Sense connexió · reintentant…" : `Sala ${sala}`;
  $("leave").hidden = !sala || sala === config.salaFixa;
}

function render() {
  const stage = $("stage");
  let content;
  if (sala && !estat && !codeError) content = [h("div", { class: "col lobby-solo" }, h("p", { class: "note" }, "Connectant amb la sala…"))];
  else if (!sala || !estat) content = codeScreen();
  else if (estat.phase === "votant") content = voteScreen();
  else if (estat.phase === "resultat") content = resultView(estat);
  else if (estat.phase === "final") content = finalView(estat);
  else content = lobbyScreen();
  if (msg) content.push(h("p", { class: "status err toast", role: "alert" }, msg));
  mount(stage, content, estat);
  const key = estat ? `${estat.phase}:${estat.node}` : "code";
  if (key !== lastKey) { window.scrollTo(0, 0); lastKey = key; }
  updateChip();
}

$("leave").addEventListener("click", () => { codeError = ""; leave(); });
render();
(async () => {
  try { config = { ...config, ...(await api("/api/config")) }; } catch { /* sense configuració: s'entra amb codi */ }
  if (!salaParam && config.salaFixa) sala = config.salaFixa;
  if (sala) enterCode(sala); else render();
})();
