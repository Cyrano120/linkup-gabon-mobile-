import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { initialMessages, initialProviders, initialRequests } from '../data';
import { isDemoDataEnabled } from '../lib/demoData';
import { addDocument, clearCollection, seedCollection, subscribeToCollection, updateDocument } from '../lib/firestore';
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
  sendMessage: (input: Omit<Message, 'id'>) => Promise<void>;
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
    await Promise.all([
      seedCollection('providers', initialProviders as unknown as Record<string, unknown>[]),
      seedCollection('requests', initialRequests as unknown as Record<string, unknown>[]),
      seedCollection('messages', initialMessages as unknown as Record<string, unknown>[]),
    ]);
  }, []);

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

    const unsubMessages = subscribeToCollection('messages', (rows) => {
      const next = rows as unknown as Message[];
      if (loadedRef.current.messages) {
        for (const item of next) {
          if (!seenRef.current.messages.has(item._firestoreId)) {
            seenRef.current.messages.add(item._firestoreId);
            if (item.createdBy && item.createdBy !== userIdRef.current) {
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
        createdBy: user?.uid ?? null,
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
        createdBy: user?.uid ?? null,
      });
    },
    [user?.uid],
  );

  const bookProvider = useCallback(
    async (provider: Provider, input: NewRequestInput) => {
      await addDocument('requests', {
        ...input,
        id: Date.now(),
        category: provider.category,
        provider: provider.name,
        candidates: [],
        status: 'En discussion',
        createdBy: user?.uid ?? null,
      });
      await addDocument('messages', {
        id: Date.now() + 1,
        from: input.client,
        to: provider.name,
        subject: input.title,
        text: `Nouvelle demande pour ${provider.name}.`,
        createdBy: user?.uid ?? null,
      });
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

  const applyToMission = useCallback(async (request: ServiceRequest, providerName: string) => {
    if (!request._firestoreId || !providerName) return;
    const candidates = request.candidates ?? [];
    if (candidates.includes(providerName)) return;
    await updateDocument('requests', request._firestoreId, {
      candidates: [...candidates, providerName],
      status: request.status === 'Ouverte' ? 'En discussion' : request.status,
    });
  }, []);

  const acceptCandidate = useCallback(
    async (request: ServiceRequest, providerName: string) => {
      if (!request._firestoreId) return;
      await updateDocument('requests', request._firestoreId, {
        provider: providerName,
        status: 'Confirmée',
      });
      await addDocument('messages', {
        id: Date.now(),
        from: 'LinkUp',
        to: providerName,
        subject: 'Mission confirmée',
        text: `${providerName} a été retenu pour « ${request.title} ».`,
        createdBy: user?.uid ?? null,
      });
    },
    [user?.uid],
  );

  const sendMessage = useCallback(
    async (input: Omit<Message, 'id'>) => {
      await addDocument('messages', {
        ...input,
        id: Date.now(),
        createdBy: user?.uid ?? null,
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
