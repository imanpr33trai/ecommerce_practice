export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  colors?: string[];
  material?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export type Category = 'All' | 'Table' | 'Dressers' | 'Sofa' | 'Chair' | 'Bed' | 'Lamps';