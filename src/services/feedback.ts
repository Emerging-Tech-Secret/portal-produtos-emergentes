import { z } from 'zod';
import { executeQuery } from '../lib/db';
import { Feedback } from '../types';
import { mockPrototypes } from '../data/mockData';

const feedbackSchema = z.object({
  id: z.string(),
  prototype_id: z.string(),
  user_id: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  reaction: z.enum(['like', 'love', 'dislike']).nullable(),
  categories: z.record(z.string(), z.number()).nullable(),
  created_at: z.string().transform(date => new Date(date)),
});

// Mock feedback data
const mockFeedback: Feedback[] = mockPrototypes.flatMap(prototype => 
  Array.from({ length: 10 }, (_, i) => ({
    id: `${prototype.id}-feedback-${i}`,
    prototypeId: prototype.id,
    userId: `user-${i}`,
    rating: 3 + Math.floor(Math.random() * 3),
    comment: `Example feedback ${i + 1} for ${prototype.title}`,
    reaction: Math.random() > 0.5 ? 'like' : Math.random() > 0.5 ? 'love' : 'dislike',
    categories: {
      usability: 3 + Math.floor(Math.random() * 3),
      innovation: 3 + Math.floor(Math.random() * 3),
      performance: 3 + Math.floor(Math.random() * 3),
      design: 3 + Math.floor(Math.random() * 3)
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }))
);

export async function getFeedbackForPrototype(
  prototypeId: string,
  useMockData: boolean = true
): Promise<Feedback[]> {
  if (useMockData) {
    return mockFeedback.filter(f => f.prototypeId === prototypeId);
  }

  const sql = `
    SELECT *
    FROM feedback
    WHERE prototype_id = ?
    ORDER BY created_at DESC
  `;

  return executeQuery(sql, [prototypeId], feedbackSchema.array());
}

export async function createFeedback(
  feedback: Omit<Feedback, 'id' | 'createdAt'>,
  useMockData: boolean = true
): Promise<Feedback> {
  if (useMockData) {
    const newFeedback: Feedback = {
      ...feedback,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    mockFeedback.push(newFeedback);
    return newFeedback;
  }

  const sql = `
    INSERT INTO feedback (
      prototype_id,
      user_id,
      rating,
      comment,
      reaction,
      categories
    ) VALUES (?, ?, ?, ?, ?, ?)
    RETURNING *
  `;

  const results = await executeQuery(
    sql,
    [
      feedback.prototypeId,
      feedback.userId,
      feedback.rating,
      feedback.comment || null,
      feedback.reaction || null,
      feedback.categories ? JSON.stringify(feedback.categories) : null
    ],
    feedbackSchema.array()
  );

  return results[0];
}