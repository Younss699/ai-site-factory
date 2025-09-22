# AI Site Factory — Vercel + OpenAI

## Étapes rapides
1. **Créer le repo GitHub** et y copier tous ces fichiers.
2. **Vercel → Import Project** (choisis ton repo). Laisse les réglages par défaut.
3. Dans Vercel → **Settings → Environment Variables** : ajoute `AI_API_KEY` avec ta clé OpenAI (Production + Preview).
4. Déploie. Ton site (HTTPS) est prêt. Va sur `/tests` pour vérifier que tout passe puis sur `/` pour générer.

## Utilisation
- Sur la page d’accueil, saisis **Idée / Audience / Ton** → *Générer*. 
- Télécharge les fichiers (landing.html, logo.svg, README, posts).

## Sécurité
- Clé **jamais** dans le client. 
- En-têtes de sécurité (CSP) en middleware — adapte si tu ajoutes des ressources.
- Rate limiting basique dans l’API (ajuste selon trafic).
- Filtre halal côté serveur + revue humaine si besoin.

## Personnalisation
- Styles : modifie les couleurs, polices (Google Fonts) sur `pages/index.tsx` et dans la landing HTML générée.
- API : ajuste le prompt dans `pages/api/generate.ts`.
