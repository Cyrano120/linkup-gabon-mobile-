# LinkUp Gabon — Rapport de veille design mobile

> **Version** : 1.0 — 19 octobre 2026  
> **Périmètre** : application mobile de mise en relation de services de proximité, Gabon (Libreville, Port-Gentil).  
> **Supports** : Flutter 3.44 / Dart 3.12 (cible principale), React Native + Expo (variante).  
> **Méthode** : recherche documentaire en ligne (sites officiels, design systems, publications UX, fiches packages). Aucun test utilisateur terrain n'a été réalisé pour ce rapport. Les points non vérifiés sont explicitement signalés « à vérifier ».

---

## Sommaire

- Synthèse
- 0. Note de méthode et limites
- 1. Références de design à étudier
- 2. Patterns UX concrets à reprendre
- 3. Design systems et packages Flutter recommandés
- 4. Recommandations priorisées pour LinkUp
- 5. Accessibilité et lisibilité
- 6. Tableau récapitulatif final
- 7. Sources

---

## Synthèse

1. **La priorité n'est pas d'ajouter des écrans, mais de rendre les écrans existants lisibles et crédibles.** La palette actuelle produit des contrastes insuffisants (blanc sur `#009E60` = 3,47:1) et l'effet verre coûte cher sur Android d'entrée de gamme.
2. **Le marketplace doit tenir en trois gestes** : rechercher, filtrer dans une bottom sheet, choisir sur une carte de décision. Chaque écran vide ou lent doit expliquer et proposer une action.
3. **La confiance est le produit.** Il faut une échelle de vérification expliquée, des avis liés à une mission terminée, un numéro masqué et un bouton « Signaler » visible.
4. **Le modèle mental est WhatsApp, pas Amazon.** La messagerie doit être centrale, avec messages pré-remplis, notes vocales et photos, tout en gardant la trace de la mission.
5. **Le terrain impose le hors-ligne et la data légère.** Cache local, file d'attente, images compressées, squelettes de chargement et APK maîtrisé valent plus qu'une animation spectaculaire.

---

## 0. Note de méthode et limites

Ce rapport croise trois types de sources :

- **Sources produit officielles** (Urban Company Design, TaskRabbit, Airtasker, Jiji, WhatsApp Business, Vinted, Gozem, Yango, Material Design, Flutter, W3C, Android) : fiables pour décrire des fonctionnalités et des règles.
- **Sources UX secondaires** (NN/g, articles de designers) : utiles pour les patterns, mais elles ne prouvent pas un impact sur LinkUp. Elles doivent être validées par des tests locaux.
- **Études de cas de cabinets ou de designers** : à lire comme des hypothèses, pas comme des preuves. Plusieurs annoncent des gains chiffrés sans méthodologie accessible ; ces chiffres ne sont pas repris ici comme vérités.

