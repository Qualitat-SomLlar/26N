# Jornada 25N · «El xat de l'equip»

Història interactiva amb votació col·lectiva per a la jornada de reflexió del 25N de Som Llar.
Funciona com un Kahoot: la persona facilitadora projecta la pantalla i les persones participants
entren des del mòbil escanejant un QR o escrivint un codi de 4 xifres. **No cal cap compte ni
cap dada personal.**

- **Participants:** `https://<la-vostra-url>/` (o directament el QR)
- **Facilitació:** `https://<la-vostra-url>/presenta` (amb PIN)

## Sala permanent

Per defecte hi ha una **sala permanent amb el codi `1312`**: sempre existeix i les persones
participants hi entren directament obrint la URL principal (o el QR), sense escriure cap codi.
La persona facilitadora també hi entra directament en posar el PIN.

- Per canviar el codi, definiu la variable `SALA_FIXA` a Vercel (4 xifres).
- Per desactivar-la i tornar a les sales amb codi aleatori, definiu `SALA_FIXA` buida.
- El codi de sala és públic (surt al projector): **el PIN ha de ser diferent del codi de sala.**
- El QR apunta sempre a la URL de producció de Vercel (o a `PUBLIC_URL`, si la definiu),
  encara que obriu la facilitació des d'una altra adreça.

## Com funciona

1. La persona facilitadora obre `/presenta` i introdueix el PIN (amb sala permanent, hi entra directament;
   sense, prem **Crear la sala**).
2. Al projector apareixen el **QR** i el **codi de sala**. Les persones participants entren i premen
   **Em connecto**. Encara no veuen la història; al projector es veu quantes s'han connectat.
3. La persona facilitadora prem **Començar la història**. Tots els mòbils mostren la primera cruïlla.
4. Cada persona vota (pot canviar el vot). Al projector: «X vots de Y persones connectades».
5. **Tancar votació** → resultat, conseqüència, impacte en l'Aina i reflexió.
   **Continuar la història** → cruïlla següent. En cas d'empat, la persona facilitadora tria.
6. Al final: gràfic del recorregut, decisions preses, tipus de violència i recursos.

Els mòbils consulten l'estat cada 2 segons; no cal recarregar la pàgina.

## Posar-ho en marxa a Vercel

### 1. Pujar el projecte a GitHub

Des d'aquesta carpeta (`jornada-25n`):

```bash
git init
git add .
git commit -m "Jornada 25N: història interactiva amb votació"
```

Creeu un repositori **privat** a GitHub (per exemple `jornada-25n`) i pugeu-hi el codi:

```bash
git remote add origin https://github.com/<organitzacio>/jornada-25n.git
git branch -M main
git push -u origin main
```

### 2. Importar-lo a Vercel

1. A [vercel.com](https://vercel.com) → **Add New… → Project** → importeu el repositori.
2. *Framework Preset*: **Other**. No cal canviar res més (no hi ha cap pas de compilació).
3. Premeu **Deploy**. Obtindreu una URL pública, per exemple `https://jornada-25n.vercel.app`.

### 3. Connectar la base de dades (Upstash Redis, gratuïta)

Els vots s'han de guardar en un lloc compartit. Sense aquest pas, **la votació no funcionarà bé**
(la pantalla de facilitació mostrarà un avís).

1. Al projecte de Vercel → pestanya **Storage** → **Create Database** → **Upstash for Redis**
   (Marketplace) → pla gratuït → regió **Frankfurt (eu-central-1)** o la més propera.
2. Connecteu-la al projecte. Vercel hi afegirà soles les variables `KV_REST_API_URL` i
   `KV_REST_API_TOKEN` (també s'accepten `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN`).

### 4. Definir el PIN de facilitació

Al projecte de Vercel → **Settings → Environment Variables** → afegiu:

| Nom | Valor |
|---|---|
| `FACILITATOR_PIN` | un PIN que només sàpiga l'equip facilitador (p. ex. 6 xifres) |

### 5. Tornar a desplegar

**Deployments → … → Redeploy**, perquè les variables noves s'apliquin.

### 6. Provar-ho

Obriu `/presenta` a l'ordinador i la URL principal en 2 o 3 mòbils. Feu un parell de cruïlles i
premeu **Reiniciar la sala** abans de la jornada.

## Provar-ho a l'ordinador (sense Vercel)

Cal Node.js 20 o posterior:

```bash
npm run dev
```

- Participants: http://localhost:3000
- Facilitació: http://localhost:3000/presenta (PIN de proves: `2526`)

En local, les dades es guarden en memòria i s'esborren en aturar el servidor.

## Estructura

```
api/            Funcions de servidor (Vercel): state, join, vote, admin
lib/            Lògica de la sala i accés a Redis
public/         Web estàtica
  index.html    Pantalla de participant
  presenta.html Pantalla de facilitació
  story.js      Història (textos, opcions, impacte, finals) — compartida amb l'API
  scenes.js     Il·lustracions SVG animades
  ui.js         Peces de la interfície compartides
  vendor/       qrcode.js (llibreria de QR, llicència MIT)
dev-server.js   Servidor de proves local
```

Per editar textos o opcions de la història, modifiqueu `public/story.js`.

## Privacitat i dades

- No es demana nom, correu ni cap dada personal. Cada dispositiu rep un identificador aleatori
  (guardat al navegador) que només serveix per no comptar dues vegades el mateix vot.
- A la base de dades només hi ha l'estat de la sala, els identificadors aleatoris i les opcions
  votades. **Tot s'esborra automàticament al cap de 12 hores.**
- La pàgina indica als cercadors que no s'indexi (`noindex`).
- Limitació coneguda: qui esborri les dades del navegador pot votar de nou com un dispositiu
  nou. Per a una activitat de sensibilització és un risc acceptable, però cal tenir-ho present.
