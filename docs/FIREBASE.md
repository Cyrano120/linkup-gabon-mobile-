# Configuration Firebase

Les trois applications (web, Expo, Flutter) partagent le projet Firebase **`linkup-gabon`**.

---

## 1. Authentication

Console Firebase → **Authentication** → onglet **Sign-in method** :

1. Activer **Email/Password**.
2. (Optionnel) Désactiver « Email enumeration protection » pour des messages d'erreur plus explicites en développement.

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

Les deux apps enregistrent l'appareil dans `devices/{uid}` et écoutent Firestore en local. Pour notifier même app fermée :

```js
// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

exports.notifyNewRequest = onDocumentCreated('requests/{id}', async (event) => {
  const request = event.data.data();
  const devices = await admin.firestore().collection('devices').get();

  const targets = devices.docs
    .filter((d) => d.data().userId !== request.createdBy)
    .map((d) => d.data().token)
    .filter(Boolean);

  if (!targets.length) return;

  await admin.messaging().sendEachForMulticast({
    tokens: targets,
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

Au **premier lancement**, si la collection `providers` est vide, l'application insère automatiquement 6 prestataires, 3 missions et 2 messages.

Pour réinitialiser : bouton **« Réinitialiser les données »** dans l'onglet Marketplace (Expo et Flutter).

---

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `Firebase non configuré` au démarrage | Variables d'environnement absentes | Créer `.env` (Expo) ou `env.json` (Flutter) |
| `permission-denied` sur Firestore | Règles non déployées | `firebase deploy --only firestore:rules` |
| `failed-precondition` (index) | Index composites manquants | Cliquer le lien de la console Firebase, ou déployer les index |
| Pas de notification distante | Pas de development build / pas de `google-services.json` | Voir la section 3 |
| Écran blanc Expo | `main` doit valoir `expo-router/entry` | Vérifier `expo-app/package.json` |
