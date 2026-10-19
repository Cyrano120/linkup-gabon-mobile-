/**
 * Garde-fou autour des données de démonstration.
 *
 * Pourquoi ce fichier existe : les apps mobiles écrivent dans le **même**
 * projet Firebase que le site en production (`linkup-gabon`). Or deux
 * mécanismes touchent réellement aux données partagées :
 *
 *  1. l'amorçage automatique, qui injecte des prestataires/missions/messages
 *     de démo dès que la collection `providers` est vide ;
 *  2. le bouton « Réinitialiser les données », qui **supprime** le contenu des
 *     collections `providers`, `requests` et `messages` avant de réinjecter
 *     la démo.
 *
 * Sur un build installé, il suffirait donc d'un appui pour effacer les vraies
 * données du site. On réserve ces opérations aux builds de développement :
 * `__DEV__` vaut `true` dans Expo Go et en développement, `false` dans un
 * build de production (`eas build --profile production`).
 *
 * @see DataContext — amorçage et réinitialisation
 * @see (tabs)/market.tsx — le bouton « Réinitialiser »
 */
export const isDemoDataEnabled: boolean = __DEV__;
