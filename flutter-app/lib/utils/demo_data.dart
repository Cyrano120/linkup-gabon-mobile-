import 'package:flutter/foundation.dart';

/// Garde-fou autour des données de démonstration.
///
/// Pourquoi ce fichier existe : l'application Flutter écrit dans le **même**
/// projet Firebase que le site en production (`linkup-gabon`). Or deux
/// mécanismes touchent réellement aux données partagées :
///
///  1. l'amorçage automatique, qui injecte des prestataires/missions/messages
///     de démo dès que la collection `providers` est vide ;
///  2. le bouton « Réinitialiser les données », qui **supprime** le contenu des
///     collections `providers`, `requests` et `messages` avant de réinjecter
///     la démo.
///
/// Sur un build installé, il suffirait donc d'un appui pour effacer les vraies
/// données du site. On réserve ces opérations au mode debug : `kDebugMode` vaut
/// `true` au lancement depuis l'IDE, `false` dans un build `--release`.
///
/// Symétrique de `expo-app/src/lib/demoData.ts` : les deux apps doivent se
/// comporter de la même façon.
///
/// @see DataController._subscribe — amorçage automatique
/// @see DataController.resetDemoData — réinitialisation
/// @see MarketScreen — le bouton « Réinitialiser »
const bool isDemoDataEnabled = kDebugMode;
