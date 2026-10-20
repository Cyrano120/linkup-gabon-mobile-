import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { initialProviders, initialRequests } from '../data';
import { isDemoDataEnabled } from '../lib/demoData';
import {
  addDocument,
  clearCollection,
  seedCollection,
  subscribeToCollection,
  subscribeToMessages,
  updateDocument,
} from '../lib/firestore';
import { presentLocalNotification } from '../lib/notifications';
import type { Message, NewProviderInput, NewRequestInput, Provider, ServiceRequest } from '../types';
import { useAuth } from './AuthContext';

interface DataContextValue {
  providers: Provider[];
  requests: ServiceRequest[];
  messages: Message[];
  ready: boolean;
  addRequest: (input: NewRequestInput) => Promise<void>;
  addProvider: (input: NewProviderInput) => Promise<void>;
  bookProvider: (provider: Provider, input: NewRequestInput) => Promise<void>;
  updateRequestStatus: (firestoreId: string | undefined, status: ServiceRequest['status']) => Promise<void>;
  applyToMission: (request: ServiceRequest, providerName: string) => Promise<void>;
  acceptCandidate: (request: ServiceRequest, providerName: string) => Promise<void>;
  sendMessage: (input: {
    from: string;
    to: string;
    toUid: string;
    subject: string;
    text: string;
  }) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans <DataScope>.');
  return ctx;
}

