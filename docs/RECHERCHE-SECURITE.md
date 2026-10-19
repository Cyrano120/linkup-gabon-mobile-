# Recherche sécurité — LinkUp Gabon

> **Document** : état de l'art, audit du dépôt et plan de durcissement
> **Projet** : LinkUp Gabon — place de marché de services (web, Expo/React Native, Flutter)
> **Backend** : projet Firebase partagé `linkup-gabon` (Auth, Firestore, FCM)
> **Date de rédaction** : 19 octobre 2026
> **Auteur** : revue technique et juridique assistée
> **Statut** : document de travail — chaque affirmation est sourcée ; les points incertains sont marqués **« à vérifier »**.

---

## Avertissement

Ce document n'est pas un avis juridique. Les citations de textes gabonais sont reproduites depuis les sources
officielles citées en annexe, mais l'interprétation de leur applicabilité à LinkUp Gabon doit être validée par un
conseil gabonais qualifié (avocat, DPO, APDPVP). Les décisions d'architecture décrites ici sont des recommandations
techniques : elles ne dispensent d'aucune formalité légale.

Les valeurs de configuration Firebase (clés d'API Web, `projectId`, etc.) ne sont pas des secrets : la sécurité de
Firebase repose sur les règles de sécurité, App Check, la validation serveur et les contrôles d'accès, pas sur la
confidentialité de ces valeurs. Voir la documentation officielle :
<https://firebase.google.com/docs/projects/api-keys>.

---

## Sommaire

1. [Synthèse exécutive](#1-synthèse-exécutive)
2. [Périmètre, méthode et sources](#2-périmètre-méthode-et-sources)
3. [Cadre juridique gabonais](#3-cadre-juridique-gabonais)
4. [Panorama des risques d'une place de marché](#4-panorama-des-risques-dune-place-de-marché)
5. [Audit du dépôt actuel](#5-audit-du-dépôt-actuel)
6. [Bonnes pratiques techniques](#6-bonnes-pratiques-techniques)
7. [Modèle de données cible et migration](#7-modèle-de-données-cible-et-migration)
8. [Règles Firestore prêtes à l'emploi](#8-règles-firestore-prêtes-à-lemploi)
9. [Index Firestore requis](#9-index-firestore-requis)
10. [Contrôles produit spécifiques](#10-contrôles-produit-spécifiques)
11. [Plan de durcissement priorisé](#11-plan-de-durcissement-priorisé)
12. [Annexes : sources et vérifications](#12-annexes--sources-et-vérifications)

---

## 1. Synthèse exécutive

LinkUp Gabon est une place de marché multi-clients (web, Expo, Flutter) qui partage un unique projet Firebase avec
des collections communes. L'audit du dépôt montre un socle fonctionnel mais **des règles Firestore ouvertes** :
prestataires et missions sont lisibles publiquement sans filtrage, et **tout compte connecté peut modifier ou
supprimer n'importe quel document**. La messagerie est lisible par tout compte connecté, les statuts de mission sont
écrits côté client, et les avis sont embarqués dans le document prestataire sans contrôle d'authenticité. À cela
s'ajoute une recommandation erronée dans la documentation interne (désactiver la protection contre l'énumération des
e-mails) et l'absence de vérification d'e-mail, de MFA, d'App Check, de règles Storage, de limitation de débit et de
journal d'audit.

| # | Risque principal | Impact | Correctif prioritaire |
|---|---|---|---|
| R1 | Règles Firestore : écriture illimitée par tout compte connecté | Corruption/suppression de toutes les données partagées, fraude | Règles « deny by default » + rôles + validation de schéma (§8) |
| R2 | Lecture publique des missions et messages par tout compte | Fuite de données personnelles (localisation, échanges), harcèlement | Lecture limitée aux participants et aux missions ouvertes (§8) |
| R3 | Identités faibles : e-mail non vérifié, pas de MFA/App Check | Faux comptes, usurpation, automatisation abusive | Vérification e-mail obligatoire, MFA, App Check (§6) |
| R4 | Statuts, candidatures, avis et paiements pilotés par le client | Escroquerie, faux avis, contournement de l'escrow | Transitions serveur via Cloud Functions, avis vérifiés (§10) |
| R5 | Transfert de données hors Gabon sans autorisation APDPVP | Sanctions APDPVP, conformité Loi 001/2011 modifiée | Analyse art. 171/173, formalités, hébergement/registre (§3) |

La faille la plus grave est R1 : aujourd'hui, un compte valide peut réécrire l'intégralité de l'annuaire et des
missions, y compris supprimer les données du site partagé. C'est aussi la plus rapide à corriger.

---

## 2. Périmètre, méthode et sources

### 2.1 Périmètre

Sont couverts :

- les trois clients (`expo-app`, `flutter-app`, web) dans leur usage de Firebase ;
- les collections Firestore `providers`, `requests`, `messages`, `devices`, plus les collections cibles
  `users`, `publicProfiles`, `disputes`, `moderationReports`, `auditLogs`, `config`, et les sous-collections
  `providers/*/reviews`, `requests/*/transactions`, `users/*/consents` ;
- l'authentification, les notifications, les règles de sécurité, la validation serveur et la conformité.

Ne sont pas couverts : le code web proprement dit (hors interactions Firebase), l'infrastructure réseau, les
contrats avec les prestataires de paiement, la sécurité physique.

### 2.2 Méthode

1. Lecture du dépôt et des documents internes (`docs/ARCHITECTURE.md`, `docs/FIREBASE.md`, règles et index).
2. Recensement des écritures client et de leurs schémas (`expo-app/src/lib`, `expo-app/src/context`,
   `flutter-app/lib/models`, `flutter-app/lib/services`).
3. Revue des sources juridiques gabonaises officielles (APDPVP, Journal Officiel).
4. Revue des référentiels techniques (Firebase, OWASP, CNIL) et sectoriels (GSMA, CEMAC).
5. Conception et **validation effective** des règles Firestore proposées avec l'émulateur Firebase (§12.3).

### 2.3 Convention de preuve

- Les affirmations juridiques citent l'article et l'URL.
- Les affirmations techniques citent la documentation officielle.
- Les points non vérifiables en ligne sont marqués **« à vérifier »**.
- Aucune statistique, aucun numéro de loi, aucune date et aucun nom d'API n'a été inventé.

---

## 3. Cadre juridique gabonais

### 3.1 Loi fondatrice et modification

Le texte de référence est la **Loi n° 001/2011 du 25 septembre 2011 relative à la protection des données à
caractère personnel**, modifiée par la **Loi n° 025/2023**.

- Texte consolidé publié par l'APDPVP : <https://www.apdpvp.ga/textes-et-decisions/>
- Publication au Journal Officiel : « JOURNAL OFFICIEL N°218 BIS DU 15 JUILLET 2023 », rubrique
  « Loi N° 025/2023 du 09/07/2023 portant modification de la loi n°001/2011 du 25 septembre 2011 relative à la
  protection des données à caractère personnel » : <https://journal-officiel.ga/20085-025-2023-/>

> **Incohérence de date — à vérifier.** Le Journal Officiel indique **09/07/2023**. Le PDF consolidé publié par
> l'APDPVP porte la mention « Fait à Libreville, le 12 juillet 2023 ». Les deux sources officielles divergent.
> Toute citation doit préciser la source utilisée.

### 3.2 Autorité compétente

L'**Autorité pour la Protection des Données Personnelles et de la Vie Privée (APDPVP)** est créée par
l'**article 7** de la loi : « Il est créé, une Autorité chargée de veiller à la Protection des Données Personnelles et
de la Vie Privée en République Gabonaise […] L'APDPVP est une autorité administrative indépendante. »

Ses missions sont définies à l'**article 8**, notamment : autoriser certains traitements, donner un avis sur
d'autres, recevoir les déclarations, recevoir les plaintes, prononcer les mesures et sanctions des articles 199 à
204, et publier des normes de sécurité.

- Site officiel : <https://www.apdpvp.ga/>
- Textes, délibérations, autorisations, déclarations, sanctions : <https://www.apdpvp.ga/textes-et-decisions/>

### 3.3 Obligations directement pertinentes pour LinkUp

| Sujet | Article | Contenu (citation ou synthèse fidèle) | Conséquence pour LinkUp |
|---|---|---|---|
| Formalités préalables | 79–82 | Déclaration ou autorisation selon les cas ; l'APDPVP autorise notamment les traitements de l'art. 81 (dont les données biométriques de contrôle d'identité) | Déclarer/autoriser le traitement « place de marché » avant mise en production |
| Sécurité | 113 | « mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque », dont pseudonymisation/chiffrement, confidentialité/intégrité/disponibilité, restauration et tests réguliers | Règles, chiffrement, sauvegardes, tests d'intrusion |
| Violation de données | 142 | « En cas de violation de données, le responsable du traitement informe, sans délai, l'APDPVP. » | Procédure d'incident et registre |
| Violation à risque élevé | 145 | Informer « la personne concernée dans les meilleurs délais » | Notification aux utilisateurs affectés |
| Registre des violations | 147 | Tenue d'un registre des violations et mise à disposition de l'APDPVP | Journal d'audit dédié |
| Délégué à la protection des données | 125 | DPO obligatoire notamment pour un suivi régulier et systématique à grande échelle, ou un traitement à grande échelle de données sensibles | Désignation à évaluer, puis notification (art. 131) |
| Droits des personnes | 50–53, 60, 73 | Accès, rectification, effacement, opposition, retrait du consentement | Écrans et API de droits, délais de traitement |
| Transfert hors Gabon | 171 | « Un responsable de traitement ne peut transférer des données personnelles vers un autre Etat que sur autorisation de l'APDPVP. » | Firebase héberge hors Gabon : analyse obligatoire |
| Dérogations au transfert | 173 | Transfert possible notamment si consentement exprès **et** l'une des conditions énumérées | Ne pas présumer que le consentement seul suffit |
| Liste des États adéquats | 171 al. 4 | L'APDPVP « publie la liste des Etats qui garantissent un niveau de protection suffisant » | **À vérifier** : aucune liste publiquement accessible n'a été trouvée au 19/10/2026 |

> **Réserve de lecture.** L'article 8 (missions de l'APDPVP) renvoie à l'article 80 pour les autorisations et aux
> articles 81–82 pour les avis, alors que l'article 81 dispose lui-même que les traitements qu'il énumère — dont les
> données biométriques nécessaires au contrôle d'identité — sont « mis en œuvre après autorisation de l'APDPVP ».
> Cette divergence de renvoi doit être confirmée auprès de l'APDPVP avant tout dépôt de dossier KYC.

**Point juridique majeur.** Le stockage des données de LinkUp dans Firebase (infrastructure Google, hors Gabon)
constitue un transfert de données personnelles vers un autre État. L'article 171 subordonne ce transfert à une
**autorisation préalable de l'APDPVP**, l'article 173 n'ouvrant que des dérogations conditionnelles. Il ne s'agit
donc pas d'une simple question d'adéquation « à la RGPD ». Voir aussi la loi cybersécurité ci-dessous, qui ajoute
des exigences d'hébergement national.

### 3.4 Loi n° 027/2023 — cybersécurité et cybercriminalité

- Texte : « Loi N° 027/2023 du 11/07/2023 portant règlementation de la cybersécurité et de la lutte contre la
  cybercriminalité en République Gabonaise », J.O. n°218 bis du 15 juillet 2023 :
  <https://journal-officiel.ga/20087-027-2023-/>

Articles saillants (reproduits ou résumés fidèlement) :

| Article | Contenu | Conséquence |
|---|---|---|
| 3 | La loi s'applique à tout usage des TIC produisant ses effets au Gabon, y compris par une personne étrangère contre des intérêts gabonais | Applicabilité large |
| 19 | Les opérateurs et fournisseurs doivent garantir la sécurité des services et informer les usagers des risques | Information des utilisateurs |
| 20 | Conservation des **données de connexion et de trafic pendant dix ans** sur le territoire national | À concilier avec la minimisation ; **à vérifier** avec un conseil |
| 27 | Les données confidentielles ou sensibles doivent être **exclusivement hébergées sur le territoire national**, sauf dérogation écrite | Risque direct pour Firebase |
| 28 | Mesures techniques et administratives, gestion continue des risques, visa de conformité | Gouvernance sécurité |
| 31 | Les exploitants de systèmes d'information conservent les données de connexion et de trafic **dix ans** | Rétention longue |
| 34 | **Audit de sécurité obligatoire et périodique** | Programme d'audit |
| 36 | « Tout opérateur est tenu d'héberger une copie de ses données sur le territoire national » | **À vérifier** : qualification de LinkUp comme « opérateur » |
| 38 | Confidentialité des communications ; interdiction d'interception sans consentement | Chiffrement en transit, pas d'écoute |
| 49–56 | Accès et atteinte frauduleux à un système d'information : peines d'emprisonnement et amendes | Cadre répressif |
| 73 | Usurpation d'identité numérique : 5 ans et 10 000 000 FCFA au plus | Faux profils |
| 75 | Escroquerie, abus de confiance, vol par voie électronique : peines du Code pénal | Fraude marketplace |

> **À vérifier avec un conseil.** L'application de l'article 27 (hébergement national exclusif des données sensibles)
> et de l'article 36 (copie nationale) à une place de marché opérée depuis le Gabon est un point juridique
> déterminant. Il peut imposer une architecture de données hybride ou des dérogations écrites.

### 3.5 Paiement et monnaie électronique (CEMAC)

Le cadre communautaire des services de paiement est le **Règlement n° 04/18/CEMAC/UMAC/COBAC du 21 décembre 2018
relatif aux services de paiement dans la CEMAC** :

- PDF BEAC : <https://www.beac.int/wp-content/uploads/2019/07/REGLEMENT-N-04-18-CEMAC-UMAC-COBAC-du-21-décembre-2018.pdf>

Une fonction de séquestre (escrow) et la manipulation de fonds pour compte de tiers relèvent en principe d'un
agrément ou d'un partenariat avec un établissement agréé. **À vérifier** : la qualification exacte de LinkUp
(intermédiaire technique vs prestataire de paiement) et les obligations COBAC applicables. Recommandation : ne jamais
détenir directement les fonds ; s'appuyer sur un prestataire agréé et un compte de cantonnement.

### 3.6 Fraude dans la monnaie mobile

Référence sectorielle : GSMA, *Mobile Money Fraud Typologies and Mitigation Strategies* (2024) :
<https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma_resources/mobile-money-fraud-typologies-and-mitigation-strategies/>.
Utile pour modéliser les typologies (faux vendeurs, ingénierie sociale, blanchiment via comptes mules, rejets de
transaction) et les contre-mesures.

### 3.7 Formalités APDPVP — synthèse opérationnelle

1. Cartographier les traitements (finalités, bases légales, durées, destinataires, transferts).
2. Déposer les formalités préalables (déclaration ou demande d'autorisation, art. 79–82).
3. Désigner un DPO si les critères de l'article 125 sont réunis ; notifier la désignation (art. 131).
4. Mettre en place la procédure de violation (art. 142, 145, 147).
5. Encadrer les transferts (art. 171, 173) et documenter chaque sous-traitant (art. 115–117).
6. Publier une politique de confidentialité et recueillir un consentement libre, spécifique et informé (définition à
   l'article 6 ; retrait à l'article 73).

---

## 4. Panorama des risques d'une place de marché

| Famille | Scénario | Contre-mesure principale |
|---|---|---|
| Faux profils | Prestataire fictif, photo volée, identité usurpée | Vérification e-mail/téléphone, KYC par paliers, modération, signalement |
| Fraude au paiement | Faux reçu mobile money, demande de paiement hors plateforme | Escrow, statuts serveur, jamais de coordonnées de paiement dans les messages |
| Contournement de la plateforme | Échange de numéros puis transaction hors plateforme | Détection/limitation des contacts, contrats et avis in-app |
| Faux avis | Auto-avis, avis achetés, review bombing | Avis vérifiés serveur après mission terminée, unicité par mission |
| Harcèlement / contenus illicites | Messages abusifs, menaces, contenus racistes ou xénophobes | Modération, blocage, journalisation, signalement (loi 027/2023, art. 70–71) |
| Sécurité des mineurs | Contact inapproprié, contenu pédocriminel | Politique de tolérance zéro, filtrage, signalement aux autorités (loi 027/2023, art. 64–68) |
| Blanchiment / mules | Comptes multiples, virements fractionnés | KYC, plafonds, surveillance, partenariat agréé |
| Fuite de données | Règles ouvertes, sauvegardes non chiffrées, journaux bavards | Règles, chiffrement, minimisation, tests (§6) |
| Déni de service / abus API | Création massive de comptes et de missions | App Check, quotas, rate limiting serveur |
| Ingénierie sociale | Faux support LinkUp, phishing | Authentification renforcée, pédagogie, canaux officiels signés |
| Atteinte à la réputation | Faux avis, usurpation de marque | Vérification, modération, procédure de retrait |

---

## 5. Audit du dépôt actuel

### 5.1 Constats dans `firestore.rules`

Fichier actuel : `firestore.rules` (racine du dépôt).

| Ligne | Règle | Problème |
|---|---|---|
| 17–21 | `providers` : `allow read: if true;` et `allow update, delete: if isAuth();` | Lecture publique de tout ; **tout compte peut modifier/supprimer n'importe quelle fiche** |
| 24–28 | `requests` : mêmes motifs | **Tout compte peut modifier/supprimer n'importe quelle mission**, y compris changer son statut |
| 31–34 | `messages` : `allow read, update, delete: if isAuth();` | **Toute la messagerie est lisible par tout compte connecté** |
| 37–39 | `devices/{userId}` propriétaire | Correct sur le principe, mais aucune validation de schéma |
| 42–44 | `users/{userId}` propriétaire | Aucune validation ; aucune écriture réelle de profil dans le code |

Il n'existe **aucune règle Storage** (`firebase.json` ne déclare que Firestore) et **aucune Cloud Function**
(`firebase.json` ne déclare pas de bloc `functions`).

### 5.2 Constats dans les clients

| Fichier | Constat | Risque |
|---|---|---|
| `expo-app/src/lib/firestore.ts:45` | `createdAt: Date.now()` | Timestamp client falsifiable ; tri et audit non fiables |
| `expo-app/src/lib/firestore.ts:55` | `updatedAt: Date.now()` | Idem |
| `expo-app/src/lib/firestore.ts:68-72` | `clearCollection()` supprime tous les documents | Destruction de données partagées |
| `expo-app/src/context/DataContext.tsx:133-145` | `addRequest` écrit `status: 'Ouverte'` et un `createdBy` optionnel | Statut métier écrit par le client |
| `expo-app/src/context/DataContext.tsx:168-189` | `bookProvider` écrit `status: 'En discussion'` et une mission avec `provider` = nom | Statut et affectation par le client |
| `expo-app/src/context/DataContext.tsx:191-197` | `updateRequestStatus` écrit le statut directement | **Contournement total du workflow** |
| `expo-app/src/context/DataContext.tsx:199-207` | `applyToMission` ajoute un **nom d'affichage** dans `candidates` | Usurpation de candidature ; pas d'UID |
| `expo-app/src/context/DataContext.tsx:209-226` | `acceptCandidate` fixe `status: 'Confirmée'` | Affectation par le client |
| `expo-app/src/context/DataContext.tsx:239-255` | `resetDemoData` efface `providers`, `requests`, `messages` | Protégé par `isDemoDataEnabled`, mais reste destructeur sur base partagée |
| `expo-app/src/lib/notifications.ts:155-171` | `devices/{uid}` avec `updatedAt: Date.now()` | Un seul appareil par compte, timestamp client, pas de purge |
| `expo-app/src/types.ts:33,50,61` | `createdBy?` optionnel ; `from`/`to` et `candidates` sont des **noms** | Impossible de sécuriser par UID |
| `docs/FIREBASE.md:12` | « Désactiver “Email enumeration protection” » | **Recommandation dangereuse** : expose l'existence des comptes (énumération d'e-mails) sans bénéfice de sécurité |
| `docs/FIREBASE.md:75-91` | Fonction FCM qui lit **tous** les `devices` et envoie en une fois | Pas de batching (limite 500), pas de purge des tokens, diffusion large |
| `docs/FIREBASE.md:112` | Reset de démo destructeur sur base partagée | Risque opérationnel |

### 5.3 Absences structurelles

- Aucune vérification d'e-mail (`sendEmailVerification`), aucun contrôle `emailVerified`.
- Aucune authentification par téléphone, aucun MFA, aucun `deleteUser`/réauthentification.
- Aucun custom claim, aucun rôle serveur, aucun écran d'administration.
- Aucun App Check (ni web, ni Flutter, ni Expo).
- Aucune Cloud Function : tout le métier est côté client.
- Aucune collection `users` réellement écrite : pas de profil centralisé.
- Aucun `storage.rules` : risque futur dès l'ajout de photos de profil ou de pièces KYC.
- Aucun journal d'audit, aucune limitation de débit, aucune gestion d'incident documentée.
- Aucune procédure de conformité APDPVP documentée.

### 5.4 Ce qui fonctionne déjà

- Séparation en couches correcte (`lib/services`, `context`) et modèles typés.
- `devices/{userId}` limité au propriétaire.
- Conscience du risque de démo destructrice (`isDemoDataEnabled`, `kDebugMode`).
- Design system cohérent et présence de trois clients partageant un domaine unique.
- Index composites déjà définis pour `category+price`, `status+budget`, `location+urgency`.

---

## 6. Bonnes pratiques techniques

### 6.1 Authentification

| Mesure | Pourquoi | Référence |
|---|---|---|
| Vérification d'e-mail obligatoire avant toute écriture métier | Empêche les comptes jetables et l'usurpation | <https://firebase.google.com/docs/auth/web/manage-users> |
| Ne **pas** désactiver la protection contre l'énumération | Depuis le 15/09/2023, elle est activée par défaut pour les nouveaux projets ; la désactiver expose la base d'e-mails | <https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection> |
| MFA (TOTP/SMS) pour prestataires, modérateurs et admins | Protège les comptes sensibles | <https://firebase.google.com/docs/auth/web/multi-factor> |
| Custom claims pour `role` (`user`, `provider`, `moderator`, `admin`) | Autorisation serveur, non falsifiable par le client | <https://firebase.google.com/docs/auth/admin/custom-claims> |
| Limiter la taille des claims (< 1000 octets) | Contrainte Firebase | <https://firebase.google.com/docs/auth/admin/custom-claims> |
| Politique de mot de passe forte | Réduit le bourrage d'identifiants | <https://www.cnil.fr/fr/authentification-par-mot-de-passe-les-mesures-de-securite-elementaires> |
| Réauthentification avant actions sensibles | Empêche les prises de contrôle sur session volée | <https://firebase.google.com/docs/auth/web/manage-users> |

**MFA et Identity Platform.** La MFA Firebase (SMS/TOTP) nécessite Firebase Authentication avec Identity Platform
(offre payante) : **à vérifier** selon le contrat et la configuration du projet `linkup-gabon`.

**Expo/React Native.** Le SDK Firebase JS seul ne fournit pas d'attestation **native** App Check pour React Native.
Utiliser `@react-native-firebase/app-check` dans un **development build** (pas Expo Go) :
<https://rnfirebase.io/app-check/usage>. Vérifier la compatibilité avec le SDK Expo utilisé
(voir `expo-app/package.json` et <https://docs.expo.dev/versions/latest/>) — **à vérifier version par version**.

### 6.2 Règles de sécurité Firestore

Principes :

1. **Refus par défaut** : terminer par `match /{document=**} { allow read, write: if false; }`.
2. **Aucune confiance au client** : timestamps serveur (`request.time`), champs de statut/rôle/prix/avis/notes écrits
   par le serveur.
3. **Validation de schéma** : `keys().hasAll()`, `keys().hasOnly()`, types, bornes de taille, énumérations.
4. **Immutabilité** : vérifier les champs non modifiables avec `diff().affectedKeys()`.
5. **Portée minimale** : un utilisateur ne lit que ce qui le concerne ; un annuaire public n'expose que les fiches
   actives.
6. **Fonctions `get()`/`exists()` avec parcimonie** : limite par requête, coût en lectures.

Références :

- <https://firebase.google.com/docs/firestore/security/get-started>
- <https://firebase.google.com/docs/firestore/security/rules-conditions>
- <https://firebase.google.com/docs/firestore/security/rules-fields>
- <https://firebase.google.com/docs/rules/rules-language>
- Tests unitaires de règles : <https://firebase.google.com/docs/rules/unit-tests>

### 6.3 App Check

App Check atteste que les requêtes proviennent de l'application légitime, et non d'un script ou d'un client modifié.

- Vue d'ensemble : <https://firebase.google.com/docs/app-check>
- Web (reCAPTCHA Enterprise) : <https://firebase.google.com/docs/app-check/web/recaptcha-provider>
- Flutter : <https://firebase.google.com/docs/app-check/flutter/default-providers>
- Expo/RN : `@react-native-firebase/app-check` (development build) : <https://rnfirebase.io/app-check/usage>

Activer l'application forcée (enforcement) par service dans la console, après une période d'observation. App Check
ne remplace pas les règles : il les complète.

### 6.4 Cloud Functions et validation serveur

Toute transition d'état métier doit être serveur (Admin SDK, qui contourne les règles) :

- création de profil et custom claims à l'inscription ;
- candidature d'un prestataire, acceptation, démarrage, terminaison, annulation ;
- ouverture et résolution de litige ;
- écriture des avis vérifiés ;
- paiements et séquestre (webhooks signés du prestataire agréé) ;
- suspension, masquage, sanction, journal d'audit ;
- purge des tokens FCM invalides.

Références :

- <https://firebase.google.com/docs/functions>
- <https://firebase.google.com/docs/functions/callable>
- Bonnes pratiques de sécurité : <https://firebase.google.com/docs/functions/security>

**FCM.** `sendEachForMulticast` est plafonné à **500 tokens** par appel : découper en lots, gérer les erreurs par
token et supprimer les tokens invalides :
<https://firebase.google.com/docs/cloud-messaging/send-message>.

### 6.5 Storage

Dès qu'un fichier est téléversé (photo de profil, pièce KYC, preuve de litige) :

1. Créer `storage.rules` et les déclarer dans `firebase.json`.
2. Interdire la lecture publique des pièces KYC ; servir via URL signée de courte durée.
3. Valider type MIME et taille côté règles et côté serveur.
4. Chiffrer et limiter la durée de conservation.
5. Référence : <https://firebase.google.com/docs/storage/security>.

### 6.6 Journalisation, détection et réponse à incident

- Journal d'audit **immuable** (collection `auditLogs`, écriture serveur seule) pour : changement de rôle, sanction,
  accès administrateur, résolution de litige, remboursement, export de données.
- Cloud Logging + alerting sur erreurs `permission-denied` anormales, pics de création de comptes, échecs de
  paiement.
- **Procédure de violation** alignée sur les articles 142, 145 et 147 : détection, qualification, information de
  l'APDPVP « sans délai », information des personnes si risque élevé, registre.
- Exercices de restauration (art. 113 : tester et évaluer régulièrement les mesures).

### 6.7 Durcissement mobile (OWASP)

| Référentiel | Usage | URL |
|---|---|---|
| MASVS | Exigences de sécurité mobile | <https://mas.owasp.org/MASVS/> |
| MASTG | Tests et techniques | <https://mas.owasp.org/MASTG/> |
| OWASP Top 10 | Risques d'application web/API | <https://owasp.org/www-project-top-ten/> |
| OWASP Mobile Top 10 | Risques mobiles | <https://owasp.org/www-project-mobile-top-10/> |
| ASVS v5.0.0 | Vérification applicative | <https://owasp.org/www-project-application-security-verification-standard/> |

Points concrets :

- ne jamais embarquer de secret (clé serveur, clé de paiement) dans l'application ;
- stocker les jetons dans le trousseau sécurisé (`expo-secure-store`, Keychain/Keystore ;
  `flutter_secure_storage`) ;
- valider les liens profonds et les paramètres d'URL ;
- désactiver les journaux contenant des données personnelles en production ;
- épingler les certificats si l'équipe peut maintenir la rotation (**à évaluer**) ;
- détecter root/jailbreak pour les fonctions sensibles (défense en profondeur) ;
- gérer la version minimale et forcer la mise à jour en cas de faille.

### 6.8 Dépendances et CI

- `npm audit` / `bun audit` et `flutter pub outdated` en CI ;
- Dependabot/Renovate ;
- analyse statique (`npx expo lint`, `npx tsc --noEmit`, `flutter analyze`) ;
- tests de règles dans la CI avec l'émulateur (`firebase emulators:exec --only firestore "npm test"`).

---

## 7. Modèle de données cible et migration

### 7.1 Principe

Passer d'un modèle « nom d'affichage » à un modèle **UID-first**, avec des statuts et des champs sensibles écrits
par le serveur. Les règles du §8 sont écrites pour ce modèle cible : **elles casseront les clients actuels jusqu'à
la migration**. Déployer dans cet ordre : migration des données → déploiement des clients → déploiement des règles.

### 7.2 Correspondance des champs

| Collection | Modèle actuel | Modèle cible | Transformation |
|---|---|---|---|
| `providers` | `id: number`, `createdBy?`, `reviews[]`, `rating`, `missions` | `ownerUid`, `verified`, `rating`, `reviewCount`, `missions`, `active`, `createdAt`/`updatedAt` serveur | `createdBy` → `ownerUid` ; extraire `reviews` vers la sous-collection ; notes calculées serveur |
| `requests` | `client: string`, `provider: string`, `candidates: string[]`, `status` FR | `clientUid`, `clientName`, `assignedProviderUid`, `candidateUids[]`, `participantUids[]`, `status` machine | Résoudre les noms en UID via l'index des utilisateurs ; traduire les statuts |
| `messages` | `from`/`to` = noms, pas de lien de mission | `requestId`, `senderUid`, `recipientUid`, `participantUids[]`, `readBy[]` | Ajouter `requestId` ; résoudre les UID ; message existant sans `requestId` à archiver |
| `devices` | `devices/{uid}` (un appareil) | `devices/{deviceId}` avec `userId` | Générer un identifiant par appareil ; conserver `userId` |
| `users` | inexistant | `users/{uid}` privé + `publicProfiles/{uid}` public | Créer à l'inscription via Cloud Function |
| `reviews` | embarqué | `providers/{providerId}/reviews/{reviewId}` | Écriture serveur, `verified` |

### 7.3 Traduction des statuts

| Ancien (FR) | Nouveau (machine) | Signification |
|---|---|---|
| `Ouverte` | `open` | Publiée, candidatures possibles |
| `En discussion` | `discussing` | Au moins un candidat ou une conversation |
| `Confirmée` | `assigned` | Prestataire retenu |
| — | `in_progress` | Mission commencée |
| `Terminée` | `completed` | Mission terminée, avis possible |
| — | `cancelled` | Annulée |
| — | `disputed` | Litige en cours |

### 7.4 Actions client à modifier

| Fichier | Action |
|---|---|
| `expo-app/src/lib/firestore.ts` | Supprimer `Date.now()` ; utiliser `serverTimestamp()` ; retirer `clearCollection` des builds de production |
| `expo-app/src/context/DataContext.tsx` | Remplacer `updateRequestStatus`, `applyToMission`, `acceptCandidate`, `bookProvider` par des appels de Cloud Function |
| `expo-app/src/lib/notifications.ts` | Écrire `devices/{deviceId}` avec `userId`, `createdAt`/`updatedAt` serveur, `appVersion` |
| `expo-app/src/types.ts` | Ajouter `ownerUid`, `clientUid`, `assignedProviderUid`, `candidateUids`, `participantUids`, `senderUid`, `recipientUid`, `requestId`, `readBy` |
| `flutter-app/lib/models/*` | Mêmes champs ; supprimer l'écriture de statut côté client |
| `flutter-app/lib/services/firestore_service.dart` | `FieldValue.serverTimestamp()` et `Timestamp` |
| `docs/FIREBASE.md` | Corriger la recommandation sur l'énumération d'e-mails ; documenter App Check et les rôles |
| `firebase.json` | Ajouter `storage` et `functions` |

### 7.5 Script de migration (esquisse)

Un script Node.js exécuté avec les identifiants Admin doit :

1. créer `users/{uid}` et `publicProfiles/{uid}` depuis les comptes Auth ;
2. résoudre `createdBy`/`client`/`provider`/`from`/`to`/`candidates` en UID ;
3. extraire `providers.*.reviews[]` vers `providers/{id}/reviews/*` avec `published: true`, `verified: false` pour
   l'historique ;
4. convertir les timestamps numériques en `Timestamp` ;
5. journaliser chaque transformation dans `auditLogs` ;
6. être idempotent et sauvegarder un export avant exécution.

> Ne pas lancer de migration destructive sans export préalable (`gcloud firestore export`) et sans environnement de
> recette.

---

## 8. Règles Firestore prêtes à l'emploi

Le fichier ci-dessous remplace `firestore.rules`. Il a été **compilé et testé** avec l'émulateur Firebase
(firebase-tools 15.18.0, émulateur Firestore 1.21.0) sur 25 scénarios d'autorisation/refus — détail en §12.3.

Points de conception :

- **refus par défaut** ;
- rôles dans les custom claims, jamais dans un document modifiable ;
- écritures métier (statuts, candidatures, participants, avis, paiements) réservées au serveur ;
- timestamps serveur obligatoires ;
- validation de schéma par `hasAll`/`hasOnly`, types, bornes et énumérations ;
- annuaire public limité aux fiches `active == true` ;
- messagerie limitée aux `participantUids` de la demande liée ;
- sous-collections sensibles (`transactions`, `auditLogs`, `rateLimits`) interdites en écriture client.

```javascript
rules_version = '2';

// =============================================================================
// LinkUp Gabon — règles Firestore cibles (schéma UID-first)
// Projet Firebase : linkup-gabon
//
// PRINCIPE : refus par défaut. Toute écriture métier sensible (statuts,
// candidatures, avis vérifiés, paiements, KYC, sanctions) passe par une Cloud
// Function appelée côté serveur (Admin SDK), qui contourne ces règles.
//
// ATTENTION : ce fichier n'est PAS compatible avec les clients actuels, qui
// écrivent des noms d'affichage et des timestamps client. Le déploiement doit
// être précédé de la migration décrite dans docs/RECHERCHE-SECURITE.md.
// =============================================================================

service cloud.firestore {
  match /databases/{database}/documents {

    // ---------------------------------------------------------------------
    // Fonctions utilitaires
    // ---------------------------------------------------------------------

    function isSignedIn() {
      return request.auth != null;
    }

    function uid() {
      return request.auth.uid;
    }

    function isOwner(ownerUid) {
      return isSignedIn() && uid() == ownerUid;
    }

    // Rôle stocké dans un custom claim, jamais dans un document modifiable
    // par le client. Valeurs attendues : user | provider | moderator | admin.
    function role() {
      return isSignedIn() ? request.auth.token.get('role', 'user') : 'anonymous';
    }

    function isAdmin() {
      return isSignedIn() && role() == 'admin';
    }

    function isModerator() {
      return isSignedIn() && (role() == 'admin' || role() == 'moderator');
    }

    // Écritures métier : compte non anonyme, e-mail vérifié ou téléphone
    // vérifié. Les comptes anonymes et les custom tokens non vérifiés sont
    // refusés.
    function hasVerifiedIdentity() {
      return isSignedIn()
        && (request.auth.token.get('email_verified', false) == true
            || request.auth.token.get('phone_number', '') != '');
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    function changedKeys() {
      return incoming().diff(existing()).affectedKeys();
    }

    // Lecture d'une demande pour vérifier l'appartenance d'un participant.
    // get() échoue si le document n'existe pas : la règle refuse alors.
    function requestData(requestId) {
      return get(/databases/$(database)/documents/requests/$(requestId)).data;
    }

    // ---------------------------------------------------------------------
    // providers/{providerId}
    // Annuaire public : seules les fiches actives sont listables. Le
    // propriétaire peut lire sa fiche même inactive.
    // ---------------------------------------------------------------------

    function validProviderFields(data) {
      return data.keys().hasAll([
          'ownerUid', 'name', 'role', 'category', 'price', 'location',
          'headline', 'bio', 'skills', 'image', 'cover', 'gallery',
          'available', 'active', 'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && data.keys().hasOnly([
          'ownerUid', 'name', 'role', 'category', 'price', 'location',
          'headline', 'bio', 'skills', 'image', 'cover', 'gallery',
          'available', 'active', 'createdAt', 'updatedAt', 'schemaVersion',
          'verified', 'rating', 'reviewCount', 'missions', 'responseTime',
          'successRate'
        ])
        && data.ownerUid is string
        && data.name is string && data.name.size() >= 2 && data.name.size() <= 80
        && data.role is string && data.role.size() >= 2 && data.role.size() <= 80
        && data.category in ['Informatique', 'Cours', 'Livraison', 'Design & Web']
        && data.price is number && data.price >= 0 && data.price <= 10000000
        && data.location is string && data.location.size() >= 2 && data.location.size() <= 120
        && data.headline is string && data.headline.size() <= 160
        && data.bio is string && data.bio.size() <= 2000
        && data.skills is list && data.skills.size() <= 20
        && data.image is string && data.image.size() <= 500
        && data.cover is string && data.cover.size() <= 500
        && data.gallery is list && data.gallery.size() <= 10
        && data.available is bool
        && data.active is bool
        && data.get('verified', false) is bool
        && data.get('rating', 0) is number
        && data.get('reviewCount', 0) is number
        && data.get('missions', 0) is number
        && data.get('responseTime', '') is string
        && data.get('successRate', 0) is number
        && data.updatedAt == request.time
        && data.schemaVersion == 1;
    }

    match /providers/{providerId} {
      allow get: if existing().active == true
        || isOwner(existing().ownerUid)
        || isAdmin();

      allow list: if existing().active == true || isAdmin();

      allow create: if hasVerifiedIdentity()
        && validProviderFields(incoming())
        && incoming().ownerUid == uid()
        && incoming().createdAt == request.time
        && incoming().get('verified', false) == false
        && incoming().get('rating', 0) == 0
        && incoming().get('reviewCount', 0) == 0
        && incoming().get('missions', 0) == 0;

      // Le propriétaire ne peut modifier que les champs de présentation.
      // verified, rating, reviewCount, missions et createdAt sont serveur.
      allow update: if hasVerifiedIdentity()
        && isOwner(existing().ownerUid)
        && changedKeys().hasOnly([
          'name', 'role', 'category', 'price', 'location', 'headline',
          'bio', 'skills', 'image', 'cover', 'gallery', 'available',
          'active', 'updatedAt'
        ])
        && incoming().ownerUid == existing().ownerUid
        && incoming().get('verified', false) == existing().get('verified', false)
        && incoming().get('rating', 0) == existing().get('rating', 0)
        && incoming().get('reviewCount', 0) == existing().get('reviewCount', 0)
        && incoming().get('missions', 0) == existing().get('missions', 0)
        && incoming().createdAt == existing().createdAt
        && incoming().schemaVersion == existing().schemaVersion
        && validProviderFields(incoming());

      // Désactivation par modération uniquement (Admin SDK).
      allow delete: if false;

      // Avis vérifiés : écriture serveur exclusive, lecture publique des avis
      // publiés. Un avis non publié reste lisible par son auteur et les
      // modérateurs.
      match /reviews/{reviewId} {
        allow get: if existing().published == true
          || isOwner(existing().authorUid)
          || isModerator();

        allow list: if existing().published == true
          || existing().authorUid == uid()
          || isModerator();

        allow create, update, delete: if false;
      }
    }

    // ---------------------------------------------------------------------
    // requests/{requestId}
    // Lecture : demande ouverte pour tout compte connecté ; demande complète
    // pour le client, les participants et la modération.
    // ---------------------------------------------------------------------

    function validRequestFields(data) {
      return data.keys().hasAll([
          'clientUid', 'clientName', 'title', 'category', 'budget',
          'location', 'urgency', 'description', 'status',
          'assignedProviderUid', 'candidateUids', 'participantUids',
          'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && data.keys().hasOnly([
          'clientUid', 'clientName', 'title', 'category', 'budget',
          'location', 'urgency', 'description', 'status',
          'assignedProviderUid', 'candidateUids', 'participantUids',
          'createdAt', 'updatedAt', 'closedAt', 'schemaVersion'
        ])
        && data.clientUid is string
        && data.clientName is string && data.clientName.size() >= 2 && data.clientName.size() <= 80
        && data.title is string && data.title.size() >= 4 && data.title.size() <= 120
        && data.category in ['Informatique', 'Cours', 'Livraison', 'Design & Web']
        && data.budget is number && data.budget >= 0 && data.budget <= 10000000
        && data.location is string && data.location.size() >= 2 && data.location.size() <= 120
        && data.urgency in ["Aujourd'hui", 'Demain', 'Cette semaine', 'Flexible']
        && data.description is string && data.description.size() >= 10 && data.description.size() <= 4000
        && data.status in ['open', 'discussing', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed']
        && (data.assignedProviderUid == null || data.assignedProviderUid is string)
        && data.candidateUids is list && data.candidateUids.size() <= 50
        && data.participantUids is list && data.participantUids.size() >= 1 && data.participantUids.size() <= 50
        && data.updatedAt == request.time
        && data.schemaVersion == 1;
    }

    match /requests/{requestId} {
      allow get: if isSignedIn() && (
          existing().status == 'open'
          || isOwner(existing().clientUid)
          || uid() in existing().participantUids
          || isModerator()
        );

      allow list: if isSignedIn() && (
          existing().status == 'open'
          || isOwner(existing().clientUid)
          || uid() in existing().participantUids
          || isModerator()
        );

      // Création par le client uniquement, à l'état ouvert, sans candidat ni
      // prestataire assigné. Le client ne peut pas se déclarer participant
      // d'une demande qui ne lui appartient pas.
      allow create: if hasVerifiedIdentity()
        && validRequestFields(incoming())
        && incoming().clientUid == uid()
        && incoming().createdAt == request.time
        && incoming().status == 'open'
        && incoming().assignedProviderUid == null
        && incoming().candidateUids.size() == 0
        && incoming().participantUids.hasOnly([uid()])
        && incoming().participantUids.hasAll([uid()]);

      // Le client peut corriger le contenu tant que la mission n'est pas
      // attribuée. Les statuts, candidatures et participants sont serveur.
      allow update: if hasVerifiedIdentity()
        && isOwner(existing().clientUid)
        && existing().status in ['open', 'discussing']
        && changedKeys().hasOnly([
          'title', 'category', 'budget', 'location', 'urgency',
          'description', 'updatedAt'
        ])
        && incoming().clientUid == existing().clientUid
        && incoming().status == existing().status
        && incoming().assignedProviderUid == existing().assignedProviderUid
        && incoming().candidateUids == existing().candidateUids
        && incoming().participantUids == existing().participantUids
        && incoming().clientName == existing().clientName
        && incoming().createdAt == existing().createdAt
        && incoming().schemaVersion == existing().schemaVersion
        && validRequestFields(incoming());

      allow delete: if false;

      // Transactions / séquestre : lecture par les participants, écriture
      // exclusivement serveur (Cloud Functions + prestataire de paiement).
      // Le document porte lui-même participantUids, écrit par le serveur.
      match /transactions/{transactionId} {
        allow get, list: if isSignedIn() && (
          uid() in existing().participantUids || isAdmin()
        );
        allow create, update, delete: if false;
      }
    }

    // ---------------------------------------------------------------------
    // messages/{messageId}
    // Messagerie strictement limitée aux participants de la demande liée.
    // ---------------------------------------------------------------------

    function validMessageDoc(data) {
      return data.keys().hasAll([
          'requestId', 'senderUid', 'recipientUid', 'participantUids',
          'text', 'readBy', 'createdAt', 'schemaVersion'
        ])
        && data.keys().hasOnly([
          'requestId', 'senderUid', 'recipientUid', 'participantUids',
          'text', 'readBy', 'createdAt', 'schemaVersion'
        ])
        && data.requestId is string && data.requestId.size() >= 1 && data.requestId.size() <= 128
        && data.senderUid is string
        && data.recipientUid is string
        && data.participantUids is list && data.participantUids.size() >= 2 && data.participantUids.size() <= 50
        && data.text is string && data.text.size() >= 1 && data.text.size() <= 2000
        && data.readBy is list && data.readBy.size() <= 50
        && data.createdAt == request.time
        && data.schemaVersion == 1;
    }

    match /messages/{messageId} {
      allow get, list: if isSignedIn() && (
        uid() in existing().participantUids || isModerator()
      );

      allow create: if hasVerifiedIdentity()
        && validMessageDoc(incoming())
        && incoming().senderUid == uid()
        && incoming().recipientUid != uid()
        && incoming().participantUids == requestData(incoming().requestId).participantUids
        && incoming().participantUids.hasAll([uid(), incoming().recipientUid])
        && incoming().readBy.hasOnly([uid()])
        && incoming().readBy.hasAll([uid()]);

      // Accusé de lecture uniquement : le texte et les participants sont
      // immuables, et un participant ne peut pas retirer un autre lecteur.
      allow update: if isSignedIn()
        && uid() in existing().participantUids
        && changedKeys().hasOnly(['readBy'])
        && incoming().readBy.hasAll(existing().readBy)
        && incoming().readBy.hasAll([uid()])
        && incoming().readBy.size() <= 50;

      allow delete: if false;
    }

    // ---------------------------------------------------------------------
    // devices/{deviceId}
    // Un document par appareil (pas un par utilisateur), pour gérer plusieurs
    // terminaux et permettre la purge des tokens invalides côté serveur.
    // ---------------------------------------------------------------------

    function validDeviceFields(data) {
      return data.keys().hasAll([
          'userId', 'token', 'platform', 'deviceName', 'enabled',
          'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && data.keys().hasOnly([
          'userId', 'token', 'platform', 'deviceName', 'enabled',
          'createdAt', 'updatedAt', 'lastSeenAt', 'appVersion', 'schemaVersion'
        ])
        && data.userId is string
        && data.token is string && data.token.size() >= 10 && data.token.size() <= 4096
        && data.platform in ['ios', 'android', 'web']
        && data.deviceName is string && data.deviceName.size() <= 120
        && data.enabled is bool
        && data.get('appVersion', '') is string
        && data.get('appVersion', '').size() <= 40
        && data.get('lastSeenAt', request.time) is timestamp
        && data.updatedAt == request.time
        && data.schemaVersion == 1;
    }

    match /devices/{deviceId} {
      allow get: if isSignedIn() && existing().userId == uid();
      allow list: if isSignedIn() && existing().userId == uid();

      allow create: if hasVerifiedIdentity()
        && validDeviceFields(incoming())
        && incoming().userId == uid()
        && incoming().createdAt == request.time;

      allow update: if hasVerifiedIdentity()
        && existing().userId == uid()
        && incoming().userId == existing().userId
        && incoming().createdAt == existing().createdAt
        && incoming().schemaVersion == existing().schemaVersion
        && changedKeys().hasOnly([
          'token', 'platform', 'deviceName', 'enabled', 'updatedAt',
          'lastSeenAt', 'appVersion'
        ])
        && validDeviceFields(incoming());

      allow delete: if isSignedIn() && existing().userId == uid();
    }

    // ---------------------------------------------------------------------
    // users/{userId} et sous-collections
    // Le profil privé n'est lisible que par son titulaire et l'administration.
    // Les données publiques vivent dans publicProfiles/{userId}.
    // ---------------------------------------------------------------------

    function validPrivateUserFields(data) {
      return data.keys().hasAll([
          'uid', 'displayName', 'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && data.keys().hasOnly([
          'uid', 'displayName', 'email', 'phone', 'photoURL', 'locale',
          'role', 'status', 'kycStatus', 'notificationsEnabled',
          'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && data.uid is string
        && data.displayName is string && data.displayName.size() >= 2 && data.displayName.size() <= 80
        && data.get('email', '') is string && data.get('email', '').size() <= 254
        && data.get('phone', '') is string && data.get('phone', '').size() <= 20
        && data.get('photoURL', '') is string && data.get('photoURL', '').size() <= 500
        && data.get('locale', 'fr') in ['fr', 'en']
        && data.get('role', 'user') in ['user', 'provider', 'moderator', 'admin']
        && data.get('status', 'active') in ['active', 'suspended', 'deleted']
        && data.get('kycStatus', 'none') in ['none', 'pending', 'verified', 'rejected']
        && data.get('notificationsEnabled', true) is bool
        && data.updatedAt == request.time
        && data.schemaVersion == 1;
    }

    match /users/{userId} {
      allow get: if isOwner(userId) || isAdmin();
      allow list: if isAdmin();

      allow create: if hasVerifiedIdentity()
        && userId == uid()
        && validPrivateUserFields(incoming())
        && incoming().uid == userId
        && incoming().createdAt == request.time
        && incoming().get('role', 'user') == 'user'
        && incoming().get('status', 'active') == 'active'
        && incoming().get('kycStatus', 'none') == 'none';

      // Le titulaire ne peut modifier que des champs de profil. role, status
      // et kycStatus sont réservés au serveur.
      allow update: if hasVerifiedIdentity()
        && isOwner(userId)
        && changedKeys().hasOnly([
          'displayName', 'phone', 'photoURL', 'locale',
          'notificationsEnabled', 'updatedAt'
        ])
        && incoming().uid == existing().uid
        && incoming().get('email', '') == existing().get('email', '')
        && incoming().get('role', 'user') == existing().get('role', 'user')
        && incoming().get('status', 'active') == existing().get('status', 'active')
        && incoming().get('kycStatus', 'none') == existing().get('kycStatus', 'none')
        && incoming().createdAt == existing().createdAt
        && incoming().schemaVersion == existing().schemaVersion
        && validPrivateUserFields(incoming());

      // Effacement / anonymisation via Cloud Function (droit à l'effacement).
      allow delete: if false;

      // Consentements append-only : un retrait est un nouvel enregistrement.
      match /consents/{consentId} {
        allow get, list: if isOwner(userId) || isAdmin();

        allow create: if hasVerifiedIdentity()
          && isOwner(userId)
          && incoming().keys().hasAll([
            'uid', 'policyVersion', 'purposes', 'source', 'grantedAt', 'schemaVersion'
          ])
          && incoming().keys().hasOnly([
            'uid', 'policyVersion', 'purposes', 'source', 'grantedAt', 'schemaVersion'
          ])
          && incoming().uid == userId
          && incoming().policyVersion is string && incoming().policyVersion.size() <= 40
          && incoming().purposes is list && incoming().purposes.size() <= 20
          && incoming().source in ['signup', 'settings', 'checkout', 'support']
          && incoming().grantedAt == request.time
          && incoming().schemaVersion == 1;

        allow update, delete: if false;
      }
    }

    // ---------------------------------------------------------------------
    // publicProfiles/{userId}
    // Projection publique minimale, alimentée par Cloud Function.
    // ---------------------------------------------------------------------

    match /publicProfiles/{userId} {
      allow get, list: if true;
      allow create, update, delete: if false;
    }

    // ---------------------------------------------------------------------
    // disputes/{disputeId}
    // Ouverture par un participant, résolution serveur uniquement.
    // ---------------------------------------------------------------------

    match /disputes/{disputeId} {
      allow get, list: if isSignedIn() && (
        uid() in existing().participantUids || isModerator()
      );

      allow create: if hasVerifiedIdentity()
        && incoming().keys().hasAll([
          'requestId', 'openedByUid', 'participantUids', 'status',
          'reason', 'description', 'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && incoming().keys().hasOnly([
          'requestId', 'openedByUid', 'participantUids', 'status',
          'reason', 'description', 'createdAt', 'updatedAt', 'schemaVersion'
        ])
        && incoming().openedByUid == uid()
        && incoming().status == 'open'
        && incoming().participantUids == requestData(incoming().requestId).participantUids
        && incoming().participantUids.hasAll([uid()])
        && incoming().reason in ['payment', 'service_not_delivered', 'quality', 'safety', 'fraud', 'other']
        && incoming().description is string
        && incoming().description.size() >= 10 && incoming().description.size() <= 4000
        && incoming().createdAt == request.time
        && incoming().updatedAt == request.time
        && incoming().schemaVersion == 1;

      allow update, delete: if false;
    }

    // ---------------------------------------------------------------------
    // moderationReports/{reportId}
    // Signalement par un utilisateur ; traitement réservé à la modération.
    // ---------------------------------------------------------------------

    match /moderationReports/{reportId} {
      allow get, list: if isSignedIn() && (
        existing().reportedByUid == uid() || isModerator()
      );

      allow create: if hasVerifiedIdentity()
        && incoming().keys().hasAll([
          'reportedByUid', 'targetType', 'targetId', 'reason',
          'details', 'status', 'createdAt', 'schemaVersion'
        ])
        && incoming().keys().hasOnly([
          'reportedByUid', 'targetType', 'targetId', 'reason',
          'details', 'status', 'createdAt', 'schemaVersion'
        ])
        && incoming().reportedByUid == uid()
        && incoming().targetType in ['provider', 'request', 'message', 'user', 'review']
        && incoming().targetId is string && incoming().targetId.size() <= 128
        && incoming().reason in ['spam', 'fraud', 'harassment', 'illegal', 'safety', 'other']
        && incoming().details is string && incoming().details.size() <= 2000
        && incoming().status == 'open'
        && incoming().createdAt == request.time
        && incoming().schemaVersion == 1;

      allow update, delete: if false;
    }

    // ---------------------------------------------------------------------
    // Collections serveur exclusives
    // ---------------------------------------------------------------------

    // Journal d'audit immuable : lecture réservée aux administrateurs.
    match /auditLogs/{logId} {
      allow get, list: if isAdmin();
      allow create, update, delete: if false;
    }

    // Compteurs de débit et secrets de fonctions : jamais accessibles au client.
    match /rateLimits/{docId} {
      allow read, write: if false;
    }

    // Configuration publique (versions de politique, drapeaux) : lecture seule.
    match /config/{configId} {
      allow get, list: if true;
      allow create, update, delete: if false;
    }

    // ---------------------------------------------------------------------
    // Refus par défaut de tout le reste, y compris les futures collections.
    // ---------------------------------------------------------------------
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 8.1 Limites connues de ce jeu de règles

- Les règles ne peuvent pas valider **chaque élément** d'une liste (par exemple chaque compétence ou chaque URL) ni
  parser une URL. La validation fine doit se faire en Cloud Function.
- `clientName` est un instantané d'affichage : un client peut le falsifier. Le serveur doit le recalculer depuis
  `users/{uid}` ou ne pas s'y fier.
- Les règles ne remplacent pas la limitation de débit : `request.time` et des compteurs serveur sont nécessaires
  pour empêcher la création massive de documents.
- `hasVerifiedIdentity()` exige un e-mail vérifié ou un numéro de téléphone. Les jetons personnalisés sans ces
  attributs sont refusés : prévoir le cas échéant un claim dédié et documenté.
- Les règles autorisent la lecture des missions `open` à tout compte connecté. Si le produit veut un accès anonyme
  au marché, il faut créer une projection publique distincte, sans données personnelles.

---

## 9. Index Firestore requis

Les règles précédentes imposent des requêtes filtrées. Ajouter à `firestore.indexes.json` :

```json
{
  "indexes": [
    {
      "collectionGroup": "providers",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "active", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "price", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "providers",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "active", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "requests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "requests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clientUid", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "requests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participantUids", "arrayConfig": "CONTAINS" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participantUids", "arrayConfig": "CONTAINS" },
        { "fieldPath": "createdAt", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "requestId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "published", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Remplacer les index existants `status+budget` et `location+urgency` s'ils ne sont plus utilisés par les nouvelles
requêtes.

---

## 10. Contrôles produit spécifiques

### 10.1 Séquestre (escrow)

| Contrôle | Détail |
|---|---|
| Ne jamais détenir les fonds | Compte de cantonnement chez un prestataire agréé (CEMAC/COBAC) |
| Machine à états serveur | `pending → held → released` ou `refunded`, jamais pilotée par le client |
| Webhooks signés | Vérifier la signature, l'idempotence et le montant/devise |
| Gel en cas de litige | Passage automatique en `disputed`, blocage de la libération |
| Preuve | Reçu, journal d'audit, réconciliation quotidienne |
| Conformité | Agrément/partenariat (§3.5) — **à vérifier** |

### 10.2 Avis vérifiés

- Un avis ne peut être créé que par le client d'une mission `completed` et payée.
- Un seul avis par mission et par auteur (`requestId + authorUid` unique).
- Écriture exclusivement serveur ; le client lit la sous-collection `reviews`.
- Publication après modération automatique (langage haineux) puis humaine en cas de doute.
- Droit de réponse du prestataire, sans modification de la note.
- La note agrégée (`rating`, `reviewCount`) est recalculée par le serveur.

### 10.3 KYC par paliers

| Palier | Vérifications | Droits |
|---|---|---|
| 0 | E-mail ou téléphone vérifié | Naviguer, publier une demande |
| 1 | Nom + téléphone + pièce d'identité | Candidater, messagerie |
| 2 | Pièce + selfie de vivacité | Recevoir des paiements, missions au-delà d'un seuil |
| 3 | Justificatifs d'entreprise | Comptes professionnels |

Les **données biométriques** sont qualifiées de données sensibles par la loi (définition à l'article 6). Les
traitements automatisés comportant des données biométriques nécessaires au contrôle de l'identité sont soumis à
**autorisation de l'APDPVP** (article 81). Leur traitement à grande échelle peut également déclencher la désignation
d'un DPO (article 125). Stocker le minimum, chiffrer, limiter la durée, documenter la base légale.

### 10.4 Litiges

- Ouverture par un participant, preuve documentaire, gel du paiement.
- Délais de réponse, escalade, décision motivée, journal d'audit.
- Restitution/remboursement via le prestataire de paiement.
- Signalement aux autorités en cas d'infraction (loi 027/2023, art. 49–75).

### 10.5 Modération

- Catégories de signalement : spam, fraude, harcèlement, contenu illégal, sécurité, autre.
- Actions graduées : avertissement, masquage, suspension, bannissement, signalement.
- Traçabilité complète dans `auditLogs` (qui, quand, pourquoi, quelle décision).
- Procédure d'appel et transparence (rapport périodique).
- Tolérance zéro pour les contenus pédocriminels et racistes/xénophobes (loi 027/2023, art. 64–71).

### 10.6 Consentement, vie privée et droits APDPVP

| Exigence | Mise en œuvre |
|---|---|
| Consentement libre, spécifique et informé | Cases distinctes par finalité, versionnées dans `users/{uid}/consents` |
| Retrait à tout moment (art. 73) | Nouvel enregistrement de consentement, effet immédiat, pas de rétroactivité |
| Accès, rectification, effacement (art. 50–53, 60) | Écrans dédiés + API serveur + délai de réponse documenté |
| Information | Politique de confidentialité claire, en français, accessible hors connexion |
| Transferts (art. 171, 173) | Registre des transferts, autorisation APDPVP, clauses contractuelles |
| Violation (art. 142, 145, 147) | Procédure, registre, notifications |
| DPO (art. 125, 131) | Désignation et notification si les critères sont réunis |
| Analyse d'impact | À mener lorsqu'un traitement est susceptible d'engendrer un risque élevé (définition à l'article 6) ; consultation préalable de l'APDPVP |

---

## 11. Plan de durcissement priorisé

### 11.1 P0 — immédiat (72 heures)

| # | Action | Fichier/console | Critère de fin |
|---|---|---|---|
| 1 | Remplacer les règles par le jeu du §8 (ou un jeu transitoire) | `firestore.rules` | Plus d'écriture libre ; tests de règles verts |
| 2 | Corriger `docs/FIREBASE.md` : ne pas désactiver la protection contre l'énumération | `docs/FIREBASE.md` | Ligne 12 corrigée |
| 3 | Retirer le bouton de réinitialisation de démo des builds de production | Expo + Flutter | `isDemoDataEnabled`/`kDebugMode` + absence d'UI |
| 4 | Activer App Check en mode observation | Console Firebase | Trafic légitime majoritaire |
| 5 | Interdire la diffusion FCM à tous les appareils | `docs/FIREBASE.md` | Envoi ciblé par participants |

### 11.2 P1 — court terme (2 semaines)

| # | Action | Détail |
|---|---|---|
| 6 | Vérification d'e-mail obligatoire | Blocage des écritures métier tant que non vérifié |
| 7 | Rôles et custom claims | `onUserCreate`, écran d'administration, MFA pour admins |
| 8 | Cloud Functions de workflow | candidatures, affectation, statuts, avis, litiges |
| 9 | Migration UID-first | Script idempotent + export préalable |
| 10 | Règles Storage | création de `storage.rules`, pièces KYC privées |
| 11 | Limitation de débit | compteurs serveur, quotas, alerte sur pics |
| 12 | Journal d'audit | `auditLogs` immuable, lecture admin |

### 11.3 P2 — moyen terme (1 à 2 mois)

| # | Action | Détail |
|---|---|---|
| 13 | Escrow | partenariat agréé, machine à états, réconciliation |
| 14 | Avis vérifiés | sous-collection serveur, unicité, modération |
| 15 | KYC par paliers | collecte minimale, chiffrement, conservation limitée |
| 16 | Modération | signalements, sanctions graduées, appels |
| 17 | Tests de règles en CI | `firebase emulators:exec` à chaque PR |
| 18 | Sauvegardes et PITR | export planifié, test de restauration |
| 19 | Durcissement mobile | MASVS, secrets, SecureStore, liens profonds |
| 20 | Formulaires APDPVP | déclarations/autorisations, DPO, registre des transferts |

### 11.4 P3 — continu

| # | Action |
|---|---|
| 21 | Audit de sécurité annuel (loi 027/2023, art. 34) |
| 22 | Exercices d'incident et mise à jour du registre des violations |
| 23 | Veille APDPVP et mises à jour légales |
| 24 | Revue des accès administrateurs et des journaux |
| 25 | Tests d'intrusion sur les parcours paiement et KYC |

---

## 12. Annexes : sources et vérifications

### 12.1 Sources juridiques

| Sujet | URL |
|---|---|
| APDPVP — textes et décisions | <https://www.apdpvp.ga/textes-et-decisions/> |
| APDPVP — site officiel | <https://www.apdpvp.ga/> |
| APDPVP — déclarations | <https://www.apdpvp.ga/declarations/> |
| APDPVP — autorisations | <https://www.apdpvp.ga/autorisations/> |
| APDPVP — sanctions | <https://www.apdpvp.ga/sanctions-2/> |
| Loi 025/2023 — Journal Officiel | <https://journal-officiel.ga/20085-025-2023-/> |
| Loi 027/2023 — Journal Officiel | <https://journal-officiel.ga/20087-027-2023-/> |
| Règlement CEMAC 04/18 — BEAC | <https://www.beac.int/wp-content/uploads/2019/07/REGLEMENT-N-04-18-CEMAC-UMAC-COBAC-du-21-décembre-2018.pdf> |
| GSMA — fraudes mobile money (2024) | <https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/gsma_resources/mobile-money-fraud-typologies-and-mitigation-strategies/> |

Articles cités : loi 001/2011 modifiée (art. 4, 6, 7, 8, 50–53, 60, 73, 79–82, 113, 115–117, 125, 131,
142, 145, 147, 171, 173) ; loi 027/2023 (art. 3, 19, 20, 27, 28, 31, 34, 36, 38, 49–56, 64–71, 73, 75).

### 12.2 Sources techniques

| Sujet | URL |
|---|---|
| Firestore — démarrer avec les règles | <https://firebase.google.com/docs/firestore/security/get-started> |
| Firestore — conditions | <https://firebase.google.com/docs/firestore/security/rules-conditions> |
| Firestore — validation de champs | <https://firebase.google.com/docs/firestore/security/rules-fields> |
| Langage des règles | <https://firebase.google.com/docs/rules/rules-language> |
| Tests unitaires de règles | <https://firebase.google.com/docs/rules/unit-tests> |
| App Check | <https://firebase.google.com/docs/app-check> |
| App Check Web | <https://firebase.google.com/docs/app-check/web/recaptcha-provider> |
| App Check Flutter | <https://firebase.google.com/docs/app-check/flutter/default-providers> |
| App Check React Native | <https://rnfirebase.io/app-check/usage> |
| Custom claims | <https://firebase.google.com/docs/auth/admin/custom-claims> |
| MFA | <https://firebase.google.com/docs/auth/web/multi-factor> |
| Gestion des utilisateurs | <https://firebase.google.com/docs/auth/web/manage-users> |
| Protection contre l'énumération | <https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection> |
| FCM — envoi et limite de 500 tokens | <https://firebase.google.com/docs/cloud-messaging/send-message> |
| Cloud Functions | <https://firebase.google.com/docs/functions> |
| Cloud Functions — sécurité | <https://firebase.google.com/docs/functions/security> |
| Storage — règles | <https://firebase.google.com/docs/storage/security> |
| Clés d'API Firebase | <https://firebase.google.com/docs/projects/api-keys> |
| OWASP MASVS | <https://mas.owasp.org/MASVS/> |
| OWASP MASTG | <https://mas.owasp.org/MASTG/> |
| OWASP Top 10 | <https://owasp.org/www-project-top-ten/> |
| OWASP Mobile Top 10 | <https://owasp.org/www-project-mobile-top-10/> |
| OWASP ASVS | <https://owasp.org/www-project-application-security-verification-standard/> |
| CNIL — mots de passe | <https://www.cnil.fr/fr/authentification-par-mot-de-passe-les-mesures-de-securite-elementaires> |
| Expo — documentation versionnée | <https://docs.expo.dev/versions/latest/> |

### 12.3 Validation des règles Firestore

Les règles du §8 ont été validées le **19 octobre 2026** avec :

- `firebase-tools` 15.18.0 ;
- émulateur Firestore 1.21.0 ;
- JDK 25 ;
- projet de démonstration `demo-linkup` (aucune donnée réelle).

Commande de compilation et de test :

```bash
firebase emulators:exec --only firestore --project demo-linkup "node test.js"
```

Résultat : **25/25 scénarios conformes**. Cas couverts :

| # | Scénario | Attendu | Obtenu |
|---|---|---|---|
| 1 | Création de fiche prestataire valide (timestamps serveur) | autorisé | 200 |
| 2 | Modification de la fiche d'autrui | refusé | 403 |
| 3 | Modification de sa propre fiche (champ de présentation) | autorisé | 200 |
| 4 | Auto-attribution de `verified` | refusé | 403 |
| 5 | Création de mission valide | autorisé | 200 |
| 6 | Lecture d'une mission ouverte par un autre compte | autorisé | 200 |
| 7 | Modification du statut par un tiers | refusé | 403 |
| 8 | Modification du statut par le client | refusé | 403 |
| 9 | Édition du contenu par le client | autorisé | 200 |
| 10 | Message d'un non-participant | refusé | 403 |
| 11 | Message à un non-participant | refusé | 403 |
| 12 | Message entre participants | autorisé | 200 |
| 13 | Lecture d'un message par un participant | autorisé | 200 |
| 14 | Lecture d'un message par un tiers | refusé | 403 |
| 15 | Accusé de lecture par le destinataire | autorisé | 200 |
| 16 | Retrait d'un autre lecteur | refusé | 403 |
| 17 | Création de son appareil | autorisé | 200 |
| 18 | Lecture de l'appareil d'autrui | refusé | 403 |
| 19 | Création de son profil | autorisé | 200 |
| 20 | Élévation de son propre rôle en `admin` | refusé | 403 |
| 21 | Lecture du profil d'autrui | refusé | 403 |
| 22 | Création d'un avis | refusé | 403 |
| 23 | Lecture d'une collection inconnue | refusé | 403 |
| 24 | Écriture dans une collection inconnue | refusé | 403 |
| 25 | Lecture de la configuration publique | autorisé | 200 |

> Ces tests valident le comportement attendu du jeu de règles. Ils ne couvrent pas l'exhaustivité des cas métier :
> ajouter des tests dédiés au séquestre, aux litiges et à la modération avant mise en production.

### 12.4 Points « à vérifier »

| # | Point | Pourquoi | Comment vérifier |
|---|---|---|---|
| V1 | Date exacte de la loi 025/2023 (09/07 vs 12/07/2023) | Divergence entre le J.O. et le PDF APDPVP | Demander confirmation écrite à l'APDPVP |
| V2 | Liste APDPVP des États offrant un niveau de protection suffisant (art. 171 al. 4) | Conditionne les transferts | Consulter l'APDPVP ; aucune liste trouvée en ligne |
| V3 | Autorisation APDPVP requise pour l'hébergement Firebase | Art. 171 | Dossier de conformité avec un conseil |
| V4 | Applicabilité de l'art. 27 (hébergement national exclusif) et de l'art. 36 (copie nationale) | Loi 027/2023 | Analyse juridique dédiée |
| V5 | Portée de l'obligation de conservation décennale (art. 20, 31) vs minimisation | Loi 027/2023 | Analyse juridique dédiée |
| V6 | Qualification de l'escrow au regard du règlement CEMAC 04/18 | Agrément/partenariat | Consultation COBAC/BEAC et prestataire agréé |
| V7 | Compatibilité d'App Check RN avec la version Expo du projet | Les SDK évoluent vite | Lire `expo-app/package.json` puis la doc versionnée |
| V8 | Protection contre l'énumération pour le projet `linkup-gabon` existant | La valeur par défaut dépend de la date de création du projet | Vérifier dans la console Identity Platform |

### 12.5 Synthèse finale (5 lignes)

1. **R1** — Les règles Firestore laissent tout compte connecté modifier ou supprimer toutes les données : remplacer
   par le jeu « deny by default » du §8.
2. **R2** — Missions, messages et e-mails sont trop exposés : limiter la lecture aux participants et aux missions
   ouvertes, vérifier les e-mails.
3. **R3** — Aucun App Check, MFA, règle Storage ni limitation de débit : activer App Check, MFA, `storage.rules` et
   des compteurs serveur.
4. **R4** — Statuts, candidatures, avis et paiements sont écrits par le client : déplacer tout le métier dans des
   Cloud Functions et vérifier les avis après mission terminée.
5. **R5** — L'hébergement Firebase hors Gabon impose une analyse APDPVP (art. 171/173) et, potentiellement, des
   obligations d'hébergement national (loi 027/2023, art. 27 et 36) : **à vérifier avec un conseil**.
