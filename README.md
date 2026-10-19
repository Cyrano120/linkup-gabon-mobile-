<div align="center">

# LinkUp Gabon — Applications mobiles

**Marketplace de services de proximité au Gabon, en deux versions natives.**
Une seule logique métier, deux stacks : **React Native + Expo** et **Flutter + Dart**.

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![Flutter](https://img.shields.io/badge/Flutter-3.44-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.12-0175C2?logo=dart&logoColor=white)](https://dart.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20FCM-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Licence](https://img.shields.io/badge/licence-MIT-009E60)](#licence)

</div>

---

## Sommaire

- [Pourquoi deux applications ?](#pourquoi-deux-applications-)
- [Aperçu fonctionnel](#aperçu-fonctionnel)
- [Architecture du dépôt](#architecture-du-dépôt)
- [Démarrage — version Expo](#démarrage--version-expo)
- [Démarrage — version Flutter](#démarrage--version-flutter)
- [Démarrage — VS Code](#démarrage--vs-code)
- [Configuration Firebase](#configuration-firebase)
- [Notifications](#notifications)
- [Modèle de données](#modèle-de-données)
- [Qualité](#qualité)
- [Veille et décisions](#veille-et-décisions)
- [Feuille de route](#feuille-de-route)
- [Licence](#licence)

---

## Pourquoi deux applications ?

Le projet web LinkUp Gabon existe déjà ([`Cyrano120/linkup-gabon`](https://github.com/Cyrano120/linkup-gabon)). Ce dépôt ajoute **deux applications mobiles natives** qui partagent le **même projet Firebase**, donc les **mêmes données en temps réel**.

L'objectif est double et assumé :

| | Expo (React Native) | Flutter (Dart) |
|---|---|---|
| **Langue** | TypeScript | Dart |
| **Intérêt** | Réutilisation immédiate de la logique du web, écosystème JS, hot reload | Performances natives, rendu identique iOS/Android, AOT |
| **Navigation** | Expo Router (fichiers) | `Navigator` + `IndexedStack` |
| **État** | React Context + hooks | `ChangeNotifier` + `provider` |
| **Firebase** | Firebase JS SDK v13 | `firebase_core` / `firebase_auth` / `cloud_firestore` / `firebase_messaging` |
| **Notifications** | `expo-notifications` | `flutter_local_notifications` + FCM |
| **Statut** | ✅ Compile, typecheck OK | ✅ `flutter analyze` sans issue, tests OK |

Garder les deux permet de comparer les approches sur un **même domaine métier** — et de choisir la stack définitive en connaissance de cause. Les deux apps sont volontairement **indépendantes** : aucune dépendance croisée, chacune se build et se déploie seule.

---

## Aperçu fonctionnel

Parité fonctionnelle complète entre les deux applications :

<table>
<tr><th>Fonctionnalité</th><th>Expo</th><th>Flutter</th></tr>
<tr><td>Authentification (email / mot de passe, inscription, déconnexion)</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Accueil : hero, statistiques live, « comment ça marche », prestataire à la une, témoignages</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Marketplace : recherche plein texte + filtres catégorie / quartier / budget / disponibilité</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Fiche prestataire : bio, compétences, galerie, avis, statistiques</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Demande directe à un prestataire (formulaire contextuel)</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Publication d'une mission (budget FCFA, quartier, délai)</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Missions : changement de statut, candidatures, acceptation d'un candidat</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Messagerie : envoi, boîtes reçus / envoyés</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Devenir prestataire (création de vitrine)</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Notifications (nouvelles missions / nouveaux messages)</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Réinitialisation des données de démonstration <em>(développement uniquement)</em></td><td align="center">✅</td><td align="center">✅</td></tr>
</table>

**Design system partagé** : palette gabonaise (`#009E60` vert, `#FCD116` jaune, `#3A75C4` bleu), fond dégradé sombre, cartes claires « verre », badges de statut, typographie lourde — identiques visuellement sur les deux apps et cohérents avec le web.

---

## Architecture du dépôt

```
linkup-gabon-mobile/
├── expo-app/                  # Application React Native + Expo (TypeScript)
│   ├── src/
│   │   ├── app/               # Expo Router : routes = fichiers
│   │   │   ├── _layout.tsx    # providers + Stack + deep-links notifications
│   │   │   ├── index.tsx      # redirection selon la session
│   │   │   ├── (auth)/        # login.tsx, register.tsx
│   │   │   ├── (tabs)/        # home, market, create, missions, messages
│   │   │   ├── provider/[id].tsx
│   │   │   └── become.tsx
│   │   ├── components/        # ui.tsx, ProviderCard, RequestCard, BookingModal
│   │   ├── context/           # AuthContext, DataContext, ToastContext
│   │   ├── lib/               # firebase, firestore, notifications, authErrors, demoData, format
│   │   ├── data.ts            # constantes + données de démo
│   │   ├── theme.ts           # design tokens
│   │   └── types.ts
│   ├── app.json               # config Expo (plugins, identifiants)
│   └── .env.example
│
├── flutter-app/               # Application Flutter (Dart)
│   ├── lib/
│   │   ├── main.dart          # init Firebase + notifications
│   │   ├── app.dart           # MaterialApp + MultiProvider + AuthGate
│   │   ├── core/              # theme, constants, firebase_config
│   │   ├── models/            # Provider, ServiceRequest, Message
│   │   ├── services/          # firestore_service, notification_service
│   │   ├── state/             # auth_controller, data_controller
│   │   ├── utils/              # auth_errors, demo_data
│   │   ├── widgets/           # ui, provider_card, request_card, booking_sheet
│   │   └── screens/           # 11 écrans
│   ├── android/ · ios/        # projets natifs
│   └── env.example.json
│
├── docs/
│   ├── FIREBASE.md            # configuration Firebase pas à pas
│   └── ARCHITECTURE.md        # flux, état, décisions techniques
├── firestore.rules            # règles partagées par les 3 apps
├── firestore.indexes.json     # index composites
└── firebase.json
```

**Pourquoi un monorepo ?** Une seule source de vérité pour les règles Firestore, le modèle de données et la documentation. Les deux apps restent isolées (pas de code partagé entre TypeScript et Dart) mais évoluent ensemble.

---

## Démarrage — version Expo

**Prérequis :** Node ≥ 20, npm, [l'application Expo Go](https://expo.dev/go) sur ton téléphone (ou un émulateur).

```bash
cd expo-app
npm install
cp .env.example .env        # puis renseigne tes clés Firebase
npm start                   # ouvre Expo Go et scanne le QR code
```

Autres commandes :

```bash
npm run android             # lance sur un émulateur Android
npm run ios                 # nécessite macOS
npm run typecheck           # tsc --noEmit
```

> ⚠️ **Notifications distantes** : elles exigent un *development build* (pas Expo Go) et un `projectId` EAS. En son absence, l'app bascule automatiquement sur le token natif, puis sur des **notifications locales** déclenchées par les écouteurs Firestore.

**Variables d'environnement** (`expo-app/.env`) :

| Variable | Rôle |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Clé API Firebase |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domaine d'authentification |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Identifiant du projet |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de stockage |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID FCM |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Identifiant d'application |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | *(optionnel)* projectId EAS pour le push |

---

## Démarrage — version Flutter

**Prérequis :** [Flutter 3.44+](https://docs.flutter.dev/get-started/install) (Dart 3.12 inclus), Android Studio ou Xcode.

```bash
cd flutter-app
flutter pub get
cp env.example.json env.json        # puis renseigne tes clés Firebase
flutter run --dart-define-from-file=env.json
```

Autres commandes :

```bash
flutter analyze             # analyse statique (0 issue)
flutter test                # tests de widgets
flutter build apk           # build Android release
flutter build ios           # build iOS (macOS requis)
```

> Sans clé Firebase, l'app démarre sur un **écran de configuration** avec les instructions — elle ne plante jamais.

**Variables d'environnement** (`flutter-app/env.json`, lues via `--dart-define-from-file`) :

| Clé | Rôle |
|---|---|
| `FIREBASE_API_KEY` | Clé API Firebase |
| `FIREBASE_AUTH_DOMAIN` | Domaine d'authentification |
| `FIREBASE_PROJECT_ID` | Identifiant du projet |
| `FIREBASE_STORAGE_BUCKET` | Bucket de stockage |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID FCM |
| `FIREBASE_APP_ID` | Identifiant d'application |

---

## Démarrage — VS Code

Le dépôt contient une configuration VS Code prête à l'emploi (`.vscode/`).

**Extensions requises** (VS Code les propose à l'ouverture du dossier) :

| Extension | Rôle |
|---|---|
| `Dart-Code.dart-code` | Dart : analyse, formatage, débogage |
| `Dart-Code.flutter` | Flutter : lancement, hot reload, DevTools |
| `dbaeumer.vscode-eslint` | ESLint pour l'app Expo |
| `expo.vscode-expo-tools` | Outils Expo |

**Lancer l'app Flutter** — ouvre le panneau *Exécuter et déboguer* (`Ctrl+Shift+D`), choisis une configuration, puis `F5` :

| Configuration | Effet |
|---|---|
| **Flutter : TECNO CK6 (téléphone)** | Compile et installe sur l'appareil branché en USB |
| **Flutter : choisir l'appareil** | Identique, en laissant Flutter demander quel appareil utiliser |
| **Flutter : tests** | Exécute les tests sous le débogueur |

> La configuration transmet automatiquement `--dart-define-from-file=env.json` : c'est ce qui fournit les clés Firebase à l'app.

**Lancer l'app Expo** — passe par les tâches (`Ctrl+Shift+P` → *Tasks: Run Task*) :

| Tâche | Effet |
|---|---|
| **Expo: installer les dépendances** | `npm install` dans `expo-app` |
| **Expo: démarrer le serveur (Expo Go)** | Démarre Metro ; scanne ensuite le QR code avec Expo Go |
| **Expo: vérifier les types** | `tsc --noEmit` |

> `F5` étant réservé à Flutter, lance Expo via une tâche : les deux apps se démarrent indépendamment.

---

## Configuration Firebase

Les deux apps se connectent au projet Firebase **`linkup-gabon`** (le même que le web). Détail complet dans **[`docs/FIREBASE.md`](docs/FIREBASE.md)**.

En résumé :

1. **Authentication** → activer le fournisseur **Email / Mot de passe**.
2. **Firestore** → créer la base, puis déployer les règles :

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

3. Récupérer la configuration web (Paramètres du projet → Vos apps → Web) et la reporter dans `expo-app/.env` et `flutter-app/env.json`.
4. Pour le push : ajouter une app Android (`google-services.json`) et iOS (`GoogleService-Info.plist`).

> ⚠️ Les collections **`providers`**, **`requests`** et **`messages`** sont **partagées avec le site en production**. L'amorçage automatique et le bouton « Réinitialiser les données » sont donc réservés aux **builds de développement** (`__DEV__` côté Expo, `kDebugMode` côté Flutter) : ils ne s'exécutent jamais dans une application publiée.

---

## Notifications

Les deux apps enregistrent l'appareil dans la collection **`devices/{uid}`** et écoutent Firestore pour notifier en local :

- **Nouvelle mission** créée par un autre utilisateur → notification.
- **Nouveau message** reçu d'un autre utilisateur → notification.

Un delta detection évite de notifier les données déjà présentes au premier chargement.

Pour du **push distant réel** (app fermée), ajoute une Cloud Function déclenchée sur `onCreate` des collections `requests` et `messages`, qui lit `devices/*` et envoie via FCM HTTP v1. Le squelette est décrit dans `docs/FIREBASE.md`.

---

## Modèle de données

```ts
providers/{id}  { name, role, category, rating, missions, price, location,
                  available, image, cover, responseTime, successRate,
                  headline, bio, gallery[], reviews[], skills[], createdBy }

requests/{id}   { title, category, budget, location, urgency, status,
                  client, provider, candidates[], description, createdBy }

messages/{id}   { from, to, subject, text, createdBy }

devices/{uid}   { userId, token, platform, updatedAt }
```

Statuts de mission : `Ouverte` → `En discussion` → `Confirmée` → `Terminée`.
Catégories : `Informatique`, `Cours`, `Livraison`, `Design & Web`.

---

## Qualité

| Vérification | Commande | Résultat |
|---|---|---|
| Types Expo | `cd expo-app && npx tsc --noEmit` | ✅ 0 erreur |
| Lint Expo | `cd expo-app && npx expo lint` | ✅ 0 problème |
| Analyse Flutter | `cd flutter-app && flutter analyze` | ✅ 0 issue |
| Tests Flutter | `cd flutter-app && flutter test` | ✅ 6/6 |

Choix techniques notables :

- **Expo** : `initializeAuth` + `getReactNativePersistence` pour conserver la session, `initializeFirestore({ experimentalForceLongPolling: true })` pour fiabiliser le streaming réseau en React Native.
- **Flutter** : Firebase initialisé **par options runtime** (`--dart-define-from-file`), donc aucun fichier de config natif requis pour démarrer ; `firebase_messaging`/notifications encapsulés en `try/catch` pour ne jamais bloquer l'app.
- **Sécurité** : dépôt multi-apps → un seul `firestore.rules` versionné, avec règle dédiée `devices/{userId}` (écriture limitée au propriétaire).
- **Erreurs d'auth** : traduites depuis le code Firebase (`auth/...`) vers des phrases françaises, dans une table strictement identique côté Expo et côté Flutter.
- **Données de démo** : amorçage et réinitialisation conditionnés à l'environnement de développement, car la base est partagée avec la production.

---

## Veille et décisions

Trois veilles sourcées et une synthèse orientent la suite du produit :

| Document | Contenu |
|---|---|
| [`docs/SYNTHESE.md`](docs/SYNTHESE.md) | **Synthèse et priorités fonctionnelles** — à lire en premier |
| [`docs/RECHERCHE-DESIGN.md`](docs/RECHERCHE-DESIGN.md) | Design mobile, patterns UX, accessibilité, packages Flutter |
| [`docs/RECHERCHE-CONCURRENCE.md`](docs/RECHERCHE-CONCURRENCE.md) | Marché gabonais, concurrents, monétisation, paiement |
| [`docs/RECHERCHE-SECURITE.md`](docs/RECHERCHE-SECURITE.md) | Sécurité, règles Firestore prêtes à l'emploi, conformité APDPVP |

---

## Feuille de route

- [ ] Cloud Functions d'envoi FCM distant (missions + messages)
- [ ] Upload de photos de profil et de réalisations (Firebase Storage)
- [ ] Paiement mobile money (Airtel Money / Moov Money)
- [ ] Chat temps réel par mission (sous-collections)
- [ ] Mode hors ligne complet avec synchronisation différée
- [ ] Publication Play Store / App Store (EAS Submit + Fastlane)

---

## Licence

MIT — Voir le fichier `LICENSE`. Projet de démonstration portfolio : les données de démonstration et les visuels (Unsplash) n'ont pas de valeur contractuelle.

<div align="center">

Fait avec ❤️ pour le Gabon.

</div>
