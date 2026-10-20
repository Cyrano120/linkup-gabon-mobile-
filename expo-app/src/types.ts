export type Category = 'Informatique' | 'Cours' | 'Livraison' | 'Design & Web';

export type RequestStatus = 'Ouverte' | 'En discussion' | 'Confirmée' | 'Terminée';

export type Urgency = "Aujourd'hui" | 'Demain' | 'Cette semaine' | 'Flexible';

export interface Review {
  client: string;
  rating: number;
  text: string;
}

export interface Provider {
  _firestoreId?: string;
  id: number;
  name: string;
  role: string;
  category: Category;
  rating: number;
  missions: number;
  price: number;
  location: string;
  available: boolean;
  image: string;
  cover: string;
  responseTime: string;
  successRate: number;
  headline: string;
  bio: string;
  gallery: string[];
  reviews: Review[];
  skills: string[];
  /** Auteur du document, estampillé par la couche Firestore. */
  createdBy?: string;
  ownerUid?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface ServiceRequest {
  _firestoreId?: string;
  id: number;
  title: string;
  category: Category;
  budget: number;
  location: string;
  urgency: Urgency;
  status: RequestStatus;
  client: string;
  provider: string;
  candidates: string[];
  description: string;
  /** Auteur du document, estampillé par la couche Firestore. */
  createdBy?: string;
  /** Client auteur de la mission (immuable). */
  clientUid?: string;
  /** Prestataire retenu, autorisé à faire évoluer la mission. */
  providerUid?: string;
  /** Candidats positionnés, alignés sur `candidates`. */
  candidateUids?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface Message {
  _firestoreId?: string;
  id: number;
  /** Nom affiché de l'expéditeur. */
  from: string;
  /** Nom affiché du destinataire. */
  to: string;
  subject: string;
  text: string;
  /** Auteur du document, estampillé par la couche Firestore. */
  createdBy?: string;
  fromUid?: string;
  toUid?: string;
  /** `[fromUid, toUid]` — contrôle d'accès et clé de requête. */
  participants?: string[];
  createdAt?: number;
  updatedAt?: number;
  readAt?: number;
}

export interface NewRequestInput {
  client: string;
  title: string;
  category: Category;
  budget: number;
  location: string;
  urgency: Urgency;
  description: string;
}

export interface NewProviderInput {
  name: string;
  role: string;
  category: Category;
  price: number;
  location: string;
  headline: string;
  skills: string[];
}

export interface NewMessageInput {
  from: string;
  to: string;
  /** UID réel du destinataire : indispensable à une conversation privée. */
  toUid: string;
  subject: string;
  text: string;
}
