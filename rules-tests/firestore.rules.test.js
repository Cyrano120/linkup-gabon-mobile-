// ============================================================================
//  Tests des règles Firestore — LinkUp Gabon
//
//  Chaque test décrit un comportement ATTENDU des règles. Ils s'exécutent
//  contre l'émulateur Firestore local : aucune donnée réelle n'est touchée.
//
//  Lancement (depuis la racine du dépôt) :
//    firebase emulators:exec --only firestore --project demo-linkup "npm --prefix rules-tests test"
// ============================================================================

import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-linkup';
const RULES = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: RULES, host: '127.0.0.1', port: 8080 },
  });
});

after(async () => {
  await env?.cleanup();
});

// Chaque test part d'une base vide : sans cela, les documents créés par un
// test précédent faussent les requêtes et les comptages.
beforeEach(async () => {
  await env.clearFirestore();
});

/** Écrit un document en contournant les règles (mise en place du décor). */
async function seed(path, data) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const parts = path.split('/');
    const id = parts.pop();
    await setDoc(doc(ctx.firestore(), parts.join('/'), id), data);
  });
}

const alice = () => env.authenticatedContext('alice');
const bob = () => env.authenticatedContext('bob');
const carol = () => env.authenticatedContext('carol');
const anon = () => env.unauthenticatedContext();

// ---------------------------------------------------------------------- vitrine

describe('providers — vitrine prestataire', () => {
  const valide = {
    id: 1,
    name: 'Nora Mba',
    role: 'Développeuse front-end',
    category: 'Design & Web',
    price: 8000,
    location: 'Nzeng-Ayong',
    available: true,
    createdBy: 'alice',
    ownerUid: 'alice',
  };

  it('tout le monde peut lire une vitrine, même sans compte', async () => {
    await seed('providers/nora', { ...valide, createdBy: 'alice' });
    await assertSucceeds(getDoc(doc(anon().firestore(), 'providers', 'nora')));
  });

  it('un visiteur sans compte ne peut pas créer de vitrine', async () => {
    await assertFails(
      addDoc(collection(anon().firestore(), 'providers'), valide),
    );
  });

  it('refuse une vitrine sans createdBy', async () => {
    const { createdBy: _ignore, ...sansCreatedBy } = valide;
    await assertFails(
      addDoc(collection(alice().firestore(), 'providers'), sansCreatedBy),
    );
  });

  it("refuse une vitrine attribuée à quelqu'un d'autre", async () => {
    await assertFails(
      addDoc(collection(bob().firestore(), 'providers'), valide),
    );
  });

  it('accepte une vitrine créée par son auteur', async () => {
    await assertSucceeds(
      addDoc(collection(alice().firestore(), 'providers'), { ...valide, id: 99 }),
    );
  });

  it('refuse un champ non autorisé', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'providers'), {
        ...valide,
        champPirate: 'valeur',
      }),
    );
  });

  it('refuse un prix hors bornes', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'providers'), { ...valide, price: -5 }),
    );
  });

  it('refuse une note hors bornes', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'providers'), { ...valide, rating: 12 }),
    );
  });

  it("refuse qu'un tiers modifie la vitrine d'un autre", async () => {
    await seed('providers/nora', valide);
    await assertFails(
      updateDoc(doc(bob().firestore(), 'providers', 'nora'), { price: 1 }),
    );
  });

  it('autorise l\'auteur à modifier sa propre vitrine', async () => {
    await seed('providers/nora', valide);
    await assertSucceeds(
      updateDoc(doc(alice().firestore(), 'providers', 'nora'), { price: 12000 }),
    );
  });

  it("refuse qu'un tiers supprime la vitrine d'un autre", async () => {
    await seed('providers/nora', valide);
    await assertFails(deleteDoc(doc(bob().firestore(), 'providers', 'nora')));
  });

  it("autorise l'auteur à supprimer sa vitrine", async () => {
    await seed('providers/nora', valide);
    await assertSucceeds(deleteDoc(doc(alice().firestore(), 'providers', 'nora')));
  });
});

// ---------------------------------------------------------------------- mission

