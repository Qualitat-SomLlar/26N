/* Servidor de proves local: serveix public/ i les funcions d'api/ amb dades en memòria.
   Ús:  npm run dev   (PIN de proves: 2526, o el que definiu a FACILITATOR_PIN) */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

process.env.FACILITATOR_PIN ||= "2526";
const root = fileURLToPath(new URL("./public/", import.meta.url));
const port = Number(process.env.PORT) || 3000;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const routes = {
  "/api/config": (await import("./api/config.js")).default,
  "/api/state": (await import("./api/state.js")).default,
  "/api/join": (await import("./api/join.js")).default,
  "/api/vote": (await import("./api/vote.js")).default,
  "/api/admin": (await import("./api/admin.js")).default
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (routes[url.pathname]) return routes[url.pathname](req, res);
  let p = url.pathname === "/" ? "/index.html" : url.pathname;
  if (!extname(p)) p += ".html";
  const file = normalize(join(root, p));
  if (!file.startsWith(normalize(root))) { res.statusCode = 403; return res.end(); }
  try {
    const data = await readFile(file);
    res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404; res.end("No trobat");
  }
}).listen(port, () => console.log(`Jornada 25N en local: http://localhost:${port}  ·  facilitació: http://localhost:${port}/presenta`));
