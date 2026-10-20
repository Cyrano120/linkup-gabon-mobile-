# Modèle de données et migration

> Document de travail. Il fixe **ce que les trois applications doivent écrire**
> et **dans quel ordre déployer**, pour que les règles durcies de
> `firestore.rules` puissent être appliquées sans casser la production.

---

## 1. Le problème à résoudre

Les règles actuelles (encore en production) autorisent :

| Trou | Conséquence |
|---|---|
| `messages` lisible par **tout compte connecté** | N'importe quel utilisateur lit toutes les conversations |
| `providers` et `requests` modifiables et supprimables par **tout compte connecté** | Un utilisateur peut modifier ou effacer la vitrine d'un autre |
| Aucune validation de schéma | Champs arbitraires, types incohérents, prix négatifs |

La correction ne peut pas être uniquement côté règles : **les applications
n'envoient pas les informations nécessaires** pour décider qui a le droit
d'écrire. Il faut donc enrichir les documents, puis durcir.

---

## 2. Ce que les applications écrivent aujourd'hui

### Site web (`LinkUp-Gabon-projet-react`, dépôt séparé)

| Fichier | Ligne | Écriture |
|---|---|---|
| `src/firestore.js` | 19 | `{ ...data, id: Date.now() }` — **aucun `createdBy`** |
| `src/firestore.js` | 7 | Lecture de **toute** la collection, triée par `id` |
| `src/App.jsx` | 142, 158, 167 | Messages avec `from` / `to` = **noms affichés** |

### Applications mobiles (Expo et Flutter)

Même schéma : collections plates, horodatage `Date.now()` côté client,
aucun champ de propriété. Les deux écrivent déjà `devices/{uid}` pour les
notifications, ce qui est conforme au modèle cible.

---

## 3. Modèle cible

Trois champs suffisent à rendre les règles applicables. Les champs existants
sont **conservés** : les interfaces continuent de fonctionner sans refonte.

### `providers/{providerId}`

