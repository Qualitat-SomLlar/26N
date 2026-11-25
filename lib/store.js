/* Emmagatzematge: Upstash Redis (API REST) si hi ha variables d'entorn;
   si no, memòria del procés (només per a proves locals). */
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

export const storage = REDIS_URL && REDIS_TOKEN ? "redis" : "memory";

async function redisPipeline(cmds) {
  const r = await fetch(REDIS_URL.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds.map(c => c.map(String)))
  });
  if (!r.ok) throw new Error("Redis ha respost " + r.status);
  const out = await r.json();
  return out.map(x => { if (x.error) throw new Error(x.error); return x.result; });
}

/* Subconjunt mínim de Redis en memòria */
const mem = globalThis.__j25nMem || (globalThis.__j25nMem = new Map());
function memExec([cmd, key, ...args]) {
  const C = String(cmd).toUpperCase();
  const cur = mem.get(key);
  switch (C) {
    case "GET": return typeof cur === "string" ? cur : null;
    case "SET": mem.set(key, String(args[0])); return "OK";
    case "EXISTS": return mem.has(key) ? 1 : 0;
    case "EXPIRE": return mem.has(key) ? 1 : 0;
    case "DEL": return mem.delete(key) ? 1 : 0;
    case "SADD": { const s = cur instanceof Set ? cur : new Set(); let n = 0; for (const a of args) if (!s.has(String(a))) { s.add(String(a)); n++; } mem.set(key, s); return n; }
    case "SCARD": return cur instanceof Set ? cur.size : 0;
    case "SISMEMBER": return cur instanceof Set && cur.has(String(args[0])) ? 1 : 0;
    case "HSET": { const m = cur instanceof Map ? cur : new Map(); let n = 0; for (let i = 0; i < args.length; i += 2) { if (!m.has(String(args[i]))) n++; m.set(String(args[i]), String(args[i + 1])); } mem.set(key, m); return n; }
    case "HLEN": return cur instanceof Map ? cur.size : 0;
    case "HGET": return cur instanceof Map ? (cur.get(String(args[0])) ?? null) : null;
    case "HGETALL": return cur instanceof Map ? [...cur.entries()].flat() : [];
    default: throw new Error("Ordre no suportada en memòria: " + C);
  }
}

export async function pipeline(cmds) {
  return storage === "redis" ? redisPipeline(cmds) : cmds.map(memExec);
}
