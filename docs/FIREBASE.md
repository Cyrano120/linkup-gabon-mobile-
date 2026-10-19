# Configuration Firebase

Les trois applications (web, Expo, Flutter) partagent le projet Firebase **`linkup-gabon`**.

---

## 1. Authentication

Console Firebase → **Authentication** → onglet **Sign-in method** :

1. Activer **Email/Password**.
2. **Laisser « Email enumeration protection » ACTIVÉE** (réglage par défaut de Google). La désactiver permettrait à un attaquant de tester des adresses e-mail et de découvrir lesquelles possèdent un compte, puis de cibler ces comptes (hameçonnage, bourrage d'identifiants). Les messages d'erreur génériques sont le comportement à conserver, en développement comme en production.

Les apps utilisent `createUserWithEmailAndPassword` + `updateProfile` (Expo) / `updateDisplayName` (Flutter).

---

## 2. Firestore

Console Firebase → **Firestore Database** → **Créer une base** (mode production).

### Déployer les règles et index

```bash
npm install -g firebase-tools
firebase login
firebase use linkup-gabon
firebase deploy --only firestore:rules,firestore:indexes
```

Les fichiers concernés à la racine du dépôt :

- `firestore.rules` — lecture publique des prestataires et missions, écriture réservée aux comptes connectés, `devices/{uid}` limité au propriétaire.
- `firestore.indexes.json` — index composites (`category + price`, `status + budget`, `location + urgency`).
- `firebase.json` — pointe vers les deux fichiers précédents.

### Récupérer la configuration client

Console Firebase → **Paramètres du projet** → **Vos apps** → application **Web** → **Configuration du SDK**.

Reporter les valeurs dans :

- `expo-app/.env` (préfixes `EXPO_PUBLIC_`)
- `flutter-app/env.json` (noms sans préfixe, via `--dart-define-from-file`)

---

## 3. Notifications push

### Android

1. Console Firebase → **Paramètres du projet** → **Vos apps** → **Ajouter une app** → **Android**.
2. Nom de paquet : `ga.linkup.gabon`.
3. Télécharger `google-services.json` et le placer dans :
   - `flutter-app/android/app/google-services.json`

> Pour Expo, les identifiants sont gérés par EAS ; il faut un *development build* pour recevoir du push.

### iOS

1. Ajouter une app iOS (bundle `ga.linkup.gabon`).
2. Télécharger `GoogleService-Info.plist` → `flutter-app/ios/Runner/GoogleService-Info.plist`.
3. Activer **Push Notifications** et **Background Modes → Remote notifications** dans Xcode.

### Envoi distant via Cloud Function

Les deux apps enregistrent l'appareil dans `devices/{uid}` et écoutent Firestore en local. Pour notifier même app fermée, une Cloud Function doit cibler **uniquement les personnes concernées** — jamais l'ensemble des appareils, sous peine de notifier tout le monde de toutes les conversations.

> **Prérequis** : les champs `toUid` (message) et `createdBy` (mission) doivent contenir des **UID Firebase**, pas des noms affichés. Voir la migration décrite dans `docs/RECHERCHE-SECURITE.md` (§7).

```js
// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

const db = () => admin.firestore();

/** Récupère les jetons d'une liste d'UID, par paquets de 10 (limite de l'opérateur `in`). */
async function tokensFor(uids) {
  const unique = [...new Set(uids.filter(Boolean))];
  const tokens = [];
  for (let i = 0; i < unique.length; i += 10) {
    const snap = await db()
      .collection('devices')
      .where('userId', 'in', unique.slice(i, i + 10))
      .get();
    snap.docs.forEach((d) => {
      const token = d.data().token;
      if (token) tokens.push(token);
    });
  }
  return tokens;
}

// Nouveau message : on notifie UNIQUEMENT le destinataire.
exports.notifyNewMessage = onDocumentCreated('messages/{id}', async (event) => {
  const message = event.data.data();
  const tokens = await tokensFor([message.toUid]);
  if (!tokens.length) return;

  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title: 'Nouveau message', body: message.subject || 'LinkUp' },
    data: { url: '/messages' },
  });
});

// Nouvelle mission : on notifie les prestataires de la MÊME catégorie,
// plafonnés, en excluant l'auteur de la mission.
exports.notifyNewRequest = onDocumentCreated('requests/{id}', async (event) => {
  const request = event.data.data();

  const providers = await db()
    .collection('providers')
    .where('category', '==', request.category)
    .limit(50)
    .get();

  const uids = providers.docs
    .map((d) => d.data().createdBy)
    .filter((uid) => uid && uid !== request.createdBy);

  const tokens = await tokensFor(uids);
  if (!tokens.length) return;

  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title: 'Nouvelle mission', body: request.title },
    data: { url: '/missions' },
  });
});
```

Déploiement :

```bash
cd functions
npm install
firebase deploy --only functions
```

> Le champ `token` est renseigné automatiquement par les apps (Expo : `getExpoPushTokenAsync` / token natif ; Flutter : FID via `onRegistered`).

---

## 4. Données de démonstration

Au **premier lancement en développement**, si la collection `providers` est vide, l'application insère automatiquement 6 prestataires, 3 missions et 2 messages.

Pour réinitialiser : bouton **« Réinitialiser les données »** dans l'onglet Marketplace (Expo et Flutter).

> ⚠️ **Ces deux mécanismes sont réservés aux builds de développement** (`__DEV__` côté Expo, `kDebugMode` côté Flutter). La base Firestore `linkup-gabon` étant partagée avec le site en production, un appui sur « Réinitialiser » depuis une application publiée **effacerait les vraies données du site**. En production, le bouton n'est pas affiché et l'amorçage ne s'exécute pas.

---

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `Firebase non configuré` au démarrage | Variables d'environnement absentes | Créer `.env` (Expo) ou `env.json` (Flutter) |
| `permission-denied` sur Firestore | Règles non déployées | `firebase deploy --only firestore:rules` |
| `failed-precondition` (index) | Index composites manquants | Cliquer le lien de la console Firebase, ou déployer les index |
| Pas de notification distante | Pas de development build / pas de `google-services.json` | Voir la section 3 |
| Écran blanc Expo | `main` doit valoir `expo-router/entry` | Vérifier `expo-app/package.json` |
