# Recherche concurrence — LinkUp Gabon

> **Objet** : comprendre le paysage concurrentiel d'une marketplace de services de proximité au Gabon, identifier les modèles économiques viables, les mécanismes de paiement et de confiance, et formuler des recommandations priorisées pour LinkUp.
>
> **Date de clôture des recherches** : 19 octobre 2026.
>
> **Périmètre** : Libreville en priorité, puis principales villes du Gabon (Port-Gentil, Franceville, Oyem). Concurrence directe gabonaise, concurrence indirecte (annonces, mobilité, livraison, e-commerce) et benchmarks internationaux.
>
> **Règle de preuve** : chaque affirmation structurante renvoie à une source consultable. Les chiffres issus des entreprises elles-mêmes sont signalés comme tels. Les points non confirmés sont marqués **« à vérifier »**. Aucun chiffre de marché n'est extrapolé.

---

## Sommaire

- [1. Synthèse exécutive](#synthese)
- [2. Méthode, périmètre et limites](#methode)
- [3. Le marché gabonais en 2026](#marche)
  - [3.1 Équipement, télécoms et usages](#marche-equipement)
  - [3.2 Paiement : mobile money, cash et agrégateurs](#marche-paiement)
  - [3.3 Ce que cela implique pour LinkUp](#marche-implications)
- [4. Cartographie concurrentielle](#cartographie)
- [5. Analyse par famille](#familles)
  - [5.1 Marketplaces de services de proximité](#services)
  - [5.2 Annuaires et génération de leads](#leadgen)
  - [5.3 Petites annonces et marketplaces généralistes](#annonces)
  - [5.4 Plateformes freelance](#freelance)
  - [5.5 Mobilité et livraison](#mobilite)
  - [5.6 E-commerce africain](#ecommerce)
  - [5.7 Acteurs gabonais : la concurrence directe](#gabon)
- [6. Monétisation](#monetisation)
- [7. Paiement et confiance](#paiement)
- [8. Frictions propres au Gabon](#frictions)
- [9. Recommandations priorisées](#recommandations)
  - [9.1 Deux stratégies possibles](#strategies)
  - [9.2 Ce qu'il faut copier](#must-copy)
  - [9.3 Ce qu'il faut éviter](#must-avoid)
  - [9.4 Se différencier de WhatsApp](#whatsapp)
  - [9.5 Feuille de route 90 jours / 12 mois](#roadmap)
  - [9.6 Indicateurs à piloter](#kpis)
- [10. Sources](#sources)

---

<a id="synthese"></a>
## 1. Synthèse exécutive

1. **Le concurrent principal n'est pas une application : c'est WhatsApp.** Le fondateur d'OZOservir résume le problème mieux que n'importe quelle étude : « Tout passait par WhatsApp, Facebook ou le bouche-à-oreille, sans garantie sur la qualité, les prix ou même la disponibilité » ([Gabonreview, 24 février 2026](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)). Facebook Marketplace Libreville et les groupes d'annonces occupent déjà le terrain ([Marketplace Libreville](https://www.facebook.com/marketplace/110266982329699/), [groupe Gabon Marketplace](https://www.facebook.com/groups/688584426149434/)). LinkUp doit donc battre un canal gratuit, familier et sans installation sur la confiance et la structure, pas sur le nombre de fonctionnalités.

2. **La concurrence gabonaise est jeune, fragmentée, mais réelle.** OZOservir a annoncé son lancement pour fin mars 2026 avec 500 inscrits revendiqués avant lancement, un abonnement de 1 900 à 5 000 FCFA/mois et une commission de 3 à 4 % ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)), mais sa fiche Google Play n'affiche que la tranche « 10+ téléchargements » ([Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)). Akanda Biz revendique 10K+ téléchargements et 4,1/5 sur 67 avis, mais s'est recentré sur le VTC et la livraison ([Google Play](https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app)). Bane, Ve.Line, WoKaTroc, Troki, CoinAfrique et Gaboncoin se disputent les services et les annonces. **Aucun acteur n'a encore gagné la confiance du marché.**

3. **La confiance est le produit, pas un badge.** Bane vérifie l'identité, n'autorise les avis qu'après une mission terminée et modère activement ([Bane, comment ça marche](https://banenounou.com/how-it-works)). Troki vérifie chaque annonce avant publication et impose une règle simple : « jamais d'acompte, on voit l'article et on paie sur place » ([Troki](https://trokiga.com)). CoinAfrique avertit explicitement contre l'envoi d'argent avant vérification ([CoinAfrique Gabon](https://ga.coinafrique.com/)). Ces précautions disent toutes la même chose : **le paiement précède la confiance, et c'est précisément le problème.**

4. **Les modèles de monétisation convergent entre 10 et 25 %, mais le point d'équilibre gabonais est plus bas.** Urban Company prélève 8,5 à 25 % ([Urban Company](https://www.urbancompany.com/blog/urban-company-announces-12-point-program-to-improve-partner-earnings-and-livelihood/)), Yoojo 20 % ([Yoojo](https://help.yoojo.com/hc/fr/articles/360010778340)), NeedHelp 20 à 25 % ([NeedHelp](https://needhelp.zendesk.com/hc/fr-fr/articles/20228073075346)), Frizbiz 13 % ([Bonjour Idée](https://www.bonjouridee.com/frizbiz/)), Glovo 25 à 35 % sur la restauration ([Fooderise](https://www.fooderise.com/fr/plateformes/glovo)). OZOservir annonce 3 à 4 %, ce qui est probablement trop bas pour financer paiement, support et remboursements. **Recommandation : 8 à 12 % sur les transactions encaissées, plus un abonnement Pro et des boosts — pas de paiement au lead au lancement.**

5. **Le paiement est un duopole mobile money, avec du cash encore structurant.** Airtel Gabon et Moov Africa contrôlent 100 % du mobile et 100 % du mobile money ; les transactions mobile money ont atteint 620 milliards FCFA en 2024, en hausse de 18 % ([Inside News 241, 24 octobre 2025](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/)). Les agrégateurs existent (SingPay, Gabon Connect, PayCentral), mais aucun séquestre public n'a été identifié pour le marché gabonais. **Le séquestre est un différenciateur, pas une case à cocher : il faut un partenaire PSP agréé et une validation juridique.**

6. **Le problème de LinkUp n'est pas l'offre de profils, c'est la preuve, le paiement et la rétention.** L'application actuelle gère des prestataires, des demandes et des messages, sans KYC ni paiement ([README du dépôt](../README.md)), et ses catégories (Informatique, Cours, Livraison, Design & Web) sont plus proches du freelance numérique que des services de proximité réellement demandés à Libreville (ménage, nounou, coiffure, plomberie, bricolage). **Il faut rééquilibrer l'offre avant d'ajouter des fonctionnalités.**

7. **Stratégie recommandée : « confiance d'abord, transaction ensuite ».** Phase 1 (0–6 mois) : prestataires vérifiés, demandes structurées, avis après mission, partage WhatsApp, paiement direct cash/mobile money. Phase 2 (6–18 mois) : paiement in-app, séquestre, commission de 8 à 12 %. Cette séquence épouse les usages gabonais au lieu de les combattre.

---

<a id="methode"></a>
## 2. Méthode, périmètre et limites

### 2.1 Ce qui a été fait

- Revue documentaire de sources primaires : sites d'acteurs, fiches Google Play, conditions tarifaires, pages d'aide, statistiques officielles.
- Revue de presse gabonaise pour les lancements, les partenariats et les chiffres sectoriels.
- Analyse de benchmarks internationaux sur les frais, le séquestre, la vérification et les garanties.
- Lecture du dépôt LinkUp pour aligner les recommandations sur l'existant ([README](../README.md), [ARCHITECTURE](ARCHITECTURE.md)).

### 2.2 Règles de lecture

| Type de donnée | Traitement |
|---|---|
| Chiffre officiel (ARCEP, DataReportal) | Cité avec le lien et l'année |
| Chiffre d'entreprise (téléchargements, utilisateurs, CA) | Cité comme « revendiqué » ou « annoncé » |
| Tranche Google Play (« 10+ », « 10K+ ») | Traitée comme un ordre de grandeur, pas un chiffre exact |
| Estimation ou hypothèse | Marquée **« à vérifier »** ou explicitement présentée comme hypothèse |
| Acteur non documenté | Mentionné sans affirmation forte, ou écarté |

### 2.3 Limites

- **Pas d'entretiens terrain** avec des prestataires, des clients ou des concurrents : les motivations d'achat sont déduites des discours publics et des produits.
- **Pas de données financières privées** : aucun concurrent gabonais ne publie son chiffre d'affaires, son taux de commission réel ou son taux de rétention.
- **Présence gabonaise parfois incertaine** pour les acteurs internationaux : Jumia et Glovo sont traités avec prudence.
- **Sites dynamiques** : plusieurs plateformes gabonaises (WoKaTroc, Artisans Gabon) ne rendent leur contenu qu'en JavaScript ; les informations très détaillées y sont marquées « à vérifier ».
- **Définition de « concurrent »** : est concurrent direct tout acteur qui met en relation un client et un prestataire de service au Gabon ; indirect, tout acteur qui capte le même budget ou le même temps (annonces, mobilité, livraison, e-commerce) ; benchmark, tout acteur international dont le modèle éclaire les choix de LinkUp.

---

<a id="marche"></a>
## 3. Le marché gabonais en 2026

<a id="marche-equipement"></a>
### 3.1 Équipement, télécoms et usages

| Indicateur | Valeur | Année | Source |
|---|---:|---|---|
| Population | 2,57 M | 2025 | [DataReportal — Digital 2025 Gabon](https://datareportal.com/reports/digital-2025-gabon) |
| Internautes | 1,84 M (71,9 %) | 2025 | [DataReportal](https://datareportal.com/reports/digital-2025-gabon) |
| Connexions mobiles | 3,19 M (124 % de la population) | 2025 | [DataReportal](https://datareportal.com/reports/digital-2025-gabon) |
| Utilisateurs Facebook | 782 000 | 2025 | [DataReportal](https://datareportal.com/reports/digital-2025-gabon) |
| Utilisateurs Instagram | 147 000 | 2025 | [DataReportal](https://datareportal.com/reports/digital-2025-gabon) |
| Abonnements internet | > 2,3 M, dont 94,65 % mobile | T1 2025 | [ARCEP — observatoire](https://www.arcep.ga/pages/detail_observatoire/1), [PDF](https://www.arcep.ga/uploads/observatoires/internet/Internet%202025-1.pdf) |
| Pénétration des abonnements internet | 127,9 % | T1 2025 | [ARCEP — PDF](https://www.arcep.ga/uploads/observatoires/internet/Internet%202025-1.pdf) |
| Abonnements mobiles | 3,2 M, 92 % de la population urbaine | 2024 | [Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/) |
| Chiffre d'affaires télécoms | 279 milliards FCFA | 2024 | [Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/) |
| Volume mobile money | 620 milliards FCFA (+18 %) | 2024 | [Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/) |
| Opérateurs mobiles | 2 (Airtel, Moov), 100 % du marché | 2024 | [Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/) |
| Prix moyen de la data | 4,09 USD/Go, 206e sur 237 | 2025 | [Cable.co.uk](https://www.cable.co.uk/mobiles/worldwide-data-pricing/) |

**Attention aux deux taux de pénétration.** Le 71,9 % de DataReportal mesure les **individus** qui utilisent internet. Le 127,9 % de l'ARCEP mesure les **abonnements** rapportés à la population, avec un même usager qui peut détenir plusieurs SIM ou abonnements. Les deux chiffres sont vrais ; ils ne mesurent pas la même chose. Ne pas les mettre dans la même phrase sans le préciser.

**Lecture.** Le Gabon affiche 71,9 % d'internautes et un usage social très fort (Facebook, WhatsApp). Mais l'accès coûte cher : 4,09 USD/Go place le pays parmi les 15 % les plus chers au monde ([Cable.co.uk](https://www.cable.co.uk/mobiles/worldwide-data-pricing/)), et le duopole maintient les prix de la data parmi les plus élevés de la CEMAC ([Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/)). **Conséquence produit : application légère, images compressées, mode hors ligne, parcours court, notifications économes.**

<a id="marche-paiement"></a>
### 3.2 Paiement : mobile money, cash et agrégateurs

| Rail | Usage | Force | Limite |
|---|---|---|---|
| Airtel Money | Paiement, transfert, wallet | Base installée, intégré à Akanda Biz | Frais et API à négocier ; dépendance à un opérateur |
| Moov Money | Paiement, transfert, wallet | Second rail indispensable | Couverture et fiabilité variables |
| Cash | Paiement à la prestation | Universel, rassurant | Pas de trace, pas de recours, risque de no-show |
| Carte bancaire | Marginal pour les services du quotidien | International | Faible pénétration, coût, échec fréquent |
| Agrégateurs | SingPay, Gabon Connect, PayCentral | Interopérabilité Airtel/Moov, API unique | Frais, délais de règlement, contrat |

Sources : [SingPay](https://singpay.ga), [Gabon Connect — passerelle mobile money](https://gabonconnect.com/fr/nos-services/passerelle-paiement-mobile-money-api), [PayCentral CEMAC](https://paycentral.gabondunumerique.com/site/).

**Points de vigilance.**

- Airtel et Moov contrôlent 100 % du mobile money ([Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/)). Un agrégateur qui n'intègre pas les deux wallets exclut la moitié du marché.
- PayCentral affiche publiquement un taux de 0,8 % ([PayCentral](https://paycentral.gabondunumerique.com/site/)). C'est un point de départ de négociation, pas un tarif universel : **à vérifier contractuellement**, notamment sur les volumes, les retraits et les remboursements.
- Aucune grille tarifaire marchande publique et comparable n'a été trouvée pour Airtel Money et Moov Money. **À vérifier** auprès des opérateurs.
- Le cash restera probablement très utilisé pour les petits montants tant que la confiance et la traçabilité ne seront pas meilleures. Un produit qui refuse le cash au lancement se prive d'une grande partie du marché.

<a id="marche-implications"></a>
### 3.3 Ce que cela implique pour LinkUp

1. **Android d'abord, application légère.** L'usage est massivement mobile et les forfaits data sont chers ; OZOservir revendique d'ailleurs une application « légère, qui fonctionne avec une connexion limitée » ([Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)).
2. **Le quartier est l'unité de recherche, pas la ville.** À Libreville, l'adressage informel complique la géolocalisation : « l'identification des adresses peut encore poser problème » ([Infos Gabon, 20 août 2026](https://fr.infosgabon.com/yango-arrive-au-gabon-le-transport-urbain-change-dere/)). Il faut combiner quartier, repère, point GPS et numéro de téléphone.
3. **Le prix doit être cadré.** Les utilisateurs négocient, mais ils veulent savoir où ils mettent les pieds. Gozem a construit son taxi-station aéroport sur des prix fixes par zone (4 000, 6 000, 8 000 FCFA) ([Gabon Media Time, 24 avril 2026](https://gabonmediatime.com/aeroport-de-libreville-gozem-lance-son-taxi-station-a-prix-fixes/)).
4. **Le paiement doit rester simple.** Un seul bouton, deux wallets, un fallback cash, un reçu. Pas de wallet propriétaire au lancement sans partenaire agréé.
5. **La confiance doit être visible avant le paiement.** C'est exactement ce que vendent Bane, Troki et Madufe ; c'est ce qui manque à WhatsApp.

---

<a id="cartographie"></a>
## 4. Cartographie concurrentielle

| Famille | Acteurs retenus | Cœur de l'offre | Modèle économique | Présence Gabon | Menace pour LinkUp |
|---|---|---|---|---|---|
| Marketplaces de services | Urban Company, TaskRabbit, Yoojo, NeedHelp, Frizbiz, AlloVoisins | Prestation à domicile, confiance, paiement | Commission 8,5–25 %, frais de service, abonnement | Non | Benchmark |
| Annuaires / leads | Thumbtack, StarOfService | Mise en relation, devis | Paiement au lead | Non | Benchmark |
| Petites annonces | Jiji, CoinAfrique, Gaboncoin, Troki, Ve.Line, WoKaTroc | Annonces, services, boutiques | Freemium + boosts + abonnement Pro | Oui (CoinAfrique, Gaboncoin, Troki, Ve.Line, WoKaTroc) | **Forte** |
| Freelance | Fiverr, Upwork, Malt, Comeup | Missions numériques à distance | Commission 5–20 % | Non (remote) | Faible |
| Mobilité / livraison | Gozem, Yango, Glovo, livreurs locaux | Transport, colis, repas | Commission, courses, frais de service | Gozem oui ; Yango lancement ; Glovo à vérifier | **Forte** (attention, budget, flotte) |
| E-commerce | Jumia | Produits + logistique + paiement | Commission + logistique | À vérifier | Moyenne |
| **Gabonais services** | **OZOservir, Bane, Madufe, Akanda Biz** | **Services, garde d'enfants, mobilité** | **Abonnement, commission, wallet** | **Oui** | **Directe** |
| **Canal dominant** | **WhatsApp, Facebook Marketplace, groupes** | **Mise en relation informelle** | **Gratuit** | **Oui** | **La plus forte** |

**Lecture en trois cercles.**

- **Cercle 1 — concurrence directe** : OZOservir (services + biens), Bane (nounou/aide à domicile), Madufe (aide à domicile), Akanda Biz (mobilité, concurrence adjacente), et les marketplaces généralistes qui ont une catégorie services (Ve.Line, WoKaTroc, Troki, CoinAfrique).
- **Cercle 2 — concurrence indirecte** : Gozem et Yango captent le budget mobilité et installent l'habitude du paiement in-app ; les livreurs locaux captent le budget logistique ; Jumia capte le budget équipement.
- **Cercle 3 — l'incumbent** : WhatsApp et Facebook Marketplace, gratuits, déjà installés, socialement légitimes. C'est contre eux que se joue l'adoption, pas contre OZOservir.

---

<a id="familles"></a>
## 5. Analyse par famille

<a id="services"></a>
### 5.1 Marketplaces de services de proximité

#### Urban Company (Inde, Golfe)

**Ce qu'il fait.** Plateforme de services à domicile (beauté, ménage, réparation, électroménager) avec des professionnels formés, des kits standardisés, des prix affichés et un service client centralisé ([Urban Company](https://www.urbancompany.com/), [Wikipédia](https://en.wikipedia.org/wiki/Urban_Company)).

**Forces à copier.**
- **Standardisation de l'expérience** : formation, kit, checklist, garantie. Le client achète un résultat, pas une promesse.
- **Prix affiché** avant la réservation, ce qui réduit la négociation et les mauvaises surprises.
- **Densité géographique** : l'offre est concentrée là où la demande est dense, ce qui réduit les temps de trajet.

**Faiblesses à éviter.**
- **Commission élevée** : 8,5 à 25 % selon les catégories, après un plafond historique à 30 % ([Urban Company, programme partenaire](https://www.urbancompany.com/blog/urban-company-announces-12-point-program-to-improve-partner-earnings-and-livelihood/)). Les prestataires se plaignent de la pression sur leurs revenus et des blocages temporaires de comptes ([Urban Company](https://www.urbancompany.com/blog/urban-company-announces-12-point-program-to-improve-partner-earnings-and-livelihood/)).
- **Modèle capitalistique** : formation, kits, assurance et support coûtent cher ; difficile à répliquer pour une petite structure.

**Leçon pour LinkUp.** La standardisation crée la confiance, mais LinkUp ne peut pas ouvrir une académie au lancement. Version agile : **checklist de qualité par catégorie, photos avant/après, charte de prix, garantie limitée**. La commission doit rester sous 12 % tant que le volume ne permet pas d'absorber le coût du support.

#### TaskRabbit (États-Unis, Royaume-Uni)

**Ce qu'il fait.** Marketplace de petites missions (montage de meubles, déménagement, bricolage), avec vérification des antécédents, paiement intégré et notation ([Wikipédia](https://en.wikipedia.org/wiki/Taskrabbit)).

**Forces à copier.**
- **Vérification des antécédents** et badge de confiance : un signal fort pour les missions à domicile.
- **Paiement intégré** : le client paie la plateforme, le prestataire est payé après la mission.
- **Planification et rappels** : réduction des no-shows.

**Faiblesses à éviter.**
- **Frais cumulés** : modèle historique à 30 % de frais de service plus 7,5 % de « Trust & Support fee », fortement critiqué par les prestataires ([Fast Company, 2016](https://www.fastcompany.com/3065993/taskrabbit-workers-fee-increase), [Support TaskRabbit](https://support.taskrabbit.com/hc/en-gb/articles/46260514951579-Fees-payments-and-cancellation-supplemental-terms)). Le barème actuel est **à vérifier**.
- **Dépendance à une plateforme unique** : les prestataires partent dès qu'ils peuvent contourner la commission.

**Leçon pour LinkUp.** Le paiement intégré justifie une commission, mais **pas 30 %**. À Libreville, un prestataire qui perd un tiers de son revenu retournera immédiatement sur WhatsApp. La transparence sur le net perçu est plus importante que le taux affiché.

#### Yoojo, NeedHelp, Frizbiz (France)

**Ce qu'ils font.** Mise en relation pour des services domestiques (ménage, bricolage, déménagement, cours), avec paiement en ligne et parfois assurance.

**Forces à copier.**
- **Frais de service clairs** : 20 % chez Yoojo avec un minimum de 5 € ([Yoojo](https://help.yoojo.com/hc/fr/articles/360010778340)), 20 à 25 % chez NeedHelp ([NeedHelp](https://needhelp.zendesk.com/hc/fr-fr/articles/20228073075346)), 13 % chez Frizbiz ([Bonjour Idée](https://www.bonjouridee.com/frizbiz/)).
- **Couverture assurance** et gestion des litiges, qui justifient une partie du prélèvement.

**Faiblesses à éviter.**
- **Frais élevés pour des services à faible marge** : 20 % sur une prestation dont la marge nette est déjà faible peut représenter davantage que ce que le prestataire conserve.
- **Complexité administrative** : les plateformes européennes doivent gérer des obligations sociales et fiscales lourdes ; ce n'est pas transposable tel quel au Gabon.

**Leçon pour LinkUp.** **Frizbiz à 13 % est la référence la plus crédible** pour un modèle « paiement + assurance + support » à faible marge. LinkUp devrait viser 8 à 12 %, avec un plafond explicite par mission pour ne pas taxer les petites prestations.

#### AlloVoisins (France)

**Ce qu'il fait.** Mise en relation de voisins pour des services (bricolage, garde, covoiturage), sans commission sur les transactions ([AlloVoisins](https://www.allovoisins.com/)).

**Forces à copier.**
- **Zéro commission** : barrière à l'entrée très faible pour les prestataires.
- **Monétisation par abonnement et boosts** : « Abonnement Premier » et « Booster » ([AlloVoisins — support pro](https://support-pro.allovoisins.com/hc/fr/articles/19967275692818), [AlloVoisins — paiement sans commission](https://www.allovoisins.com/article/442-faites-vous-payer-en-ligne-sans-commission)).

**Faiblesses à éviter.**
- **Faible contrôle de la transaction** : sans paiement intégré, la plateforme ne capte ni la valeur ni les données de satisfaction.
- **Qualité hétérogène** : l'absence de vérification systématique tire l'expérience vers le bas.

**Leçon pour LinkUp.** L'abonnement et les boosts sont viables **quand la liquidité est déjà là**. Au lancement, LinkUp n'a pas cette liquidité : commencer par une commission basse sur les transactions réellement encaissées, puis ajouter l'abonnement.

<a id="leadgen"></a>
### 5.2 Annuaires et génération de leads

#### Thumbtack (États-Unis)

**Ce qu'il fait.** Le client décrit son besoin, la plateforme met en relation avec des professionnels ; ces derniers paient **au lead**, pas à la mission ([Brineweb](https://www.brineweb.com/blog/thumbtack-business-model-how-thumbtack-works-and-makes-money)).

**Forces à copier.**
- **Qualification de la demande** : le client remplit un formulaire structuré, ce qui améliore la conversion.
- **Monétisation dès le premier contact**, indépendamment du volume de transactions.

**Faiblesses à éviter.**
- **Le professionnel paie même sans obtenir le chantier** : modèle critiqué, surtout pour les petits artisans.
- **Incitation au spam** : les professionnels contactent large pour amortir le coût des leads.

**Leçon pour LinkUp.** **Ne pas facturer au lead au lancement.** Dans un marché où le prestataire vit au jour le jour, payer pour un contact non converti est perçu comme un risque, pas comme un investissement. Si LinkUp teste le modèle plus tard, il faut plafonner les crédits et rembourser les leads invalides.

#### StarOfService (France, international)

**Ce qu'il fait.** Mise en relation avec des professionnels, modèle de génération de leads et de crédits pour les pros ([StarOfService](https://www.starofservice.us/pro/how-it-works)).

**Forces à copier.**
- **SEO et acquisition organique** : les pages « service + ville » captent une demande déjà exprimée.
- **Devis comparés** : le client reçoit plusieurs propositions.

**Faiblesses à éviter.**
- **Pression commerciale** sur les professionnels pour acheter des crédits.
- **Expérience client inégale** selon la réactivité des pros.

**Leçon pour LinkUp.** Le SEO local (« plombier Libreville », « nounou Akanda ») est un canal peu coûteux et durable. Mais il faut mesurer le **coût par mission terminée**, pas le coût par lead.

<a id="annonces"></a>
### 5.3 Petites annonces et marketplaces généralistes

#### Jiji (Afrique)

**Ce qu'il fait.** Petites annonces gratuites avec options de visibilité payantes (TOP, Boost) ([Jiji — FAQ](https://jiji.sn/faq/169)). La société revendique 90 millions d'utilisateurs annuels et environ 70 milliards USD de valeur d'annonces ([Wikipédia](https://en.wikipedia.org/wiki/Jiji_Africa)) — chiffres **revendiqués**, non audités.

**Forces à copier.**
- **Gratuité de base** : maximise l'offre et le SEO.
- **Boosts** : monétisation simple, sans friction sur la transaction.
- **Modération et catégories** : structurent une masse d'annonces très hétérogène.

**Faiblesses à éviter.**
- **Pas de transaction** : la plateforme ne garantit ni le paiement ni la qualité.
- **Annonces dupliquées, prix opaques, arnaques** : conséquences classiques du modèle.

**Leçon pour LinkUp.** Jiji prouve que **la gratuité est un moteur d'offre**, pas un modèle économique. LinkUp doit copier la gratuité de base et les boosts, mais ajouter ce que Jiji n'a pas : la preuve de réalisation.

**Présence au Gabon : à vérifier.** Le domaine `jiji.ga` ne répondait pas à la date de recherche ; OZOservir cite pourtant Jiji parmi les acteurs présents ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)).

#### CoinAfrique (Afrique francophone, présent au Gabon)

**Ce qu'il fait.** Petites annonces gratuites, avec catégories services (babysitting, ménage, cours, travaux, beauté, web/design) et options de visibilité payantes ([CoinAfrique Gabon](https://ga.coinafrique.com/), [offres de visibilité](https://ci.coinafrique.com/nos-offres-visibilite)).

**Forces à copier.**
- **Couverture géographique** : villes et quartiers, ce qui est exactement la maille de LinkUp.
- **Catégories services déjà remplies** : la demande existe, elle n'est pas à créer.
- **Règles de sécurité explicites** : « ne pas envoyer de paiements sans avoir vérifié le produit », « donner rendez-vous dans un lieu public » ([CoinAfrique Gabon](https://ga.coinafrique.com/)).

**Faiblesses à éviter.**
- **Pas de paiement intégré** : la plateforme se décharge de la confiance sur l'utilisateur.
- **Pas de vérification systématique** : la qualité dépend de l'annonceur.
- **Avertissements plutôt que garanties** : l'aveu que le risque reste entier.

**Leçon pour LinkUp.** CoinAfrique est le meilleur argument commercial : **les gens cherchent déjà des services en ligne, mais ils ne sont pas rassurés**. LinkUp n'a pas à créer la demande ; il doit sécuriser la conclusion.

#### Ve.Line (Gabon)

**Ce qu'il fait.** Marketplace gabonaise revendiquant 9 provinces, 3 rôles (acheteur, vendeur, livreur), annonces gratuites, boutiques certifiées, messagerie, livraison intégrée et « paiement sécurisé » avec confirmation à la livraison ([Ve.Line](https://veline.net)).

**Forces à copier.**
- **Parcours complet** : annonce → messagerie → livraison → paiement, dans une seule application.
- **Abonnement Pro** : mise en avant, statistiques, boutique certifiée, essai 30 jours.
- **Support WhatsApp** : un numéro gabonais affiché, ce qui réduit la barrière d'entrée.
- **Version web pour iPhone** : contourne les frictions de distribution sur iPhone.

**Faiblesses à éviter.**
- **ADN « annonces »** : la plateforme reste optimisée pour vendre un objet, pas pour garantir une prestation.
- **« Paiement sécurisé » à définir** : la page ne précise pas si les fonds sont séquestrés, retenus ou simplement confirmés à la livraison. **À vérifier** avant d'en faire un argument comparable.
- **Qualité de l'offre** : « boutique certifiée » ne dit pas ce qui est vérifié.

**Leçon pour LinkUp.** Ve.Line montre qu'un acteur gabonais peut déjà offrir le parcours complet. LinkUp doit donc aller plus loin sur **la preuve de service** (identité, diplôme, avis après mission, garantie), pas seulement sur la logistique.

#### WoKaTroc (Gabon)

**Ce qu'il fait.** Marketplace gabonaise couvrant boutique, food, services et billetterie, avec vendeurs vérifiés et livraison par le vendeur, des partenaires de livraison étant annoncés ([WoKaTroc](https://www.wokatroc.com)).

**Forces à copier.**
- **Billetterie** : cas d'usage à forte intention, paiement immédiat, qui installe l'habitude d'acheter en ligne.
- **Vendeurs vérifiés** : signal de confiance.
- **Services + produits** : même pari qu'OZOservir, avec une exécution différente.

**Faiblesses à éviter.**
- **Dispersion** : boutique, food, services, billetterie — quatre métiers, quatre logistiques, quatre supports.
- **Livraison non maîtrisée** : dépendance aux vendeurs et à des partenaires.

**Leçon pour LinkUp.** La billetterie et l'événementiel (photographes, traiteurs, coiffure) sont une **porte d'entrée** possible : forte intention, paiement immédiat, preuve facile. À tester sans diluer le cœur de métier.

#### Troki (Gabon)

**Ce qu'il fait.** Petites annonces gratuites, chaque annonce vérifiée avant publication, badge « Vérifié » pour les vendeurs, avis acheteurs, boutiques, et prise de rendez-vous en ligne pour les prestataires beauté ([Troki](https://trokiga.com)).

**Forces à copier.**
- **Vérification avant publication** : plus fort qu'une simple case « je certifie ».
- **Règle de sécurité mémorable** : « jamais d'acompte, on voit l'article et on paie sur place ».
- **Rendez-vous beauté** : un des rares acteurs gabonais identifiés qui rapproche annonces et réservation de service.
- **Gratuité** : barrière d'entrée nulle.

**Faiblesses à éviter.**
- **Modération coûteuse** : vérifier chaque annonce ne passe pas à l'échelle sans outil.
- **Pas de paiement intégré** : la règle « pas d'acompte » protège, mais empêche la monétisation transactionnelle.
- **Confiance déclarative** : « vérifié » reste à préciser.

**Leçon pour LinkUp.** Une **règle simple et répétable** vaut mieux qu'une charte de dix pages. LinkUp peut adopter : « vous ne payez qu'après la prestation, et vous confirmez avec un code ». C'est compréhensible, vérifiable et différenciant.

#### Gaboncoin (Gabon)

**Ce qu'il fait.** Petites annonces gratuites généralistes (immobilier, véhicules, emploi, objets d'occasion) avec une forte présence Facebook (environ 12 200 abonnés affichés sur sa page, relevé indirect **à vérifier**) ([Gaboncoin](https://gaboncoin.com), [page Facebook](https://www.facebook.com/gaboncoin/)).

**Forces à copier.**
- **Distribution sociale** : la page Facebook est un canal d'acquisition gratuit et puissant.
- **Simplicité** : dépôt d'annonce sans friction.

**Faiblesses à éviter.**
- **Pas de confiance structurée** : annonces non vérifiées, pas de paiement, pas de recours.
- **Dépendance à Facebook** : algorithme, portée organique déclinante, risque de suspension.

**Leçon pour LinkUp.** **Chaque fiche prestataire et chaque demande doivent être partageables sur WhatsApp et Facebook**, avec un lien profond qui ramène dans l'app. La distribution sociale n'est pas l'ennemie ; c'est le canal d'acquisition.

<a id="freelance"></a>
### 5.4 Plateformes freelance

| Acteur | Modèle | Taux publié | Force à copier | Faiblesse à éviter | Leçon pour LinkUp |
|---|---|---|---|---|---|
| Fiverr | Commission vendeur | 20 % ([calculateur Upwork](https://www.upwork.com/tools/fiverr-fee-calculator)) | Packs standardisés, prix affiché, délai | Course au prix bas, qualité inégale | Ne pas se battre sur le freelance numérique |
| Upwork | Commission | ~10 %, barème variable (**à vérifier**) ([Upwork](https://www.upwork.com/tools/fiverr-fee-calculator)) | Contrats, jalons, suivi du temps | Complexité, frais, concurrence mondiale | Utile pour les missions numériques, pas pour le local |
| Malt | Commission freelance | 5 % (10 % sur certains marchés, puis 5 % après 6 mois) ([Malt](https://help.malt.com/hc/en-150/articles/29539691425938)) | Sélection qualitative, profils vérifiés | Positionnement haut de gamme | La qualité se paie, mais le local reste plus sensible au prix |
| Comeup | Commission | 20 %, ou 1 € avec ComeUp Plus ([Comeup](https://comeup.com/fr/experts/comeup-alternative-a-malt)) | Abonnement + commission, flexibilité | Faible notoriété | Un abonnement peut remplacer une commission élevée |

**Lecture.** Les plateformes freelance mondiales ont déjà fixé la norme de 5 à 20 % pour le travail numérique à distance. LinkUp ne doit pas essayer de les concurrencer sur ce terrain : **son avantage est la proximité physique, la vérification locale et la responsabilité en cas de problème**. Les catégories « Informatique », « Design & Web » et « Cours » du produit actuel sont utiles, mais elles ne doivent pas définir le positionnement.

<a id="mobilite"></a>
### 5.5 Mobilité et livraison

#### Gozem (présent au Gabon depuis mai 2021)

**Ce qu'il fait.** Super-app de mobilité et de services : taxi, livraison de repas, courses, colis, gaz, billetterie, finances (financement de véhicule, de téléphone, avance de trésorerie) et vente en ligne pour les commerçants ([Gozem Gabon](https://gozem.co/ga/en/)). Gozem a lancé son service de taxi à Libreville le 5 mai 2021 ([Aproko247](https://www.aproko247.com/2021/05/05/gozem-africas-super-app-launches-in-libreville-gabon/)). Gozem a inauguré en avril 2026 un taxi-station à l'aéroport de Libreville avec des prix fixes par zone (4 000, 6 000, 8 000 FCFA) ([Gabon Media Time](https://gabonmediatime.com/aeroport-de-libreville-gozem-lance-son-taxi-station-a-prix-fixes/)).

**Forces à copier.**
- **Prix fixes par zone** : réduit l'incertitude et la négociation, surtout pour les nouveaux clients.
- **Présence physique** : un stand à l'aéroport, 24 h/24, même sans application. La confiance passe aussi par l'humain.
- **Écosystème** : mobilité → livraison → paiement → financement. Chaque service nourrit l'autre.
- **Partenariats institutionnels** (aéroport) : signal de légitimité.

**Faiblesses à éviter.**
- **Capital intensif** : flotte, financement, assurance, support. LinkUp n'a pas vocation à acheter des véhicules.
- **Mobilité en premier** : la culture produit reste celle du transport, pas celle de la prestation à domicile.
- **Dispersion** : la super-app empile les métiers ; l'expérience peut devenir moyenne partout.

**Leçon pour LinkUp.** **La grille tarifaire par zone est un puissant dispositif de confiance.** LinkUp peut afficher, par catégorie et par quartier, une fourchette de prix indicative — à construire avec les prestataires, pas à imposer.

#### Yango (lancement à Libreville, août 2026)

**Ce qu'il fait.** Application de mobilité internationale, annoncée à Libreville en août 2026, avec des promotions d'acquisition pour les premiers chauffeurs (0 % de commission annoncé sur les réseaux sociaux, **à vérifier**) ([Infos Gabon, 20 août 2026](https://fr.infosgabon.com/yango-arrive-au-gabon-le-transport-urbain-change-dere/), [groupe Facebook](https://www.facebook.com/groups/1241714153537913/)).

**Forces à copier.**
- **Acquisition agressive** : 0 % de commission pour amorcer l'offre.
- **Technologie** : géolocalisation, suivi, paiement in-app.
- **Marque** : notoriété internationale, confiance initiale.

**Faiblesses à éviter.**
- **Guerre des prix** : la promotion est temporaire ; les chauffeurs peuvent repartir ailleurs.
- **Localisation** : l'article souligne que l'identification des adresses à Libreville reste un défi ([Infos Gabon](https://fr.infosgabon.com/yango-arrive-au-gabon-le-transport-urbain-change-dere/)).
- **Modèle standardisé** : peu d'adaptation aux spécificités locales.

**Leçon pour LinkUp.** **Ne pas concurrencer Yango sur la mobilité.** En revanche, anticiper la bataille pour l'attention des prestataires : si un chauffeur peut gagner plus avec Yango, il délaissera LinkUp. La fidélisation passe par des revenus récurrents (ménage, nounou, cours), pas par des courses ponctuelles.

#### Glovo (benchmark, présence Gabon non confirmée)

**Ce qu'il fait.** Livraison de repas et de courses, commissions de 25 à 35 % sur les restaurants ([Fooderise](https://www.fooderise.com/fr/plateformes/glovo)).

**Forces à copier.**
- **Logistique intégrée** et suivi en temps réel.
- **Effet de réseau** : plus de restaurants, plus de clients, plus de livreurs.

**Faiblesses à éviter.**
- **Commission très élevée** : 25 à 35 % est intenable pour un artisan ou une femme de ménage.
- **Modèle capitalistique** : flotte, support, remboursements.

**Leçon pour LinkUp.** La commission élevée ne fonctionne que sur des paniers à forte fréquence et à forte marge. **Les services à domicile sont à faible fréquence** : il faut une commission basse ou un abonnement.

#### Livreurs locaux (Gabon)

Acteurs identifiés : GabGo Express, Ogooué Livraison, Glyvup, Emeno, et plusieurs autres acteurs cités localement (Chap Chap, Smart Delivery Gabon, PickFirst, Alcy, PaKego, Libre-Go — **à vérifier**) ([GabGo](https://www.gabgoexpress.com), [Ogooué Livraison](https://www.ogoouelivraison.com), [Glyvup](https://glyvup.com), [Emeno](https://www.emeno-livraison.com)).

**Forces à copier.**
- **Ancrage local** : quartiers, repères, habitudes.
- **Commande WhatsApp** et paiement cash/mobile money.
- **Suivi en direct** et preuve de livraison par code (Glyvup).
- **Réseaux de livreurs vérifiés** (Ogooué Livraison).

**Faiblesses à éviter.**
- **Fragmentation** : pas de standard de prix, pas de couverture nationale fiable.
- **Qualité hétérogène** : un livreur indépendant n'est pas une flotte.
- **Dépendance à WhatsApp** : pas de traçabilité.

**Leçon pour LinkUp.** **Ne pas construire de flotte.** Intégrer 2 ou 3 partenaires pour les catégories qui en ont besoin (pièces détachées, produits de beauté, documents) et facturer la livraison à part.

<a id="ecommerce"></a>
### 5.6 E-commerce africain

#### Jumia

**Ce qu'il fait.** Marketplace e-commerce avec logistique (Jumia Logistics), paiement (JumiaPay) et politique de retours (7 jours en Côte d'Ivoire, politique à vérifier pour le Gabon) ([Jumia VendorHub — commissions](https://vendorhub.jumia.ci/commissions/), [politique de retour](https://www.jumia.ci/sp-politique-de-retour-remboursement/)).

**Forces à copier.**
- **Politique de retour claire** : un engagement qui déplace le risque vers le vendeur et rassure l'acheteur.
- **Paiement à la livraison** et JumiaPay, selon les marchés : deux rails pour deux niveaux de confiance.
- **Gestion des vendeurs** : commissions par catégorie, frais fixes, tableau de bord.

**Faiblesses à éviter.**
- **Logistique coûteuse** : Jumia a réduit son périmètre et s'est retiré d'Algérie après 14 ans ([Algérie 360](https://www.algerie360.com/apres-14-ans-dactivite-jumia-met-fin-a-son-aventure-en-algerie/)) ; Jumia Food a également été arrêté ([Jeune Afrique](https://www.jeuneafrique.com/entreprises/jumia/)).
- **Marges faibles** : l'e-commerce de biens est un métier d'échelle.

**Leçon pour LinkUp.** **Ne pas acheter de stock, ne pas construire d'entrepôt.** Copier uniquement la **politique de retour/garantie** et la **traçabilité du paiement**.

**Présence au Gabon : à vérifier.** Aucun site officiel `jumia.com.ga` accessible à la date de recherche ; un groupe Facebook « JUMIA GABON » existe ([groupe](https://www.facebook.com/groups/987895895025855/)), et OZOservir cite Jumia parmi les acteurs présents ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)). La nature exacte de la présence (site local, import, revendeur) n'est pas confirmée.

<a id="gabon"></a>
### 5.7 Acteurs gabonais : la concurrence directe

**Vue d'ensemble.** Le marché gabonais n'est pas vide : il est **fragmenté entre annonces, services, mobilité et livraison**, avec des acteurs jeunes, peu financés et rarement transparents sur leurs chiffres. Le tableau ci-dessous synthétise les signaux disponibles.

| Acteur | Catégorie | Proposition | Traction / preuve publique | Modèle | Menace |
|---|---|---|---|---|---|
| **OZOservir** | Services + biens | Marketplace locale, KYC, paiement mobile | 500 inscrits revendiqués avant lancement ; Google Play « 10+ » | Abonnement 1 900–5 000 FCFA + 3–4 % + boosts | **Directe** |
| **Bane** | Nounou / aide à domicile | Profils vérifiés, avis après mission | Site actif ; pas de chiffre public | Non public (**à vérifier**) | **Directe (niche)** |
| **Madufe** | Aide à domicile | Helpers formés, identité/diplôme vérifiés | « Aucun profil publié à Libreville » | Non public | Faible (pas d'offre locale) |
| **Akanda Biz** | VTC + colis | Prix choisi par le client, wallet | 10K+ téléchargements, 4,1/5 (67 avis) | Commission/courses (**à vérifier**) | **Adjacente forte** |
| **Ve.Line** | Marketplace | Annonces, boutiques, livraison, paiement | « Milliers d'annonces » (revendiqué) | Pro + boosts | **Directe** |
| **WoKaTroc** | Marketplace | Boutique, food, services, billetterie | Non public | Non public | **Directe** |
| **Troki** | Annonces + beauté | Annonces vérifiées, badge, rendez-vous | Non public | Gratuit + boutique/boosts | **Directe** |
| **CoinAfrique** | Annonces | Annonces gratuites, services | Présent au Gabon, catégories services | Freemium + boosts | **Directe** |
| **Gaboncoin** | Annonces | Annonces généralistes | ≈12 200 abonnés Facebook affichés | Gratuit + options | Indirecte |
| **Gozem** | Mobilité / super-app | Taxi, livraison, finances | Présent depuis 2021, taxi-station aéroport | Commission, services | Adjacente |
| **Yango** | Mobilité | VTC | Lancement annoncé août 2026 | Commission (promo à vérifier) | Adjacente |
| **WhatsApp / Facebook** | Canal informel | Groupes, Marketplace, bouche-à-oreille | Ubiquitaire | Gratuit | **La plus forte** |

#### 5.7.1 OZOservir

**Ce qu'il fait.** Marketplace gabonaise de services et de biens, fondée par Béni-Jaël Mbata (groupe SooPHA), annoncée le 24 février 2026, avec un lancement prévu fin mars 2026 à Libreville ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)). Fonctions annoncées : géolocalisation, avis vérifiés, messagerie interne, paiement mobile, KYC, application légère adaptée aux connexions limitées ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/), [Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)).

**Traction.** 500 « early adopters » revendiqués en moins d'une semaine, acquis par du porte-à-porte, des démonstrations et des QR codes, sans budget média ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)). La fiche Google Play indique « 10+ téléchargements » et une mise à jour au 21 juillet 2026 ([Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)). L'écart entre les 500 inscrits revendiqués et la tranche publique la plus basse de Google Play est le signal le plus important du marché : **inscrire n'est pas activer, et activer n'est pas payer.**

**Modèle annoncé.** Inscription gratuite au départ, puis abonnements de 1 900 à 5 000 FCFA/mois (badge vérifié, statistiques, vitrine professionnelle), commission de 3 à 4 % sur les paiements intégrés, et mise en avant sponsorisée ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)).

**Forces à copier.**
- **Acquisition terrain** : le porte-à-porte et les QR codes sont adaptés à un marché où l'inscription numérique est lente.
- **Prix d'entrée adapté** : 1 900 FCFA/mois est psychologiquement accessible.
- **Discours de confiance** : KYC, avis, messagerie, paiement — les quatre briques attendues.
- **Application légère** : réponse directe à la contrainte data.

**Faiblesses à éviter.**
- **Écart discours / adoption** : 500 inscrits vs « 10+ » téléchargements. La preuve publique est faible.
- **Dispersion services + biens** : deux métiers, deux logiques de confiance, deux supports.
- **Commission trop basse** : 3 à 4 % couvre difficilement le coût d'un paiement, d'un remboursement et d'un support client.
- **KYC annoncé, pas prouvé** : la fiche Play Store parle de « profils vérifiés », sans détailler ce qui est vérifié.

**Leçon pour LinkUp.** **Copier l'acquisition terrain, pas la dispersion.** Choisir 2 ou 3 catégories, 2 ou 3 quartiers, et mesurer les **missions terminées**, pas les inscrits. Un objectif de 500 inscrits peut être atteint en une semaine ; 500 missions terminées, non.

#### 5.7.2 Akanda Biz

**Ce qu'il fait.** Application gabonaise de mobilité (VTC, taxi, colis, location, réservation) éditée par MACROSKY. Le client fixe le prix, les chauffeurs répondent par une offre ou une contre-offre ; paiement cash ou wallet rechargeable via Airtel Money et Moov Money ; suivi en direct, partage de trajet, bouton SOS ([Google Play](https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app)).

**Traction.** 10K+ téléchargements, 4,1/5 sur 67 avis, mise à jour du 14 octobre 2026 ([Google Play](https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app)). C'est l'un des rares acteurs gabonais à afficher une traction publique à cinq chiffres — même si son cœur est la mobilité.

**Forces à copier.**
- **Négociation encadrée** : le client propose un prix, le prestataire accepte ou contre-offre. Cela respecte la culture de négociation tout en structurant l'échange.
- **Wallet intégré** : recharge Airtel/Moov, transfert entre utilisateurs, paiement des courses. C'est un outil de rétention.
- **Sécurité** : suivi, partage de trajet, SOS. Ces fonctions sont des arguments de sécurité différenciants.
- **Parcours chauffeur** : gains quotidiens/hebdomadaires, zones de demande, parrainage.

**Faiblesses à éviter.**
- **Pivot** : l'application est passée d'une « super-app services + biens » à la mobilité. C'est un signal de difficulté à tenir la promesse initiale (**à vérifier** sur l'historique exact).
- **Mobilité saturée** : Gozem est installé, Yango arrive. La différenciation par le prix seul est fragile.
- **Note 4,1/5** : correcte, mais pas excellente ; un avis mentionne l'absence de version anglaise.
- **Monétisation non publique** : impossible de savoir si le wallet ou la commission finance réellement l'opération (**à vérifier**).

**Leçon pour LinkUp.** **La négociation n'est pas un bug, c'est un usage.** LinkUp doit la permettre, mais la cadrer : budget indicatif, fourchette de prix, offre unique, engagement de délai. Le wallet est tentant, mais il exige une licence ou un partenariat : **ne pas le construire soi-même au lancement.**

#### 5.7.3 Bane

**Ce qu'il fait.** Marketplace gabonaise spécialisée dans la garde d'enfants et l'aide à domicile : nounou, ménage, aide aux personnes âgées, bricolage. Les prestataires soumettent leur pièce d'identité pour obtenir un badge de confiance ; les avis ne peuvent être déposés qu'après une mission réellement terminée ; l'équipe modère les signalements ([Bane — comment ça marche](https://banenounou.com/how-it-works)).

**Forces à copier.**
- **Verticalisation** : un seul métier, une seule promesse, un seul parcours. C'est plus crédible qu'une marketplace généraliste.
- **Vérification progressive** : identité, puis badge, puis avis. La confiance se construit par étapes.
- **Avis après mission** : la règle la plus importante du marché. Elle empêche les faux avis et aligne la réputation sur la réalité.
- **Modération active** : un signal fort, rare chez les petits acteurs.
- **Langage de confiance** : « partenaire de confiance, pas un simple annuaire ».

**Faiblesses à éviter.**
- **Niche étroite** : la garde d'enfants est un marché à forte confiance, mais étroit et sensible au prix.
- **Monétisation non publique** : pas de grille tarifaire visible (**à vérifier**).
- **Pas de paiement intégré visible** : la plateforme reste une mise en relation.
- **Couverture centrée sur Libreville**, ce qui est normal au démarrage mais limite la croissance.

**Leçon pour LinkUp.** **Copier la règle « avis après mission » et la vérification progressive.** C'est plus efficace qu'un badge « vérifié » attribué à l'inscription. LinkUp peut commencer par une catégorie à forte confiance (nounou, ménage) pour prouver le modèle, puis élargir.

#### 5.7.4 Madufe

**Ce qu'il fait.** Réseau panafricain d'aide à domicile (garde d'enfants, ménage, cuisine, personnes âgées, chauffeur, jardinage), avec des helpers diplômés d'écoles partenaires, identité, diplôme et références vérifiés avant publication ([Madufe — Libreville](https://www.madufe.com/fr/aide-a-domicile/libreville)).

**Traction à Libreville.** La page indique explicitement : « Aucun profil n'est encore publié à Libreville » ([Madufe](https://www.madufe.com/fr/aide-a-domicile/libreville)). Le réseau se constitue école par école.

**Forces à copier.**
- **Profondeur de vérification** : identité + diplôme + références + école partenaire. C'est le standard le plus élevé identifié.
- **Positionnement diaspora/expatriés/ONG** : une clientèle explicitement ciblée par la plateforme.
- **Approche « école par école »** : qualité avant volume.

**Faiblesses à éviter.**
- **Pas d'offre locale** : impossible de convertir sans profils.
- **Modèle très haut de gamme** : lent, coûteux, difficile à étendre.
- **Dépendance aux partenariats écoles** : goulot d'étranglement.

**Leçon pour LinkUp.** La vérification profonde est un **avantage durable**, mais l'offre est le premier obstacle. LinkUp doit d'abord recruter et vérifier des prestataires existants, puis construire des partenariats de formation. **Ne pas promettre « certifié » sans partenaire.**

#### 5.7.5 Ve.Line, WoKaTroc, Troki, CoinAfrique, Gaboncoin

Ces acteurs sont analysés en détail en [5.3](#annonces). Points saillants pour LinkUp :

- **Ve.Line** est l'un des concurrents gabonais les plus complets sur le parcours (annonce → chat → livraison → paiement). Son point faible est la **preuve de service**, pas la fonctionnalité.
- **WoKaTroc** mise sur la **billetterie** et les vendeurs vérifiés. C'est une porte d'entrée d'acquisition intéressante.
- **Troki** a une des règles de sécurité les plus claires du marché (« pas d'acompte ») et un début de réservation beauté.
- **CoinAfrique** prouve que la **demande de services existe** et que les utilisateurs sont déjà sensibilisés aux arnaques.
- **Gaboncoin** prouve que **Facebook est un canal d'acquisition** majeur.

#### 5.7.6 Artisans Gabon et acteurs non documentés

**Artisans Gabon** se présente comme une « plateforme de mise en relation entre prestataires de services et employeurs au Gabon » ([Artisans Gabon](https://www.artisans-gabon.ga/)). Le site est une application JavaScript dont le contenu public est très limité : le modèle économique et le niveau réel de vérification n'ont pas pu être confirmés. **À vérifier.** Le nom est mentionné ici pour mémoire, pas comme une menace établie.

**Servei Group**, **Ibaara** et plusieurs applications de services locales ont été signalés lors de la recherche mais n'ont pas pu être documentés de manière fiable (sites indisponibles ou contenu insuffisant). **À vérifier** avant toute décision.

#### 5.7.7 WhatsApp et Facebook : l'incumbent

**Ce qu'ils font.** WhatsApp sert à trouver un prestataire, négocier, envoyer des photos, convenir d'un rendez-vous et payer (mobile money ou cash). Facebook Marketplace et les groupes remplacent l'annuaire et la vitrine.

**Preuves d'usage.**
- Le fondateur d'OZOservir décrit un marché où « tout passait par WhatsApp, Facebook ou le bouche-à-oreille » ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)).
- Facebook Marketplace Libreville est accessible et actif ([lien](https://www.facebook.com/marketplace/110266982329699/)).
- Le groupe « Gabon Marketplace » existe et accepte les annonces de services ([lien](https://www.facebook.com/groups/688584426149434/)).
- Ve.Line affiche un numéro WhatsApp pour le support ([Ve.Line](https://veline.net)) ; Gaboncoin s'appuie sur une page Facebook d'environ 12 200 abonnés affichés ([Facebook](https://www.facebook.com/gaboncoin/)).

**Forces.**
- **Gratuit**, déjà installé, aucune inscription.
- **Socialement légitime** : on fait confiance à un contact recommandé.
- **Multimodal** : texte, photos, vocaux, appels, paiement mobile money.
- **Effet de réseau** : tout le monde est déjà là.

**Faiblesses.**
- **Pas de recherche structurée** : impossible de comparer les prix, les disponibilités, les avis.
- **Pas de vérification** : n'importe qui peut se déclarer plombier.
- **Pas de recours** : en cas de malfaçon, il ne reste que la pression sociale.
- **Pas de trace** : pas d'historique, pas de reçu, pas de garantie.
- **Bruit** : groupes spammés, messages perdus, relances.

**Leçon pour LinkUp.** **Ne pas se positionner comme un « remplaçant de WhatsApp ».** Se positionner comme **la couche de confiance et de traçabilité de ce qui se passe déjà sur WhatsApp**. Chaque fiche doit avoir un bouton « Partager sur WhatsApp » ; chaque demande doit pouvoir être envoyée à un pro ; chaque mission doit produire un reçu et un avis. C'est la seule stratégie qui épouse l'usage au lieu de le combattre.

---

<a id="monetisation"></a>
## 6. Monétisation

### 6.1 Les cinq modèles observés

| Modèle | Qui paie | Avantage | Risque | Exemples |
|---|---|---|---|---|
| Commission sur transaction | Prestataire (parfois client) | Aligné sur la valeur, scalable | Incite au contournement, sensible au cash | Urban Company, Yoojo, Frizbiz, Glovo |
| Abonnement | Prestataire | Revenu récurrent, prévisible | Barrière pour les petits revenus | OZOservir, Ve.Line Pro, AlloVoisins Premier |
| Boost / mise en avant | Prestataire | Marge élevée, simple | Peut acheter la visibilité au détriment de la qualité | Jiji, CoinAfrique, OZOservir |
| Paiement au lead | Prestataire | Monétise dès le contact | Paie sans garantie de mission | Thumbtack, StarOfService |
| Frais de service client | Client | Préserve le revenu du prestataire | Augmente le prix affiché, freine la conversion | TaskRabbit |

### 6.2 Barème comparé

| Acteur | Modèle | Taux / prix publié | Source |
|---|---|---|---|
| Urban Company | Commission prestataire | 8,5–25 % | [Urban Company](https://www.urbancompany.com/blog/urban-company-announces-12-point-program-to-improve-partner-earnings-and-livelihood/) |
| TaskRabbit | Frais client + confiance | ~30 % + 7,5 % (historique ; actuel à vérifier) | [Fast Company](https://www.fastcompany.com/3065993/taskrabbit-workers-fee-increase), [Support](https://support.taskrabbit.com/hc/en-gb/articles/46260514951579-Fees-payments-and-cancellation-supplemental-terms) |
| Yoojo | Frais de service prestataire | 20 %, minimum 5 € | [Yoojo](https://help.yoojo.com/hc/fr/articles/360010778340) |
| NeedHelp | Frais de service | 20–25 % | [NeedHelp](https://needhelp.zendesk.com/hc/fr-fr/articles/20228073075346) |
| Frizbiz | Commission | 13 % | [Bonjour Idée](https://www.bonjouridee.com/frizbiz/) |
| AlloVoisins | Abonnement + boosts | 0 % de commission | [AlloVoisins](https://www.allovoisins.com/article/442-faites-vous-payer-en-ligne-sans-commission) |
| Thumbtack | Paiement au lead | Variable | [Brineweb](https://www.brineweb.com/blog/thumbtack-business-model-how-thumbtack-works-and-makes-money) |
| StarOfService | Paiement au lead | Crédits | [StarOfService](https://www.starofservice.us/pro/how-it-works) |
| Jiji | Freemium + boosts | Gratuit + packages | [Jiji](https://jiji.sn/faq/169) |
| CoinAfrique | Freemium + boosts | Gratuit + options | [CoinAfrique](https://ci.coinafrique.com/nos-offres-visibilite) |
| Fiverr | Commission vendeur | 20 % | [Calculateur Upwork](https://www.upwork.com/tools/fiverr-fee-calculator) |
| Upwork | Commission | ~10 % (variable, à vérifier) | [Calculateur Upwork](https://www.upwork.com/tools/fiverr-fee-calculator) |
| Malt | Commission freelance | 5 % (10 % certains marchés) | [Malt](https://help.malt.com/hc/en-150/articles/29539691425938) |
| Comeup | Commission | 20 %, ou 1 € avec Plus | [Comeup](https://comeup.com/fr/experts/comeup-alternative-a-malt) |
| Jumia | Commission catégorielle + frais fixes | Variable | [Jumia VendorHub](https://vendorhub.jumia.ci/commissions/) |
| Glovo | Commission restaurant | 25–35 % | [Fooderise](https://www.fooderise.com/fr/plateformes/glovo) |
| OZOservir | Abonnement + commission + boosts | 1 900–5 000 FCFA/mois ; 3–4 % | [Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/) |
| Wave | Frais de transfert | 1 % | [Wave](https://www.wave.com/fr/) |

> **Note.** Wave n'est pas disponible au Gabon à la date de recherche ; il est cité uniquement comme benchmark de frais de transfert (1 %).

### 6.3 Ce que le barème dit

1. **La commission « pleine » se situe souvent entre 13 et 25 %** pour les plateformes qui prennent en charge le paiement, l'assurance et le support. En dessous de 13 %, il faut un autre revenu (abonnement, boost, publicité) ou un coût d'opération très faible.
2. **Les plateformes qui ne prennent pas le paiement monétisent la visibilité** (AlloVoisins, Jiji, CoinAfrique). C'est le modèle le plus simple, mais il ne finance pas la confiance.
3. **Les plateformes qui paient au lead transfèrent le risque au prestataire** (Thumbtack, StarOfService). C'est difficile à vendre à un artisan qui compte ses jours.
4. **Le mobile money a un coût** : PayCentral annonce 0,8 % ([PayCentral](https://paycentral.gabondunumerique.com/site/)), mais il faut ajouter le support, les remboursements, la réconciliation et la fraude. Une commission de 3 à 4 % laisse peu de marge.

### 6.4 Recommandation pour LinkUp

**Principe : ne pas faire payer l'accès, faire payer la valeur.**

| Phase | Période | Ce que LinkUp facture | Ce que LinkUp ne facture pas | Pourquoi |
|---|---|---|---|---|
| 0 — Amorçage | 0–3 mois | Rien | Inscription, publication, contact | Constituer l'offre et prouver la réalisation |
| 1 — Confiance | 3–9 mois | Pro 2 500–5 000 FCFA/mois ; boosts 1 000–3 000 FCFA/7 jours | Commission sur les paiements directs | Revenu récurrent sans taxer les petites missions |
| 2 — Transaction | 9–18 mois | Commission 8–12 % sur les paiements in-app ; Pro ; boosts | Commission sur le cash non traçable | Aligner le revenu sur la valeur réellement captée |
| 3 — Échelle | 18 mois+ | Commission + Pro + livraison + services B2B | Publicité intrusive | Diversifier sans dégrader l'expérience |

**Pourquoi 8 à 12 % ?**

- **Au-dessus de 12 %**, le prestataire compare immédiatement avec WhatsApp (0 %) et peut organiser le contournement.
- **En dessous de 8 %**, LinkUp ne couvre pas le coût du paiement (0,8 % annoncé), du support, des remboursements et de l'acquisition.
- **8 à 12 %** laisse au prestataire 88 à 92 % de son revenu, ce qui est psychologiquement acceptable, et permet à LinkUp de financer la confiance.

**Pourquoi un abonnement Pro ?**

- Il crée un revenu récurrent indépendant du volume.
- Il finance la vérification et la mise en avant.
- Il est déjà pratiqué par OZOservir (1 900–5 000 FCFA), Ve.Line (Pro) et AlloVoisins (Premier).
- Il doit inclure des contreparties concrètes : badge, statistiques, priorité dans les résultats, portfolio, support dédié.

**Ce qu'il faut éviter.**

- **Le paiement au lead au lancement** : il monétise l'espoir, pas le résultat.
- **La double commission** (client + prestataire) : elle augmente le prix affiché et freine la conversion.
- **La commission sur le cash** : impossible à mesurer, donc injuste et conflictuelle.
- **Le wallet propriétaire** sans licence : risque réglementaire et complexité opérationnelle.

---

<a id="paiement"></a>
## 7. Paiement et confiance

### 7.1 Les rails disponibles

| Rail | Couverture | Usage recommandé | Point de vigilance |
|---|---|---|---|
| Airtel Money | Nationale | Paiement client, versement prestataire | Frais, API, KYC |
| Moov Money | Nationale | Paiement client, versement prestataire | Frais, API, KYC |
| Cash | Universel | Paiement à la prestation | Pas de trace, pas de recours |
| Agrégateur (SingPay, Gabon Connect, PayCentral) | Airtel + Moov | Intégration unique, réconciliation | Contrat, règlement, taux |
| Carte bancaire | Faible | Clients expatriés / B2B | Coût, échec, chargeback |

**Recommandation.** Intégrer **un agrégateur qui couvre Airtel et Moov**, avec un fallback cash. Ne pas construire de wallet propriétaire. Afficher clairement les frais éventuels au client.

### 7.2 Le séquestre : état des lieux

**Constat.** Aucun mécanisme public de séquestre n'a été identifié pour les marketplaces de services au Gabon. Les transferts mobile money peuvent être immédiats. Les plateformes d'annonces (CoinAfrique, Troki) recommandent explicitement de **ne pas payer avant d'avoir vu le bien ou le prestataire** ([CoinAfrique](https://ga.coinafrique.com/), [Troki](https://trokiga.com)). Ve.Line revendique un « paiement sécurisé » avec confirmation à la livraison, sans préciser le mécanisme ([Ve.Line](https://veline.net)).

**Trois options.**

| Option | Mécanisme | Confiance | Complexité | Recommandation |
|---|---|---|---|---|
| A — Séquestre PSP | Les fonds sont capturés par un PSP agréé, conservés, puis versés au prestataire après confirmation | Très forte | Élevée : contrat PSP, KYC, conformité, réconciliation | Phase 2 |
| B — Paiement à la prestation + code | Le client paie directement (cash/mobile money), confirme la fin avec un code, LinkUp facture la commission | Moyenne | Faible | **Phase 1** |
| C — Acompte + solde | Petit acompte mobile money, solde à la fin | Moyenne à forte | Moyenne | Pour les missions à enjeu élevé |

**Point juridique.** Le séquestre de fonds pour compte de tiers suppose un cadre de paiement autorisé. **À vérifier** avec la BEAC, un PSP agréé et un conseil juridique avant de promettre un « paiement sécurisé » ou de conserver des fonds. Ne pas utiliser ces termes tant que le mécanisme n'est pas opérationnel.

### 7.3 La pile de confiance

| Mécanisme | Ce qu'il prouve | Coût | Effet | Référence |
|---|---|---|---|---|
| Vérification du numéro | Le compte est joignable | Faible | Moyen | Standard |
| Vérification d'identité (CNI + selfie) | La personne est réelle | Moyen | Fort | Bane, Madufe |
| Vérification du diplôme / références | La compétence est attestée | Élevé | Très fort (nounou, santé) | Madufe |
| Vérification de l'annonce | Le contenu est réel | Moyen | Moyen | Troki |
| Avis après mission | La réputation est réelle | Faible | Très fort | Bane |
| Prix affiché / fourchette | Le prix est prévisible | Faible | Fort | Gozem, Urban Company |
| Paiement intégré | Le paiement est traçable | Élevé | Fort | TaskRabbit, Jumia |
| Séquestre | Le paiement est conditionné | Très élevé | Très fort | Jumia (mécanisme à vérifier) |
| Garantie / remboursement | Le risque est couvert | Élevé | Très fort | Jumia (7 jours) |
| Médiation des litiges | Le conflit a une issue | Moyen | Fort | Urban Company |
| Charte publique | Les règles sont connues | Faible | Moyen | Troki |

**Recommandation : une séquence, pas un badge.**

1. **Vérifier** : téléphone, puis identité pour les catégories sensibles (nounou, ménage, santé, beauté à domicile).
2. **Contractualiser** : demande structurée (catégorie, quartier, date, budget, description, photos).
3. **Payer** : cash/mobile money au lancement, avec code de confirmation ; séquestre ensuite.
4. **Confirmer** : le client valide la fin de mission ; le prestataire reçoit son paiement ou son reçu.
5. **Noter** : avis uniquement après mission terminée.
6. **Recours** : politique de remboursement, médiation, garantie plafonnée.

**Ce qu'il faut publier.** Une page « Ce que LinkUp vérifie » qui distingue clairement :
- ce qui est vérifié automatiquement (numéro, email) ;
- ce qui est vérifié manuellement (CNI, diplôme, références) ;
- ce qui n'est pas vérifié (déclarations libres, photos de portfolio).

C'est ce que Bane et Madufe font implicitement ; LinkUp doit le faire explicitement. **Un badge qui ne dit pas ce qu'il couvre est une promesse de plus, pas une preuve.**

---

<a id="frictions"></a>
## 8. Frictions propres au Gabon

| Friction | Preuve | Impact sur LinkUp | Réponse recommandée |
|---|---|---|---|
| **Duopole télécom et coût de la data** | Airtel + Moov = 100 % du mobile ; data parmi les plus chères de la CEMAC ; 4,09 USD/Go, 206e/237 ([Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/), [Cable.co.uk](https://www.cable.co.uk/mobiles/worldwide-data-pricing/)) | Inscription lourde, vidéos, uploads coûteux, abandon | App légère, images compressées, mode hors ligne, parcours en 3 écrans |
| **Mobile money fragmenté + cash** | 100 % du mobile money pour deux opérateurs ; 620 Md FCFA ; cash encore très utilisé sur les petits montants ([Inside News 241](https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/)) | Paiement incomplet, réconciliation difficile | Agrégateur Airtel + Moov, fallback cash, reçu numérique |
| **Adressage et géolocalisation** | « L'identification des adresses peut encore poser problème » ([Infos Gabon](https://fr.infosgabon.com/yango-arrive-au-gabon-le-transport-urbain-change-dere/)) ; Gozem raisonne par zones ([Gabon Media Time](https://gabonmediatime.com/aeroport-de-libreville-gozem-lance-son-taxi-station-a-prix-fixes/)) | No-shows, retards, litiges | Quartier + repère + point GPS + appel ; grille par zone |
| **Informalité et négociation** | « Tout passait par WhatsApp… sans garantie sur la qualité, les prix ou la disponibilité » ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)) ; Akanda Biz laisse le client fixer le prix ([Google Play](https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app)) | Devis flous, dépassements, conflits | Demande structurée, fourchette de prix, jalons, validation |
| **Confiance et fraude** | CoinAfrique avertit contre les paiements anticipés ([CoinAfrique](https://ga.coinafrique.com/)) ; Troki impose « pas d'acompte » ([Troki](https://trokiga.com)) ; pas de séquestre public identifié | Conversion faible, méfiance | Vérification, avis après mission, code de confirmation, garantie |
| **Liquidité / œuf et la poule** | OZOservir : 500 inscrits revendiqués vs « 10+ » téléchargements ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/), [Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)) ; Madufe : aucun profil à Libreville ([Madufe](https://www.madufe.com/fr/aide-a-domicile/libreville)) | Pas d'offre → pas de demande → pas de revenu | Densifier 2–3 quartiers, 2–3 catégories, avant d'élargir |
| **Sensibilité prix** | Les prix sont négociés, surtout pour les petits services ; la data coûte cher ([Cable.co.uk](https://www.cable.co.uk/mobiles/worldwide-data-pricing/)) | Commission perçue comme un prélèvement | 8–12 %, plafond par mission, gratuité de base, Pro optionnel |
| **Appareils et connectivité** | OZOservir revendique une app légère pour connexions limitées ([Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)) ; Glyvup promet un suivi simple ([Glyvup](https://glyvup.com)) | Installations lourdes, abandon | APK léger, cache, mode dégradé, notifications courtes |
| **Domination de WhatsApp** | Usage massif décrit par OZOservir ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)) ; support WhatsApp chez Ve.Line ([Ve.Line](https://veline.net)) | Coût d'acquisition élevé, contournement | Partage WhatsApp natif, notifications, support WhatsApp, pas de combat frontal |
| **Cadre juridique et fiscal** | Non documenté dans cette recherche | Risque de conformité (séquestre, wallet, statut des prestataires) | **À vérifier** avec un conseil juridique avant paiement et wallet |

**Synthèse.** Les frictions ne sont pas des détails d'exécution : elles définissent le produit. **Une marketplace de services au Gabon doit être légère, mobile money d'abord avec fallback cash, centrée sur le quartier, avec des prix cadrés, compatible WhatsApp et fondée sur la preuve de réalisation.** Toute fonctionnalité qui ignore l'une de ces contraintes échouera, quel que soit son niveau de finition.

---

<a id="recommandations"></a>
## 9. Recommandations priorisées

<a id="strategies"></a>
### 9.1 Deux stratégies possibles

#### Approche A — Marketplace transactionnelle d'emblée

**Principe.** Lancer avec paiement intégré, séquestre, commission et KYC complet dès le premier jour.

**Avantages.**
- Confiance maximale : le client sait que son argent est protégé.
- Données de transaction complètes : GMV, réalisation, litiges.
- Monétisation immédiate.

**Inconvénients.**
- Dépendance à un PSP et à un cadre juridique non confirmé.
- Coût d'intégration et de support élevé.
- Friction à l'inscription pour des prestataires peu numériques.
- Risque de contournement tant que la liquidité est faible.

**Quand la choisir.** Si LinkUp dispose d'un partenaire PSP prêt, d'un budget juridique et d'une équipe support capable d'absorber les litiges dès le lancement. Ce n'est pas le cas aujourd'hui.

#### Approche B — Couche de confiance greffée sur WhatsApp

**Principe.** Lancer avec des profils vérifiés, des demandes structurées, des avis après mission et un partage WhatsApp natif. Le paiement reste direct (cash/mobile money) ; LinkUp facture l'abonnement Pro et les boosts. Le paiement intégré arrive en phase 2.

**Avantages.**
- Épouse l'usage existant : pas de changement d'habitude brutal.
- Coût technique et juridique faible.
- Permet de prouver la réalisation avant d'investir dans le séquestre.
- Acquisition via WhatsApp/Facebook, là où sont les utilisateurs.

**Inconvénients.**
- Monétisation plus lente.
- Risque de désintermédiation (le client et le prestataire se rencontrent et sortent de l'app).
- Moins de données de transaction.

**Quand la choisir.** Maintenant : LinkUp a déjà les profils, les demandes et la messagerie ; il lui manque la preuve, la vérification et la distribution.

#### Recommandation

**Approche B, puis A.** Séquence :

1. **0–6 mois** : confiance + offre + distribution WhatsApp. Objectif : 100 prestataires vérifiés, 20 missions terminées par semaine, 30 % de demandes converties.
2. **6–12 mois** : paiement mobile money, commission 8–12 %, Pro, boosts. Objectif : 30 % des paiements in-app, 10 % de conversion Pro.
3. **12–18 mois** : séquestre PSP, garantie, expansion Port-Gentil. Objectif : taux de litige < 5 %, rétention à 90 jours > 30 %.

Ces seuils sont des **objectifs internes proposés**, pas des benchmarks de marché.

<a id="must-copy"></a>
### 9.2 Ce qu'il faut copier

| Pratique | Pourquoi | Source | Adaptation LinkUp |
|---|---|---|---|
| **Acquisition terrain** | Crée la confiance et l'offre là où sont les prestataires | OZOservir, 500 inscrits en une semaine ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)) | Équipe de 2–3 personnes, 3 quartiers, QR codes, démonstrations |
| **Verticalisation** | Un métier, une promesse, un parcours | Bane (nounou), Madufe (aide à domicile) | Commencer par ménage/nounou/beauté, puis élargir |
| **Vérification progressive** | La confiance se construit par étapes | Bane ([how it works](https://banenounou.com/how-it-works)) | Téléphone → CNI → diplôme/références selon catégorie |
| **Avis après mission** | Empêche les faux avis, aligne la réputation sur la réalité | Bane ([how it works](https://banenounou.com/how-it-works)) | Avis débloqué par un code de fin de mission |
| **Règle de sécurité simple** | Plus efficace qu'une charte de 10 pages | Troki (« jamais d'acompte ») ([Troki](https://trokiga.com)) | « Payez après la prestation, confirmez avec un code » |
| **Prix fixes par zone** | Réduit l'incertitude et la négociation | Gozem aéroport, 4 000/6 000/8 000 FCFA ([Gabon Media Time](https://gabonmediatime.com/aeroport-de-libreville-gozem-lance-son-taxi-station-a-prix-fixes/)) | Fourchettes indicatives par catégorie et quartier |
| **Parcours complet** | Le client ne sort pas de l'app | Ve.Line ([veline.net](https://veline.net)) | Annonce → chat → devis → mission → paiement → avis |
| **Abonnement Pro + boosts** | Revenu récurrent et visibilité | OZOservir, Ve.Line, AlloVoisins, Jiji | 2 500–5 000 FCFA/mois, boosts 7 jours |
| **Politique de retour** | Déplace le risque et rassure | Jumia Côte d'Ivoire, 7 jours ([Jumia](https://www.jumia.ci/sp-politique-de-retour-remboursement/)) | Garantie limitée par catégorie, remboursement plafonné |
| **Support WhatsApp** | Rencontre l'utilisateur là où il est | Ve.Line ([veline.net](https://veline.net)) | Numéro dédié, réponses < 2 h, modèles de messages |
| **Application légère** | Respecte la contrainte data | OZOservir ([Google Play](https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir)) | Images < 200 Ko, mode hors ligne, cache |

<a id="must-avoid"></a>
### 9.3 Ce qu'il faut éviter

| Piège | Preuve | Pourquoi c'est dangereux | Alternative |
|---|---|---|---|
| **Commission 25–35 %** | Glovo 25–35 % ([Fooderise](https://www.fooderise.com/fr/plateformes/glovo)), Urban Company jusqu'à 25 % ([Urban Company](https://www.urbancompany.com/blog/urban-company-announces-12-point-program-to-improve-partner-earnings-and-livelihood/)) | Le prestataire retourne sur WhatsApp | 8–12 %, plafond par mission |
| **Paiement au lead** | Thumbtack ([Brineweb](https://www.brineweb.com/blog/thumbtack-business-model-how-thumbtack-works-and-makes-money)), StarOfService ([StarOfService](https://www.starofservice.us/pro/how-it-works)) | Le pro paie sans garantie de mission | Commission sur transaction, Pro, boosts |
| **Super-app / dispersion** | OZOservir services + biens ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)) ; Akanda Biz s'est recentré sur la mobilité ([Google Play](https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app)) | Dilue la qualité et le support | 2–3 catégories, 2–3 quartiers |
| **Badge sans vérification** | Artisans Gabon (**à vérifier**) ; pratiques de badge génériques | Détruit la confiance au premier incident | Publier ce qui est vérifié, auditer |
| **Construire une flotte** | Jumia Logistics, Glovo ([Jumia](https://group.jumia.com/business/logistics), [Fooderise](https://www.fooderise.com/fr/plateformes/glovo)) | Capital intensif, marges faibles | Partenariats livreurs |
| **Wallet propriétaire sans licence** | Akanda Biz wallet Airtel/Moov ([Google Play](https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app)) | Risque réglementaire, complexité | Agrégateur PSP |
| **« Paiement sécurisé » vague** | Ve.Line revendique un paiement sécurisé sans détail ([Ve.Line](https://veline.net)) | Promesse non tenue = perte de confiance | Définir le mécanisme, ne l'annoncer qu'une fois opérationnel |
| **Commission sur le cash** | Modèle non traçable | Injuste, conflictuel, contestable | Commission seulement sur in-app |
| **Ignorer WhatsApp** | Usage massif ([Gabonreview](https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/)) | Coût d'acquisition élevé | Partage et support WhatsApp |
| **Dépendre de Facebook** | Gaboncoin s'appuie sur Facebook ([Facebook](https://www.facebook.com/gaboncoin/)) | Algorithme, suspension, portée | Site + app + WhatsApp + SEO local |

<a id="whatsapp"></a>
### 9.4 Se différencier de WhatsApp

| Besoin | WhatsApp / Facebook | LinkUp | Preuve à construire |
|---|---|---|---|
| Trouver | Groupes, contacts, bouche-à-oreille | Recherche par catégorie, quartier, disponibilité | Temps moyen pour trouver un pro < 3 min |
| Comparer | Aucun comparatif | Profils, prix, avis, délai de réponse | Taux de demandes avec 3 devis |
| Vérifier | Photo de profil | Badge + page « ce qui est vérifié » | % de profils avec CNI vérifiée |
| Cadrer | Messages vocaux, photos | Demande structurée (budget, date, adresse) | % de demandes complètes |
| Payer | Cash / mobile money, sans recours | Paiement in-app, code, reçu | % de paiements in-app |
| Après | Aucun historique | Historique, garantie, avis | Taux de litige, taux d'avis |
| Recommander | Statut WhatsApp | Profil partageable, lien profond | Partages → installations |

**Positionnement.** « **LinkUp ne remplace pas WhatsApp. LinkUp sécurise ce qui s'y passe.** »

**Traduction produit.**
- Bouton « Partager sur WhatsApp » sur chaque fiche et chaque demande.
- Notifications WhatsApp pour les pros qui ne gardent pas l'app ouverte.
- Support WhatsApp pour les litiges.
- Lien profond `linkup.ga/p/{id}` qui ouvre l'app ou le web.
- Modèles de messages prêts à envoyer (devis, confirmation, rappel).

<a id="roadmap"></a>
### 9.5 Feuille de route 90 jours / 12 mois

#### P0 — 0 à 90 jours : prouver la confiance

| Chantier | Livrable | Critère de succès |
|---|---|---|
| **Recadrer l'offre** | Catégories : ménage, nounou, beauté à domicile, plomberie/électricité, bricolage, livraison, cours, informatique | 60 % des demandes sur les 4 premières catégories |
| **Vérification** | Téléphone + CNI manuelle pour les catégories sensibles ; page « ce qui est vérifié » | 100 % des profils sensibles vérifiés |
| **Avis après mission** | Code de fin de mission, avis débloqué | 80 % des missions terminées avec avis |
| **Géolocalisation** | Quartier + repère + GPS + téléphone | < 10 % de no-shows |
| **Distribution WhatsApp** | Partage natif, liens profonds, support WhatsApp | 30 % des installations via partage |
| **Densité** | 100 prestataires vérifiés dans 2–3 quartiers | 20 missions terminées/semaine |
| **Instrumentation** | Funnel inscription → demande → devis → mission → avis → paiement | Tableau de bord hebdomadaire |

#### P1 — 90 à 180 jours : prouver le paiement

| Chantier | Livrable | Critère de succès |
|---|---|---|
| **Mobile money** | Agrégateur Airtel + Moov, fallback cash, reçu | 30 % des missions payées in-app |
| **Pro** | 2 500–5 000 FCFA/mois, badge, stats, priorité | 10 % des prestataires actifs en Pro |
| **Boosts** | 1 000–3 000 FCFA/7 jours | 5 % des revenus |
| **Litiges** | Politique de remboursement, médiation, garantie plafonnée | Taux de litige < 5 % |
| **Livraison** | 2–3 partenaires pour les catégories qui en ont besoin | 10 % des missions avec livraison |
| **Contenu** | SEO local (« plombier Libreville », « nounou Akanda ») | 20 % du trafic organique |

#### P2 — 180 à 365 jours : prouver le modèle

| Chantier | Livrable | Critère de succès |
|---|---|---|
| **Séquestre** | PSP agréé, capture/versement, conformité | 50 % des paiements in-app séquestrés |
| **Commission** | 8–12 % sur les paiements in-app | Prise de taux moyenne 8–10 % |
| **Récurrence** | Abonnements ménage/nounou, rappels, re-réservation | 30 % des clients avec ≥ 2 missions |
| **B2B** | Offres bureaux, expatriés, ONG | 20 % du GMV |
| **Expansion** | Port-Gentil, Akanda | Densité ≥ 50 pros par ville |
| **Marque** | Programme de garantie, charte qualité | NPS > 30 |

<a id="kpis"></a>
### 9.6 Indicateurs à piloter

**Offre**
- Nombre de prestataires inscrits, vérifiés, actifs (≥ 1 mission sur 30 jours).
- Taux de réponse < 2 h.
- Taux d'acceptation des demandes.
- Délai moyen de première réponse.

**Demande**
- Demandes créées / semaine.
- Taux de demandes complètes (catégorie, quartier, budget, date).
- Taux de devis (≥ 1 devis reçu).
- Taux de conversion demande → mission.
- Taux de répétition à 30/90 jours.

**Confiance**
- Taux de profils vérifiés.
- Taux d'avis après mission.
- Taux de litige.
- Taux de remboursement.
- Délai de résolution.

**Économie**
- GMV.
- Taux de prélèvement réel.
- Revenu Pro.
- Revenu boosts.
- CAC par mission terminée.
- Payback.

**Liquidité**
- Taux de remplissage (demandes ayant reçu au moins un devis).
- Temps médian de recherche.
- Temps médian de réalisation.

**Règle de pilotage.** Un inscrit ne vaut rien ; une mission terminée vaut tout. **Tous les tableaux de bord doivent être centrés sur la réalisation, pas sur les inscriptions.**

---

<a id="sources"></a>
## 10. Sources

### 10.1 Gabon — statistiques et marché

- DataReportal, *Digital 2025: Gabon* — <https://datareportal.com/reports/digital-2025-gabon>
- ARCEP Gabon, observatoire internet T1 2025 — <https://www.arcep.ga/pages/detail_observatoire/1>
- ARCEP Gabon, PDF internet T1 2025 — <https://www.arcep.ga/uploads/observatoires/internet/Internet%202025-1.pdf>
- Inside News 241, « Airtel et Moov, deux géants pour un marché déjà saturé », 24 octobre 2025 — <https://insidenews241.com/gabon-airtel-et-moov-deux-geants-pour-un-marche-deja-sature/>
- Cable.co.uk, *Worldwide mobile data pricing* — <https://www.cable.co.uk/mobiles/worldwide-data-pricing/>
- Infos Gabon, « Yango arrive au Gabon », 20 août 2026 — <https://fr.infosgabon.com/yango-arrive-au-gabon-le-transport-urbain-change-dere/>
- Gabon Media Time, « Aéroport de Libreville : Gozem lance son taxi-station à prix fixes », 24 avril 2026 — <https://gabonmediatime.com/aeroport-de-libreville-gozem-lance-son-taxi-station-a-prix-fixes/>

### 10.2 Acteurs gabonais

- OZOservir, Google Play — <https://play.google.com/store/apps/details?id=com.soophagroup.ozoservir>
- Gabonreview, « OZOservir, la nouvelle marketplace des services au Gabon », 24 février 2026 — <https://www.gabonreview.com/economie-numerique-ozoservir-la-nouvelle-marketplace-des-services-au-gabon/>
- Akanda Biz, Google Play — <https://play.google.com/store/apps/details?id=usinapps.com.br.guideakanda.app>
- Bane — <https://banenounou.com> ; comment ça marche — <https://banenounou.com/how-it-works>
- Madufe, Libreville — <https://www.madufe.com/fr/aide-a-domicile/libreville>
- Ve.Line — <https://veline.net>
- WoKaTroc — <https://www.wokatroc.com>
- Troki — <https://trokiga.com>
- CoinAfrique Gabon — <https://ga.coinafrique.com/>
- CoinAfrique, offres de visibilité — <https://ci.coinafrique.com/nos-offres-visibilite>
- Gaboncoin — <https://gaboncoin.com> ; page Facebook — <https://www.facebook.com/gaboncoin/>
- Gozem Gabon — <https://gozem.co/ga/en/>
- Gozem, lancement à Libreville le 5 mai 2021 — <https://www.aproko247.com/2021/05/05/gozem-africas-super-app-launches-in-libreville-gabon/>
- Artisans Gabon — <https://www.artisans-gabon.ga/>
- GabGo Express — <https://www.gabgoexpress.com>
- Ogooué Livraison — <https://www.ogoouelivraison.com>
- Glyvup — <https://glyvup.com>
- Emeno Livraison — <https://www.emeno-livraison.com>
- Facebook Marketplace Libreville — <https://www.facebook.com/marketplace/110266982329699/>
- Groupe Facebook « Gabon Marketplace » — <https://www.facebook.com/groups/688584426149434/>
- Groupe Facebook « JUMIA GABON » — <https://www.facebook.com/groups/987895895025855/>
- Groupe Facebook sur le lancement de Yango — <https://www.facebook.com/groups/1241714153537913/>

### 10.3 Paiement et agrégateurs

- SingPay — <https://singpay.ga>
- Gabon Connect, passerelle mobile money — <https://gabonconnect.com/fr/nos-services/passerelle-paiement-mobile-money-api>
- PayCentral CEMAC — <https://paycentral.gabondunumerique.com/site/>
- Wave — <https://www.wave.com/fr/>

### 10.4 Benchmarks internationaux

- Urban Company, programme partenaire — <https://www.urbancompany.com/blog/urban-company-announces-12-point-program-to-improve-partner-earnings-and-livelihood/>
- Urban Company, Wikipédia — <https://en.wikipedia.org/wiki/Urban_Company>
- TaskRabbit, frais et paiements — <https://support.taskrabbit.com/hc/en-gb/articles/46260514951579-Fees-payments-and-cancellation-supplemental-terms>
- Fast Company, frais TaskRabbit — <https://www.fastcompany.com/3065993/taskrabbit-workers-fee-increase>
- TaskRabbit, Wikipédia — <https://en.wikipedia.org/wiki/Taskrabbit>
- Yoojo, frais de service — <https://help.yoojo.com/hc/fr/articles/360010778340>
- NeedHelp, frais de service — <https://needhelp.zendesk.com/hc/fr-fr/articles/20228073075346>
- Frizbiz, commission — <https://www.bonjouridee.com/frizbiz/>
- AlloVoisins, paiement sans commission — <https://www.allovoisins.com/article/442-faites-vous-payer-en-ligne-sans-commission>
- AlloVoisins, support pro — <https://support-pro.allovoisins.com/hc/fr/articles/19967275692818>
- Thumbtack, modèle économique — <https://www.brineweb.com/blog/thumbtack-business-model-how-thumbtack-works-and-makes-money>
- StarOfService, fonctionnement pro — <https://www.starofservice.us/pro/how-it-works>
- Jiji, FAQ — <https://jiji.sn/faq/169>
- Jiji, Wikipédia — <https://en.wikipedia.org/wiki/Jiji_Africa>
- Fiverr / Upwork, calculateur de frais — <https://www.upwork.com/tools/fiverr-fee-calculator>
- Malt, frais — <https://help.malt.com/hc/en-150/articles/29539691425938>
- Comeup, alternative à Malt — <https://comeup.com/fr/experts/comeup-alternative-a-malt>
- Jumia VendorHub, commissions — <https://vendorhub.jumia.ci/commissions/>
- Jumia, politique de retour — <https://www.jumia.ci/sp-politique-de-retour-remboursement/>
- Jumia Logistics — <https://group.jumia.com/business/logistics>
- Algérie 360, retrait de Jumia — <https://www.algerie360.com/apres-14-ans-dactivite-jumia-met-fin-a-son-aventure-en-algerie/>
- Jeune Afrique, Jumia — <https://www.jeuneafrique.com/entreprises/jumia/>
- Fooderise, commissions Glovo — <https://www.fooderise.com/fr/plateformes/glovo>

### 10.5 Sources internes LinkUp

- README du dépôt — [../README.md](../README.md)
- Architecture — [ARCHITECTURE.md](ARCHITECTURE.md)

---

> **Conclusion en une phrase.** Le marché gabonais n'attend pas une énième application d'annonces : il attend une plateforme qui **prouve** qu'un prestataire est fiable, **cadre** le prix et le périmètre, **trace** la mission et **offre un recours** — le tout sans demander à l'utilisateur d'abandonner WhatsApp.
