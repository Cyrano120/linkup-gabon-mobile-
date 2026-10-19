import type { Category, Message, Provider, RequestStatus, ServiceRequest, Urgency } from './types';

export const categories: Category[] = ['Informatique', 'Cours', 'Livraison', 'Design & Web'];

export const localAreas = [
  'Libreville',
  'Akanda',
  'Owendo',
  'Nzeng-Ayong',
  'Glass',
  'Louis',
  'PK12',
  'Port-Gentil',
];

export const statuses: RequestStatus[] = ['Ouverte', 'En discussion', 'Confirmée', 'Terminée'];

export const urgencies: Urgency[] = ["Aujourd'hui", 'Demain', 'Cette semaine', 'Flexible'];

export const serviceHighlights = [
  {
    title: 'Dépannage à Libreville',
    text: 'PC, imprimante, wifi ou logiciel bloqué : trouve quelqu’un proche de ton quartier.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Cours et soutien',
    text: 'Révision, exposé, anglais, maths ou bureautique avec des profils proches du campus.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Création locale',
    text: 'Flyers, logos, reels et sites pour snacks, salons, événements et petits commerces.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
  },
];

export const howItWorksSteps = [
  {
    title: 'Tu expliques le besoin',
    text: 'Un PC à réparer à PK12, un flyer pour une soirée à Glass ou un cours de maths à Batterie IV.',
  },
  {
    title: 'LinkUp rapproche les bons profils',
    text: 'Compare les prix, la disponibilité, les compétences et le quartier du prestataire.',
  },
  {
    title: 'Vous confirmez sur place',
    text: 'Validez le tarif en FCFA et choisissez Airtel Money, Moov Money ou espèce.',
  },
];

export const testimonials = [
  {
    name: 'Ariane, étudiante à l’UOB',
    text: 'J’ai trouvé quelqu’un pour remettre mon ordinateur en état avant un devoir. Voir le quartier m’a rassurée.',
  },
  {
    name: 'Brice, graphiste à Akanda',
    text: 'LinkUp me donne une vitrine simple. Je montre ce que je sais faire sans gros portfolio.',
  },
  {
    name: 'Nadya, commerçante à Nzeng-Ayong',
    text: 'Pour mes flyers WhatsApp, je préfère un jeune du coin qui comprend le style local.',
  },
];

