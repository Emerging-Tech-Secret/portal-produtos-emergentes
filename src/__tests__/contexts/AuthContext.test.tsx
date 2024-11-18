import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { DataModeProvider } from '../../contexts/DataModeContext';

describe('AuthContext', () => {
  const TestComponent = () => {
    const { user, loading } = useAuth();
    return (
      <div>
        {loading ? 'Loading...' : user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
    );
  };

  it('deve iniciar com loading true', () => {
    const { getByText } = render(
      <DataModeProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </DataModeProvider>
    );

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('deve atualizar o estado de autenticação', async () => {
    const { getByText } = render(
      <DataModeProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </DataModeProvider>
    );

    // Aguarda o estado inicial de loading
    expect(getByText('Loading...')).toBeInTheDocument();

    // Simula a conclusão da verificação de auth
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getByText('Not logged in')).toBeInTheDocument();
  });
});