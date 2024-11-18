import { describe, it, expect, vi } from 'vitest';
import { analyzeFeedback, generateInsights } from '../../services/pmf';
import { mockPrototypes } from '../../data/mockData';
import { Feedback } from '../../types';

describe('Serviço de Análise PMF', () => {
  const mockFeedback: Feedback[] = [
    {
      id: '1',
      prototypeId: '1',
      userId: '1',
      rating: 5,
      comment: 'Excelente produto!',
      reaction: 'love',
      categories: {
        usability: 5,
        innovation: 4,
        performance: 5,
        design: 4
      },
      createdAt: new Date()
    }
  ];

  describe('analyzeFeedback', () => {
    it('deve gerar análise PMF válida', async () => {
      const prototype = mockPrototypes[0];
      const analysis = await analyzeFeedback(prototype, mockFeedback);

      expect(analysis).toBeDefined();
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(100);
      expect(analysis.recommendations).toBeInstanceOf(Array);
      expect(analysis.metrics).toBeDefined();
    });

    it('deve considerar todas as métricas', async () => {
      const prototype = mockPrototypes[0];
      const analysis = await analyzeFeedback(prototype, mockFeedback);

      expect(analysis.metrics).toHaveProperty('userEngagement');
      expect(analysis.metrics).toHaveProperty('problemSolution');
      expect(analysis.metrics).toHaveProperty('marketPotential');
      expect(analysis.metrics).toHaveProperty('technicalFeasibility');
    });
  });

  describe('generateInsights', () => {
    it('deve gerar insights baseados na análise', async () => {
      const prototype = mockPrototypes[0];
      const analysis = await analyzeFeedback(prototype, mockFeedback);
      const insights = await generateInsights(prototype, analysis);

      expect(insights).toBeDefined();
      expect(typeof insights).toBe('string');
      expect(insights.length).toBeGreaterThan(0);
    });
  });
});