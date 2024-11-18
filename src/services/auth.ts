import { initializeApp } from 'firebase/app';
import { User } from '../types';
import { mockUsers } from './users';

// Mock Firebase for development
const isMockMode = true;

export async function signIn(email: string, password: string): Promise<User> {
  if (isMockMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'admin123') {
      throw new Error('Invalid credentials');
    }
    
    // Update last login
    user.lastLogin = new Date();
    return user;
  }

  // Real Firebase implementation would go here
  throw new Error('Firebase authentication not implemented');
}

export async function signUp(email: string, password: string, name: string, role: User['role']): Promise<User> {
  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    mockUsers.push(user);
    return user;
  }

  throw new Error('Firebase authentication not implemented');
}

export async function logOut(): Promise<void> {
  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  throw new Error('Firebase authentication not implemented');
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (isMockMode) {
    // Simulate initial auth state check
    setTimeout(() => {
      callback(null);
    }, 500);
    
    return () => {}; // Cleanup function
  }

  throw new Error('Firebase authentication not implemented');
}