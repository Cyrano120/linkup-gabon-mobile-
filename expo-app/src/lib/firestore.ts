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
} from 'firebase/firestore';

import { requireDb } from './firebase';

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

export async function addDocument(name: CollectionName, data: Doc): Promise<string> {
  const db = requireDb();
  const { _firestoreId: _ignored, ...payload } = data;
  const ref = await addDoc(collection(db, name), { ...payload, createdAt: Date.now() });
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
