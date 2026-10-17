# Mettre la boutique Humanitea en ligne

Le code est sur GitHub (`matheo-glm1/humanitea`). Netlify l'affiche en ligne et fait tourner
le paiement HelloAsso. À chaque `git push`, le site se met à jour tout seul.

## 1. Relier GitHub à Netlify (une seule fois)

1. Créer un compte sur https://app.netlify.com (bouton « Sign up with GitHub »).
2. **Add new site → Import an existing project → GitHub**, puis choisir le dépôt `humanitea`.
3. Ne rien changer aux réglages de build (le fichier `netlify.toml` s'en charge) et cliquer sur **Deploy**.

## 2. Récupérer les clés API HelloAsso

Sur HelloAsso : **Mon compte → Intégration et API**. On y trouve le `clientId` et le `clientSecret`.

- La clé doit avoir l'autorisation **Checkout**. Si le paiement est refusé, demander au support HelloAsso de l'activer.
- L'association doit être **vérifiée** sur HelloAsso pour encaisser des paiements.
- Ne jamais mettre ces clés dans le code ni les envoyer par message.

## 3. Mettre les clés dans Netlify

Netlify → le site → **Site configuration → Environment variables** :

| Variable | Valeur |
|---|---|
| `HELLOASSO_CLIENT_ID` | le clientId |
| `HELLOASSO_CLIENT_SECRET` | le clientSecret |
| `HELLOASSO_ORG_SLUG` | `humanitea` |
| `HELLOASSO_ENV` | `sandbox` pour tester, `production` pour les vraies ventes |

Après avoir changé une variable : **Deploys → Trigger deploy** pour qu'elle soit prise en compte.

## 4. Tester sans vrai argent (recommandé)

1. Créer une asso de test sur https://auth.helloasso-sandbox.com/inscription et la valider avec de faux documents.
2. Prendre les clés API de **cette asso de test**, mettre son slug dans `HELLOASSO_ORG_SLUG` et `HELLOASSO_ENV=sandbox`.
3. Passer une commande sur le site avec une carte de test.
4. Quand tout marche : remettre les vraies clés, `HELLOASSO_ORG_SLUG=humanitea` et `HELLOASSO_ENV=production`.

## Où voir les commandes ?

Dans l'espace HelloAsso de l'asso. Le détail (articles, tailles, quantités) est envoyé
avec chaque paiement dans les métadonnées et résumé dans le libellé du paiement.

## Modifier les produits

Tout est dans `products.json` (nom, prix, tailles, photos…). Le site et le paiement lisent ce même
fichier : le prix payé est toujours celui de `products.json`.
