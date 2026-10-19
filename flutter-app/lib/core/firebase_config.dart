/// Configuration Firebase lue depuis les `--dart-define`.
///
/// Lancement :
/// `flutter run --dart-define-from-file=env.json`
///
/// Si aucune clé n'est fournie, l'application affiche un écran de
/// configuration au lieu de planter.
class FirebaseConfig {
  const FirebaseConfig._();

  static const String apiKey = String.fromEnvironment('FIREBASE_API_KEY');
  static const String authDomain = String.fromEnvironment('FIREBASE_AUTH_DOMAIN');
  static const String projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
  static const String storageBucket = String.fromEnvironment('FIREBASE_STORAGE_BUCKET');
  static const String messagingSenderId =
      String.fromEnvironment('FIREBASE_MESSAGING_SENDER_ID');
  static const String appId = String.fromEnvironment('FIREBASE_APP_ID');

  /// Vrai si les informations minimales sont présentes.
  static bool get isConfigured => apiKey.isNotEmpty && projectId.isNotEmpty;
}
