/* GET /api/state?sala=1234 — estat públic de la sala (el consulten els mòbils cada 2 s) */
import { getEstat, validCode } from "../lib/game.js";
import { handle, query, send } from "../lib/http.js";

export default handle(async (req, res) => {
  const { sala } = query(req);
  if (!validCode(sala)) return send(res, 400, { error: "codi", message: "El codi de sala ha de tenir 4 xifres." });
  const e = await getEstat(sala);
  if (!e) return send(res, 404, { error: "sala", message: "No hi ha cap sala amb aquest codi." });
  // Memòria cau d'1 s a la CDN: molts mòbils, poques lectures a la base de dades
  send(res, 200, { estat: e, now: Date.now() }, { "Cache-Control": "public, max-age=0, s-maxage=1, stale-while-revalidate=1" });
});