export const initialProviders: Provider[] = [
  {
    id: 1,
    name: 'Nora Mba',
    role: 'Développeuse front-end',
    category: 'Design & Web',
    rating: 4.9,
    missions: 28,
    price: 8000,
    location: 'Nzeng-Ayong',
    available: true,
    image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=900&q=80',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    responseTime: '12 min',
    successRate: 98,
    headline: 'Sites vitrines, interfaces React et landing pages pour petits business gabonais.',
    bio: 'Nora aide les petits commerces et associations à créer une présence web propre sans se perdre dans la technique.',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Nadya', rating: 5, text: 'Elle a livré une page claire pour mon salon de coiffure.' },
      { client: 'Junior', rating: 5, text: 'Très bonne communication et design propre.' },
    ],
    skills: ['React', 'Landing page', 'Maquette'],
  },
  {
    id: 2,
    name: 'Cedric Aworet',
    role: 'Technicien informatique',
    category: 'Informatique',
    rating: 4.8,
    missions: 35,
    price: 5000,
    location: 'Louis',
    available: true,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    responseTime: '8 min',
    successRate: 96,
    headline: 'Dépannage rapide à Libreville pour PC, logiciels, imprimantes et réseau wifi.',
    bio: 'Cedric intervient surtout sur les urgences : ordinateur lent, installation, imprimante et wifi.',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Kevin', rating: 5, text: 'Il a remis mon PC en état le même jour.' },
      { client: 'Ariane', rating: 4, text: 'Bon service, explications simples.' },
    ],
    skills: ['PC lent', 'Installation', 'Wifi'],
  },
  {
    id: 3,
    name: 'Sarah Kombila',
    role: 'Coach scolaire',
    category: 'Cours',
    rating: 4.7,
    missions: 19,
    price: 6000,
    location: 'Batterie IV',
    available: false,
    image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=900&q=80',
    cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    responseTime: '1 h',
    successRate: 94,
    headline: 'Soutien scolaire pour élèves et étudiants avant examens, exposés et devoirs.',
    bio: 'Sarah accompagne les élèves avec une méthode calme : reprendre les bases, s’exercer et préparer les contrôles.',
    gallery: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Linda', rating: 5, text: 'Elle m’a aidée à préparer mon oral.' },
      { client: 'Davy', rating: 4, text: 'Bonne pédagogie et ponctuelle.' },
    ],
    skills: ['Maths', 'Anglais', 'Révision'],
  },
  {
    id: 4,
    name: 'Jason Bouanga',
    role: 'Livreur express',
    category: 'Livraison',
    rating: 4.6,
    missions: 42,
    price: 3000,
    location: 'Akanda',
    available: true,
    image: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?auto=format&fit=crop&w=900&q=80',
    cover: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    responseTime: '15 min',
    successRate: 97,
    headline: 'Livraison de colis, courses et documents entre Akanda, Centre-ville et Owendo.',
    bio: 'Jason gère les petites courses et livraisons urgentes avec confirmation du départ et de l’arrivée.',
    gallery: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Mireille', rating: 5, text: 'Colis livré rapidement à Akanda.' },
      { client: 'Steve', rating: 4, text: 'Pratique pour les documents urgents.' },
    ],
    skills: ['Courses', 'Colis', 'Express'],
  },
  {
    id: 5,
    name: 'Maeva Rekangalt',
    role: 'Designer freelance',
    category: 'Design & Web',
    rating: 4.8,
    missions: 23,
    price: 7000,
    location: 'Glass',
    available: true,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    responseTime: '20 min',
    successRate: 95,
    headline: 'Flyers, logos et visuels WhatsApp pour événements, commerces et associations.',
    bio: 'Maeva crée des visuels qui parlent aux clients locaux : affiches, statuts WhatsApp, flyers et logos simples.',
    gallery: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Mickael', rating: 5, text: 'Le flyer était propre et prêt pour WhatsApp.' },
      { client: 'Prisca', rating: 5, text: 'Très bon choix des couleurs.' },
    ],
    skills: ['Logo', 'Flyer', 'Canva'],
  },
  {
    id: 6,
    name: 'Yann Ondo',
    role: 'Monteur vidéo',
    category: 'Design & Web',
    rating: 4.7,
    missions: 17,
    price: 9000,
    location: 'Charbonnages',
    available: true,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
    cover: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    responseTime: '25 min',
    successRate: 93,
    headline: 'Vidéos courtes, reels, sous-titres et montages pour artistes et entrepreneurs.',
    bio: 'Yann transforme des vidéos brutes en contenus courts pour TikTok, Instagram et WhatsApp.',
    gallery: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
    ],
    reviews: [
      { client: 'Bryan', rating: 5, text: 'Le reel avait un rendu très dynamique.' },
      { client: 'Kelly', rating: 4, text: 'Bon montage et sous-titres propres.' },
    ],
    skills: ['Reels', 'Montage', 'Sous-titres'],
  },
];

export const initialRequests: ServiceRequest[] = [
  {
    id: 101,
    title: 'Installer Windows et Office',
    category: 'Informatique',
    budget: 10000,
    location: 'PK12',
    urgency: 'Demain',
    status: 'Ouverte',
    client: 'Kevin',
    provider: 'En attente',
    candidates: ['Cedric Aworet'],
    description: 'Mon ordinateur a été formaté, je dois le rendre prêt pour les cours à l’UOB.',
  },
  {
    id: 102,
    title: 'Cours de soutien en anglais',
    category: 'Cours',
    budget: 15000,
    location: 'Batterie IV',
    urgency: 'Cette semaine',
    status: 'En discussion',
    client: 'Linda',
    provider: 'Sarah Kombila',
    candidates: ['Sarah Kombila'],
    description: 'Besoin de deux séances pour préparer un exposé oral.',
  },
  {
    id: 103,
    title: 'Créer un flyer pour une activité',
    category: 'Design & Web',
    budget: 12000,
    location: 'Glass',
    urgency: 'Demain',
    status: 'Confirmée',
    client: 'Mickael',
    provider: 'Maeva Rekangalt',
    candidates: ['Maeva Rekangalt', 'Nora Mba'],
    description: 'Besoin d’un visuel propre pour annoncer une rencontre étudiante.',
  },
];

export const initialMessages: Message[] = [
  {
    id: 1,
    from: 'Cedric A.',
    to: 'Kevin',
    subject: 'Disponibilité dépannage PC',
    text: 'Je peux passer après les cours pour installer Windows et les logiciels demandés.',
  },
  {
    id: 2,
    from: 'Maeva R.',
    to: 'Mickael',
    subject: 'Flyer événement',
    text: 'J’ai besoin du thème, des couleurs et du texte final pour livrer une première version.',
  },
];