describe('requests — mission', () => {
  const valide = {
    id: 101,
    title: 'Installer Windows et Office',
    category: 'Informatique',
    budget: 10000,
    description: 'Ordinateur formaté, à préparer pour les cours.',
    status: 'Ouverte',
    urgency: 'Demain',
    location: 'PK12',
    client: 'Alice',
    provider: 'En attente',
    candidates: [],
    createdBy: 'alice',
    clientUid: 'alice',
  };

  it('un visiteur sans compte ne peut pas publier de mission', async () => {
    await assertFails(addDoc(collection(anon().firestore(), 'requests'), valide));
  });

  it('accepte une mission publiée par son client', async () => {
    await assertSucceeds(
      addDoc(collection(alice().firestore(), 'requests'), { ...valide, id: 201 }),
    );
  });

  it("refuse une mission dont le client n'est pas l'auteur", async () => {
    await assertFails(
      addDoc(collection(bob().firestore(), 'requests'), valide),
    );
  });

  it('refuse un statut inconnu', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'requests'), {
        ...valide,
        status: 'Annulée par la lune',
      }),
    );
  });

  it('refuse un délai inconnu', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'requests'), {
        ...valide,
        urgency: 'Un jour peut-être',
      }),
    );
  });

  it("refuse qu'un tiers modifie une mission", async () => {
    await seed('requests/r1', valide);
    await assertFails(
      updateDoc(doc(carol().firestore(), 'requests', 'r1'), { budget: 1 }),
    );
  });

  it('autorise le client à modifier sa mission', async () => {
    await seed('requests/r1', valide);
    await assertSucceeds(
      updateDoc(doc(alice().firestore(), 'requests', 'r1'), { status: 'En discussion' }),
    );
  });

  it('autorise le prestataire retenu à faire évoluer la mission', async () => {
    await seed('requests/r2', { ...valide, providerUid: 'bob', status: 'En discussion' });
    await assertSucceeds(
      updateDoc(doc(bob().firestore(), 'requests', 'r2'), { status: 'Confirmée' }),
    );
  });

  it("interdit de s'approprier une mission en changeant createdBy", async () => {
    await seed('requests/r1', valide);
    await assertFails(
      updateDoc(doc(alice().firestore(), 'requests', 'r1'), { createdBy: 'bob' }),
    );
  });

  it("refuse qu'un tiers supprime une mission", async () => {
    await seed('requests/r1', valide);
    await assertFails(deleteDoc(doc(bob().firestore(), 'requests', 'r1')));
  });
});

// ------------------------------------------------------------------ messagerie

describe('messages — messagerie privée', () => {
  const conversation = {
    id: 1,
    fromUid: 'alice',
    toUid: 'bob',
    participants: ['alice', 'bob'],
    from: 'Alice',
    to: 'Bob',
    subject: 'Disponibilité',
    text: 'Bonjour, êtes-vous libre demain ?',
  };

  it('accepte un message envoyé par son expéditeur', async () => {
    await assertSucceeds(
      addDoc(collection(alice().firestore(), 'messages'), { ...conversation, id: 11 }),
    );
  });

  it("refuse un message dont l'expéditeur est quelqu'un d'autre", async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'messages'), { ...conversation, id: 12, fromUid: 'bob' }),
    );
  });

  it('refuse une liste de participants qui ne correspond pas', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'messages'), {
        ...conversation,
        id: 13,
        participants: ['alice', 'carol'],
      }),
    );
  });

  it('refuse un message adressé à soi-même', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'messages'), {
        ...conversation,
        id: 14,
        toUid: 'alice',
        participants: ['alice', 'alice'],
      }),
    );
  });

  it('le destinataire peut lire le message', async () => {
    await seed('messages/m1', conversation);
    await assertSucceeds(getDoc(doc(bob().firestore(), 'messages', 'm1')));
  });

  it("un tiers NE PEUT PAS lire la conversation d'autrui", async () => {
    await seed('messages/m1', conversation);
    await assertFails(getDoc(doc(carol().firestore(), 'messages', 'm1')));
  });

  it('un visiteur sans compte ne peut pas lire un message', async () => {
    await seed('messages/m1', conversation);
    await assertFails(getDoc(doc(anon().firestore(), 'messages', 'm1')));
  });

  it('le destinataire ne peut pas se réécrire un message comme auteur', async () => {
    await seed('messages/m1', conversation);
    await assertFails(
      updateDoc(doc(bob().firestore(), 'messages', 'm1'), { text: 'Falsifié' }),
    );
  });

  it("l'expéditeur peut corriger son message", async () => {
    await seed('messages/m1', conversation);
    await assertSucceeds(
      updateDoc(doc(alice().firestore(), 'messages', 'm1'), { text: 'Bonjour, êtes-vous libre ?' }),
    );
  });

  it("interdit d'ajouter un participant à une conversation", async () => {
    await seed('messages/m1', conversation);
    await assertFails(
      updateDoc(doc(alice().firestore(), 'messages', 'm1'), {
        participants: ['alice', 'bob', 'carol'],
      }),
    );
  });

  it("un tiers ne peut pas supprimer la conversation d'autrui", async () => {
    await seed('messages/m1', conversation);
    await assertFails(deleteDoc(doc(carol().firestore(), 'messages', 'm1')));
  });

  it('une requête filtrée sur participants ne renvoie que mes conversations', async () => {
    await seed('messages/m1', conversation);
    await seed('messages/m2', {
      ...conversation,
      id: 2,
      fromUid: 'carol',
      toUid: 'bob',
      participants: ['carol', 'bob'],
    });

    const ctx = bob().firestore();
    const q = query(
      collection(ctx, 'messages'),
      where('participants', 'array-contains', 'bob'),
    );
    const snap = await assertSucceeds(getDocs(q));
    assert.equal(snap.size, 2, 'Bob participe aux deux conversations.');
  });

  it("une requête globale est refusée (pas de lecture de tout le monde)", async () => {
    await seed('messages/m1', conversation);
    await assertFails(getDocs(collection(carol().firestore(), 'messages')));
  });
});

