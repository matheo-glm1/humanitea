// Connexion à l'API HelloAsso (utilisé par les fonctions Netlify, jamais par le navigateur).
// Les clés sont lues dans les variables d'environnement Netlify :
//   HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET  → Mon compte > Intégration et API sur HelloAsso
//   HELLOASSO_ORG_SLUG                            → "humanitea" (ou le slug de l'asso de test)
//   HELLOASSO_ENV                                 → "sandbox" (test, par défaut) ou "production"

const ENV = (process.env.HELLOASSO_ENV || "sandbox").toLowerCase();
const BASE = ENV === "production" ? "https://api.helloasso.com" : "https://api.helloasso-sandbox.com";
export const SLUG = process.env.HELLOASSO_ORG_SLUG || "humanitea";

let token = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const { HELLOASSO_CLIENT_ID: clientId, HELLOASSO_CLIENT_SECRET: clientSecret } = process.env;
  if (!clientId || !clientSecret) throw new Error("Clés HelloAsso manquantes dans les variables d'environnement Netlify");

  const res = await fetch(`${BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret })
  });
  if (!res.ok) throw new Error(`Authentification HelloAsso refusée (${res.status})`);
  const data = await res.json();
  token = data.access_token;
  tokenExpiry = Date.now() + (Number(data.expires_in) - 60) * 1000;
  return token;
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}/v5${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HelloAsso ${res.status} : ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
