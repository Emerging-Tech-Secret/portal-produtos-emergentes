import { z } from 'zod';
import { executeQuery } from '../lib/db';
import { User } from '../types';

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'member', 'reader']),
  created_at: z.string().transform(date => new Date(date)),
  last_login: z.string().nullable().transform(date => date ? new Date(date) : undefined),
});

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@itau.com.br',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'member@itau.com.br',
    name: 'Membro',
    role: 'member',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'reader@itau.com.br',
    name: 'Leitor',
    role: 'reader',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date()
  }
];

export async function getAllUsers(useMockData: boolean = true): Promise<User[]> {
  if (useMockData) {
    return Promise.resolve(mockUsers);
  }

  const sql = `
    SELECT 
      id,
      email,
      name,
      role,
      created_at,
      last_login
    FROM users
    ORDER BY created_at DESC
  `;

  return executeQuery(sql, [], userSchema.array());
}

export async function getUserById(id: string, useMockData: boolean = true): Promise<User | null> {
  if (useMockData) {
    return Promise.resolve(mockUsers.find(u => u.id === id) || null);
  }

  const sql = `
    SELECT 
      id,
      email,
      name,
      role,
      created_at,
      last_login
    FROM users
    WHERE id = ?
  `;

  const results = await executeQuery(sql, [id], userSchema.array());
  return results[0] || null;
}

export async function createUser(
  user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>,
  useMockData: boolean = true
): Promise<User> {
  if (useMockData) {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      lastLogin: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  }

  const sql = `
    INSERT INTO users (
      email,
      name,
      role
    ) VALUES (?, ?, ?)
    RETURNING *
  `;

  const results = await executeQuery(
    sql,
    [user.email, user.name, user.role],
    userSchema.array()
  );

  return results[0];
}

export async function updateUser(
  user: User,
  useMockData: boolean = true
): Promise<User> {
  if (useMockData) {
    const index = mockUsers.findIndex(u => u.id === user.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    mockUsers[index] = user;
    return user;
  }

  const sql = `
    UPDATE users
    SET 
      email = ?,
      name = ?,
      role = ?
    WHERE id = ?
    RETURNING *
  `;

  const results = await executeQuery(
    sql,
    [user.email, user.name, user.role, user.id],
    userSchema.array()
  );

  return results[0];
}

export async function deleteUser(
  id: string,
  useMockData: boolean = true
): Promise<void> {
  if (useMockData) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(index, 1);
    return;
  }

  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;

  await executeQuery(sql, [id]);
}