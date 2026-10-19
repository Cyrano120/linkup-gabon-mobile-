import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:linkup_gabon/utils/auth_errors.dart';

/// Non-régression : l'application affichait auparavant « Error . » — un message
/// vide de sens — parce que le nettoyage retirait le code d'erreur, qui était
/// justement la seule information utile.
void main() {
  group('describeAuthError', () {
    test('traduit un code connu en français', () {
      final error = FirebaseAuthException(
        code: 'email-already-in-use',
        message: 'The email address is already in use by another account.',
      );

      expect(
        describeAuthError(error),
        'Cet email est déjà utilisé. Essaie plutôt de te connecter.',
      );
    });

    test('extrait le code quand seul le texte brut le contient', () {
      final error = Exception(
        '[firebase_auth/wrong-password] The password is invalid.',
      );

      expect(describeAuthError(error), 'Mot de passe incorrect.');
    });

    test('ne renvoie jamais un message vide ou absurde', () {
      final result = describeAuthError(Exception('Error'));

      expect(result, isNotEmpty);
      expect(result.toLowerCase(), isNot('error'));
      expect(result, 'Une erreur est survenue. Réessaie.');
    });

    test('conserve un message brut exploitable', () {
      final result = describeAuthError(Exception('Le serveur est injoignable.'));

      expect(result, 'Le serveur est injoignable.');
    });
  });
}