| Champ | Type | Rôle |
|---|---|---|
| *(existants)* | — | `id`, `name`, `role`, `category`, `rating`, `missions`, `price`, `location`, `available`, `image`, `cover`, `responseTime`, `successRate`, `headline`, `bio`, `gallery`, `reviews`, `skills` |
| `createdBy` | string (uid) | **Auteur de la vitrine.** Immuable. Seul lui peut modifier ou supprimer. |
| `ownerUid` | string (uid) | Propriétaire exploitable (égale `createdBy` aujourd'hui, pourra en différer si un compte gère plusieurs vitrines). |
| `createdAt` | number (ms) | Horodatage de création. |
| `updatedAt` | number (ms) | Dernière modification. |

### `requests/{requestId}`

| Champ | Type | Rôle |
|---|---|---|
| *(existants)* | — | `id`, `title`, `category`, `budget`, `location`, `urgency`, `status`, `client`, `provider`, `candidates`, `description` |
| `createdBy` | string (uid) | **Auteur de la mission.** Immuable. |
| `clientUid` | string (uid) | Client (égale `createdBy`). Immuable. |
| `providerUid` | string (uid) ou absent | Prestataire retenu. Peut faire évoluer la mission. |
| `candidateUids` | list\<string\> | Candidats positionnés, autorisés à modifier la mission. |
| `createdAt` / `updatedAt` | number (ms) | Horodatage. |

> **Pourquoi `candidates` ET `candidateUids` ?**
> `candidates` contient des **noms affichés**, utiles à l'interface.
> Les règles ne peuvent pas s'appuyer dessus. On ajoute donc `candidateUids`
> pour le contrôle d'accès, sans toucher à l'affichage existant.

### `reviews/{requestId}` — avis

L'identifiant du document **est celui de la mission**. Cette seule décision
apporte trois garanties sans code applicatif : un avis par mission, un avis
impossible à rattacher à une autre mission, et une création qui échoue si
l'avis existe déjà.

| Champ | Type | Rôle |
|---|---|---|
| `providerId` | string | Document `providers` visé (clé d'affichage). |
| `providerUid` | string (uid) | Prestataire de la mission. Vérifié contre `requests/{requestId}.providerUid`. |
| `requestId` | string | Identifiant de la mission (égale l'ID du document). |
| `authorUid` | string (uid) | Client auteur de l'avis. |
| `rating` | int 1–5 | Note. |
| `text` | string 3–1000 | Commentaire. |
| `createdBy` | string (uid) | Égal à `authorUid`. |
| `createdAt` | number (ms) | Horodatage. |

**Ce que les règles garantissent** (vérifié par 11 tests) : l'avis n'est créé
que si la mission existe, qu'elle est `Terminée`, que l'auteur en est le
client, et que le prestataire visé est celui retenu sur cette mission. Un
prestataire ne peut donc plus écrire ses propres avis — ce qui restait
possible tant qu'ils vivaient dans le tableau `reviews` de sa vitrine.

> **Dette assumée** : le tableau `reviews` de `providers` reste autorisé pour
> ne pas casser les documents existants. Il est **déprécié** : l'affichage
> doit lire la collection `reviews`, jamais le tableau.

> **Vocabulaire imposé.** `status` vaut exactement `Ouverte`,
> `En discussion`, `Confirmée` ou `Terminée` ; `urgency` vaut exactement
> `Aujourd'hui`, `Demain`, `Cette semaine` ou `Flexible`. **Les accents sont
> significatifs** : `Confirmee` sans accent est refusé par les règles.
> Le site utilisait `Urgent` et `Confirmee` dans son jeu de démonstration ;
> c'est corrigé.

### `messages/{messageId}`

| Champ | Type | Rôle |
|---|---|---|
| *(existants)* | — | `id`, `from`, `to`, `subject`, `text` (`from`/`to` = noms affichés) |
| `fromUid` | string (uid) | Expéditeur. Immuable. |
| `toUid` | string (uid) | Destinataire. Immuable. |
| `participants` | list\<string\> | **`[fromUid, toUid]`** — contrôle d'accès et clé de requête. Immuable. |
| `createdBy` | string (uid) | Égale `fromUid`. |
| `readAt` | number (ms) ou absent | Accusé de lecture. |

**Lecture** : `array-contains` sur `participants`.
**Écriture** : seul l'expéditeur peut corriger son message, et jamais les
participants.

### `devices/{uid}` et `users/{uid}`

Déjà conformes, aucune migration nécessaire.

---

## 4. Conséquence sur la messagerie du site web

Aujourd'hui, le site affiche **tous** les messages : c'est un tableau
d'affichage global. Après migration, il n'affichera que les conversations
de l'utilisateur connecté.

C'est **le comportement voulu**, mais c'est un changement visible pour toi
comme pour tes utilisateurs : le « flux global » disparaît au profit d'une
messagerie privée. À valider explicitement.

La requête devient :

```js
query(
  collection(db, 'messages'),
  where('participants', 'array-contains', uid),
  orderBy('id', 'desc')
)
```

> ⚠️ Cette requête exige un **index composite** `participants` (array-contains)
> + `id` (descendant). Il doit être ajouté à `firestore.indexes.json` **avant**
> le déploiement côté client, sinon la requête échoue en production.

---

## 5. Migration des données existantes

### Cas des vitrines et des missions créées avant la migration

Elles n'ont aucun auteur identifiable. Trois choix possibles :

| Option | Effet | Recommandation |
|---|---|---|
| Laisser sans `createdBy` | Plus personne ne peut les modifier. Lecture seule définitive. | Solution d'attente acceptable |
| Attribuer à un compte administrateur | L'administrateur peut gérer et transférer la propriété. | **Recommandé** |
| Supprimer | Base propre, perte des données de démonstration. | Acceptable en démonstration |

**Recommandation** : attribuer à un compte administrateur dédié, marquer
`seeded: true`, et transférer la propriété au fur et à mesure des
réclamations.

### Cas des messages existants

Ils portent des **noms affichés**, pas des identifiants. Il est donc
**impossible** de déterminer les participants de façon fiable.

**Recommandation** : les supprimer (ce sont des données de démonstration).
Les conserver sans `participants` les rendrait invisibles et non modifiables,
donc inutiles.

### Récupérer les dates

Le champ `id` valait `Date.now()` à la création. Il fournit donc
directement `createdAt` :

```js
createdAt = typeof doc.id === 'number' && doc.id > 1e12 ? doc.id : Date.now()
```

---

## 6. Ordre de déploiement (impératif)

Les règles durcies **cassent** toute application qui n'écrit pas les nouveaux
champs. L'ordre n'est donc pas négociable.

```
Étape 1 — Applications écrivent les nouveaux champs
          (les règles actuelles, permissives, acceptent les champs en plus)
                        ↓
Étape 2 — Script de migration : compléter les documents existants
          (createdBy, clientUid, providerUid, participants, createdAt)
                        ↓
Étape 3 — Déployer firestore.rules + firestore.indexes.json
                        ↓
Étape 4 — Vérification en production (tests manuels sur les trois apps)
                        ↓
Étape 5 — Activer la vérification d'e-mail et App Check
```

### Pourquoi cet ordre

- **Inverser 1 et 3** : les applications actuelles n'envoient pas `createdBy`,
  donc toute création échoue. Site et mobiles en panne.
- **Inverser 2 et 3** : les documents anciens n'ont pas `createdBy`, donc
  plus aucune modification n'est possible sur eux — sans recours.
- **Étape 1 seule** : sans risque. Les règles actuelles n'interdisent pas les
  champs supplémentaires.

### Retour arrière

En cas de problème à l'étape 3 :

```bash
firebase deploy --only firestore:rules   # depuis un commit antérieur
```

Les règles sont un fichier unique, le retour arrière est immédiat et sans
perte de données.

### État au 20 octobre 2026

| Étape | État |
|---|---|
| 1. Les trois applications écrivent les nouveaux champs | ✅ web, Expo, Flutter |
| 2. Migration des documents existants | ✅ sans objet : la base ne contenait que 16 documents de démonstration, supprimés |
| 3. Règles et index déployés | ✅ `linkup-gabon` |
| 4. Vérification en production | ⏳ réamorçage à déclencher par une connexion |
| 5. Vérification d'e-mail, App Check | ⏳ |

Le réamorçage est automatique : à la première connexion, l'application
constate que `providers` est vide et réinjecte les données de démonstration,
cette fois avec `createdBy`, `clientUid` et `candidateUids`. Les messages ne
sont pas réamorcés : une conversation privée exige deux comptes réels.

Vérifié en production après déploiement :

| Contrôle | Résultat |
|---|---|
| Lecture publique des prestataires | 200 |
| Écriture anonyme sur `providers` | 403 `PERMISSION_DENIED` |
| Lecture anonyme de `messages` | 403 `PERMISSION_DENIED` |

---

## 7. Ce que chaque application doit changer

| Application | Fichiers concernés | Changement |
|---|---|---|
| **Web** | `src/firestore.js`, `src/App.jsx` | Ajouter `createdBy`/`clientUid`/`fromUid`/`toUid`/`participants` ; filtrer la lecture des messages |
| **Expo** | `src/lib/firestore.ts`, `src/state/DataContext.tsx` | Idem |
| **Flutter** | `lib/services/firestore_service.dart`, `lib/state/data_controller.dart` | Idem |

Règle commune : **le client n'invente jamais l'identité**. `createdBy` et
`fromUid` viennent toujours de `auth.currentUser.uid`, jamais d'un champ
saisi dans un formulaire.

---

## 8. Décisions à prendre

| # | Question | Proposition |
|---|---|---|
| M1 | Attribuer les documents hérités à un compte administrateur ? | Oui |
| M2 | Supprimer les messages de démonstration existants ? | Oui |
| M3 | Accepter que la messagerie du site devienne privée (fin du flux global) ? | Oui |
| M4 | Vérification d'e-mail obligatoire dès maintenant, ou après migration ? | Après migration |

---

## Voir aussi

- [`RECHERCHE-SECURITE.md`](RECHERCHE-SECURITE.md) — analyse, plan P0–P3, cadre légal
- [`SYNTHESE.md`](SYNTHESE.md) — décisions D1–D5
- [`../firestore.rules`](../firestore.rules) — règles cibles, commentées
- [`../rules-tests/firestore.rules.test.js`](../rules-tests/firestore.rules.test.js) — 49 tests
