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
  createdBy?: string;
  createdAt?: number;
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
  createdBy?: string;
  createdAt?: number;
}

export interface Message {
  _firestoreId?: string;
  id: number;
  from: string;
  to: string;
  subject: string;
  text: string;
  createdBy?: string;
  createdAt?: number;
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
