// POST /api/checkout — enregistre la commande puis crée le paiement HelloAsso.
// Le montant est recalculé ici à partir de products.json : on ne fait jamais confiance au prix envoyé par le navigateur.
import catalog from "../../products.json";
import { api, json, SLUG } from "../lib/helloasso.mjs";
import { commandes } from "../lib/commandes.mjs";

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Requête invalide" }, 400); }

  // Coordonnées de l'acheteur
  const client = {
    prenom: clean(body?.client?.prenom, 60),
    nom: clean(body?.client?.nom, 60),
    tel: clean(body?.client?.tel, 20),
    email: clean(body?.client?.email, 120).toLowerCase()
  };
  if (!client.prenom || !client.nom) return json({ error: "Prénom et nom obligatoires" }, 400);
  if (!/^\+?[0-9 .()-]{8,20}$/.test(client.tel)) return json({ error: "Numéro de téléphone invalide" }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) return json({ error: "E-mail invalide" }, 400);

  // Articles
  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length || items.length > 30) return json({ error: "Panier vide ou trop grand" }, 400);

  const lignes = [];
  for (const item of items) {
    const product = catalog.find(p => p.id === item?.id);
    const qty = Number(item?.qty);
    if (!product || !product.sizes.includes(item.size) || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return json({ error: "Article invalide dans le panier" }, 400);
    }
    lignes.push({ id: product.id, nom: product.name, taille: item.size, quantite: qty, prixUnitaire: product.price });
  }

  const totalCents = lignes.reduce((sum, l) => sum + Math.round(l.prixUnitaire * 100) * l.quantite, 0);
  const summary = lignes.map(l => `${l.quantite}× ${l.nom} (${l.taille})`).join(", ");
  const site = process.env.URL; // adresse du site, fournie par Netlify

  const intentBody = {
    totalAmount: totalCents,
    initialAmount: totalCents,
    itemName: `Humanitea : ${summary}`.slice(0, 250),
    backUrl: `${site}/?paiement=annule`,
    errorUrl: `${site}/?paiement=erreur`,
    returnUrl: `${site}/?paiement=retour`,
    containsDonation: false,
    metadata: { lignes, telephone: client.tel }
  };
  const payer = { firstName: client.prenom, lastName: client.nom, email: client.email };

  try {
    let intent;
    try {
      // On pré-remplit la page HelloAsso avec les coordonnées…
      intent = await api(`/organizations/${SLUG}/checkout-intents`, { method: "POST", body: { ...intentBody, payer } });
    } catch (err) {
      // … sauf si HelloAsso refuse le nom (règles de validation strictes) : l'acheteur le retapera sur HelloAsso
      if (err.status !== 400) throw err;
      intent = await api(`/organizations/${SLUG}/checkout-intents`, { method: "POST", body: intentBody });
    }

    await commandes().setJSON(String(intent.id), {
      id: String(intent.id),
      date: new Date().toISOString(),
      statut: "en attente",
      client,
      lignes,
      total: totalCents / 100,
      remis: false
    });

    return json({ redirectUrl: intent.redirectUrl });
  } catch (err) {
    console.error("Création du paiement HelloAsso impossible :", err.message);
    return json({ error: "Paiement indisponible pour le moment" }, 502);
  }
};

export const config = { path: "/api/checkout" };
