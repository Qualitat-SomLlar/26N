/* Peces de la interfície compartides per la pantalla de participant i la de facilitació */
import { STORY, nodeOf, optOf } from "./story.js";
import { SCENES } from "./scenes.js";

export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "value") el.value = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export const $ = (id) => document.getElementById(id);

export function hasFn(history) {
  return (cond) => {
    const neg = cond.startsWith("!");
    const [n, k] = cond.replace("!", "").split(":");
    const r = history.some(x => x.node === n && x.choice === k);
    return neg ? !r : r;
  };
}

export function sceneEl(key, history) {
  const fn = SCENES[key];
  if (!fn) return null;
  const fig = h("figure", { class: "scene", style: "margin:0" });
  fig.innerHTML = fn(hasFn(history)); // SVG generat per la mateixa pàgina, sense dades externes
  return fig;
}

export function storyBlock(n, history) {
  const has = hasFn(history);
  return h("div", { class: "story" }, n.text.filter(p => typeof p === "string" || !p.if || has(p.if)).map(p =>
    typeof p === "string" ? h("p", null, p) : p.quote ? h("p", { class: "quote" }, p.quote) : h("p", { class: "aside" }, p.aside)));
}

export const stepLabel = (estat) => h("p", { class: "step" }, `Cruïlla ${estat.history.length + 1}`);
export const tagsEl = (tags) => h("div", { class: "types" }, tags.map(x => h("span", null, x)));

export function impactEl(v) {
  const txt = v >= 2 ? "Molt positiu" : v === 1 ? "Positiu" : v === 0 ? "Neutre o ambivalent" : v === -1 ? "Negatiu" : "Molt negatiu";
  const dots = [-2, -1, 0, 1, 2].map(i => {
    const on = (v < 0 && i < 0 && i >= v) || (v > 0 && i > 0 && i <= v);
    return h("i", { class: (i === 0 ? "mid " : "") + (on ? "on " + (v > 0 ? "pos" : "neg") : "") });
  });
  return h("div", { class: "impact" }, h("div", { class: "dots", "aria-hidden": "true" }, dots), h("span", { class: "txt" }, txt));
}

/* Cruïlla oberta a votació */
export function nodeView(estat, { mine, canVote, onVote, status }) {
  const n = nodeOf(estat.node);
  return [
    sceneEl(n.scene, estat.history),
    h("div", { class: "col" },
      stepLabel(estat), h("h2", null, n.title), storyBlock(n, estat.history),
      h("p", { class: "question" }, n.question),
      h("div", { class: "options", role: "group", "aria-label": n.question },
        n.options.map(o => h("button", {
          class: "opt" + (mine === o.key ? " mine" : ""), id: "opt-" + o.key, type: "button",
          disabled: !canVote, "aria-pressed": mine === o.key ? "true" : "false", onclick: () => onVote && onVote(o.key)
        }, h("span", { class: "key" }, o.key), h("span", { class: "label" }, o.label)))),
      status)
  ];
}

/* Resultat d'una votació */
export function resultView(estat, { tieControls } = {}) {
  const n = nodeOf(estat.node);
  const t = estat.tally || {};
  const total = Object.values(t).reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...Object.values(t));
  const win = optOf(estat.node, estat.winner);
  const col = h("div", { class: "col" },
    stepLabel(estat), h("h2", null, n.title),
    h("p", { class: "question" }, n.question),
    h("div", { class: "options" }, n.options.map(o => {
      const c = t[o.key] || 0, pct = total ? Math.round(c * 100 / total) : 0;
      return h("button", { class: "opt" + (estat.winner === o.key ? " winner" : ""), type: "button", disabled: true },
        h("span", { class: "bar", style: `width:${(c / max) * 100}%` }),
        h("span", { class: "key" }, o.key), h("span", { class: "label" }, o.label),
        h("span", { class: "count" }, `${c} ${c === 1 ? "vot" : "vots"} · ${pct}%`));
    })));
  if (!win) {
    col.append(h("div", { class: "panel" },
      h("span", { class: "tag" }, total ? "Empat" : "Cap vot"),
      h("p", null, total ? "Hi ha empat. Comenteu-ho a la sala: la persona facilitadora triarà per on continua." : "No hi ha cap vot. La persona facilitadora pot reobrir la votació o triar una opció."),
      tieControls || null));
  } else {
    col.append(
      h("div", { class: "panel conseq" }, h("span", { class: "tag" }, "Què passa ara"), h("p", null, win.conseq)),
      h("div", { class: "panel" }, h("span", { class: "tag" }, "Impacte en l'Aina"), impactEl(win.aina)),
      h("div", { class: "panel learn" }, h("span", { class: "tag" }, "Per reflexionar"), h("p", null, win.learn), tagsEl(n.tags)));
  }
  return [sceneEl(n.scene, estat.history), col];
}

