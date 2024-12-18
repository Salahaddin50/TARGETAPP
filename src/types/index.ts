import { Category, Subcategory } from './categories';

export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profile?: {
    photo?: string;
    age?: number;
    country?: string;
    degree?: string;
    profession?: string;
    linkedIn?: string;
  };
  createdAt: Date;
}

export interface Target {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  progress: number;
  actions: Action[];
  createdAt: Date;
  userId: string;
}

// Rest of the types remain unchanged...