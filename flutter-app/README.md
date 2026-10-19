# Flutter — LinkUp Gabon

Application mobile native du marketplace **LinkUp Gabon**, écrite en **Dart** avec **Flutter 3.44**.

Fait partie du monorepo [`linkup-gabon-mobile`](../README.md), aux côtés de la version **React Native + Expo**.

## Démarrage rapide

```bash
flutter pub get
cp env.example.json env.json          # renseigne tes clés Firebase
flutter run --dart-define-from-file=env.json
```

Sans clé Firebase, l'application affiche un écran de configuration — elle ne plante pas.

## Commandes utiles

| Commande | Effet |
|---|---|
| `flutter run --dart-define-from-file=env.json` | Lance l'app avec la config Firebase |
| `flutter analyze` | Analyse statique (doit afficher `No issues found!`) |
| `flutter test` | Tests de widgets |
| `flutter build apk --release --dart-define-from-file=env.json` | APK Android |
| `flutter build appbundle --release --dart-define-from-file=env.json` | Bundle Play Store |

## Structure

```
lib/
├── main.dart          # init Firebase + notifications, runApp
├── app.dart           # MaterialApp, MultiProvider, AuthGate
├── core/              # theme (design tokens), constants (seed), firebase_config
├── models/            # Provider, ServiceRequest, Message
├── services/          # FirestoreService, NotificationService
├── state/             # AuthController, DataController (ChangeNotifier)
├── widgets/           # ui.dart, provider_card, request_card, booking_sheet
└── screens/           # 11 écrans (auth, 5 onglets, détail, vitrine, config)
```

## Fonctionnalités

Authentification · accueil · marketplace filtrable · fiche prestataire · demande directe · publication de mission · suivi des missions et candidatures · messagerie · vitrine prestataire · notifications.

## Notes

- **Aucun fichier natif Firebase requis au démarrage** : Firebase est initialisé par options runtime (`--dart-define-from-file`).
- **Push distant** : ajouter `google-services.json` (Android) / `GoogleService-Info.plist` (iOS), puis une Cloud Function FCM — voir [`docs/FIREBASE.md`](../docs/FIREBASE.md).
- Sans configuration push, les **notifications locales** continuent de fonctionner (écouteurs Firestore).
