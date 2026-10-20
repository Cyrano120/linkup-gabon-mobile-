# Synthèse — Design, concurrence et sécurité

Ce document ne remplace pas les trois veilles : il les **résume et les ordonne** pour décider.
Le détail, les tableaux complets et les sources sont dans :

| Rapport | Contenu | Volume |
|---|---|---|
| [`RECHERCHE-DESIGN.md`](RECHERCHE-DESIGN.md) | Références visuelles, patterns UX, accessibilité, packages Flutter | 825 lignes, 176 sources |
| [`RECHERCHE-CONCURRENCE.md`](RECHERCHE-CONCURRENCE.md) | Marché gabonais, concurrents, monétisation, paiement, feuille de route | 1 027 lignes, 221 sources |
| [`RECHERCHE-SECURITE.md`](RECHERCHE-SECURITE.md) | Cadre juridique, audit du dépôt, règles prêtes à l'emploi, plan de durcissement | 1 383 lignes, 70 sources |

**Priorité retenue : les fonctionnalités d'abord.** Le design et la sécurité sont traités en
sections 4 et 5, comme des travaux à mener **en parallèle** et non en préalable.

---

## 1. Trois constats qui commandent tout le reste

### 1.1 Le vrai concurrent s'appelle WhatsApp, pas une application

Le canal dominant au Gabon reste WhatsApp, Facebook et le bouche-à-oreille. C'est le constat
du fondateur de ton concurrent direct lui-même (« *tout passait par WhatsApp, Facebook ou le
bouche-à-oreille, sans garantie sur la qualité, les prix ou même la disponibilité* »,
[GabonReview, 24 février 2026](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)).

**Conséquence produit :** on ne bat pas WhatsApp sur le nombre de fonctionnalités (il en a
moins et il gagne). On le bat sur **la preuve, le prix cadré et le recours** — trois choses
que WhatsApp ne sait structurellement pas offrir.

### 1.2 Tu as un concurrent gabonais direct, et il est déjà positionné sur la confiance

**OZOservir** (groupe SooPHA, fondateur Béni-Jaël Mbata) a été présenté en février 2026 et son
application est en ligne sur Google Play depuis — mise à jour le 21 juillet 2026.
Sources vérifiées : l'article GabonReview et la fiche `com.soophagroup.ozoservir`.

