/* POST /api/admin {pin, action, sala?, choice?} — accions de la persona facilitadora
   action: login | create | status | start | close | pick | reopen | advance | reset */
import { act, counts, createSala, getEstat, validCode } from "../lib/game.js";
import { checkPin, handle, readJson, send } from "../lib/http.js";
import { storage } from "../lib/store.js";

export default handle(async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "metode" });
  const noStore = { "Cache-Control": "no-store" };
  if (!process.env.FACILITATOR_PIN) {
    return send(res, 500, { error: "config", message: "Falta configurar la variable FACILITATOR_PIN al servidor." }, noStore);
  }
  const body = await readJson(req);
  if (!checkPin(body.pin)) return send(res, 401, { error: "pin", message: "El PIN no és correcte." }, noStore);

  const { action } = body;
  if (action === "login") return send(res, 200, { ok: true, storage }, noStore);
  if (action === "create") {
    const sala = await createSala();
    return send(res, 200, { sala }, noStore);
  }
  if (!validCode(body.sala)) return send(res, 400, { error: "codi", message: "Falta el codi de sala." }, noStore);
  let e = await getEstat(body.sala);
  if (!e) return send(res, 404, { error: "sala", message: "La sala ha caducat o no existeix. Crea'n una de nova." }, noStore);
  if (action !== "status") e = await act(body.sala, e, action, body);
  const c = await counts(body.sala, e);
  send(res, 200, { estat: e, ...c, storage }, noStore);
});
