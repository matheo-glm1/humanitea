// Base de données des commandes (Netlify Blobs) : une entrée par paiement, rangée par son numéro HelloAsso.
import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

export const commandes = () => getStore({ name: "commandes", consistency: "strong" });

// Mot de passe de la page admin, défini dans la variable d'environnement Netlify ADMIN_PASSWORD
export function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!expected || !given) return false;
  const hash = s => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(given), hash(expected));
}

// Passe une commande en « payée » (appelé au retour du client et depuis la page admin)
export async function markPaid(key, orderId) {
  const store = commandes();
  const cmd = await store.get(key, { type: "json" });
  if (!cmd || cmd.statut === "payée") return cmd;
  cmd.statut = "payée";
  cmd.payeeLe = new Date().toISOString();
  cmd.commandeHelloAsso = orderId ?? null;
  await store.setJSON(key, cmd);
  return cmd;
}
