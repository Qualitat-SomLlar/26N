/* GET /api/config — configuració pública: sala permanent, URL de producció i tipus d'emmagatzematge */
import { SALA_FIXA } from "../lib/game.js";
import { handle, send } from "../lib/http.js";
import { storage } from "../lib/store.js";

export function publicUrl() {
  const explicit = (process.env.PUBLIC_URL || "").trim().replace(/\/$/, "");
  if (/^https:\/\/\S+$/.test(explicit)) return explicit;
  const prod = (process.env.VERCEL_PROJECT_PRODUCTION_URL || "").trim();
  return prod ? `https://${prod}` : null;
}

export default handle(async (req, res) => {
  send(res, 200, { salaFixa: SALA_FIXA || null, publicUrl: publicUrl(), storage },
    { "Cache-Control": "public, max-age=0, s-maxage=60" });
});
