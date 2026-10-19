/**
 * Traduit les erreurs Firebase Auth en messages lisibles pour l'utilisateur.
 *
 * Pourquoi ce fichier existe : le SDK renvoie des messages du genre
 * `Firebase: Error (auth/email-already-in-use).` où la seule information utile
 * est le **code**. Se contenter de retirer le préfixe et le code laissait
 * l'utilisateur devant un « Error . » qui ne lui apprend rien. On s'appuie donc
 * sur `error.code`, qui est stable, pour produire une phrase utile en français.
 */

const MESSAGES_BY_CODE: Record<string, string> = {
  'auth/email-already-in-use': 'Cet email est déjà utilisé. Essaie plutôt de te connecter.',
  'auth/invalid-email': "Cette adresse email n'est pas valide.",
  'auth/missing-email': 'Saisis ton adresse email.',
  'auth/missing-password': 'Saisis ton mot de passe.',
  'auth/weak-password': 'Mot de passe trop court : 6 caractères minimum.',
  'auth/user-not-found': 'Aucun compte ne correspond à cet email.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/invalid-login-credentials': 'Email ou mot de passe incorrect.',
  'auth/user-disabled': 'Ce compte a été désactivé.',
  'auth/too-many-requests': 'Trop de tentatives. Réessaie dans quelques minutes.',
  'auth/network-request-failed': 'Connexion impossible. Vérifie ton accès à internet.',
  'auth/operation-not-allowed': "Cette méthode de connexion n'est pas activée pour ce projet.",
  'auth/api-key-not-valid': 'Configuration Firebase invalide (clé API refusée).',
  'auth/invalid-api-key': 'Configuration Firebase invalide (clé API refusée).',
  'auth/requires-recent-login': 'Reconnecte-toi pour effectuer cette action.',
  'auth/internal-error': 'Erreur temporaire du service. Réessaie.',
};

const FALLBACK = 'Une erreur est survenue. Réessaie.';

/** Extrait `auth/xxx` d'un message brut, quand `error.code` n'est pas fourni. */
function codeFromMessage(message: string): string | null {
  const match = message.match(/\((auth\/[\w-]+)\)/);
  return match ? match[1] : null;
}

export function describeAuthError(error: unknown): string {
  // 1. Cas nominal : le SDK expose un code stable.
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === 'string' && MESSAGES_BY_CODE[code]) {
    return MESSAGES_BY_CODE[code];
  }

  const raw = error instanceof Error ? error.message : String(error ?? '');

  // 2. Le code est parfois uniquement présent dans le message.
  const inlineCode = codeFromMessage(raw);
  if (inlineCode && MESSAGES_BY_CODE[inlineCode]) {
    return MESSAGES_BY_CODE[inlineCode];
  }

  // 3. Dernier recours : on nettoie le message brut. S'il ne reste rien
  //    d'exploitable (c'est le cas du fameux « Error »), on renvoie un
  //    message générique plutôt qu'un texte vide ou absurde.
  const cleaned = raw
    .replace('Firebase: ', '')
    .replace(/\(auth\/[\w-]+\)\.?/, '')
    .replace(/\.$/, '')
    .trim();

  const isMeaningless = cleaned === '' || /^error$/i.test(cleaned);
  return isMeaningless ? FALLBACK : cleaned;
}
