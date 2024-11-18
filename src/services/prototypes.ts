import { z } from 'zod';
import { executeQuery, isUsingMockDatabase } from '../lib/db';
import { Prototype } from '../types';
import { mockPrototypes } from '../data/mockData';

const prototypeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  tags: z.string().transform(tags => tags.split(',')),
  rating: z.number(),
  author: z.string(),
  demo_url: z.string().nullable(),
  created_at: z.string().transform(date => new Date(date)),
  author_id: z.string(),
  access_level: z.enum(['public', 'private', 'restricted']),
  allowed_users: z.string().nullable().transform(users => users?.split(',') || undefined),
});

export async function getPrototypes(useMockData: boolean = true): Promise<Prototype[]> {
  if (useMockData || isUsingMockDatabase()) {
    return Promise.resolve(mockPrototypes);
  }

  try {
    const sql = `
      SELECT 
        id,
        title,
        description,
        image_url,
        tags,
        rating,
        author,
        demo_url,
        created_at,
        author_id,
        access_level,
        allowed_users
      FROM prototypes
      ORDER BY created_at DESC
    `;

    const results = await executeQuery(sql, [], prototypeSchema.array());
    return results.length > 0 ? results : mockPrototypes;
  } catch (error) {
    console.warn('Failed to fetch prototypes:', error);
    return mockPrototypes;
  }
}

export async function getPrototypeById(id: string, useMockData: boolean = true): Promise<Prototype | null> {
  if (useMockData || isUsingMockDatabase()) {
    return Promise.resolve(mockPrototypes.find(p => p.id === id) || null);
  }

  try {
    const sql = `
      SELECT 
        id,
        title,
        description,
        image_url,
        tags,
        rating,
        author,
        demo_url,
        created_at,
        author_id,
        access_level,
        allowed_users
      FROM prototypes
      WHERE id = ?
    `;

    const results = await executeQuery(sql, [id], prototypeSchema.array());
    return results[0] || mockPrototypes.find(p => p.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch prototype:', error);
    return mockPrototypes.find(p => p.id === id) || null;
  }
}

export async function deletePrototype(id: string, useMockData: boolean = true): Promise<void> {
  if (useMockData || isUsingMockDatabase()) {
    const index = mockPrototypes.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Prototype not found');
    }
    mockPrototypes.splice(index, 1);
    return;
  }

  const sql = `
    DELETE FROM prototypes
    WHERE id = ?
  `;

  await executeQuery(sql, [id]);
}

export async function createPrototype(
  prototype: Omit<Prototype, 'id' | 'createdAt'>,
  useMockData: boolean = true
): Promise<Prototype> {
  if (useMockData || isUsingMockDatabase()) {
    const newPrototype: Prototype = {
      ...prototype,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    mockPrototypes.push(newPrototype);
    return newPrototype;
  }

  const sql = `
    INSERT INTO prototypes (
      title,
      description,
      image_url,
      tags,
      rating,
      author,
      demo_url,
      author_id,
      access_level,
      allowed_users
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `;

  const results = await executeQuery(
    sql,
    [
      prototype.title,
      prototype.description,
      prototype.imageUrl,
      prototype.tags.join(','),
      prototype.rating,
      prototype.author,
      prototype.demoUrl || null,
      prototype.authorId,
      prototype.accessLevel,
      prototype.allowedUsers?.join(',') || null
    ],
    prototypeSchema.array()
  );

  return results[0];
}