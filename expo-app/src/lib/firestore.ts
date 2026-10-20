import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { requireAuth, requireDb } from './firebase';

export type CollectionName = 'providers' | 'requests' | 'messages' | 'devices';

type Doc = Record<string, unknown> & { _firestoreId?: string };

/**
 * Souscription temps réel à une collection.
 * Chaque document reçoit `_firestoreId` pour permettre les mises à jour.
 */
export function subscribeToCollection(
  name: CollectionName,
  onChange: (rows: Doc[]) => void,
): () => void {
  const db = requireDb();
  const ref = collection(db, name);
  return onSnapshot(
    ref,
    (snapshot) => {
      const rows: Doc[] = snapshot.docs.map((d) => ({ ...(d.data() as Doc), _firestoreId: d.id }));
      rows.sort((a, b) => Number(b.createdAt ?? b.id ?? 0) - Number(a.createdAt ?? a.id ?? 0));
      onChange(rows);
    },
    (error) => {
      console.warn(`[firestore] subscribe ${name} error`, error?.message);
      onChange([]);
    },
  );
}

/**
 * Conversations de l'utilisateur connecté, et **seulement** les siennes.
 *
 * La requête filtre sur `participants` : les règles Firestore refusent toute
 * lecture globale de la collection. L'index composite
 * `participants (array-contains) + id (desc)` est déclaré dans
 * `firestore.indexes.json`.
 */
export function subscribeToMessages(
  uid: string,
  onChange: (rows: Doc[]) => void,
): () => void {
  const db = requireDb();
  const ref = query(
    collection(db, 'messages'),
    where('participants', 'array-contains', uid),
    orderBy('id', 'desc'),
  );
  return onSnapshot(
    ref,
    (snapshot) => {
      const rows: Doc[] = snapshot.docs.map((d) => ({ ...(d.data() as Doc), _firestoreId: d.id }));
      onChange(rows);
    },
    (error) => {
      console.warn('[firestore] subscribe messages error', error?.message);
      onChange([]);
    },
  );
}

/**
 * Ajoute un document en estampillant l'auteur.
 *
 * L'identité vient toujours du compte connecté, jamais des données fournies
 * par l'appelant : un écran ne peut donc pas écrire au nom d'un autre.
 */
export async function addDocument(name: CollectionName, data: Doc): Promise<string> {
  const db = requireDb();
  const { _firestoreId: _ignored, ...payload } = data;
  const uid = requireAuth().currentUser?.uid;
  const ref = await addDoc(collection(db, name), {
    ...payload,
    ...(uid ? { createdBy: uid } : {}),
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function updateDocument(
  name: CollectionName,
  firestoreId: string,
  data: Doc,
): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, name, firestoreId), { ...data, updatedAt: Date.now() });
}

export async function setDocument(name: CollectionName, firestoreId: string, data: Doc): Promise<void> {
  const db = requireDb();
  const { _firestoreId: _ignored, ...payload } = data;
  await updateDoc(doc(db, name, firestoreId), payload).catch(async () => {
    // fallback si le document n'existe pas encore
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, name, firestoreId), { ...payload, createdAt: serverTimestamp() });
  });
}

export async function clearCollection(name: CollectionName): Promise<void> {
  const db = requireDb();
  const snap = await getDocs(collection(db, name));
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, name, d.id))));
}

export async function seedCollection(name: CollectionName, items: Doc[]): Promise<void> {
  await Promise.all(items.map((item) => addDocument(name, { ...item, seeded: true })));
}
