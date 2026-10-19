# Architecture

## Vue d'ensemble

```
        ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
        │  Web (Vite)    │   │  Expo (RN/TS)  │   │ Flutter (Dart) │
        └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
                │                    │                    │
                └──────────────┬─────┴────────────────────┘
                               ▼
                     Firebase (Auth · Firestore · FCM)
                        providers · requests · messages · devices
```

Les trois clients sont indépendants mais partagent :

- le **projet Firebase** et donc les données temps réel ;
- le **design system** (palette, rayons, espacements) ;
- les **règles Firestore** versionnées à la racine du dépôt.

## Séparation des responsabilités

### Expo (TypeScript)

| Couche | Dossier | Rôle |
|---|---|---|
| Routes | `src/app/**` | Expo Router : un fichier = un écran. Groupes `(auth)` et `(tabs)`. |
| Composants | `src/components` | UI présentationnelle (`ui.tsx`, `ProviderCard`, `RequestCard`, `BookingModal`). |
| État | `src/context` | `AuthContext` (session), `DataContext` (données Firestore + notifications), `ToastContext`. |
| Accès données | `src/lib` | `firebase.ts` (init), `firestore.ts` (CRUD + souscriptions), `notifications.ts`, `format.ts`. |
| Contrats | `src/types.ts`, `src/data.ts` | Types métier + constantes et seed. |

### Flutter (Dart)

| Couche | Dossier | Rôle |
|---|---|---|
| Point d'entrée | `lib/main.dart`, `lib/app.dart` | Init Firebase/notifications, providers, `AuthGate`. |
| Domaine | `lib/models` | `Provider`, `ServiceRequest`, `Message` — immuables, `fromMap`/`toMap`. |
| Accès données | `lib/services` | `FirestoreService` (streams + CRUD), `NotificationService` (local + FCM). |
| État | `lib/state` | `AuthController`, `DataController` (`ChangeNotifier`). |
| UI | `lib/widgets`, `lib/screens` | Widgets réutilisables + 11 écrans. |

**Pourquoi cette séparation ?** Le métier (statuts de mission, candidatures, tarification FCFA) ne dépend ni de Firestore ni de l'UI. Les contrôleurs orchestrent ; les widgets affichent. Un changement de backend n'impacterait que `lib/services` (Flutter) et `src/lib` (Expo).

## Flux de données

1. `main.dart` initialise Firebase puis `NotificationService`.
2. `AuthController` écoute `authStateChanges()` et expose l'utilisateur.
3. `DataController` écoute à son tour `authStateChanges()`, puis souscrit aux collections `providers`, `requests`, `messages`.
4. À la première connexion **en développement**, si `providers` est vide → seed des données de démo. En production, aucun seed n'est injecté : la base est partagée avec le site.
5. Chaque mutation (`addRequest`, `bookProvider`, `acceptCandidate`…) écrit dans Firestore ; l'UI se met à jour via les streams.
6. Le contrôleur compare les identifiants déjà vus pour notifier localement les **nouveaux** documents des autres utilisateurs.

## Décisions techniques

| Décision | Raison |
|---|---|
| **Firebase JS SDK** côté Expo (et non `@react-native-firebase`) | Fonctionne dans Expo Go, aucune configuration native requise pour démarrer. |
| `initializeFirestore({ experimentalForceLongPolling: true })` | Le streaming réseau est capricieux en React Native ; le long polling est fiable. |
| `getReactNativePersistence(AsyncStorage)` | Conserver la session entre deux lancements, comme sur le web. |
| **FirebaseOptions runtime** côté Flutter | Démarre sans `google-services.json` ; l'ajouter ne concerne que le push. |
| Écran de configuration si clés absentes | Meilleure expérience développeur qu'un crash au démarrage. |
| Notifications `/devices/{uid}` avec règle dédiée | Prêt pour une Cloud Function FCM sans exposer les tokens. |
| Deux apps plutôt qu'une seule | Comparer RN et Flutter sur un même domaine, décider sur des faits. |

## Conventions

- **Palette** : `#009E60` (vert), `#FCD116` (jaune), `#3A75C4` (bleu) — drapeau gabonais.
- **Montants** : toujours en **FCFA**, formatés `fr-FR` (`12 000 FCFA`).
- **Statuts** : `Ouverte` → `En discussion` → `Confirmée` → `Terminée`.
- **Rayons** : `sm 10` · `md 14` · `lg 20` · `xl 26`.
- **Espacements** : `xs 4` · `sm 8` · `md 12` · `lg 16` · `xl 24` · `xxl 32`.