function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState(false);

  const seededRef = useRef(false);
  const loadedRef = useRef({ requests: false, messages: false });
  const seenRef = useRef<{ requests: Set<unknown>; messages: Set<unknown> }>({
    requests: new Set(),
    messages: new Set(),
  });
  const userIdRef = useRef<string | null>(null);

  // L'identifiant est relu dans les callbacks d'abonnement (asynchrones) : on le
  // synchronise dans un effet plutôt que pendant le rendu.
  useEffect(() => {
    userIdRef.current = user?.uid ?? null;
  }, [user]);

  const seedInitialData = useCallback(async () => {
    const uid = user?.uid;
    // Une mission amorcée doit porter un client identifiable.
    const requests = (initialRequests as unknown as Record<string, unknown>[]).map((item) => ({
      ...item,
      clientUid: uid,
      candidateUids: [],
    }));

    // Les messages ne sont plus amorcés : une conversation privée exige deux
    // comptes réels. Inventer des participants produirait des documents
    // illisibles, refusés par les règles de sécurité.
    await Promise.all([
      seedCollection('providers', initialProviders as unknown as Record<string, unknown>[]),
      seedCollection('requests', requests),
    ]);
  }, [user?.uid]);

  useEffect(() => {
    // Aucun compte : rien à écouter. L'état est déjà vierge, car <DataScope>
    // remonte ce provider à chaque changement de compte (voir en fin de fichier).
    if (!user) return;

    const unsubProviders = subscribeToCollection('providers', (rows) => {
      // En production, on n'injecte jamais de démo : la base est partagée avec
      // le site, une collection vide est un choix légitime.
      if (rows.length === 0 && !seededRef.current && isDemoDataEnabled) {
        seededRef.current = true;
        seedInitialData().catch((error) => console.warn('[seed] providers', error));
        return;
      }
      setProviders(rows as unknown as Provider[]);
      setReady(true);
    });

    const unsubRequests = subscribeToCollection('requests', (rows) => {
      const next = rows as unknown as ServiceRequest[];
      // Notifie uniquement les nouvelles missions des autres utilisateurs.
      if (loadedRef.current.requests) {
        for (const item of next) {
          if (!seenRef.current.requests.has(item._firestoreId)) {
            seenRef.current.requests.add(item._firestoreId);
            if (item.createdBy && item.createdBy !== userIdRef.current) {
              presentLocalNotification('Nouvelle mission', item.title).catch(() => {});
            }
          }
        }
      } else {
        next.forEach((item) => seenRef.current.requests.add(item._firestoreId));
        loadedRef.current.requests = true;
      }
      setRequests(next);
    });

    // Le flux ne contient déjà que mes conversations : le filtrage est fait par
    // la requête (`participants array-contains`), donc aussi par les règles.
    const unsubMessages = subscribeToMessages(user.uid, (rows) => {
      const next = rows as unknown as Message[];
      if (loadedRef.current.messages) {
        for (const item of next) {
          if (!seenRef.current.messages.has(item._firestoreId)) {
            seenRef.current.messages.add(item._firestoreId);
            if (item.fromUid && item.fromUid !== userIdRef.current) {
              presentLocalNotification(`Message de ${item.from}`, item.subject || item.text).catch(
                () => {},
              );
            }
          }
        }
      } else {
        next.forEach((item) => seenRef.current.messages.add(item._firestoreId));
        loadedRef.current.messages = true;
      }
      setMessages(next);
    });

    return () => {
      unsubProviders();
      unsubRequests();
      unsubMessages();
    };
  }, [user, seedInitialData]);

  const addRequest = useCallback(
    async (input: NewRequestInput) => {
      await addDocument('requests', {
        ...input,
        id: Date.now(),
        status: 'Ouverte',
        provider: 'En attente',
        candidates: [],
        candidateUids: [],
        clientUid: user?.uid,
      });
    },
    [user?.uid],
  );

  const addProvider = useCallback(
    async (input: NewProviderInput) => {
      await addDocument('providers', {
        ...input,
        id: Date.now(),
        rating: 4.5,
        missions: 0,
        available: true,
        responseTime: '30 min',
        successRate: 90,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=009E60&color=fff&size=256`,
        cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
        bio: input.headline,
        gallery: [],
        reviews: [],
      });
    },
    [],
  );

  const bookProvider = useCallback(
    async (provider: Provider, input: NewRequestInput) => {
      const uid = user?.uid;
      const providerUid = provider.createdBy;

      await addDocument('requests', {
        ...input,
        id: Date.now(),
        category: provider.category,
        provider: provider.name,
        candidates: [],
        candidateUids: [],
        status: 'En discussion',
        clientUid: uid,
        ...(providerUid ? { providerUid } : {}),
      });

      // Conversation privée : seulement si le prestataire a un compte réel et
      // si ce n'est pas l'utilisateur lui-même. Sinon on n'écrit pas de message
      // fantôme que personne ne pourrait lire.
      if (uid && providerUid && providerUid !== uid) {
        await addDocument('messages', {
          id: Date.now() + 1,
          from: input.client,
          to: provider.name,
          subject: input.title,
          text: `Nouvelle demande pour ${provider.name}.`,
          fromUid: uid,
          toUid: providerUid,
          participants: [uid, providerUid],
        });
      }
    },
    [user?.uid],
  );

  const updateRequestStatus = useCallback(
    async (firestoreId: string | undefined, status: ServiceRequest['status']) => {
      if (!firestoreId) return;
      await updateDocument('requests', firestoreId, { status });
    },
    [],
  );

  const applyToMission = useCallback(
    async (request: ServiceRequest, providerName: string) => {
      if (!request._firestoreId || !providerName) return;
      const candidates = request.candidates ?? [];
      if (candidates.includes(providerName)) return;

      // `candidates` et `candidateUids` restent alignés : l'index du nom donne
      // l'index de l'UID, ce qui permet de retrouver le candidat retenu.
      const candidateUids = [...(request.candidateUids ?? [])];
      const candidateUid = providers.find((p) => p.name === providerName)?.createdBy;
      if (candidateUid && !candidateUids.includes(candidateUid)) {
        candidateUids.push(candidateUid);
      }

      await updateDocument('requests', request._firestoreId, {
        candidates: [...candidates, providerName],
        candidateUids,
        status: request.status === 'Ouverte' ? 'En discussion' : request.status,
      });
    },
    [providers],
  );

  const acceptCandidate = useCallback(
    async (request: ServiceRequest, providerName: string) => {
      if (!request._firestoreId) return;
      const uid = user?.uid;

      const index = (request.candidates ?? []).indexOf(providerName);
      const fromList =
        index >= 0 && index < (request.candidateUids?.length ?? 0)
          ? request.candidateUids![index]
          : undefined;
      const providerUid = fromList ?? providers.find((p) => p.name === providerName)?.createdBy;

      await updateDocument('requests', request._firestoreId, {
        provider: providerName,
        status: 'Confirmée',
        ...(providerUid ? { providerUid } : {}),
      });

      if (uid && providerUid && providerUid !== uid) {
        await addDocument('messages', {
          id: Date.now(),
          from: 'LinkUp',
          to: providerName,
          subject: 'Mission confirmée',
          text: `${providerName} a été retenu pour « ${request.title} ».`,
          fromUid: uid,
          toUid: providerUid,
          participants: [uid, providerUid],
        });
      }
    },
    [providers, user?.uid],
  );

  const sendMessage = useCallback(
    async (input: {
      from: string;
      to: string;
      toUid: string;
      subject: string;
      text: string;
    }) => {
      const uid = user?.uid;
      if (!uid) throw new Error('Connecte-toi pour envoyer un message.');
      if (!input.toUid) throw new Error('Choisis un destinataire.');
      if (input.toUid === uid) throw new Error('Tu ne peux pas t’écrire à toi-même.');

      await addDocument('messages', {
        id: Date.now(),
        from: input.from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        fromUid: uid,
        toUid: input.toUid,
        participants: [uid, input.toUid],
      });
    },
    [user?.uid],
  );

  const resetDemoData = useCallback(async () => {
    // Sécurité avant tout : ce bouton SUPPRIME des documents dans la base
    // partagée avec le site en production. On refuse l'opération hors dev,
    // même si l'interface ne devrait jamais l'exposer.
    if (!isDemoDataEnabled) {
      throw new Error(
        'Données de démo désactivées : elles sont partagées avec la production.',
      );
    }
    await Promise.all([
      clearCollection('providers'),
      clearCollection('requests'),
      clearCollection('messages'),
    ]);
    seededRef.current = true;
    await seedInitialData();
  }, [seedInitialData]);

  const value = useMemo<DataContextValue>(
    () => ({
      providers,
      requests,
      messages,
      ready,
      addRequest,
      addProvider,
      bookProvider,
      updateRequestStatus,
      applyToMission,
      acceptCandidate,
      sendMessage,
      resetDemoData,
    }),
    [
      providers,
      requests,
      messages,
      ready,
      addRequest,
      addProvider,
      bookProvider,
      updateRequestStatus,
      applyToMission,
      acceptCandidate,
      sendMessage,
      resetDemoData,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * À utiliser à la place de `<DataProvider>` pour monter les données.
 *
 * Pourquoi une `key` : changer de compte doit repartir de listes vides, sinon
 * les données du compte précédent resteraient affichées un instant après une
 * reconnexion. Faire varier la `key` remonte le provider, ce qui réinitialise
 * tout son état — c'est le pattern recommandé par React, et il évite le
 * `setState` synchrone dans un effet que le lint refuse à juste titre.
 */
export function DataScope({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return <DataProvider key={user?.uid ?? 'anonyme'}>{children}</DataProvider>;
}
