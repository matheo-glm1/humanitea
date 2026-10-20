// /api/commandes — utilisé par la page admin.html (protégé par le mot de passe ADMIN_PASSWORD)
//   GET  : liste des commandes (et revérifie auprès de HelloAsso celles encore « en attente »)
//   POST : { id, remis } pour cocher / décocher « remis au client »
import { checkIntent, json } from "../lib/helloasso.mjs";
import { commandes, isAdmin, markPaid } from "../lib/commandes.mjs";

const ABANDON_APRES = 2 * 60 * 60 * 1000; // une commande non payée après 2 h est considérée abandonnée

export default async (req) => {
  if (!isAdmin(req)) return json({ error: "Mot de passe incorrect" }, 401);
  const store = commandes();

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "Requête invalide" }, 400); }
    const cmd = await store.get(String(body?.id), { type: "json" });
    if (!cmd) return json({ error: "Commande introuvable" }, 404);
    cmd.remis = Boolean(body.remis);
    await store.setJSON(cmd.id, cmd);
    return json(cmd);
  }

  const { blobs } = await store.list();
  const liste = (await Promise.all(blobs.map(b => store.get(b.key, { type: "json" })))).filter(Boolean);

  // Paiements pas encore confirmés (client qui a fermé la page avant le retour, par ex.)
  const enAttente = liste.filter(c => c.statut === "en attente").slice(0, 25);
  await Promise.all(enAttente.map(async c => {
    try {
      const { paid, orderId } = await checkIntent(c.id);
      if (paid) Object.assign(c, await markPaid(c.id, orderId));
      else if (Date.now() - Date.parse(c.date) > ABANDON_APRES) {
        c.statut = "abandonnée";
        await store.setJSON(c.id, c);
      }
    } catch (err) {
      console.error(`Vérification de la commande ${c.id} impossible :`, err.message);
    }
  }));

  liste.sort((a, b) => b.date.localeCompare(a.date));
  return json(liste);
};

export const config = { path: "/api/commandes" };