**Conséquence pratique** : les recommandations sont classées par priorité et par coût, mais chaque hypothèse forte (contraste, taille de cible, impact du poids de l'APK) doit être confrontée à un test sur un téléphone d'entrée de gamme réel, en 3G, à Libreville.

**Contexte marché utile** : au Gabon, fin 2025, on comptait environ **1,87 million d'internautes** (71,9 % de la population) et **3,27 millions de connexions mobiles**, dont 88,9 % en 3G/4G/5G selon DataReportal. Ces chiffres indiquent un marché connecté mais mobile-first, pas un marché de PC. ([DataReportal, Digital 2026: Gabon](https://datareportal.com/reports/digital-2026-gabon))

---

## 1. Références de design à étudier

Trois familles de références sont utiles :

- **Marketplaces de services** : elles montrent comment un utilisateur choisit un prestataire, demande un devis, suit une mission et évalue.
- **Marketplaces africaines / francophones** : elles montrent les contraintes réelles (paiement mobile, quartiers, confiance, Android d'entrée de gamme).
- **Produits de confiance et de logistique** : ils donnent les briques de réassurance (vérification, avis, protection, suivi d'état).

### 1.1 Urban Company (Inde) — la référence du service à domicile

**À observer.** Le parcours de réservation a été condensé en un module d'une page, avec un récapitulatif clair, un checkout en un clic pour les clients récurrents, l'adresse et le moyen de paiement pré-sélectionnés, et la disponibilité du prestataire affichée au moment du choix. Urban Company met aussi en avant les devis détaillés, le suivi des étapes de la prestation, les avis à double sens et un centre d'aide avec suivi des remboursements. ([Urban Company Design](https://medium.com/uc-design/the-all-new-urban-company-app-32b3953e990e), [3 Sided Coin](https://3sided.co.in/urbanclap.html))

**Pourquoi pour LinkUp.** C'est l'analogue le plus proche : un particulier choisit un professionnel, compare un prix, planifie une intervention et suit son exécution. Trois idées sont directement transposables :

1. **Une seule page de confirmation** avant validation, avec toutes les variables visibles (prestataire, service, quartier, date, prix, paiement).
2. **La disponibilité au moment du choix**, pas après : éviter « je choisis untel puis j'apprends qu'il n'est pas disponible ».
3. **Un devis qui distingue inclus / non inclus**, pour éviter les surprises sur place.

**À ne pas copier.** Le catalogue très large, la logique de rendez-vous à domicile avec créneaux précis, et les moyens de paiement indiens (UPI, carte). LinkUp doit rester lisible sur un petit écran et ne pas afficher 12 catégories à la fois.

### 1.2 TaskRabbit (États-Unis) — la confiance avant la réservation

**À observer.** Les cartes de « Taskers » affichent photo, nom, niveau de compétence, pourcentage d'avis positifs et prix. La fiche permet de lire l'« About » et les « Reviews ». Le tableau de bord distingue les missions en attente, à venir, annulées et terminées, avec le détail des coûts et les prochaines étapes. TaskRabbit a aussi introduit des **notes de satisfaction privées**, séparées des avis publics, pour éviter la pression sur le prestataire. ([Big Human](https://www.bighuman.com/work/taskrabbit), [TaskRabbit Support](https://support.taskrabbit.com/hc/en-us/articles/46260450347803-What-Are-Client-Satisfaction-Ratings))

**Pourquoi pour LinkUp.** LinkUp a déjà les états « Ouverte → En discussion → Confirmée → Terminée ». TaskRabbit montre comment rendre ces états **rassurants** : dire ce qui se passe ensuite, qui doit agir, et quel est le coût final. La note privée est une bonne idée pour le marché gabonais, où laisser un mauvais avis public peut être socialement coûteux.

**À ne pas copier.** Le modèle économique basé sur des frais de dossier et un background check payant, qui serait une barrière à l'entrée pour les prestataires informels. Le prix à l'heure est aussi peu adapté à de nombreux petits services, souvent forfaitisés ; à vérifier sur le terrain gabonais.

### 1.3 Thumbtack (États-Unis) — deux parcours selon la complexité

**À observer.** Thumbtack distingue deux modes : **Instant Book** pour les projets simples (montage TV, nettoyage, déménagement) et **demande d'estimation** pour les projets complexes (rénovation, installation). L'utilisateur voit des estimations de prix, des profils détaillés et peut discuter dans l'app. ([Thumbtack Press](https://press.thumbtack.com/announcements/thumbtack-launches-instant-book-to-make-hiring-pros-even-easier), [App Store](https://apps.apple.com/us/app/thumbtack-home-service-pros/id852703300))

**Pourquoi pour LinkUp.** LinkUp couvre deux natures de demande très différentes :

- **Service simple et cadré** : dépannage informatique, livraison de colis, course. On peut aller vite vers « Contacter » ou « Réserver ».
- **Service sur mesure** : logo, flyer, site web, montage vidéo. Il faut un brief, un devis, un délai et des révisions.

Le même bouton pour les deux crée de la confusion. LinkUp gagne à proposer **deux entrées explicites** : « Trouver un pro maintenant » et « Décrire mon projet pour recevoir des devis ».

**À ne pas copier.** Le formulaire de qualification très long de Thumbtack, qui peut décourager sur mobile. Chez LinkUp, la qualification doit tenir en 3 questions maximum avant le premier contact.

### 1.4 Airtasker (Australie) — publier une mission et recevoir des offres

**À observer.** Airtasker repose sur un flux limpide : décrire la tâche, fixer un budget, recevoir des offres, choisir un Tasker, payer via Airtasker Pay (fonds bloqués jusqu'à la fin), puis laisser un avis. Les profils affichent taux de complétion, avis et badges vérifiés. ([Airtasker — How it works](https://www.airtasker.com/us/how-it-works), [Airtasker — Earn money](https://www.airtasker.com/us/earn-money))

**Pourquoi pour LinkUp.** C'est **exactement** le modèle de l'écran « Publier une mission » avec candidatures et acceptation d'un candidat. Airtasker montre comment :

1. Structurer la publication : quoi, où, quand, combien.
2. Comparer les offres sur une base commune (prix, délai, note, message).
3. Donner un statut clair à chaque étape.

**À ne pas copier.** Le séquestre (escrow) intégral n'est pas réaliste dès le lancement avec des paiements en espèces et Mobile Money. On peut toutefois en reprendre le **langage de réassurance** (« le paiement est convenu avant le début, puis libéré après validation ») sans prétendre le garantir techniquement tant que le flux n'existe pas.

### 1.5 StarOfService et Yoojo (France) — le vocabulaire francophone du devis

**À observer.** StarOfService fonctionne par **demande de devis diffusée à plusieurs professionnels**, qui répondent sous 24 h ; le client compare les devis et choisit. Yoojo met en avant la simplicité, la sécurité et les avis, avec une application dédiée au prestataire pour gérer ses missions. ([StarOfService](https://www.starofservice.com.jm/pro/how-it-works), [Yoojo](https://yoojo.ie/become-a-service-provider))

**Pourquoi pour LinkUp.** Le public gabonais est francophone et habitué au vocabulaire « devis », « prestataire », « intervention », « à domicile ». Ces deux acteurs donnent un **modèle mental** déjà installé, utile pour les libellés et la structure de comparaison des offres. Ils montrent aussi que le prestataire a besoin d'un espace dédié, pas seulement d'une fiche.

**À ne pas copier.** Le modèle de génération de leads payants, qui peut frustrer les professionnels et créer une course au devis. LinkUp doit protéger le temps du prestataire : limiter le nombre de demandes simultanées et afficher le budget avant acceptation.

### 1.6 Fiverr — packager les services créatifs

**À observer.** Les « gigs » sont structurés en offres **Basic / Standard / Premium**, avec périmètre, délai, nombre de révisions et options. La page de commande montre une timeline de production. ([Fiverr — Graphics & Design](https://www.fiverr.com/categories/graphics-design), [Fiverr — Mobile apps](https://dribbble.com/FiverrDesign/projects/1553031-Mobile-apps))

**Pourquoi pour LinkUp.** La verticale « création design/web » (flyers, logos, montage vidéo, sites) se vend mal en simple tête-à-tête : le client ne sait pas quoi demander, le prestataire répète les mêmes questions. Des **formules prêtes à l'emploi** (« Logo essentiel », « Logo + déclinaisons », « Identité complète ») réduisent les allers-retours et rendent le prix lisible.

**À ne pas copier.** Les codes et prix du marché occidental, l'anglais des descriptions, et la logique de course au moins-disant. À Libreville, le prix doit être en FCFA, avec des exemples locaux (flyer pour un salon, visuels pour une page Facebook, site vitrine).

### 1.7 Jiji (Nigeria et Afrique) — la confiance dans un marché où l'arnaque est une crainte réelle

**À observer.** Jiji affiche un badge **« Verified ID »** après vérification KYC, et un badge **« Verified store »** après visite physique du magasin par un agent. Les annonces et profils montrent aussi les avis et les étoiles. ([Jiji — Verified ID](https://jiji.ng/faq/verified-id-badge), [Jiji — Verified store](https://jiji.ng/faq/offline-store-verification))

**Pourquoi pour LinkUp.** Jiji est la référence africaine la plus directement comparable en termes de **volume, de classification et de défiance initiale**. Des travaux de redesign citent la peur des arnaques et l'impossibilité de distinguer un vendeur vérifié comme des irritants majeurs ; c'est une hypothèse à confirmer par des entretiens à Libreville, mais elle est cohérente avec le contexte. ([Étude de redesign Jiji](https://medium.com/@osunmolatosin/jiji-ng-redesign-11d4bfdf6fac), [Recherche UX Jiji](https://frankagyepong.com/jiji/))

**À ne pas copier.** La densité publicitaire, les bannières qui poussent le contenu, et la priorité donnée aux annonces sponsorisées. LinkUp doit au contraire protéger la lisibilité de la fiche prestataire.

### 1.8 WhatsApp Business — le concurrent réel, et une leçon de simplicité

**À observer.** Le catalogue WhatsApp permet de présenter des produits ou services avec nom, description, prix, images (jusqu'à 10 photos/vidéos), et de les partager dans une conversation. Le parcours est entièrement conversationnel : le client ouvre le catalogue depuis le profil, choisit un item, puis discute. ([WhatsApp Business — Catalogue](https://whatsappbusiness.com/resources/resource-library/whatsapp-business-app-resources-whatsapp-business-catalog), [Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/catalogs/catalogs-overview))

**Pourquoi pour LinkUp.** Au Gabon, WhatsApp est le réflexe. LinkUp ne doit pas combattre ce réflexe : il doit **reprendre le modèle mental** (catalogue + message) tout en ajoutant ce que WhatsApp ne fait pas bien : recherche, filtres, comparaison, statut de mission, avis structurés, traçabilité.

**À ne pas copier.** L'absence de recherche et de filtre, l'exposition du numéro personnel, et la conversation comme unique source de vérité (aucun statut, aucun historique de mission).

**Conséquence design forte** : la messagerie ne doit pas être un onglet secondaire enterré. Elle doit être accessible depuis chaque fiche et chaque mission, avec un message pré-rempli.

### 1.9 Facebook Marketplace — la rapidité de publication

**À observer.** La publication est photo-first : photos, titre, prix, catégorie, localisation, puis conversation via Messenger. La logique de proximité et la remise en main propre sont centrales. ([Facebook — Sell something](https://www.facebook.com/help/www/561376580709359))

**Pourquoi pour LinkUp.** C'est le concurrent par défaut pour « trouver quelqu'un près de chez moi ». Sa force est la **vitesse de mise en ligne** et la familiarité. LinkUp doit s'en inspirer pour l'écran « Publier une mission » : 4 champs, 3 photos maximum, un bouton.

**À ne pas copier.** L'absence de signaux de qualité de service, de créneaux, de suivi et de protection. C'est précisément l'espace de différenciation de LinkUp.

### 1.10 Airbnb — la pile de confiance

**À observer.** Photos nombreuses, profil détaillé, avis vérifiés, taux de réponse, identité vérifiée, prix transparent. Airbnb a construit la confiance entre inconnus par l'accumulation de **petits signaux** : visage, ancienneté, nombre d'avis, réactivité, vérification. ([Airbnb Design — Designing for trust](https://medium.com/airbnb-design/designing-for-trust-7ce268468d5b), [Learning People](https://www.learningpeople.com/au/career-insights/blog/why-uxui-design-is-essential-for-brand-success-airbnb))

**Pourquoi pour LinkUp.** Le cœur du problème est « est-ce que je peux laisser cette personne venir chez moi / faire un travail que je ne peux pas vérifier ? ». Airbnb montre qu'il faut **empiler** les preuves, pas en afficher une seule.

**À ne pas copier.** La carte en plein écran et le calendrier complexe, trop lourds pour un petit écran et une connexion instable.

### 1.11 Uber — le statut comme histoire

**À observer.** Uber modélise le trajet comme une machine à états : demandé → accepté → en approche → en cours → terminé → payé → noté, avec ETA et reçu. Chaque état déclenche une notification et une action. ([Uber Base Design System](https://base.uber.com), [Uber — Trip branding](https://www.uber.com/rs/en/blog/trip-branding-personalization))

**Pourquoi pour LinkUp.** Les statuts de mission de LinkUp sont déjà proches de cette logique. Il manque la **mise en scène** : quelle étape, qui doit agir, combien de temps, que se passe-t-il ensuite.

**À ne pas copier.** La carte temps réel, coûteuse en données, en batterie et en complexité. Une timeline textuelle avec horodatage suffit.

### 1.12 Vinted et Mercari — publier vite, rassurer sur la transaction

**À observer.** Vinted : « snap, list, sell », étiquette prépayée, protection acheteur, avis à double sens. Mercari : photo-first, suggestion de catégorie, expédition anonyme pour ne pas partager son adresse. ([Vinted — How it works](https://www.vinted.com/how_it_works), [Mercari — Anonymous shipping](https://careers.mercari.com/en/mercan/articles/59470/), [Mercari — Creating a listing](https://www.mercari.com/us/help_center/topics/listing/guides/creating-a-listing/))

**Pourquoi pour LinkUp.** La publication d'une mission doit être aussi rapide qu'une annonce Vinted, et la fiche prestataire doit rassurer sur la **protection des données** (numéro masqué, pas d'adresse exacte avant confirmation).

**À ne pas copier.** Le modèle d'expédition et la logique de colis, qui ne correspondent pas à des services à domicile.

### 1.13 OfferUp — vérification progressive et sécurité

**À observer.** OfferUp combine profils publics, avis, chat intégré, vérification TruYou (téléphone, e-mail, identité) et conseils de rencontre dans des lieux publics. La vérification est **optionnelle mais visible**, ce qui permet de distinguer les profils sans bloquer l'inscription. ([OfferUp — About](https://about.offerup.com), [OfferUp — Staying safe](https://about.offerup.com/post/staying-safe-on-offerup), [Communiqué profils vérifiés](https://www.prnewswire.com/news-releases/offerup-launches-enhanced-public-profiles-to-elevate-user-reputation-and-verifications-663891583.html))

**Pourquoi pour LinkUp.** C'est le bon compromis pour le Gabon : ne pas exiger une pièce d'identité à l'inscription (friction, méfiance), mais **afficher clairement** qui a fait l'effort de vérification.

**À ne pas copier.** La multiplication de badges peu expliqués. Chaque badge doit avoir une infobulle « ce que ça veut dire ».

### 1.14 Leboncoin — les filtres du marché francophone

**À observer.** Recherche plein texte, filtres par catégorie, localisation, prix, tri, distinction professionnel / particulier, messagerie intégrée. ([Leboncoin sur Google Play](https://play.google.com/store/apps/details?id=fr.leboncoin))

**Pourquoi pour LinkUp.** Le public francophone comprend déjà ce modèle. Les catégories de filtres proposées par LinkUp (catégorie, quartier, budget, disponibilité) sont les bonnes ; le travail est de les rendre **utilisables sur un pouce**, pas de les réinventer.

**À ne pas copier.** La densité des pages d'annonces et les encarts promotionnels.

### 1.15 Gozem et Yango — la réalité du paiement et de la ville

**À observer.** Gozem, super-app francophone (Togo, Bénin, Gabon, Cameroun…), combine transport, livraison, courses et portefeuille, avec paiement en **espèces, carte et Mobile Money**. Son positionnement est « Simple • Safe • Reliable », avec des services qui varient selon la ville. Yango revendique une approche « hyperlocale » et plus de 10 services dans plus de 30 pays. ([Gozem](https://gozem.co/en/), [Gozem — Notre histoire](https://website.gozem.co/en/), [Yango](https://yango.com), [Rest of World](https://restofworld.org/2021/everyone-wants-to-be-a-superapp/))

**Pourquoi pour LinkUp.** Ces apps prouvent qu'un utilisateur gabonais peut naviguer dans plusieurs services, et que le **paiement en espèces reste une option de premier plan**. Elles montrent aussi l'importance du **sélecteur de ville** et des tuiles de service larges.

**À ne pas copier.** La tentation du super-app à outrance. LinkUp doit rester une marketplace de services, pas ajouter dix verticales avant d'avoir résolu la confiance sur une.

### 1.16 Références complémentaires, en un coup d'œil

| Référence | Ce qu'elle apporte | Usage pour LinkUp |
|---|---|---|
| **Jumia** | E-commerce mobile-first africain, adresse et paiement à la livraison | Modèle « adresse/quartier d'abord », confirmation de commande |
| **Glovo** | Multi-catégories, suivi de commande, localisation | Tuiles de services, statut de livraison |
| **Yoojo** | Services à domicile francophones, avis, app prestataire | Vocabulaire, espace prestataire |
| **StarOfService** | Devis diffusés à plusieurs pros | Comparaison d'offres, demande de devis |
| **Mercari** | Publication photo-first | Rapidité de création de mission |
| **OfferUp** | Vérification progressive | Échelle de confiance |
| **Leboncoin** | Filtres et messagerie | Taxonomie de filtres |
| **Gozem** | Mobile Money + cash | Sélection du paiement, confirmation |

---

## 2. Patterns UX concrets à reprendre

### 2.1 Recherche et filtres

**Objectif** : passer de « je cherche » à « je vois 12 prestataires pertinents » en moins de 3 interactions.

**À faire :**

- **Barre de recherche persistante** en haut du marketplace, avec un placeholder qui donne des exemples concrets : « Réparation PC, cours de maths, livraison… ».
- **Suggestions** dès 2 caractères : services, quartiers, noms de prestataires. Ajouter les **recherches récentes** et les **recherches populaires près de vous**.
- **Tolérance aux fautes** : « depannage », « dépannage », « ordinateur », « PC ». Les utilisateurs tapent vite, souvent avec un clavier français et des abréviations.
- **Filtres en bottom sheet** (pas une page séparée), ouverte depuis un bouton « Filtrer · 2 ». Le panneau peut couvrir 85 % de l'écran, mais laisse voir le nombre de résultats en temps réel : « Voir 18 prestataires ». C'est le pattern de la « tray » décrit par NN/g, qui garde les résultats visibles pendant le filtrage. ([NN/g — Mobile faceted search](https://www.nngroup.com/articles/mobile-faceted-search))
- **Filtres utiles seulement** : catégorie, quartier, budget, disponibilité. NN/g recommande de ne pas exposer tous les attributs disponibles, mais ceux qui aident réellement à décider. ([NN/g — Filter categories and values](https://www.nngroup.com/articles/filter-categories-values))
- **Quartiers en chips multi-sélection** : Nzeng-Ayong, Glass, Louis, PK12, Akanda, Owendo, Port-Gentil. Ne pas laisser un champ libre : les noms sont mal orthographiés et les limites informelles.
- **Budget en FCFA** : préréglages 5 000 / 10 000 / 25 000 / 50 000+, puis curseur. Afficher « 10 000 – 25 000 FCFA », pas « 10000-25000 ».
- **Disponibilité** : « Aujourd'hui », « Cette semaine », « Flexible » — trois choix, pas un calendrier.
- **Tri** : pertinence, note, prix, réactivité. Un seul menu, libellé explicitement.
- **Chips de filtres actifs** au-dessus des résultats, chacune avec un « × », plus un lien « Tout effacer ».
- **Compteur de résultats** et rappel de la recherche : « 18 prestataires pour “réparation” à Akanda ».

**Microcopy utile :**

- « Aucun prestataire ne correspond à tous vos filtres. »
- « Essayez d'élargir le quartier ou le budget. »
- « Retirer le filtre “Budget max. 5 000 FCFA” »
- « Publier une mission » (action secondaire si aucun résultat).

**Piège.** Le filtre « disponibilité » est souvent mal compris. Afficher « Disponible aujourd'hui » sur la carte, et non seulement dans le panneau, pour que l'utilisateur comprenne l'effet du filtre.

### 2.2 Fiche prestataire

**Objectif** : permettre une décision en 10 secondes, puis rassurer en 30 secondes.

**Structure recommandée, de haut en bas :**

1. **En-tête compact** : photo ronde 72–96 dp, nom, métier, badge « Identité vérifiée », note « 4,8 · 32 avis », quartier, « Répond en ~20 min ».
2. **Prix et disponibilité** : « À partir de 5 000 FCFA » + « Devis gratuit » + « Disponible cette semaine ». Si le prix est variable, dire « Sur devis » plutôt que rien.
3. **CTA collant en bas** : « Discuter » (principal), « Demander un devis » (secondaire), « Appeler » (tertiaire, avec numéro masqué jusqu'au clic).
4. **Bandeau de confiance** : 4 preuves maximum — identité vérifiée, téléphone vérifié, 12 missions terminées, 96 % de réussite. Chaque preuve a une infobulle.
5. **Galerie** : 3 photos + « Voir tout ». Étiqueter « Avant / Après » quand c'est pertinent (réparation, design, coiffure).
6. **Bio courte** : 3 lignes, puis « Lire plus ». Éviter le mur de texte.
7. **Compétences** : chips (« Réparation PC », « Installation Windows », « Récupération de données »).
8. **Zone d'intervention** : quartiers, + « Se déplace » / « À distance ».
9. **Avis** : note globale, répartition, 3 avis récents, filtre « Avec photo », badge « Mission vérifiée ». Un avis sans mission vérifiée doit être signalé.
10. **Prestataires similaires** : 3 cartes maximum, pour ne pas perdre l'utilisateur.

**Ce qu'il faut éviter :**

- Une note « 5,0 » sans nombre d'avis. C'est un signal vide, et cela peut sembler faux.
- Une section avis qui occupe 40 % de l'écran avant le premier contenu utile (critique classique faite à TaskRabbit). ([Analyse UX TaskRabbit](https://medium.com/design-bootcamp/how-taskrabbit-could-make-their-mobile-experience-better-1f129c2c8588))
- Un CTA unique « Contacter » qui ne dit pas ce qui va se passer (message ? devis ? appel ?).

### 2.3 Prise de contact

**Objectif** : réduire l'anxiété et le nombre de messages vides.

**Deux chemins explicites :**

| Chemin | Quand l'utiliser | Ce que ça fait |
|---|---|---|
| **Discuter** | J'ai choisi ce prestataire | Ouvre le chat avec un message pré-rempli |
| **Publier une mission** | Je veux comparer plusieurs offres | Publie une demande, les prestataires candidatent |

**Messages pré-remplis** selon la catégorie :

> « Bonjour [Nom], j'ai besoin de [service] à [quartier] pour [date]. Mon budget est d'environ [X] FCFA. Est-ce que vous êtes disponible ? »

**Dans le chat :**

- Texte, **note vocale**, photo, localisation approximative.
- **Réponses rapides** : « Quel est le prix ? », « Vous êtes disponible aujourd'hui ? », « Je vous envoie une photo ».
- **Proposition de créneau** (2–3 boutons), pas un calendrier.
- **Numéro masqué** par défaut ; bouton « Afficher mon numéro » avec confirmation.
- **Signaler / Bloquer** accessibles depuis le menu, pas cachés.
- Bandeau « Ne partagez jamais vos codes Mobile Money ».
- Accusé de réception et délai de réponse attendu : « [Nom] répond généralement en 20 min ».

**Handoff WhatsApp.** Un bouton « Continuer sur WhatsApp » peut être utile, mais il doit : (1) pré-remplir le message, (2) revenir dans l'app pour le suivi, (3) ne pas exposer le numéro avant consentement. Sinon, LinkUp perd la trace de la mission et devient un simple annuaire.

### 2.4 Onboarding et première expérience

**Objectif** : voir un prestataire avant de créer un compte.

**Principe : navigation invitée.** L'utilisateur doit pouvoir parcourir l'accueil, le marketplace et une fiche prestataire sans compte. La création de compte intervient au premier acte à valeur : contacter, publier, demander un devis.

**Parcours recommandé :**

1. **3 écrans maximum**, skippables :
   - « Trouvez un pro près de chez vous. »
   - « Publiez une mission, recevez des offres. »
   - « Payez en espèces ou par Mobile Money. »
2. **Ville + quartier** (obligatoire pour personnaliser, pas pour entrer).
3. **Numéro de téléphone** avec indicatif **+241** pré-rempli, OTP à 6 chiffres, autofill SMS.
4. **Pas de mot de passe, pas d'e-mail obligatoire.** Au Gabon, le numéro de téléphone est souvent la première identité numérique ; c'est en tout cas le point d'entrée le plus simple et le plus universel.
5. **Centres d'intérêt** (3–5 choix) pour personnaliser l'accueil : « Dépannage », « Cours », « Livraison », « Design ».
6. **Profil progressif** : nom et photo demandés seulement au moment de publier ou de devenir prestataire.

**Pourquoi.** Chaque écran supplémentaire est une opportunité d'abandon sur un forfait data limité. Le pattern « une chose par écran » (GOV.UK) et la divulgation progressive de NN/g vont dans ce sens : ne demander que ce qui est nécessaire à l'étape en cours. ([GOV.UK — One thing per page](https://designnotes.blog.gov.uk/2015/07/03/one-thing-per-page/), [NN/g — Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/))

**Onboarding prestataire.** Séparer clairement « Je cherche un service » et « Je propose mes services ». Pour le prestataire :

- Checklist visible : photo, bio, compétences, zone, tarifs, pièce d'identité.
- Sauvegarde automatique du brouillon.
- « Votre profil est prêt à 60 % — ajoutez une photo pour être visible. »
- Ne pas bloquer la publication sur la vérification d'identité : publier d'abord, vérifier ensuite.

### 2.5 Signaux de confiance

**Objectif** : rendre la confiance vérifiable, pas décorative.

**Échelle de vérification recommandée :**

| Niveau | Signal | Comment l'obtenir | Affichage |
|---|---|---|---|
| 0 | Compte créé | Téléphone | « Nouveau » |
| 1 | Téléphone vérifié | OTP | Icône téléphone + « Vérifié » |
| 2 | Identité vérifiée | Pièce d'identité + selfie | Badge « Identité vérifiée » |
| 3 | Métier vérifié | Diplôme, certificat, portfolio | Badge « Professionnel vérifié » |
| 4 | Mission vérifiée | Avis après mission terminée | « Avis vérifié » sur l'avis |

**Règles d'affichage :**

- **Toujours expliquer un badge** : au tap, une phrase simple (« Identité vérifiée : pièce d'identité contrôlée par LinkUp le 12/09/2026 »).
- **Afficher les signaux négatifs utiles** : taux d'annulation, délai de réponse, dernière activité. Un profil sans aucun signal négatif est suspect.
- **Avis après mission terminée uniquement**, avec possibilité de note privée séparée (inspiration TaskRabbit).
- **Avis à double sens** : le prestataire note aussi le client, pour limiter les mauvais comportements.
- **Signaler / Bloquer** dans le chat et la fiche, avec un motif et un retour de traitement.
- **Conseils de sécurité** contextuels : « Pour une première rencontre, privilégiez un lieu public » ; « Ne payez pas la totalité avant le début ».

**Piège.** Les badges « payants » ou attribués automatiquement détruisent la confiance. Un badge doit correspondre à un contrôle réel, documenté et daté.

### 2.6 Paiement et confirmation

**Objectif** : ne pas promettre plus que ce que l'app peut faire, mais rendre le paiement **prévisible**.

**Réalité gabonaise** : espèces, Airtel Money, Moov Money. La carte bancaire n'est pas le moyen le plus courant dans le contexte produit ; les moyens cités sont les espèces, Airtel Money et Moov Money. Gozem affiche explicitement « paiement en espèces, carte et Mobile Money ». ([Google Play — Gozem](https://play.google.com/store/apps/details?id=com.gozem))

**Écran de confirmation recommandé :**

- Récapitulatif : prestataire, service, date/heure, quartier, durée estimée, prix, frais éventuels, mode de paiement.
- **Un seul total**, en gros, en FCFA.
- Mention explicite : « Aucun frais caché » ou « Des frais de service de X FCFA s'appliquent ».
- Bouton principal : « Confirmer la mission ».
- Bouton secondaire : « Modifier ».
- Après confirmation : écran « Mission confirmée » avec référence, bouton « Partager sur WhatsApp », « Ajouter au calendrier » (optionnel), « Contacter le prestataire ».

**Mobile Money :** le paiement se fait souvent par **push USSD** : l'utilisateur reçoit une demande sur son téléphone et doit la valider. L'écran doit donc gérer quatre états :

1. « Demande envoyée — validez sur votre téléphone. »
2. « En attente de confirmation… » (avec chronomètre et bouton « Je n'ai rien reçu »).
3. « Paiement confirmé » (reçu, référence).
4. « Échec / expiré » (réessayer, changer de moyen, contacter le support).

Selon un article sectoriel, l'USSD resterait le canal dominant du mobile money en Afrique ; ce chiffre est à vérifier pour le Gabon, mais le pattern de confirmation asynchrone reste valable. ([Telecom Review Africa](https://www.telecomreviewafrica.com/articles/features/28877-has-mobile-money-outgrown-its-own-infrastructure/), [DGateway](https://dgateway.desispay.com/blog/mobile-money-vs-card-payments-africa))

**Espèces :** afficher « Prévoyez l'appoint » et « Confirmez la remise en main propre ». Ne pas prétendre à une protection que l'app ne peut pas offrir.

### 2.7 États vides

**Objectif** : un écran vide ne doit jamais ressembler à une panne.

NN/g recommande de distinguer l'absence de contenu de l'erreur, d'expliquer ce qui devrait s'afficher, et de donner un chemin direct pour remplir l'écran. ([NN/g — Empty states](https://www.nngroup.com/articles/empty-state-interface-design))

**Quatre cas à traiter séparément :**

| Contexte | Message | Action principale | Action secondaire |
|---|---|---|---|
| Aucun résultat de recherche | « Aucun prestataire ne correspond à tous vos filtres. » | « Retirer le dernier filtre » | « Publier une mission » |
| Aucune mission | « Vous n'avez pas encore de mission. » | « Publier une mission » | « Parcourir les prestataires » |
| Aucun message | « Vos échanges avec les prestataires apparaîtront ici. » | « Trouver un prestataire » | — |
| Aucune notification | « Vous êtes à jour. » | — | — |
| Erreur | « Impossible de charger les prestataires. » | « Réessayer » | « Nous contacter » |
| Hors ligne | « Vous êtes hors ligne. Affichage des dernières données. » | « Réessayer » | — |

**Règle** : ne jamais afficher une illustration seule. Toujours un titre, une phrase et un bouton.

### 2.8 États de chargement

**Objectif** : donner une impression de vitesse même sur 3G.

- **Squelettes de contenu** (skeleton screens) plutôt qu'un spinner plein écran : ils montrent la structure et réduisent la perception d'attente. ([NN/g — Skeleton screens](https://www.nngroup.com/articles/skeleton-screens))
- **Conserver l'en-tête, la recherche et le CTA** pendant le chargement. Ne pas bloquer toute la page.
- **Afficher les données en cache** immédiatement, puis rafraîchir.
- **Délai avant message** : si le chargement dépasse 8–10 secondes, afficher « La connexion est lente » + « Réessayer ».
- **Images** : placeholder de la bonne taille, puis fondu. Éviter les sauts de mise en page.
- **Ne pas animer indéfiniment** : un shimmer qui tourne 30 secondes signale un bug.

**Nuance** : les squelettes ne remplacent pas l'optimisation. NN/g le rappelle explicitement ; ils améliorent la perception, pas le temps réel. ([NN/g](https://www.nngroup.com/articles/skeleton-screens))

**Poids et data.** Selon Google Play, le taux de téléchargement d'une app d'environ 10 Mo serait supérieur d'environ 30 % à celui d'une app de 100 Mo. Sur un forfait data limité, cela compte autant que le design : une APK légère, des images compressées et un cache disque sont des décisions de design, pas seulement d'ingénierie. ([Google Play Dev](https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2))

### 2.9 Mode hors ligne

**Objectif** : rester utile quand le réseau tombe, ce qui est fréquent en 3G/4G instable.

**Stratégie recommandée : local-first en lecture, file d'attente en écriture.**

- **Lecture** : mettre en cache la dernière liste de prestataires, les fiches consultées, les missions et les messages. Afficher un bandeau « Dernière mise à jour : il y a 12 min ».
- **Écriture** : les messages et les créations de mission partent dans une **file d'attente** avec statut « En attente de réseau ». L'utilisateur voit que ce n'est pas perdu.
- **Connectivité** : `connectivity_plus` détecte le type de réseau, mais ne prouve pas l'accès Internet. Compléter avec un test de joignabilité (`internet_connection_checker_plus`). ([pub.dev — connectivity_plus](https://pub.dev/packages/connectivity_plus), [pub.dev — internet_connection_checker_plus](https://pub.dev/packages/internet_connection_checker_plus))
- **Stockage** : `drift` (SQLite typé, réactif, migrations) pour les données relationnelles ; `hive_ce` pour les préférences simples. ([pub.dev — drift](https://pub.dev/packages/drift), [pub.dev — hive_ce](https://pub.dev/packages/hive_ce))
- **Synchronisation** : idempotence sur les créations (clé générée côté client), résolution de conflit « dernière écriture gagne » pour les messages, et statut explicite pour les missions.
- **Ne pas mentir** : ne jamais afficher « Envoyé » si le message est seulement en file d'attente. Afficher « En attente ».

### 2.10 Gestion des erreurs réseau

**Objectif** : une erreur doit dire quoi faire, pas ce qui a cassé.

NN/g recommande : message près de la source, visible, en langage humain, sans blâmer l'utilisateur, avec une action constructive. ([NN/g — Error message guidelines](https://www.nngroup.com/articles/error-message-guidelines))

**Taxonomie simple :**

| Type | Exemple | Où l'afficher | Action |
|---|---|---|---|
| Validation | « Le budget doit être supérieur à 0 FCFA » | Sous le champ | Corriger |
| Réseau | « Connexion perdue. Votre message est en attente. » | Bandeau + chat | Réessayer |
| Timeout | « Le serveur met trop de temps à répondre. » | Zone concernée | Réessayer |
| 401/403 | « Votre session a expiré. » | Modale | Se reconnecter |
| 404 | « Ce prestataire n'est plus disponible. » | Page | Voir les similaires |
| 429 | « Trop de demandes. Réessayez dans quelques minutes. » | Bandeau | Attendre |
| 5xx | « Service momentanément indisponible. » | Zone concernée | Réessayer + support |

**Règles :**

- **Conserver les données saisies** (formulaire de mission, message).
- **Ne jamais afficher un code brut** (`SocketException`, `500`) sans traduction.
- **Un seul bouton principal** par erreur.
- **Un identifiant de requête** discret pour le support : « Réf. : A7F3 ».
- **Pas de modale** pour une erreur non bloquante : un bandeau suffit.

---

## 3. Design systems et packages Flutter recommandés

### 3.1 Material 3, Cupertino, ou les deux ?

**Recommandation : Material 3 par défaut, composants adaptatifs ponctuels.**

- Material 3 est le langage natif d'Android, la cible principale. Dans Flutter 3.44, c'est le comportement par défaut ; `useMaterial3` reste utile pour verrouiller le choix lors d'une migration. Utiliser `ColorScheme.fromSeed` comme base, puis surcharger les teintes. ([Material 3](https://m3.material.io), [Flutter Material](https://docs.flutter.dev/ui/design/material))
- **Navigation principale : 3 à 5 destinations maximum** dans une barre de navigation basse, avec icône + libellé. Pour LinkUp : Accueil, Explorer, Missions, Messages, Profil. Au-delà de 5, les cibles deviennent trop petites. ([Material 3 — Navigation bar](https://m3.material.io/components/navigation-bar/overview))
- **Ne pas prendre le seed Material tel quel** : il génère des teintes qui peuvent entrer en conflit avec la palette Gabon. Définir un `ColorScheme` explicite, avec des couleurs testées en contraste.
- **Cupertino** uniquement pour les widgets iOS spécifiques (sélecteurs, transitions). Maintenir deux design systems complets double le coût de test.
- **Material 3 Expressive** : annoncé par Google en mai 2025, mais, à la date de consultation, Flutter n'implémente pas encore les composants Expressive et n'accepte pas de contributions à ce sujet. Ne pas planifier dessus sans revérifier l'état du dépôt. ([GitHub Flutter #168813](https://github.com/flutter/flutter/issues/168813), [Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive))

### 3.2 Packages Flutter

| Besoin | Package | Lien | Pourquoi / usage | Coût |
|---|---|---|---|---|
| Images réseau + cache | `cached_network_image` | [pub.dev](https://pub.dev/packages/cached_network_image) | Cache disque, placeholder, errorWidget ; réduit fortement les données et les re-téléchargements | Faible |
| Squelettes de chargement | `skeletonizer` | [pub.dev](https://pub.dev/packages/skeletonizer) | Transforme les widgets existants en squelettes ; évite de maintenir deux layouts | Faible |
| Animations | `flutter_animate` | [pub.dev](https://pub.dev/packages/flutter_animate) | Transitions 150–250 ms, entrées de listes ; à utiliser avec parcimonie | Faible |
| Navigation / deep links | `go_router` | [pub.dev](https://pub.dev/packages/go_router) | Routes déclaratives, onglets, liens `linkup.ga/prestataire/123` | Faible |
| Connectivité | `connectivity_plus` | [pub.dev](https://pub.dev/packages/connectivity_plus) | Type de réseau et changements ; ne prouve pas Internet | Faible |
| Test d'accès réel | `internet_connection_checker_plus` | [pub.dev](https://pub.dev/packages/internet_connection_checker_plus) | Vérifie la joignabilité réelle avant de synchroniser | Faible |
| Base locale | `drift` | [pub.dev](https://pub.dev/packages/drift) | SQLite typé, réactif, migrations ; pour missions, messages, cache | Moyen |
| Stockage clé-valeur | `hive_ce` | [pub.dev](https://pub.dev/packages/hive_ce) | Préférences, dernier quartier, token ; alternative légère à drift | Faible |
| État | `flutter_riverpod` | [pub.dev](https://pub.dev/packages/flutter_riverpod) | Gestion des états loading/error/data, testabilité | Moyen |
| HTTP | `dio` | [pub.dev](https://pub.dev/packages/dio) | Intercepteurs, timeouts, retry, logs | Faible |
| Compression d'images | `flutter_image_compress` | [pub.dev](https://pub.dev/packages/flutter_image_compress) | Réduire les photos avant upload (200–500 Ko, 1600 px) | Faible |
| Sélection d'images | `image_picker` | [pub.dev](https://pub.dev/packages/image_picker) | Appareil photo / galerie | Faible |
| i18n | `flutter_localizations` + `intl` | [docs Flutter](https://docs.flutter.dev/ui/internationalization) | `gen_l10n`, formats FCFA, dates FR, prêt pour l'anglais | Faible |
| SVG | `flutter_svg` | [pub.dev](https://pub.dev/packages/flutter_svg) | Icônes et illustrations légères | Faible |
| Liens externes | `url_launcher` | [pub.dev](https://pub.dev/packages/url_launcher) | WhatsApp, téléphone, e-mail | Faible |

**Points d'attention :**

- **`google_fonts`** télécharge les polices à l'exécution par défaut : mauvais pour la data et le premier lancement. **Embarquer** les polices dans l'APK (`assets/fonts`) ou utiliser les polices système.
- **`flutter_animate`** ne doit pas animer les listes longues en continu. Respecter `MediaQuery.disableAnimations` / le réglage système « Réduire les animations ».
- **`skeletonizer`** : attention aux skeletons qui durent trop longtemps ; couper l'animation après 10 s et afficher une erreur.
- **`cached_network_image`** : utiliser `memCacheWidth` et `maxWidthDiskCache` pour éviter de décoder des images 4000 px sur un téléphone 2 Go de RAM.

**Exemple de thème accessible (à adapter) :**

```dart
const brandGreen = Color(0xFF009E60);   // accent, pas texte blanc
const actionGreen = Color(0xFF007A4A);  // fond de bouton, texte blanc
const sand = Color(0xFFF7F5F0);
const ink = Color(0xFF0B2A1F);

ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: brandGreen,
    brightness: Brightness.light,
  ).copyWith(
    primary: actionGreen,
    onPrimary: Colors.white,
    surface: Colors.white,
    onSurface: ink,
    secondary: const Color(0xFFFCD116),
    onSecondary: ink,
  ),
  scaffoldBackgroundColor: sand,
);
```

### 3.3 Variante React Native + Expo

Si la variante Expo est maintenue, les équivalents utiles sont :

| Besoin | Package | Lien |
|---|---|---|
| Navigation | `expo-router` | [docs.expo.dev](https://docs.expo.dev/router/introduction/) |
| Images | `expo-image` | [docs.expo.dev](https://docs.expo.dev/versions/latest/sdk/image/) |
| Listes performantes | `@shopify/flash-list` | [docs.expo.dev](https://docs.expo.dev/versions/latest/sdk/flash-list/) |
| Données réseau | `@tanstack/react-query` | [tanstack.com](https://tanstack.com/query/latest) |
| Stockage rapide | `react-native-mmkv` | [github.com](https://github.com/mrousavy/react-native-mmkv) |
| Connectivité | `@react-native-community/netinfo` | [github.com](https://github.com/react-native-netinfo/react-native-netinfo) |
| Animations | `react-native-reanimated` | [docs.swmansion.com](https://docs.swmansion.com/react-native-reanimated/) |

**Conseil** : ne pas dupliquer les efforts de design. Les tokens (couleurs, espacements, rayons, typographie) doivent être définis une fois et exportés vers les deux stacks.

### 3.4 Tokens proposés

**Couleurs — mode clair**

| Token | Valeur | Usage |
|---|---|---|
| `bg` | `#F7F5F0` | Fond général (sable chaud, moins agressif que blanc) |
| `surface` | `#FFFFFF` | Cartes, feuilles |
| `ink` | `#0B2A1F` | Texte principal (contraste 14,1:1 sur sable) |
| `muted` | `#5B6B63` | Texte secondaire (5,2:1 sur sable) |
| `brand` | `#009E60` | Accents, icônes, états ; **pas** de texte blanc dessus |
| `action` | `#007A4A` | Boutons pleins avec texte blanc (5,4:1) |
| `accent` | `#FCD116` | Notes, urgence, surbrillance ; texte sombre uniquement |
| `info` | `#1D4ED8` | Liens et informations (6,7:1 sur blanc) |
| `danger` | `#B42318` | Erreurs, actions destructrices |

**Couleurs — mode sombre**

| Token | Valeur | Usage |
|---|---|---|
| `bg` | `#0B1220` | Fond |
| `surface` | `#141C2B` | Cartes |
| `ink` | `#F2F4F7` | Texte principal |
| `muted` | `#A9B4C2` | Texte secondaire |
| `brand` | `#34D399` | Accents verts lisibles |
| `accent` | `#FCD116` | Notes, urgence |
| `info` | `#93C5FD` | Liens (10,4:1) |

**Espacements** : 4, 8, 12, 16, 24, 32 dp.  
**Rayons** : 12 dp (cartes), 16 dp (feuilles), 999 dp (pilules).  
**Typographie** : 12 / 14 / 16 / 20 / 24 / 32 sp ; corps à 16 sp ; hauteur de ligne 1,4–1,5.  
**Bordures** : 1 dp `#E6E1D6` en mode clair, `#263244` en mode sombre.  
**Élévation** : préférer une bordure à une ombre ; les ombres sont peu visibles sur les écrans de mauvaise qualité.

---

## 4. Recommandations priorisées pour LinkUp

**Définition des coûts** :  
- **Faible** : < 1 semaine, 1 personne.  
- **Moyen** : 1–3 semaines, design + dev.  
- **Élevé** : > 3 semaines, refonte transversale ou backend.

### P0 — Rendre l'app lisible et crédible (semaines 1–3)

| # | Action | Pourquoi | Coût |
|---|---|---|---|
| 1 | **Corriger les contrastes et la typographie** | Blanc sur `#009E60` = 3,47:1, insuffisant pour du texte normal ; vert sur sable = 3,18:1. La palette actuelle échoue probablement sur les boutons et les textes secondaires. | Faible |
| 2 | **Supprimer le `BackdropFilter` et le dégradé sombre généralisé** | Le flou est « relativement coûteux » sur GPU (documentation Flutter) et encore plus sur Android d'entrée de gamme. Les surfaces opaques sont plus lisibles et plus rapides. | Faible |
| 3 | **Refondre la carte prestataire en « carte de décision »** | Photo, métier, note + nombre d'avis, quartier, prix, disponibilité, CTA. Une carte doit permettre de choisir sans ouvrir 5 fiches. | Faible |
| 4 | **Fiche prestataire : CTA collant + bandeau de confiance + résumé d'avis** | Le doute principal est « puis-je faire confiance ? ». Les preuves doivent être visibles sans scroller. | Moyen |
| 5 | **Recherche + filtres en bottom sheet avec compteur et état « aucun résultat »** | Le marketplace est le cœur du produit. Un filtre mal fait fait perdre l'utilisateur ; un état vide mal fait le fait quitter. | Moyen |

### P1 — Confiance et continuité (semaines 4–8)

| # | Action | Pourquoi | Coût |
|---|---|---|---|
| 6 | **Onboarding invité + téléphone/OTP + ville/quartier** | Réduire la friction avant le premier prestataire vu. Le téléphone est l'identité locale ; l'e-mail est une barrière. | Moyen |
| 7 | **Timeline de mission avec prochaine action** | Les 4 statuts existent déjà ; il faut les rendre lisibles : qui doit agir, quoi faire, quand. | Moyen |
| 8 | **Chat avec messages pré-remplis, notes vocales, photos, signalement** | Le chat est le produit ; il doit être aussi simple que WhatsApp, avec la traçabilité en plus. | Moyen |
| 9 | **Échelle de vérification + avis liés à une mission terminée** | La confiance ne peut pas reposer sur une seule étoile. Les badges doivent être expliqués et datés. | Moyen |
| 10 | **Cache hors ligne + file d'attente + états d'erreur** | Le réseau est instable ; perdre un message ou une mission est le pire scénario. | Moyen |
| 11 | **Squelettes + compression d'images + cache disque** | Réduire la data et l'attente perçue. Une photo de profil ne doit pas peser 4 Mo. | Faible |

### P2 — Échelle et finition (semaines 9–16)

| # | Action | Pourquoi | Coût |
|---|---|---|---|
| 12 | **Design tokens + bibliothèque de composants** | Éviter la dérive visuelle entre écrans et entre Flutter/RN. Urban Company a créé son design system pour cette raison. | Moyen |
| 13 | **Espace prestataire : checklist, brouillon, tableau de bord** | Un prestataire mal guidé produit une fiche incomplète, donc moins de missions. | Moyen |
| 14 | **Confirmation de paiement + états Mobile Money** | Le paiement est le moment le plus anxieux ; un état « en attente » clair évite les doubles paiements. | Moyen |
| 15 | **Audit accessibilité + tests terrain** | Les hypothèses de ce rapport doivent être validées sur de vrais téléphones, en plein soleil, en 3G. | Faible |
| 16 | **Mode sombre** | Confort le soir, mais ne pas en faire un argument de batterie sans mesure sur le parc (OLED vs LCD). | Moyen |
| 17 | **Analytics produit** | Mesurer recherche sans résultat, abandon de publication, temps jusqu'au premier message. | Faible |

### Ce qu'il ne faut pas faire maintenant

- **Ajouter des verticales** (transport, food) avant d'avoir stabilisé la confiance sur les services.
- **Construire un wallet LinkUp** : le Mobile Money existant suffit pour la v1.
- **Cartes interactives en temps réel** : coûteuses en data et en batterie, peu utiles pour un service à domicile.
- **Onboarding gamifié** : le public cible veut aller vite, pas collectionner des badges.

---

## 5. Accessibilité et lisibilité

### 5.1 Contrastes : la palette Gabon doit être retravaillée

Les ratios ci-dessous sont calculés selon la formule WCAG (luminance relative). Seuils : **4,5:1** pour le texte normal, **3:1** pour le grand texte (≥ 24 px, ou ≥ 18,66 px gras) et les composants d'interface. ([W3C — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [WebAIM](https://webaim.org/resources/contrastchecker))

| Combinaison | Ratio | Verdict |
|---|---:|---|
| Blanc sur `#009E60` (vert Gabon) | **3,47:1** | ❌ Texte normal ; ✅ grand texte seulement |
| `#009E60` sur fond sombre `#0B1220` | **5,40:1** | ✅ Texte normal |
| `#009E60` sur sable `#F7F5F0` | **3,18:1** | ❌ Texte normal ; ✅ grand texte |
| `#007A4A` sur sable `#F7F5F0` | **4,96:1** | ✅ Texte normal |
| Blanc sur `#007A4A` | **5,41:1** | ✅ Bouton plein |
| `#FCD116` sur fond sombre `#0B1220` | **12,72:1** | ✅ Excellent |
| `#FCD116` sur blanc | **1,47:1** | ❌ Jamais pour du texte |
| `#0B2A1F` sur `#FCD116` | **10,45:1** | ✅ Texte sombre sur jaune |
| `#3A75C4` sur fond sombre `#0B1220` | **4,03:1** | ❌ Texte normal |
| Blanc sur `#3A75C4` | **4,64:1** | ✅ (juste) |
| `#93C5FD` sur `#0B1220` | **10,38:1** | ✅ Lien en mode sombre |

**Conclusions concrètes :**

1. **Ne jamais utiliser de texte blanc sur le vert `#009E60` pour du texte normal** (moins de 24 px, ou moins de 18,66 px en gras) : le ratio est de 3,47:1. Pour les boutons, utiliser `#007A4A` (5,41:1) ou un texte sombre.
2. **Le jaune `#FCD116` est une couleur de remplissage, pas de texte.** Sur blanc, il est illisible (1,47:1). Pour un badge, l'utiliser en fond avec du texte `#0B2A1F`.
3. **Le bleu `#3A75C4` est limite sur fond sombre.** En mode sombre, utiliser `#93C5FD` pour les liens.
4. **Le vert `#009E60` reste la couleur de marque**, mais en accent (icônes, bordures, états), pas en fond de texte courant.

**Ne pas se fier uniquement à la couleur** pour les statuts : ajouter une icône et un libellé (« Confirmée », « En attente »). C'est une exigence WCAG 1.4.1. ([W3C — Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html))

### 5.2 Cibles tactiles

- **Android** : 48 × 48 dp minimum, soit environ 9 mm, avec 8 dp d'espace entre cibles. ([Android Accessibility](https://support.google.com/accessibility/android/answer/7101858), [Material 3 — Structure](https://m3.material.io/foundations/designing/structure))
- **iOS** : 44 × 44 pt. ([Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout))
- **WCAG 2.2 AA** : 24 × 24 px minimum, ou 24 px d'espacement. C'est un plancher, pas un objectif. ([W3C — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))

**Application LinkUp :**

- Boutons principaux : hauteur 52–56 dp, largeur pleine sur mobile.
- Icônes seules : `IconButton` avec padding, jamais 24 dp cliquable.
- Chips de filtres : hauteur 40–44 dp, espacement 8 dp.
- Liens dans le texte : OK (exception WCAG), mais éviter les petits liens isolés.
- Actions destructrices (« Supprimer », « Bloquer ») : jamais collées à une action bénigne.

### 5.3 Typographie et français

- **Corps de texte : 16 sp minimum.** 14 sp pour les métadonnées, 12 sp pour les mentions légales uniquement.
- **Ne pas figer la hauteur des lignes** : le texte doit pouvoir grandir avec le réglage système. Utiliser `MediaQuery.textScalerOf(context)` et des layouts flexibles, pas `textScaleFactor` (déprécié). ([Flutter — TextScaler](https://docs.flutter.dev/release/breaking-changes/deprecate-textscalefactor))
- **Tester à 200 %** de taille de texte : les boutons, chips et cartes doivent rester lisibles et cliquables.
- **Éviter les majuscules** pour les libellés longs : le français accentué en capitales est moins lisible.
- **Français correct** : accents, apostrophes typographiques, espaces insécables avant `:` `;` `!` `?`, et entre le montant et `FCFA` (`10 000 FCFA`).
- **Formats** : `intl` avec locale `fr_GA` (ou `fr_FR` + symbole `FCFA`), dates `lun. 19 oct.`, téléphone `+241 06 00 00 00`.
- **Vocabulaire stable** : « prestataire » (pas « pro » et « vendeur » selon les écrans), « mission » (pas « tâche » et « commande »), « quartier » (pas « zone »).
- **Éviter le jargon** : « devis », « disponibilité », « budget » sont compris ; « matching », « lead », « onboarding » ne le sont pas.

### 5.4 Mode sombre, lumière et batterie

- **Proposer les deux modes**, avec « Suivre le système » par défaut.
- **Ne pas utiliser de noir pur** (`#000000`) ni de blanc pur sur fond sombre : contraste trop dur, halos. Utiliser `#0B1220` et `#F2F4F7`.
- **En mode sombre**, les surfaces doivent se distinguer par des teintes (`#141C2B`, `#1B2536`) et non par des ombres.
- **Le gain de batterie du mode sombre dépend de l'écran** (OLED vs LCD). Sur un parc d'entrée de gamme majoritairement LCD, le gain est faible ; ne pas promettre de « économie de batterie » sans mesure.
- **Plein soleil** : le mode clair à contraste élevé est souvent plus lisible qu'un dégradé sombre avec du texte gris. Tester sur un écran de téléphone bas de gamme, luminosité 100 %, en extérieur.
- **Faible luminosité** : éviter les textes gris clair sur fond clair (`#9CA3AF` sur blanc = 2,54:1, insuffisant).

### 5.5 Utilisateurs peu familiers du numérique

- **Une action principale par écran**, avec un libellé explicite (« Publier une mission », pas « Suivant »).
- **Icône + texte** systématiquement pour les actions importantes. Une icône seule n'est pas comprise par tout le monde.
- **Pas de geste caché** (swipe pour supprimer, appui long). Toujours un bouton visible.
- **Confirmer les actions destructrices** avec un verbe clair : « Supprimer la mission » / « Annuler ».
- **Messages vocaux** dans le chat : plus faciles à produire que du texte pour certains utilisateurs.
- **Photos avant/après** : un vendeur de service montrer son travail vaut mieux qu'une longue bio.
- **Numéros et montants en gros**, avec des chiffres tabulaires si possible.
- **Progression visible** : « Étape 2 sur 3 » pour la publication d'une mission.
- **Rassurer après l'action** : « Votre mission est publiée. Les prestataires peuvent maintenant postuler. »

### 5.6 Tests à prévoir avant lancement

1. **Écran 320 dp de large** (petit Android) : pas de débordement, pas de texte tronqué.
2. **Taille de texte 200 %** : parcours de recherche, fiche, chat, publication.
3. **TalkBack** : libellés des icônes, ordre de focus, annonce des erreurs.
4. **3G bridée** (200 kbps, 400 ms de latence) : chargement, images, publication.
5. **Mode avion** : consultation du cache, file d'attente, retour du réseau.
6. **Plein soleil** : lisibilité des couleurs et des contrastes.
7. **Test à deux pouces / une main** : boutons accessibles dans la zone du pouce.
8. **Utilisateurs peu familiers** : 5 personnes, tâches réelles (trouver un dépanneur, publier une mission).

---

## 6. Tableau récapitulatif final

| Pattern | Pourquoi | Comment l'appliquer chez LinkUp |
|---|---|---|
| **Carte de décision** | L'utilisateur doit choisir sans ouvrir 5 fiches | Photo, métier, note + nb d'avis, quartier, prix, dispo, CTA |
| **Recherche avec suggestions** | Le vocabulaire local est varié (PC, ordinateur, dépannage) | Autocomplete dès 2 caractères + recherches récentes + populaires |
| **Filtres en bottom sheet** | Garder les résultats visibles et réduire les taps | Panneau 85 %, compteur live « Voir 18 prestataires », chips actives |
| **Quartiers en chips** | Les noms sont mal orthographiés et les limites informelles | Nzeng-Ayong, Glass, Louis, PK12, Akanda, Owendo, Port-Gentil |
| **État « aucun résultat »** | Un écran vide ressemble à une panne | Expliquer, proposer de retirer un filtre, publier une mission |
| **Fiche prestataire rassurante** | Le doute principal est la confiance | Bandeau de preuves, avis liés à une mission, CTA collant |
| **Deux chemins de contact** | « Discuter » et « comparer des offres » sont deux intentions | Bouton « Discuter » + bouton « Publier une mission » |
| **Message pré-rempli** | Réduit l'anxiété et les messages vides | « Bonjour, j'ai besoin de [service] à [quartier]… » |
| **Note vocale** | Plus accessible que le texte pour certains | Bouton micro dans le chat, avec durée limitée |
| **Numéro masqué** | Protéger les prestataires et les clients | Révélation après consentement, bouton « Afficher mon numéro » |
| **Onboarding invité** | Voir avant de s'inscrire | Navigation libre, compte au premier contact |
| **OTP téléphone** | Le téléphone est l'identité locale | +241 pré-rempli, OTP 6 chiffres, pas de mot de passe |
| **Profil progressif** | Ne pas demander 10 champs à l'inscription | Nom/photo au moment de publier ou de devenir prestataire |
| **Échelle de vérification** | La confiance doit être vérifiable | Téléphone → identité → métier → mission vérifiée, badges expliqués |
| **Avis vérifiés** | Un avis sans mission n'a pas de valeur | Avis uniquement après mission terminée, note privée séparée |
| **Timeline de mission** | L'utilisateur doit savoir quoi faire ensuite | Ouverte → En discussion → Confirmée → Terminée, avec prochaine action |
| **Confirmation récapitulative** | Éviter les surprises et les litiges | Prestataire, service, date, quartier, prix, paiement, référence |
| **Mobile Money asynchrone** | Le push USSD n'est pas instantané | États « en attente / confirmé / échoué », chronomètre, réessai |
| **Squelettes de chargement** | Perceived performance sur 3G | Skeletonizer sur les listes, header et CTA toujours visibles |
| **Cache + file d'attente** | Le réseau tombe souvent | Dernières données affichées, messages « en attente », sync idempotente |
| **Erreurs actionnables** | Une erreur doit dire quoi faire | Message près du champ, bouton « Réessayer », données conservées |
| **Contrastes accessibles** | La palette actuelle échoue sur certains textes | `#007A4A` pour les boutons, `#FCD116` en fond, `#93C5FD` en mode sombre |
| **Cibles 48 dp** | Les doigts et les écrans petits | Boutons 52–56 dp, espacement 8 dp, pas d'icône seule de 24 dp |
| **Typographie adaptable** | Utilisateurs malvoyants / petits écrans | Corps 16 sp, pas de hauteur fixe, test à 200 % |
| **Français local** | Crédibilité et compréhension | Accents, FCFA, dates FR, vocabulaire stable, pas de jargon |
| **Mode sombre optionnel** | Confort le soir, pas une obligation | Suivre le système, surfaces teintées, pas de noir pur |

---

## 7. Sources

### Sources produit et design systems

1. Urban Company Design — « The all-new Urban Company app » : https://medium.com/uc-design/the-all-new-urban-company-app-32b3953e990e
2. 3 Sided Coin — refonte du checkout Urban Company : https://3sided.co.in/urbanclap.html
3. Obvious — design system Urban Company : https://www.obvious.in/blog/urban-company-design-system
4. TaskRabbit — mise à jour de l'app Tasker : https://www.taskrabbit.com/blog/tasker-update-app-version-4-42-0/
5. Big Human — refonte UX/UI TaskRabbit : https://www.bighuman.com/work/taskrabbit
6. TaskRabbit Support — notes de satisfaction privées : https://support.taskrabbit.com/hc/en-us/articles/46260450347803-What-Are-Client-Satisfaction-Ratings
7. TaskRabbit Support — laisser un avis : https://support.taskrabbit.com/hc/en-us/articles/46260428700059-How-Do-I-Leave-a-Review
8. Thumbtack Press — Instant Book : https://press.thumbtack.com/announcements/thumbtack-launches-instant-book-to-make-hiring-pros-even-easier
9. Thumbtack — App Store : https://apps.apple.com/us/app/thumbtack-home-service-pros/id852703300
10. Airtasker — How it works : https://www.airtasker.com/us/how-it-works
11. Airtasker — Earn money : https://www.airtasker.com/us/earn-money
12. Airtasker — App Store : https://apps.apple.com/au/app/airtasker/id512137061
13. StarOfService — How it works for Pros : https://www.starofservice.com.jm/pro/how-it-works
14. TechCrunch — changement de modèle StarOfService : https://techcrunch.com/2019/02/20/starofservice-switches-business-model-for-its-independent-contractor-marketplace/
15. Yoojo — Become a service provider : https://yoojo.ie/become-a-service-provider
16. Yoojo — App Store : https://apps.apple.com/us/app/yoojo-home-services/id1309048389
17. Jiji — Verified ID badge : https://jiji.ng/faq/verified-id-badge
18. Jiji — Verified store : https://jiji.ng/faq/offline-store-verification
19. Frank Agyepong — recherche UX Jiji : https://frankagyepong.com/jiji/
20. Medium — redesign Jiji.ng : https://medium.com/@osunmolatosin/jiji-ng-redesign-11d4bfdf6fac
21. WhatsApp Business — catalogue : https://whatsappbusiness.com/resources/resource-library/whatsapp-business-app-resources-whatsapp-business-catalog
22. Meta for Developers — catalogs overview : https://developers.facebook.com/documentation/business-messaging/whatsapp/catalogs/catalogs-overview
23. WhatsApp Help Center — about catalog : https://faq.whatsapp.com/405903568419894
24. Facebook — vendre sur Marketplace : https://www.facebook.com/help/www/561376580709359
25. OfferUp — About : https://about.offerup.com
26. OfferUp — Staying safe : https://about.offerup.com/post/staying-safe-on-offerup
27. PR Newswire — profils vérifiés OfferUp : https://www.prnewswire.com/news-releases/offerup-launches-enhanced-public-profiles-to-elevate-user-reputation-and-verifications-663891583.html
28. Vinted — How it works : https://www.vinted.com/how_it_works
29. Mercari — Anonymous shipping : https://careers.mercari.com/en/mercan/articles/59470/
30. Mercari — Creating a listing : https://www.mercari.com/us/help_center/topics/listing/guides/creating-a-listing/
31. Airbnb Design — Designing for trust : https://medium.com/airbnb-design/designing-for-trust-7ce268468d5b
32. Learning People — UX Airbnb : https://www.learningpeople.com/au/career-insights/blog/why-uxui-design-is-essential-for-brand-success-airbnb
33. Uber Base Design System : https://base.uber.com
34. Uber — Trip branding : https://www.uber.com/rs/en/blog/trip-branding-personalization
35. Leboncoin — Google Play : https://play.google.com/store/apps/details?id=fr.leboncoin
36. Gozem — site officiel : https://gozem.co/en/
37. Gozem — notre histoire : https://website.gozem.co/en/
38. Gozem — Google Play : https://play.google.com/store/apps/details?id=com.gozem
39. Rest of World — super apps et Gozem : https://restofworld.org/2021/everyone-wants-to-be-a-superapp/
40. Yango — site officiel : https://yango.com
41. Pixelmatters — design de l'app Jumia : https://www.pixelmatters.com/work/jumia-ecommerce-mobile-app-design
42. Fiverr — Graphics & Design : https://www.fiverr.com/categories/graphics-design
43. Fiverr Design — projets mobile : https://dribbble.com/FiverrDesign/projects/1553031-Mobile-apps

### Design systems, accessibilité et UX

44. Material Design 3 : https://m3.material.io
45. Material 3 — Navigation bar : https://m3.material.io/components/navigation-bar/overview
46. Material 3 — Touch targets : https://m3.material.io/foundations/designing/structure
47. Material 3 — Type scale : https://m3.material.io/styles/typography/type-scale-tokens
48. Material 3 Expressive : https://m3.material.io/blog/building-with-m3-expressive
49. GitHub Flutter — support M3 Expressive : https://github.com/flutter/flutter/issues/168813
50. Android Accessibility — Touch target size : https://support.google.com/accessibility/android/answer/7101858
51. W3C — Target Size Minimum (WCAG 2.2) : https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
52. W3C — Contrast Minimum (WCAG 2.2) : https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
53. W3C — Use of Color (WCAG 2.1) : https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
54. WebAIM — Contrast Checker : https://webaim.org/resources/contrastchecker
55. Apple — Human Interface Guidelines, Layout : https://developer.apple.com/design/human-interface-guidelines/layout
56. NN/g — Skeleton Screens 101 : https://www.nngroup.com/articles/skeleton-screens
57. NN/g — Empty States in Complex Applications : https://www.nngroup.com/articles/empty-state-interface-design
58. NN/g — Error-Message Guidelines : https://www.nngroup.com/articles/error-message-guidelines
59. NN/g — Mobile Faceted Search with a Tray : https://www.nngroup.com/articles/mobile-faceted-search
60. NN/g — Helpful Filter Categories and Values : https://www.nngroup.com/articles/filter-categories-values
61. NN/g — Progressive Disclosure : https://www.nngroup.com/articles/progressive-disclosure
62. NN/g — 4 Principles to Reduce Cognitive Load in Forms : https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/
63. GOV.UK — One thing per page : https://designnotes.blog.gov.uk/2015/07/03/one-thing-per-page/

### Contexte marché, performance et packages

64. DataReportal — Digital 2026: Gabon : https://datareportal.com/reports/digital-2026-gabon
65. GSMA — The Mobile Economy Africa : https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/africa
66. GSMA — The Mobile Economy Sub-Saharan Africa 2024 (PDF) : https://event-assets.gsma.com/pdf/GSMA_ME_SSA_2024_Web.pdf
67. Google Play Dev — Shrinking APKs, growing installs : https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2
68. Android — Android (Go edition) : https://developer.android.com/guide/topics/androidgo
69. Android Developers Blog — Optimize for Android Go : https://android-developers.googleblog.com/2022/09/optimize-for-android-go-lessons-from-google-apps-part-1.html
70. Flutter — Internationalization : https://docs.flutter.dev/ui/internationalization
71. Flutter — TextScaler (remplace textScaleFactor) : https://docs.flutter.dev/release/breaking-changes/deprecate-textscalefactor
72. Appt — Scale text in Flutter : https://appt.org/en/docs/flutter/samples/scale-text
73. Flutter API — BackdropFilter : https://api.flutter.dev/flutter/widgets/BackdropFilter-class.html
74. GitHub Flutter — BackdropFilter performance : https://github.com/flutter/flutter/issues/32804
75. pub.dev — cached_network_image : https://pub.dev/packages/cached_network_image
76. pub.dev — skeletonizer : https://pub.dev/packages/skeletonizer
77. pub.dev — flutter_animate : https://pub.dev/packages/flutter_animate
78. pub.dev — go_router : https://pub.dev/packages/go_router
79. pub.dev — connectivity_plus : https://pub.dev/packages/connectivity_plus
80. pub.dev — internet_connection_checker_plus : https://pub.dev/packages/internet_connection_checker_plus
81. pub.dev — drift : https://pub.dev/packages/drift
82. pub.dev — hive_ce : https://pub.dev/packages/hive_ce
83. pub.dev — flutter_image_compress : https://pub.dev/packages/flutter_image_compress
84. pub.dev — flutter_riverpod : https://pub.dev/packages/flutter_riverpod
85. Expo — Image : https://docs.expo.dev/versions/latest/sdk/image/
86. Expo — FlashList : https://docs.expo.dev/versions/latest/sdk/flash-list/
87. Shopify — FlashList docs : https://shopify.github.io/flash-list/docs/
88. Telecom Review Africa — mobile money et USSD : https://www.telecomreviewafrica.com/articles/features/28877-has-mobile-money-outgrown-its-own-infrastructure/
89. DGateway — mobile money vs cartes en Afrique : https://dgateway.desispay.com/blog/mobile-money-vs-card-payments-africa

---

*Fin du rapport. Les ratios de contraste ont été calculés à partir des codes hexadécimaux indiqués, selon la formule WCAG 2.x. Les recommandations de priorité et de coût sont des estimations de projet, à ajuster après cadrage technique.*
