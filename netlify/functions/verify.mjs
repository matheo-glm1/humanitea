// GET /api/verify?id=… — vérifie auprès de HelloAsso qu'un paiement a bien été accepté.
// HelloAsso ne renvoie la commande ("order") que si le paiement est autorisé.
import { api, json, SLUG } from "../lib/helloasso.mjs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^\d+$/.test(id)) return json({ error: "Identifiant invalide" }, 400);

  try {
    const intent = await api(`/organizations/${SLUG}/checkout-intents/${id}`);
    const order = intent?.order;
    return json({ paid: Boolean(order), orderId: order?.id ?? null });
  } catch (err) {
    console.error("Vérification du paiement HelloAsso impossible :", err.message);
    return json({ error: "Vérification indisponible" }, 502);
  }
};

export const config = { path: "/api/verify" };
