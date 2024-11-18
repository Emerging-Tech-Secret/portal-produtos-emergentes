export interface Prototype {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  rating: number;
  author: string;
  demoUrl?: string;
  createdAt: Date;
  authorId: string;
  accessLevel: 'public' | 'private' | 'restricted';
  allowedUsers?: string[];
}

export interface Feedback {
  id: string;
  prototypeId: string;
  userId: string;
  rating: number;
  comment?: string;
  reaction?: 'like' | 'love' | 'dislike';
  createdAt: Date;
  categories?: {
    usability?: number;
    innovation?: number;
    performance?: number;
    design?: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'reader';
  createdAt: Date;
  lastLogin?: Date;
}

export interface ProductMarketFit {
  id: string;
  prototypeId: string;
  score: number;
  analysis: string;
  recommendations: string[];
  createdAt: Date;
  metrics: {
    userEngagement: number;
    problemSolution: number;
    marketPotential: number;
    technicalFeasibility: number;
  };
}

export type DataMode = 'mock' | 'real';