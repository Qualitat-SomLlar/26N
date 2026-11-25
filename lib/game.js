/* Lògica de la sala: estat, connexions, vots i transicions de facilitació */
import { STORY, nodeOf, optOf, endingFor } from "../public/story.js";
import { pipeline } from "./store.js";

export const TTL = 60 * 60 * 12; // les dades d'una sala s'esborren soles al cap de 12 hores

export const K = {
  estat: (c) => `j25n:sala:${c}:estat`,
  joined: (c, s) => `j25n:sala:${c}:joined:${s}`,
  vots: (c, r) => `j25n:sala:${c}:vots:${r}`
};

export const validCode = (c) => typeof c === "string" && /^\d{4}$/.test(c);
export const validPid = (p) => typeof p === "string" && /^[a-z0-9]{12,48}$/.test(p);
export const validUrl = (u) => typeof u === "string" && /^https:\/\/\S+$/.test(u) && u.length < 500;

export function newEstat(prev) {
  return {
    phase: "inici", node: STORY.start,
    round: (prev?.round || 0) + 1,
    history: [], tally: null, winner: null, tied: null,
    session: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    updatedAt: Date.now()
  };
}

export async function getEstat(code) {
  const [v] = await pipeline([["GET", K.estat(code)]]);
  return v ? JSON.parse(v) : null;
}

export async function putEstat(code, e) {
  e.updatedAt = Date.now();
  await pipeline([["SET", K.estat(code), JSON.stringify(e), "EX", TTL]]);
  return e;
}

export async function counts(code, e) {
  const [joined, votes] = await pipeline([["SCARD", K.joined(code, e.session)], ["HLEN", K.vots(code, e.round)]]);
  return { joined: Number(joined) || 0, votes: Number(votes) || 0 };
}

export async function createSala() {
  for (let i = 0; i < 20; i++) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const [exists] = await pipeline([["EXISTS", K.estat(code)]]);
    if (!Number(exists)) { await putEstat(code, newEstat()); return code; }
  }
  throw new Error("No s'ha pogut crear un codi de sala lliure");
}

export async function join(code, pid) {
  const e = await getEstat(code);
  if (!e) return { error: "sala", status: 404 };
  await pipeline([["SADD", K.joined(code, e.session), pid], ["EXPIRE", K.joined(code, e.session), TTL]]);
  return { ok: true, session: e.session };
}

export async function vote(code, pid, round, choice) {
  const e = await getEstat(code);
  if (!e) return { error: "sala", status: 404 };
  if (e.phase !== "votant" || e.round !== round) return { error: "tancada", status: 409 };
  if (!optOf(e.node, choice)) return { error: "opcio", status: 400 };
  await pipeline([
    ["HSET", K.vots(code, round), pid, choice], ["EXPIRE", K.vots(code, round), TTL],
    ["SADD", K.joined(code, e.session), pid], ["EXPIRE", K.joined(code, e.session), TTL]
  ]);
  return { ok: true };
}

async function tallyOf(code, e) {
  const n = nodeOf(e.node);
  const t = {}; n.options.forEach(o => t[o.key] = 0);
  const [flat] = await pipeline([["HGETALL", K.vots(code, e.round)]]);
  for (let i = 0; i < (flat || []).length; i += 2) if (t[flat[i + 1]] !== undefined) t[flat[i + 1]]++;
  return t;
}

const fresh = (o) => ({ tally: null, winner: null, tied: null, ...o });

/* Aplica una acció de facilitació i retorna el nou estat */
export async function act(code, e, action, body) {
  switch (action) {
    case "start":
      return putEstat(code, fresh({ ...e, phase: "votant", node: STORY.start, round: e.round + 1, history: [] }));
    case "close": {
      if (e.phase !== "votant") return e;
      const t = await tallyOf(code, e);
      const max = Math.max(0, ...Object.values(t));
      const top = Object.keys(t).filter(k => t[k] === max && max > 0);
      return putEstat(code, { ...e, phase: "resultat", tally: t,
        winner: top.length === 1 ? top[0] : null,
        tied: top.length > 1 ? top : (max === 0 ? Object.keys(t) : null) });
    }
    case "pick":
      if (e.phase !== "resultat" || !optOf(e.node, body.choice)) return e;
      return putEstat(code, { ...e, winner: body.choice });
    case "reopen":
      if (e.phase !== "resultat") return e;
      return putEstat(code, { ...e, phase: "votant", tally: null, winner: null, tied: null });
    case "advance": {
      const opt = e.phase === "resultat" && optOf(e.node, e.winner);
      if (!opt) return e;
      const history = [...e.history, { node: e.node, choice: opt.key }];
      let next = opt.next;
      if (next === "END") next = endingFor(history);
      const phase = STORY.endings[next] ? "final" : "votant";
      return putEstat(code, fresh({ ...e, phase, node: next, round: e.round + 1, history }));
    }
    case "reset":
      return putEstat(code, newEstat(e));
    default:
      return e;
  }
}