// ----------------------------------------------------------------- appareils

// --------------------------------------------------------------------- avis

describe('reviews — avis adossés à une mission terminée', () => {
  const mission = {
    title: 'Installer Windows et Office',
    category: 'Informatique',
    budget: 10000,
    description: 'Ordinateur à préparer pour les cours.',
    status: 'Terminée',
    client: 'Alice',
    provider: 'Bob',
    candidateUids: [],
    createdBy: 'alice',
    clientUid: 'alice',
    providerUid: 'bob',
  };

  const avis = {
    providerId: 'p1',
    providerUid: 'bob',
    requestId: 'r1',
    authorUid: 'alice',
    rating: 5,
    text: 'Travail rapide et soigné.',
    createdBy: 'alice',
  };

  it('accepte un avis du client sur une mission terminée', async () => {
    await seed('requests/r1', mission);
    await assertSucceeds(setDoc(doc(alice().firestore(), 'reviews', 'r1'), avis));
  });

  it('refuse un avis si la mission n’est pas terminée', async () => {
    await seed('requests/r1', { ...mission, status: 'Confirmée' });
    await assertFails(setDoc(doc(alice().firestore(), 'reviews', 'r1'), avis));
  });

  it('refuse un avis si la mission n’existe pas', async () => {
    await assertFails(setDoc(doc(alice().firestore(), 'reviews', 'r1'), avis));
  });

  it('refuse un avis rédigé par le prestataire lui-même', async () => {
    await seed('requests/r1', mission);
    await assertFails(
      setDoc(doc(bob().firestore(), 'reviews', 'r1'), {
        ...avis,
        authorUid: 'bob',
        createdBy: 'bob',
      }),
    );
  });

  it('refuse un avis qui vise un autre prestataire que celui de la mission', async () => {
    await seed('requests/r1', mission);
    await assertFails(
      setDoc(doc(alice().firestore(), 'reviews', 'r1'), { ...avis, providerUid: 'carol' }),
    );
  });

  it("refuse un avis dont l'identifiant ne correspond pas à la mission", async () => {
    await seed('requests/r1', mission);
    await assertFails(
      setDoc(doc(alice().firestore(), 'reviews', 'r9'), { ...avis }),
    );
  });

  it('refuse une note hors bornes ou non entière', async () => {
    await seed('requests/r1', mission);
    await assertFails(
      setDoc(doc(alice().firestore(), 'reviews', 'r1'), { ...avis, rating: 6 }),
    );
    await assertFails(
      setDoc(doc(alice().firestore(), 'reviews', 'r1'), { ...avis, rating: 0 }),
    );
    await assertFails(
      setDoc(doc(alice().firestore(), 'reviews', 'r1'), { ...avis, rating: 4.5 }),
    );
  });

  it('refuse un commentaire trop court', async () => {
    await seed('requests/r1', mission);
    await assertFails(
      setDoc(doc(alice().firestore(), 'reviews', 'r1'), { ...avis, text: 'ok' }),
    );
  });

  it("empêche un tiers de modifier ou supprimer l'avis", async () => {
    await seed('requests/r1', mission);
    await seed('reviews/r1', avis);
    await assertFails(
      updateDoc(doc(bob().firestore(), 'reviews', 'r1'), { rating: 1 }),
    );
    await assertFails(deleteDoc(doc(bob().firestore(), 'reviews', 'r1')));
  });

  it("autorise l'auteur à corriger puis retirer son avis", async () => {
    await seed('requests/r1', mission);
    await seed('reviews/r1', avis);
    await assertSucceeds(
      updateDoc(doc(alice().firestore(), 'reviews', 'r1'), { rating: 4 }),
    );
    await assertSucceeds(deleteDoc(doc(alice().firestore(), 'reviews', 'r1')));
  });

  it('laisse les avis lisibles sans compte', async () => {
    await seed('requests/r1', mission);
    await seed('reviews/r1', avis);
    await assertSucceeds(getDoc(doc(anon().firestore(), 'reviews', 'r1')));
  });
});

