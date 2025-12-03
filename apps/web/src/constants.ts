import { Product, TeamMember } from './types';

export const CATEGORIES = ['All', 'Table', 'Dressers', 'Sofa', 'Chair', 'Bed', 'Lamps'];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Long Chair',
    category: 'Sofa',
    price: 508,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000',
    description: 'Minimalist long chair designed for comfort and style.',
    isNew: true
  },
  {
    id: '2',
    name: 'PureSpace Focus',
    category: 'Chair',
    price: 299,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
    description: 'Sleek, minimalist design for ultimate productivity.',
    isOnSale: true,
    discount: 50
  },
  {
    id: '3',
    name: 'Nordic Lamp',
    category: 'Lamps',
    price: 120,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?auto=format&fit=crop&q=80&w=1000',
    description: 'Warm light for a cozy atmosphere.',
  },
  {
    id: '4',
    name: 'Oak Dresser',
    category: 'Dressers',
    price: 850,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1000',
    description: 'Solid oak dresser with plenty of storage.',
  },
  {
    id: '5',
    name: 'Cloud Sofa',
    category: 'Sofa',
    price: 1200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
    description: 'Like sitting on a cloud. Ultra soft fabric.',
    isNew: true
  },
  {
    id: '6',
    name: 'Marble Table',
    category: 'Table',
    price: 450,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1000',
    description: 'Genuine marble top with gold legs.',
  }
];

export const TEAM: TeamMember[] = [
  { id: '1', name: 'Sarah', role: 'Designer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Mike', role: 'Engineer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Anna', role: 'Manager', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
];