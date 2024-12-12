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

export interface PortalEvaluation {
  id: string;
  userId: string;
  createdAt: Date;
  overallRating: number;
  likertResponses: {
    usability: number;
    design: number;
    performance: number;
    features: number;
    reliability: number;
  };
  qualitativeResponse: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface EvaluationAnalysis {
  id: string;
  evaluationIds: string[];
  createdAt: Date;
  summary: string;
  recommendations: string[];
  trends: {
    category: string;
    trend: number;
    insight: string;
  }[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export type DataMode = 'mock' | 'real';