export function chartEl(history) {
  if (!history.length) return null;
  let acc = 0;
  const pts = [0, ...history.map(s => (acc += optOf(s.node, s.choice)?.aina || 0))];
  const W = 460, H = 180, L = 30, R = 20, T = 20, Bm = 30;
  const lo = Math.min(-4, ...pts), hi = Math.max(4, ...pts);
  const x = i => L + i * (W - L - R) / (pts.length - 1 || 1);
  const y = v => T + (hi - v) * (H - T - Bm) / (hi - lo);
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;
  const last = pts[pts.length - 1];
  const wrap = h("div", { class: "chart" });
  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolució de com ha viscut l'Aina el camí, de 0 a ${last}">
    <line class="ch-zero" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>
    <text class="sv-sm" x="${L}" y="${y(0) - 6}">punt de partida</text>
    <path class="ch-area" d="${area}"/><path class="ch-line" d="${line}"/>
    ${pts.map((v, i) => `<circle class="ch-dot ${i === pts.length - 1 ? "end" : ""}" cx="${x(i)}" cy="${y(v)}" r="${i === pts.length - 1 ? 6 : 4}"/>
      ${i ? `<text class="sv-sm" text-anchor="middle" x="${x(i)}" y="${H - 8}">${i}</text>` : ""}`).join("")}
    <text class="sv-lbl" text-anchor="end" x="${x(pts.length - 1) - 10}" y="${y(last) + (last >= 0 ? -10 : 18)}">${last > 0 ? "+" : ""}${last}</text>
  </svg>`;
  return wrap;
}

/* Final de la història */
export function finalView(estat) {
  const f = STORY.endings[estat.node];
  return [
    sceneEl(f.scene, estat.history),
    h("div", { class: "col" },
      h("p", { class: "eyebrow" }, f.tone),
      h("h1", null, f.title),
      h("div", { class: "story" }, h("p", null, f.text)),
      h("div", { class: "panel" },
        h("span", { class: "tag" }, "Com ha viscut l'Aina el camí"),
        chartEl(estat.history),
        h("p", { class: "note" }, "Cada punt és una cruïlla. La línia suma l'impacte de cada decisió en l'Aina.")),
      h("div", { class: "panel" },
        h("span", { class: "tag" }, "Les decisions que hem pres"),
        h("ol", { class: "path" }, estat.history.map((s, i) => {
          const n = nodeOf(s.node), o = optOf(s.node, s.choice);
          if (!n || !o) return null;
          return h("li", null, h("b", null, String(i + 1)), h("span", null, `${n.title}: ${o.label}`),
            h("span", { class: "d " + (o.aina > 0 ? "pos" : o.aina < 0 ? "neg" : "") }, (o.aina > 0 ? "+" : "") + o.aina));
        }))),
      h("div", { class: "panel learn" },
        h("span", { class: "tag" }, "Quines violències hi han aparegut?"),
        tagsEl(STORY.types),
        h("p", { class: "note" }, "Marc de referència: Llei 5/2008, del dret de les dones a erradicar la violència masclista, modificada per la Llei 17/2020.")),
      h("h2", null, "Quines situacions hem normalitzat i què podem fer, des del nostre lloc, per deixar de normalitzar-les?"),
      h("div", { class: "resources" },
        h("div", { class: "res v" }, h("b", null, "900 900 120"), h("span", null, "Atenció a les violències masclistes · 24 h, gratuït")),
        h("div", { class: "res m" }, h("b", null, "112"), h("span", null, "Emergències · perill immediat"))))
  ];
}

/* Substitueix el contingut de l'escenari conservant la il·lustració si l'escena no ha canviat */
let lastSceneKey = "";
export function mount(stage, content, estat) {
  content = content.flat().filter(Boolean);
  const key = estat ? `${estat.phase}:${estat.node}:${estat.history.length}` : "none";
  const old = stage.querySelector(".scene");
  if (old && key === lastSceneKey && content[0]?.classList?.contains("scene")) content[0] = old;
  lastSceneKey = key;
  stage.replaceChildren(...content);
}

export function storeGet(k, fallback) { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } }
export function storeSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sense emmagatzematge */ } }

export async function api(path, body) {
  const r = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" });
  let data = {};
  try { data = await r.json(); } catch { /* resposta buida */ }
  if (!r.ok) { const e = new Error(data.message || "Error de connexió"); e.status = r.status; e.code = data.error; throw e; }
  return data;
}
