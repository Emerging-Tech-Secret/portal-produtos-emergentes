import { describe, it, expect, vi } from 'vitest';
import { signIn, signUp, logOut } from '../../services/auth';
import { mockUsers } from '../../services/users';

describe('Serviço de Autenticação', () => {
  describe('signIn', () => {
    it('deve autenticar um usuário com credenciais válidas', async () => {
      const email = 'admin@itau.com.br';
      const password = 'admin123';

      const user = await signIn(email, password);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.role).toBe('admin');
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const email = 'admin@itau.com.br';
      const password = 'senha_errada';

      await expect(signIn(email, password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('deve criar um novo usuário', async () => {
      const email = 'novo@itau.com.br';
      const password = 'senha123';
      const name = 'Novo Usuário';
      const role = 'member';

      const user = await signUp(email, password, name, role);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
      expect(user.role).toBe(role);
    });

    it('deve rejeitar email duplicado', async () => {
      const existingUser = mockUsers[0];
      const password = 'senha123';
      const name = 'Teste';
      const role = 'member';

      await expect(
        signUp(existingUser.email, password, name, role)
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('logOut', () => {
    it('deve fazer logout do usuário', async () => {
      await expect(logOut()).resolves.not.toThrow();
    });
  });
});