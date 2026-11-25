/* Il·lustracions SVG generades (viewBox 480×320) */
export const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const NAMES = { tu: "Tu", aina: "Aina", marc: "Marc", nuria: "Núria", silvia: "Xènia", altres: "" };
function P(x, y, role, o = {}) {
  const s = o.s || 1, d = o.d ?? 0;
  const label = o.label ?? NAMES[role];
  return `<g class="pop" style="--d:${d}s"><g class="pp r-${role} ${role}" transform="translate(${x} ${y}) scale(${s})">
    ${role === "tu" ? `<circle class="ring" cx="0" cy="-28" r="36"/>` : ""}
    <rect class="body" x="-19" y="-30" width="38" height="40" rx="17"/>
    <circle class="head" cx="0" cy="-45" r="13"/>
    ${label ? `<text class="sv-lbl" y="${o.ly ?? 28}" text-anchor="middle">${esc(label)}</text>` : ""}
  </g></g>`;
}
function B(x, y, lines, o = {}) {
  const d = o.d ?? 0, fs = 13, lh = 17;
  const w = Math.max(...lines.map(l => [...l].length)) * 6.7 + 22;
  const h = lines.length * lh + 12;
  const align = o.align || "left";
  const bx = align === "right" ? x - w + 16 : align === "center" ? x - w / 2 : x - 16;
  const by = y - h;
  const tail = o.think ? `<circle cx="${x}" cy="${y + 6}" r="3.5" class="tail"/><circle cx="${x - 4}" cy="${y + 14}" r="2.2" class="tail"/>`
    : `<path class="tail" d="M${x - 6} ${y - 1} L${x} ${y + 9} L${x + 6} ${y - 1}"/>`;
  return `<g class="pop" style="--d:${d}s"><g class="bub ${o.cls || ""} ${o.think ? "think" : ""}">
    <rect x="${bx}" y="${by}" width="${w}" height="${h}" rx="10"/>${tail}
    ${o.think ? "" : `<rect x="${x - 5}" y="${y - 3}" width="10" height="3" style="stroke:none"/>`}
    ${lines.map((l, i) => `<text class="sv-txt" x="${bx + 11}" y="${by + 19 + i * lh}" font-size="${fs}">${esc(l)}</text>`).join("")}
  </g></g>`;
}
function Phone(x, y, title, msgs, o = {}) {
  const w = 220, h = 300;
  let out = `<g class="pop" style="--d:${o.d ?? 0}s">
    <rect class="ph-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="26"/>
    <rect class="ph-screen" x="${x + 8}" y="${y + 10}" width="${w - 16}" height="${h - 20}" rx="19"/>
    <rect class="ph-head" x="${x + 8}" y="${y + 10}" width="${w - 16}" height="38" rx="19"/>
    <rect class="ph-head" x="${x + 8}" y="${y + 30}" width="${w - 16}" height="18"/>
    <circle cx="${x + 30}" cy="${y + 29}" r="10" class="${o.avatar ? "r-" + o.avatar : "r-altres"}" style="fill:var(--c)"/>
    <text class="sv-txt" x="${x + 48}" y="${y + 33}" font-weight="700">${esc(title)}</text></g>`;
  let cy = y + 62;
  msgs.forEach((m, i) => {
    const d = (o.d ?? 0) + 0.4 + i * (m.slow ? 0.9 : 0.55);
    const lines = m.lines || [];
    const tw = Math.max(40, ...lines.map(l => [...l].length * 6.2)) + 18;
    const imgH = m.img ? 74 : 0;
    const bw = m.img ? 150 : Math.min(tw, w - 50);
    const whoH = m.who ? 13 : 0;
    const bh = lines.length * 15 + 12 + imgH + whoH;
    const bx = m.mine ? x + w - 14 - bw : x + 16;
    out += `<g class="pop" style="--d:${d}s">
      <rect class="${m.mine ? "msg-m" : "msg-o"}" x="${bx}" y="${cy}" width="${bw}" height="${bh}" rx="11"/>
      ${m.who ? `<text class="msg-who r-${m.whoRole || "altres"}" style="fill:var(--c)" x="${bx + 9}" y="${cy + 13}">${esc(m.who)}</text>` : ""}
      ${m.img ? `<rect class="img-ph" x="${bx + 6}" y="${cy + 6 + whoH}" width="${bw - 12}" height="${imgH - 6}" rx="7"/>
        <circle class="img-ic" cx="${bx + bw - 34}" cy="${cy + 24 + whoH}" r="8"/>
        <path class="img-ic" d="M${bx + 14} ${cy + imgH + whoH - 4} l28 -26 l18 16 l14 -10 l26 20 z"/>
        <text class="sv-sm" x="${bx + 14}" y="${cy + 20 + whoH}">foto</text>` : ""}
      ${lines.map((l, k) => `<text class="${m.mine ? "msg-m-t" : "msg-t"}" x="${bx + 9}" y="${cy + whoH + imgH + 19 + k * 15}">${esc(l)}</text>`).join("")}
      ${m.react ? `<rect class="react" x="${bx + bw - 44}" y="${cy + bh - 6}" width="40" height="18" rx="9"/><text class="msg-t" x="${bx + bw - 38}" y="${cy + bh + 7}" font-size="11">${esc(m.react)}</text>` : ""}
    </g>`;
    cy += bh + (m.react ? 18 : 9);
  });
  if (o.typing) {
    const d = (o.d ?? 0) + 0.4 + msgs.length * 0.55;
    out += `<g class="pop" style="--d:${d}s"><rect class="msg-o" x="${x + 16}" y="${cy}" width="48" height="24" rx="12"/>
      <g class="typing"><circle cx="${x + 30}" cy="${cy + 12}" r="3"/><circle cx="${x + 40}" cy="${cy + 12}" r="3"/><circle cx="${x + 50}" cy="${cy + 12}" r="3"/></g></g>`;
  }
  return out;
}
const Table = (x, y, w, h = 16) => `<rect class="sv-furn" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
const Mug = (x, y) => `<rect class="sv-furn" x="${x}" y="${y - 14}" width="12" height="14" rx="2"/><path class="sv-line" d="M${x + 12} ${y - 11} q6 0 6 5 t-6 5"/>`;
const Steam = (x, y) => `<path class="steam drift" d="M${x} ${y} q-5 -8 0 -16 t0 -16"/>`;
const Ground = (y = 250) => `<rect class="sv-floor" x="0" y="${y}" width="480" height="${320 - y}"/>`;
const Wall = () => `<rect class="sv-bg" x="0" y="0" width="480" height="320"/>`;
const Window = (x, y) => `<rect class="sv-furn" x="${x}" y="${y}" width="90" height="64" rx="4"/><path class="sv-line" d="M${x + 45} ${y} v64 M${x} ${y + 32} h90"/>`;
const Door = (x, y) => `<rect class="sv-furn" x="${x}" y="${y}" width="56" height="${250 - y}" rx="3"/><circle cx="${x + 46}" cy="${y + (250 - y) / 2}" r="3" class="sv-furn2"/>`;
const svgWrap = (inner, label) => `<svg viewBox="0 0 480 320" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const SCENES = {
  intro: () => svgWrap(Wall() + Phone(30, 10, "Equip 🏠", [
      { who: "Laura", lines: ["Bon dia! Qui té les", "claus del pis 3?"] },
      { mine: true, lines: ["Jo! Les porto ara"] },
      { who: "Pau", lines: ["Gràcies 🙌"] }
    ], { typing: true }) +
    B(330, 90, ["Què faries tu?"], { d: 2.4, align: "center", cls: "hot" }) +
    P(330, 200, "tu", { d: 2, s: 1.3, label: "Tu" }),
    "Un mòbil amb el xat de l'equip i una figura que es pregunta què faria"),
  benvinguda: () => svgWrap(Wall() + Window(360, 30) + Ground(250) +
    P(80, 215, "altres", { ly: 46,  d: 0.1 }) + P(160, 215, "marc", { ly: 46,  d: 0.2 }) + P(240, 215, "aina", { ly: 46,  d: 0.3 }) +
    P(320, 215, "tu", { ly: 46,  d: 0.4 }) + P(400, 215, "altres", { ly: 46,  d: 0.5 }) +
    Table(40, 222, 400, 18) + Mug(150, 222) + Mug(232, 222) + Mug(312, 222) + Mug(392, 222) + Steam(238, 205) +
    B(160, 148, ["«Amb tu l'equip guanya", "en bellesa, eh?»"], { d: 1, cls: "hot" }) +
    B(80, 108, ["ha ha"], { d: 1.8, cls: "soft" }) + B(400, 126, ["ha ha"], { d: 2, cls: "soft", align: "right" }) +
    B(258, 162, ["…"], { d: 2.6, think: true, cls: "soft" }),
    "Pausa del cafè: en Marc fa un comentari sobre el físic de l'Aina davant de l'equip"),
  xat: () => svgWrap(Wall() + Phone(130, 10, "Equip (informal)", [
      { who: "Laura", lines: ["Algú ve dissabte al", "sopar? 🍕"] },
      { who: "Marc", whoRole: "marc", img: true, lines: ["Ara entenc per què", "la van contractar 🔥"], react: "😂 2", slow: true }
    ], { typing: true }) + P(60, 290, "tu", { d: 2.8, s: 0.9 }) + B(60, 225, ["?"], { d: 3.2, think: true, align: "center" }),
    "Xat de l'equip: en Marc comparteix una foto de l'Aina amb un comentari sexual i dues persones hi reaccionen amb rialles"),
  nuria: (has) => svgWrap(Wall() + Phone(130, 10, "Núria", has("xat:B")
      ? [{ lines: ["Molt bé el que vas dir,", "eh."] }, { lines: ["Però potser no calia", "fer-ho al grup…", "Ara hi ha mal rotllo 😬"], slow: true }]
      : [{ lines: ["Has vist el que va", "penjar en Marc?"] }, { lines: ["Quin mal gust…", "Però bé, ja el coneixem.", "No ho fa amb mala", "intenció 🤷"], slow: true }],
    { avatar: "nuria", typing: true }) + P(400, 250, "nuria", { d: 0.2 }) + P(70, 250, "tu", { d: 0.4 }),
    "Missatge privat de la Núria sobre el que ha passat al xat"),
  cuina: () => svgWrap(Wall() + Ground(250) +
    `<rect class="sv-furn" x="20" y="180" width="140" height="70" rx="4"/><rect class="sv-furn" x="40" y="140" width="44" height="40" rx="6"/>` + Steam(62, 132) + Steam(72, 128) +
    P(250, 250, "aina", { d: 0.2, s: 1.15 }) + P(360, 250, "tu", { d: 0.4, s: 1.15 }) +
    B(250, 150, ["«Tu en saps", "alguna cosa?»"], { d: 1, cls: "hot" }),
    "A la cuina, l'Aina pregunta si saps què està passant"),
  aina: () => svgWrap(Wall() + Window(195, 30) + Ground(250) +
    `<rect class="sv-furn" x="110" y="215" width="70" height="12" rx="4"/><rect class="sv-furn" x="300" y="215" width="70" height="12" rx="4"/>` +
    P(145, 215, "aina", { ly: 34,  d: 0.2, s: 1.1 }) + P(335, 215, "tu", { ly: 34,  d: 0.4, s: 1.1 }) +
    B(145, 130, ["No vull muntar", "un drama…"], { d: 1, think: true }) + B(170, 92, ["…però tampoc vull que", "això continuï"], { d: 1.8, think: true, cls: "soft" }),
    "L'Aina i tu parlant: ella dubta sobre què fer"),
  coord: () => svgWrap(Wall() + Door(400, 120) + Ground(250) +
    P(130, 205, "silvia", { ly: 44,  d: 0.1, s: 1.05 }) + Table(40, 210, 190, 20) +
    `<rect class="sv-furn" x="60" y="196" width="34" height="14" rx="2"/>` +
    P(280, 250, "aina", { d: 0.3 }) + P(350, 250, "tu", { d: 0.4 }) +
    B(130, 120, ["«Hi parlo jo,", "discretament, i ho", "deixem aquí, oi?»"], { d: 1, cls: "hot" }),
    "Despatx de coordinació: la coordinadora proposa resoldre-ho de manera discreta"),
  rumor: () => svgWrap(Wall() + Ground(250) + `<path class="sv-line" d="M0 250 L480 250 M60 0 v250 M420 0 v250"/>` +
    P(170, 250, "marc", { d: 0.2, s: 1.1 }) + P(300, 250, "aina", { d: 0.4, s: 1.1 }) +
    B(170, 150, ["«…vas anar a plorar", "a la Xènia…»"], { d: 1, cls: "hot" }) +
    `<g class="pop" style="--d:2s"><circle class="isol pulse" cx="300" cy="222" r="56"/></g>`,
    "Al passadís, en Marc fa un comentari en veu baixa a l'Aina i després l'aïlla"),
  represalies: () => svgWrap(Wall() + Window(40, 24) + Ground(250) +
    P(70, 215, "altres", { ly: 46,  d: 0.1 }) + P(140, 215, "marc", { ly: 46,  d: 0.15 }) + P(210, 215, "altres", { ly: 46,  d: 0.2 }) +
    P(280, 215, "nuria", { ly: 46,  d: 0.25 }) + P(350, 215, "altres", { ly: 46,  d: 0.3 }) + P(420, 215, "tu", { ly: 46,  d: 0.35 }) +
    Table(30, 222, 420, 18) +
    B(140, 150, ["«Hi ha qui s'ho mira", "tot amb lupa.»"], { d: 1, cls: "hot" }) +
    B(210, 110, ["ha ha"], { d: 1.7, cls: "soft" }) + B(350, 120, ["ha ha"], { d: 1.9, cls: "soft" }) +
    `<g class="pop" style="--d:2.3s"><circle class="isol" cx="420" cy="190" r="44"/></g>`,
    "Reunió d'equip: en Marc fa un comentari contra la persona que acompanya l'Aina i algunes persones riuen"),
  entrevista: () => svgWrap(Wall() + Ground(250) +
    P(90, 205, "altres", { ly: 44,  d: 0.1, label: "Comissió" }) + P(160, 205, "altres", { ly: 44,  d: 0.15, label: "" }) + P(230, 205, "altres", { ly: 44,  d: 0.2, label: "" }) +
    Table(50, 212, 380, 18) + `<rect class="sv-furn" x="120" y="200" width="30" height="12" rx="2"/>` +
    P(320, 290, "aina", { d: 0.4, s: 0.95 }) + P(395, 290, "tu", { d: 0.5, s: 0.95 }) +
    B(160, 128, ["«I per què tens aquestes", "fotos en obert?»"], { d: 1.1, cls: "hot" }),
    "Entrevista amb la comissió del protocol: una pregunta posa el focus en l'Aina"),
  tornada: () => svgWrap(Wall() + Ground(250) +
    [0, 1, 2, 3, 4, 5, 6].map(i => {
      const a = Math.PI * (0.15 + i * 0.7 / 6), cx = 240 - Math.cos(a) * 190, cy = 250 - Math.sin(a) * 50;
      const roles = ["altres", "nuria", "aina", "altres", "silvia", "altres", "tu"];
      return P(cx, cy + 10, roles[i], { d: 0.1 * i, s: 0.9 });
    }).join("") +
    B(120, 108, ["«Ara ja no es podrà", "fer cap broma.»"], { d: 1.2, cls: "hot" }),
    "Reunió d'equip després de la resolució: algú diu que ara ja no es podran fer bromes"),
  fi_bo: () => svgWrap(Wall() + Ground(250) +
    [80, 160, 240, 320, 400].map((x, i) => P(x, 240, ["nuria", "tu", "aina", "silvia", "altres"][i], { d: 0.15 * i })).join("") +
    `<g class="pop" style="--d:1s"><path class="link" d="M80 200 Q160 160 240 200 Q320 160 400 200"/></g>` +
    `<g class="pop" style="--d:1.4s"><path class="heart pulse" d="M240 120 c-10 -14 -30 -4 -20 12 l20 18 l20 -18 c10 -16 -10 -26 -20 -12z"/></g>` +
    B(240, 96, ["«Això no.»"], { d: 2, align: "center" }),
    "L'equip unit al voltant de l'Aina"),
  fi_mig: () => svgWrap(Wall() + Ground(250) +
    P(120, 240, "altres", { d: 0.1 }) + P(190, 240, "altres", { d: 0.2 }) + P(330, 240, "aina", { d: 0.4, s: 1.1 }) +
    B(330, 140, ["Havia de demostrar", "que no exagerava"], { d: 1, think: true }),
    "L'Aina, una mica apartada, pensant en el procés"),
  fi_sola: () => svgWrap(Wall() + Ground(250) + Door(390, 110) +
    P(70, 240, "altres", { d: 0.1 }) + P(130, 240, "altres", { d: 0.15 }) + P(190, 240, "altres", { d: 0.2 }) +
    P(340, 240, "aina", { d: 0.6, s: 1.05 }) +
    `<g class="pop" style="--d:1.2s"><circle class="isol" cx="340" cy="212" r="52"/></g>`,
    "L'Aina sola, al costat de la porta, separada de la resta de l'equip")
};
