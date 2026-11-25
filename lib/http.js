/* Utilitats HTTP compatibles amb Vercel (Node) i amb el servidor local */
import { createHash, timingSafeEqual } from "node:crypto";

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > 10_000) break; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
}

export function query(req) {
  if (req.query) return req.query;
  return Object.fromEntries(new URL(req.url, "http://localhost").searchParams);
}

export function send(res, status, obj, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(obj));
}

export function checkPin(pin) {
  const expected = process.env.FACILITATOR_PIN || "";
  if (!expected || typeof pin !== "string") return false;
  const a = createHash("sha256").update(pin).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function handle(fn) {
  return async (req, res) => {
    try { await fn(req, res); }
    catch (e) { console.error(e); send(res, 500, { error: "servidor", message: "Hi ha hagut un error al servidor. Torna-ho a provar." }); }
  };
}
