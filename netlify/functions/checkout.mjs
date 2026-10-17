// POST /api/checkout — crée un paiement HelloAsso pour le contenu du panier.
// Le montant est recalculé ici à partir de products.json : on ne fait jamais confiance au prix envoyé par le navigateur.
import catalog from "../../products.json";
import { api, json, SLUG } from "../lib/helloasso.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Requête invalide" }, 400); }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length || items.length > 30) return json({ error: "Panier vide ou trop grand" }, 400);

  const lines = [];
  for (const item of items) {
    const product = catalog.find(p => p.id === item?.id);
    const qty = Number(item?.qty);
    if (!product || !product.sizes.includes(item.size) || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return json({ error: "Article invalide dans le panier" }, 400);
    }
    lines.push({ id: product.id, nom: product.name, taille: item.size, quantite: qty, prixUnitaire: product.price });
  }

  const totalCents = lines.reduce((sum, l) => sum + Math.round(l.prixUnitaire * 100) * l.quantite, 0);
  const summary = lines.map(l => `${l.quantite}× ${l.nom} (${l.taille})`).join(", ");
  const site = process.env.URL; // adresse du site, fournie par Netlify

  try {
    const intent = await api(`/organizations/${SLUG}/checkout-intents`, {
      method: "POST",
      body: {
        totalAmount: totalCents,
        initialAmount: totalCents,
        itemName: `Humanitea : ${summary}`.slice(0, 250),
        backUrl: `${site}/?paiement=annule`,
        errorUrl: `${site}/?paiement=erreur`,
        returnUrl: `${site}/?paiement=retour`,
        containsDonation: false,
        metadata: { lignes: lines } // visible dans la réponse de l'API pour préparer les commandes
      }
    });
    return json({ redirectUrl: intent.redirectUrl });
  } catch (err) {
    console.error("Création du paiement HelloAsso impossible :", err.message);
    return json({ error: "Paiement indisponible pour le moment" }, 502);
  }
};

export const config = { path: "/api/checkout" };
