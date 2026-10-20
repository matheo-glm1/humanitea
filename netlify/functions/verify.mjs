// GET /api/verify?id=… — vérifie auprès de HelloAsso qu'un paiement a bien été accepté,
// et passe la commande enregistrée en « payée ».
import { checkIntent, json } from "../lib/helloasso.mjs";
import { markPaid } from "../lib/commandes.mjs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^\d+$/.test(id)) return json({ error: "Identifiant invalide" }, 400);

  try {
    const { paid, orderId } = await checkIntent(id);
    if (paid) await markPaid(id, orderId);
    return json({ paid, orderId });
  } catch (err) {
    console.error("Vérification du paiement HelloAsso impossible :", err.message);
    return json({ error: "Vérification indisponible" }, 502);
  }
};

export const config = { path: "/api/verify" };