describe('devices — jetons de notification', () => {
  const appareil = { userId: 'alice', token: 'jeton-de-test-123456', platform: 'android' };

  it('accepte son propre appareil', async () => {
    await assertSucceeds(
      setDoc(doc(alice().firestore(), 'devices', 'alice'), appareil),
    );
  });

  it("refuse d'écrire l'appareil d'un autre", async () => {
    await assertFails(
      setDoc(doc(bob().firestore(), 'devices', 'alice'), appareil),
    );
  });

  it("refuse de lire l'appareil d'un autre", async () => {
    await seed('devices/alice', appareil);
    await assertFails(getDoc(doc(bob().firestore(), 'devices', 'alice')));
  });

  it("refuse un userId qui ne correspond pas au document", async () => {
    await assertFails(
      setDoc(doc(alice().firestore(), 'devices', 'alice'), { ...appareil, userId: 'bob' }),
    );
  });

  it('refuse une plateforme inconnue', async () => {
    await assertFails(
      setDoc(doc(alice().firestore(), 'devices', 'alice'), { ...appareil, platform: 'blackberry' }),
    );
  });
});

// ------------------------------------------------------------------- profils

describe('users — profil privé', () => {
  it('accepte son propre profil', async () => {
    await assertSucceeds(
      setDoc(doc(alice().firestore(), 'users', 'alice'), { uid: 'alice', displayName: 'Alice' }),
    );
  });

  it("refuse de lire le profil d'un autre", async () => {
    await seed('users/alice', { uid: 'alice', displayName: 'Alice' });
    await assertFails(getDoc(doc(bob().firestore(), 'users', 'alice')));
  });

  it('refuse un rôle inconnu', async () => {
    await assertFails(
      setDoc(doc(alice().firestore(), 'users', 'alice'), { uid: 'alice', role: 'super-roi' }),
    );
  });
});

// -------------------------------------- documents hérités (avant migration)
//
// Les documents créés avant la migration ne portent ni `createdBy`, ni
// `clientUid`, ni `participants`. Les règles doivent les refuser PROPREMENT
// (et non lever une erreur d'évaluation), afin qu'aucun document orphelin
// ne reste modifiable.

describe('documents hérités — refus propre', () => {
  it('refuse la modification d’une vitrine sans createdBy', async () => {
    await seed('providers/herite', {
      id: 1, name: 'Ancienne vitrine', role: 'Développeur',
      category: 'Design & Web', price: 5000,
    });
    await assertFails(
      updateDoc(doc(alice().firestore(), 'providers', 'herite'), { price: 6000 }),
    );
  });

  it('refuse la suppression d’un document hérité', async () => {
    await seed('providers/herite', {
      id: 1, name: 'Ancienne vitrine', role: 'Développeur',
      category: 'Design & Web', price: 5000,
    });
    await assertFails(deleteDoc(doc(alice().firestore(), 'providers', 'herite')));
  });

  it('refuse la modification d’une mission sans clientUid', async () => {
    await seed('requests/herite', {
      id: 2, title: 'Ancienne mission', category: 'Informatique',
      budget: 1000, description: 'Document antérieur à la migration.',
    });
    await assertFails(
      updateDoc(doc(alice().firestore(), 'requests', 'herite'), { budget: 2000 }),
    );
  });

  it('refuse la lecture d’un message sans participants', async () => {
    await seed('messages/herite', {
      id: 3, from: 'Alice', to: 'Bob', subject: 'Ancien', text: 'Document antérieur.',
    });
    await assertFails(getDoc(doc(alice().firestore(), 'messages', 'herite')));
  });
});

// ---------------------------------------------------------- collections inconnues

describe('refus par défaut', () => {
  it('refuse toute collection non déclarée', async () => {
    await assertFails(
      addDoc(collection(alice().firestore(), 'collectionInconnue'), { x: 1 }),
    );
  });

  it('refuse même la lecture d’une collection non déclarée', async () => {
    await assertFails(getDocs(collection(alice().firestore(), 'collectionInconnue')));
  });
});