| | OZOservir | LinkUp Gabon (aujourd'hui) |
|---|---|---|
| Périmètre | Services **+** vente de biens | Services uniquement |
| Géolocalisation | Oui | Quartier déclaratif |
| Avis | Annoncés « vérifiés » | Avis libres, non liés à une mission |
| Vérification d'identité | KYC annoncé | Absente |
| Messagerie | Présentée comme privée | **Lisible par tout compte connecté** |
| Paiement | Mobile money annoncé | Non implémenté |
| Connexion faible | Explicitement conçue pour | Non traitée |
| Modèle | 1 900–5 000 FCFA/mois + 3–4 % | Aucun |

### 1.3 Mais le marché n'est pas pris

Le fondateur revendique **500 inscrits avant lancement** ; la fiche Google Play affiche
**« 10+ téléchargements »**. L'écart est net : la traction n'est pas au rendez-vous.

**Conséquence :** la fenêtre est ouverte. Ce qui manque à LinkUp n'est pas une idée, c'est
**la preuve de confiance** — exactement l'axe sur lequel OZOservir communique déjà et où
LinkUp est, techniquement, en retard (voir §5).

---

## 2. Positionnement retenu

Le rapport de concurrence propose deux stratégies et recommande la seconde, puis la première.

| | Approche A — Transactionnelle d'emblée | **Approche B — Couche de confiance greffée sur WhatsApp** |
|---|---|---|
| Principe | Paiement, séquestre, KYC, commission dès le jour 1 | Profils vérifiés, demandes structurées, avis après mission, partage WhatsApp. Paiement direct. |
| Coût | Élevé (PSP + juridique + support) | Faible |
| Risque | Contournement tant que la liquidité est faible | Monétisation plus lente |
| Verdict | Prématurée aujourd'hui | **À mener maintenant** |

**Formule de positionnement :**

> LinkUp ne remplace pas WhatsApp. **LinkUp sécurise ce qui s'y passe.**

Traduction concrète : bouton « Partager sur WhatsApp » sur chaque fiche et chaque demande,
liens profonds `linkup.ga/p/{id}`, support WhatsApp, modèles de messages prêts à envoyer.

---

## 3. Fonctionnalités : le plan priorisé

C'est le cœur de ce document. Chaque ligne indique **pourquoi** et **d'où vient la
recommandation**.

### P0 — Fondations de confiance (0 à 90 jours)

| # | Fonctionnalité | Pourquoi elle est prioritaire | Effort |
|---|---|---|---|
| 1 | **Messagerie réellement privée** (conversations scopées par participants) | Aujourd'hui tout compte connecté lit tous les messages. C'est à la fois un défaut fonctionnel et un défaut de sécurité. | Élevé |
| 2 | **Avis débloqués par un code de fin de mission** | Empêche les faux avis et aligne la réputation sur la réalité. Pratique reprise de Bane et Troki. | Moyen |
| 3 | **Vérification par téléphone (OTP)** puis e-mail vérifié | Le téléphone est l'identité locale réelle ; l'e-mail est une barrière à l'inscription. | Moyen |
| 4 | **Demande structurée** : catégorie, quartier, repère, budget, délai, urgence | C'est le « cadrage » que WhatsApp ne sait pas faire. Condition d'un devis comparable. | Faible |
| 5 | **Statuts de mission avec « prochaine action »** | Les 4 statuts existent déjà mais ne disent pas *qui* doit agir. | Moyen |
| 6 | **Partage WhatsApp natif + liens profonds** | Le canal d'acquisition réel. Objectif interne proposé : 30 % des installations via partage. | Faible |
| 7 | **Mode hors ligne** : cache local, file d'attente d'envoi, états d'erreur explicites | Réseau instable. Perdre un message ou une mission est le pire scénario. | Moyen |
| 8 | **Fiche prestataire : bandeau « ce qui est vérifié », daté** | La question de l'utilisateur est « puis-je faire confiance ? », pas « est-ce joli ? ». | Moyen |

### P1 — Paiement et monétisation (90 à 180 jours)

| # | Fonctionnalité | Pourquoi | Effort |
|---|---|---|---|
| 9 | **Mobile money** (agrégateur Airtel + Moov), reçu, repli espèces | Duopole mobile money au Gabon. Le paiement in-app est le principal levier de monétisation. | Élevé |
| 10 | **Abonnement Pro 2 500–5 000 FCFA/mois** + boosts 1 000–3 000 FCFA/7 jours | Revenu récurrent, indépendant du volume de transactions. | Moyen |
| 11 | **Litiges et remboursement plafonné** | Déplace le risque et rassure. Politique claire exigée par la loi 027/2023. | Moyen |
| 12 | **Chat enrichi** : notes vocales, photos, messages pré-remplis | La note vocale est un usage local fort ; le confort doit égaler WhatsApp. | Moyen |
| 13 | **Repères géographiques** (quartier + point de repère, pas seulement GPS) | Les adresses formelles n'existent pas partout ; le repère est plus fiable. | Faible |

### P2 — Échelle (180 à 365 jours)

| # | Fonctionnalité | Pourquoi | Effort |
|---|---|---|---|
| 14 | **Séquestre via PSP agréé** | Principal différenciateur, mais nécessite un cadre juridique confirmé. | Élevé |
| 15 | **KYC par paliers** selon la sensibilité de la catégorie | Collecte minimale, chiffrée, à durée de conservation limitée. | Élevé |
| 16 | **Signalement et modération** avec sanctions graduées | Obligations légales (loi 027/2023, art. 64-71). | Moyen |
| 17 | **Extension Port-Gentil** après densité à Libreville | Densité avant étendue : 2–3 quartiers d'abord. | Élevé |
| 18 | **Offre B2B** (bureaux, ONG) | Panier plus élevé, paiement plus fiable. | Moyen |

### Recentrage de l'offre — décision à prendre

Aujourd'hui : `Informatique`, `Cours`, `Livraison`, `Design & Web`.
Le rapport recommande de se recentrer sur les catégories **réellement demandées** :
ménage, nounou, beauté à domicile, plomberie/électricité, bricolage, puis cours,
informatique et livraison.

> Un prestataire mal guidé produit une fiche incomplète, donc moins de missions. La largeur
> d'offre dilue la qualité et le support — c'est l'erreur identifiée chez OZOservir
> (services + biens) et chez Akanda Biz, qui s'est recentré sur la mobilité.

---

## 4. Design : corrections à mener en parallèle

### À corriger en premier (impact immédiat, effort faible)

| # | Action | Constat vérifié |
|---|---|---|
| 1 | **Boutons en `#007A4A` plutôt que `#009E60`, ou texte sombre sur le vert** | Blanc sur `#009E60` = **3,47:1** — j'ai recalculé la formule WCAG moi-même, c'est exact et sous le seuil de 4,5:1 |
| 2 | **Le jaune `#FCD116` n'est jamais une couleur de texte** | 1,47:1 sur blanc : illisible. Usage en fond, avec texte `#0B2A1F` (10,45:1) |
| 3 | **Supprimer le `BackdropFilter` et le dégradé sombre généralisé** | Le flou est coûteux sur GPU, encore plus sur Android d'entrée de gamme. Surfaces opaques = plus lisible et plus rapide |
| 4 | **Carte prestataire = « carte de décision »** | Photo, métier, note + nombre d'avis, quartier, prix, disponibilité, action. Choisir sans ouvrir 5 fiches |
| 5 | **Recherche et filtres en panneau glissant, avec compteur de résultats** | Et surtout un état « aucun résultat » qui propose une action, au lieu d'un écran vide |
| 6 | **Ne jamais coder un statut par la couleur seule** | Exigence WCAG 1.4.1 : icône + libellé en plus de la couleur |

### À prévoir ensuite

Design tokens et bibliothèque de composants (éviter la dérive entre les écrans et entre les
deux stacks), espace prestataire avec brouillon et tableau de bord, squelettes de chargement,
compression d'images (une photo de profil ne doit pas peser 4 Mo), mode sombre.

### Ce qu'il ne faut pas faire maintenant

- Ajouter des verticales (transport, repas) avant de stabiliser la confiance.
- Construire un portefeuille LinkUp : le mobile money existant suffit.
- Des cartes interactives en temps réel : coûteuses en données et en batterie.
- Un onboarding gamifié : le public veut aller vite.

---

## 5. Sécurité : état réel du dépôt et cible

### 5.1 Ce que l'audit du code a trouvé

| # | Règle ou code actuel | Conséquence |
|---|---|---|
| 1 | `messages` → `allow read: if isAuth()` | Tout compte connecté lit **tous** les messages privés |
| 2 | `providers` → `allow update, delete: if isAuth()` | Tout compte peut modifier la note, le prix, ou supprimer la fiche d'un concurrent |
| 3 | `requests` → `allow update, delete: if isAuth()` | Tout compte peut modifier un budget ou supprimer une mission |
| 4 | `create` ne vérifie que l'existence de 3 clés | Aucun contrôle de type, de taille, ni de valeurs autorisées |
| 5 | `DateTime.now()` (Flutter) / `Date.now()` (Expo) | Horodatage falsifiable ; `serverTimestamp()` est la solution |
| 6 | Pas d'App Check | L'API est appelable depuis un script, hors application |
| 7 | Pas de vérification d'e-mail ni de téléphone | Création de comptes en masse triviale |
| 8 | `messages` est une collection **plate** | Empêche de scoper proprement une conversation par participants |

### 5.2 Deux erreurs de ma propre documentation, corrigées aujourd'hui

- `docs/FIREBASE.md` recommandait de **désactiver la protection contre l'énumération des
  comptes**. C'est un recul de sécurité : cela permettrait de découvrir quelles adresses
  possèdent un compte, puis de les cibler. **Corrigé.**
- L'exemple de Cloud Function FCM envoyait la notification **à tous les appareils
  enregistrés**. Chaque utilisateur aurait été notifié des conversations des autres.
  **Corrigé** : ciblage du destinataire pour les messages, des prestataires de la même
  catégorie pour les missions, avec plafond.

### 5.3 Priorités de durcissement

| Priorité | Action | Échéance |
|---|---|---|
| **P0** | Remplacer les règles par un jeu « refus par défaut » avec validation stricte | 72 heures |
| **P0** | Activer App Check en mode observation | 72 heures |
| **P1** | Vérification d'e-mail obligatoire avant écriture métier | 2 semaines |
| **P1** | Rôles par custom claims + Cloud Functions pour les transitions de statut, candidatures, avis | 2 semaines |
| **P1** | Migration vers des identifiants UID (au lieu des noms affichés) + règles Storage | 2 semaines |
| **P2** | Avis vérifiés côté serveur, KYC par paliers, modération, tests de règles en intégration continue | 1 à 2 mois |

Le rapport de sécurité fournit le **jeu de règles complet, commenté et directement
utilisable** (§8) ainsi que les index Firestore requis (§9).

---

## 6. Conformité gabonaise — un point qu'il ne faut pas négliger

Le rapport a vérifié les textes. J'ai contrôlé ses citations : elles correspondent **mot pour
mot** aux articles publiés par l'autorité.

- **Loi n° 001/2011** du 25 septembre 2011 relative à la protection des données à caractère
  personnel, modifiée par la **loi n° 025/2023**.
- **Loi n° 027/2023** du 11 juillet 2023 portant réglementation de la cybersécurité et de la
  lutte contre la cybercriminalité.
- Autorité compétente : **APDPVP** (Autorité pour la Protection des Données Personnelles et
  de la Vie Privée), créée par l'article 7 de la loi. Site officiel vérifié et actif :
  <https://www.apdpvp.ga/>

Obligations qui concernent directement LinkUp :

| Sujet | Article | Conséquence |
|---|---|---|
| Formalités préalables | 79–82 | Déclaration ou autorisation **avant** mise en production |
| Sécurité | 113 | Mesures techniques adaptées au risque |
| Violation de données | 142, 145 | Information de l'APDPVP, puis des personnes concernées |
| Registre des violations | 147 | Journal dédié à tenir |
| Délégué à la protection des données | 125 | À évaluer, puis à notifier |
| Droits des personnes | 50–53, 60, 73 | Accès, rectification, effacement, opposition |
| **Transfert hors Gabon** | 171 | « *Un responsable de traitement ne peut transférer des données personnelles vers un autre État que sur autorisation de l'APDPVP* » |

> **Point critique** : Firebase héberge les données hors du Gabon. La loi 027/2023 (art. 27 et
> 36) pourrait même imposer un hébergement national. **Ce point doit être validé par un
> conseil gabonais qualifié avant toute mise en production commerciale.** Le présent document
> n'est pas un avis juridique.

Fait notable : sur sa fiche Google Play, OZOservir met en avant « *Data hosted in Europe, GDPR
compliant* ». Ton concurrent a donc déjà choisi et affiché sa réponse sur ce sujet.

---

## 7. Décisions à prendre

| # | Question | Options | Recommandation |
|---|---|---|---|
| D1 | Stratégie | Approche A (transactionnelle) / **Approche B (confiance d'abord)** | **B, puis A** |
| D2 | Catégories | Garder les 4 actuelles / **Recentrer sur 2–3 catégories à forte demande** | Recentrer |
| D3 | Vérification | Maintenant / plus tard | **Téléphone d'abord**, dès P0 |
| D4 | Règles Firestore | Appliquer le jeu durci maintenant / attendre | **Maintenant** (cf. §5.1, trous 1 à 3) |
| D5 | Conformité | Consulter un juriste / ignorer | **Consulter**, avant production commerciale |

---

## 8. Ce qu'il ne faut pas faire

- **Commission de 25 à 35 %** (Glovo, Urban Company) : le prestataire retourne sur WhatsApp. Cible : 8–12 %.
- **Facturer au prospect** (Thumbtack, StarOfService) : le professionnel paie sans garantie de mission.
- **Super-application dispersée** : services + biens + mobilité diluent la qualité.
- **Badge sans vérification réelle** : détruit la confiance au premier incident.
- **Construire une flotte de livraison** : capital intensif, marges faibles.
- **Portefeuille propriétaire sans licence** : risque réglementaire.
- **Annoncer un « paiement sécurisé » vague** : ne jamais promettre un mécanisme non opérationnel.
- **Commission sur les paiements en espèces** : intraçable, injuste, contestable.
- **Ignorer WhatsApp** ou **dépendre de Facebook** comme canal unique.

---

## 9. Ce qui est déjà fait

| Élément | État |
|---|---|
| Données de démonstration limitées aux builds de développement (`__DEV__` / `kDebugMode`) | ✅ Fait, dans les deux apps |
| Correction de la documentation Firebase (énumération, ciblage FCM) | ✅ Fait |
| Cible web Flutter et configuration VS Code | ✅ Fait |
| Règles Firestore durcies | ✅ Déployées le 20 octobre 2026, 49 tests |
| Messagerie privée | ✅ Fait : `participants`, lecture scopée, destinataire réel |
| Corrections de design §4 | ❌ À faire |
| Fonctionnalités P0 2 à 8 | ❌ À faire |

---

<div align="center">

*Synthèse produite à partir de trois veilles sourcées et d'un audit du code réel.*

</div>
