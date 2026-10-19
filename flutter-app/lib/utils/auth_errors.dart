import 'package:firebase_auth/firebase_auth.dart';

/// Traduit les erreurs Firebase Auth en messages lisibles pour l'utilisateur.
///
/// Pourquoi ce fichier existe : `error.toString()` renvoie quelque chose comme
/// `[firebase_auth/email-already-in-use] The email address is already in use by
/// another account.` — un texte **anglais** précédé d'un code technique. Se
/// contenter de retirer le code laissait donc un message anglais, et un texte
/// vide quand Firebase n'en fournit aucun.
///
/// On s'appuie sur `FirebaseAuthException.code`, qui est stable, pour produire
/// une phrase utile en français. La table est volontairement identique à celle
/// de l'application Expo (`src/lib/authErrors.ts`) : les deux apps doivent
/// parler d'une seule voix.
const Map<String, String> _messagesByCode = {
  'email-already-in-use': 'Cet email est déjà utilisé. Essaie plutôt de te connecter.',
  'invalid-email': "Cette adresse email n'est pas valide.",
  'missing-email': 'Saisis ton adresse email.',
  'missing-password': 'Saisis ton mot de passe.',
  'weak-password': 'Mot de passe trop court : 6 caractères minimum.',
  'user-not-found': 'Aucun compte ne correspond à cet email.',
  'wrong-password': 'Mot de passe incorrect.',
  'invalid-credential': 'Email ou mot de passe incorrect.',
  'invalid-login-credentials': 'Email ou mot de passe incorrect.',
  'user-disabled': 'Ce compte a été désactivé.',
  'too-many-requests': 'Trop de tentatives. Réessaie dans quelques minutes.',
  'network-request-failed': 'Connexion impossible. Vérifie ton accès à internet.',
  'operation-not-allowed': "Cette méthode de connexion n'est pas activée pour ce projet.",
  'api-key-not-valid': 'Configuration Firebase invalide (clé API refusée).',
  'invalid-api-key': 'Configuration Firebase invalide (clé API refusée).',
  'requires-recent-login': 'Reconnecte-toi pour effectuer cette action.',
  'internal-error': 'Erreur temporaire du service. Réessaie.',
};

const String _fallback = 'Une erreur est survenue. Réessaie.';

/// `true` si le message ressemble à une erreur d'authentification exploitable.
String describeAuthError(Object error) {
  // 1. Cas nominal : le SDK expose un code stable.
  if (error is FirebaseAuthException) {
    final mapped = _messagesByCode[error.code];
    if (mapped != null) return mapped;
  }

  final raw = error.toString();

  // 2. Le code n'est parfois présent que dans le texte.
  final inline = RegExp(r'\[firebase_auth/([\w-]+)\]').firstMatch(raw);
  if (inline != null) {
    final mapped = _messagesByCode[inline.group(1)];
    if (mapped != null) return mapped;
  }

  // 3. Dernier recours : on nettoie le message brut. S'il ne reste rien
  //    d'exploitable, on préfère un message générique à un texte vide.
  //    On retire aussi « Exception: », que Dart ajoute devant tout message
  //    brut et qui n'apprend rien à l'utilisateur.
  final cleaned = raw
      .replaceFirst('FirebaseException: ', '')
      .replaceFirst('Exception: ', '')
      .replaceAll(RegExp(r'\[[^\]]*\]'), '')
      .trim();

  if (cleaned.isEmpty || cleaned.toLowerCase() == 'error') return _fallback;
  return cleaned;
}
