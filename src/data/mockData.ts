import { Prototype } from '../types';

export const mockPrototypes: Prototype[] = [
  {
    id: '1',
    title: 'Assistente Virtual Inteligente',
    description: 'Um protótipo de assistente virtual que utiliza processamento de linguagem natural para entender e responder perguntas dos usuários de forma contextual.',
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80',
    tags: ['IA', 'NLP', 'Chatbot'],
    rating: 4.5,
    author: 'Lab Digital Itaú',
    authorId: '1',
    accessLevel: 'public',
    demoUrl: 'https://demo.example.com/assistant',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Sistema de Biometria Facial',
    description: 'Solução de autenticação biométrica que utiliza reconhecimento facial para garantir maior segurança no acesso a serviços bancários.',
    imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1600&q=80',
    tags: ['Biometria', 'Segurança', 'IA'],
    rating: 4.8,
    author: 'Time de Segurança Digital',
    authorId: '2',
    accessLevel: 'restricted',
    allowedUsers: ['1', '2'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    title: 'Análise Preditiva de Investimentos',
    description: 'Ferramenta que utiliza machine learning para analisar tendências de mercado e sugerir estratégias de investimento personalizadas.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80',
    tags: ['Machine Learning', 'Investimentos', 'Análise de Dados'],
    rating: 4.3,
    author: 'Equipe de Inovação em Investimentos',
    authorId: '1',
    accessLevel: 'private',
    demoUrl: 'https://demo.example.com/investments',
    createdAt: new Date('2024-02-15')
  }
];