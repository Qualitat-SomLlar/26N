/* POST /api/join {sala, pid} — una persona es connecta a la sala d'espera */
import { join, validCode, validPid } from "../lib/game.js";
import { handle, readJson, send } from "../lib/http.js";

export default handle(async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "metode" });
  const { sala, pid } = await readJson(req);
  if (!validCode(sala) || !validPid(pid)) return send(res, 400, { error: "dades", message: "Dades no vàlides." });
  const r = await join(sala, pid);
  if (r.error) return send(res, r.status, { error: r.error, message: "No hi ha cap sala amb aquest codi." });
  send(res, 200, r, { "Cache-Control": "no-store" });
});
