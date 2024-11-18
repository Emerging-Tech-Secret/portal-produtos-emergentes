import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { HomePage } from '../../pages/HomePage';
import { DataModeProvider } from '../../contexts/DataModeContext';
import { ErrorProvider } from '../../contexts/ErrorContext';
import { mockPrototypes } from '../../data/mockData';

vi.mock('../../services/prototypes', () => ({
  getPrototypes: vi.fn().mockResolvedValue(mockPrototypes)
}));

describe('Página Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista de protótipos', async () => {
    render(
      <DataModeProvider>
        <ErrorProvider>
          <HomePage />
        </ErrorProvider>
      </DataModeProvider>
    );

    // Aguarda os protótipos serem carregados
    for (const prototype of mockPrototypes) {
      expect(await screen.findByText(prototype.title)).toBeInTheDocument();
    }
  });

  it('deve filtrar protótipos por busca', async () => {
    render(
      <DataModeProvider>
        <ErrorProvider>
          <HomePage />
        </ErrorProvider>
      </DataModeProvider>
    );

    // Aguarda o carregamento
    await screen.findByText(mockPrototypes[0].title);

    // Realiza uma busca
    const searchInput = screen.getByPlaceholderText(/buscar produtos/i);
    fireEvent.change(searchInput, { target: { value: mockPrototypes[0].title } });

    // Verifica se apenas o protótipo buscado está visível
    expect(screen.getByText(mockPrototypes[0].title)).toBeInTheDocument();
    mockPrototypes.slice(1).forEach(prototype => {
      expect(screen.queryByText(prototype.title)).not.toBeInTheDocument();
    });
  });

  it('deve filtrar por tags', async () => {
    render(
      <DataModeProvider>
        <ErrorProvider>
          <HomePage />
        </ErrorProvider>
      </DataModeProvider>
    );

    // Aguarda o carregamento
    await screen.findByText(mockPrototypes[0].title);

    // Seleciona uma tag
    const tag = mockPrototypes[0].tags[0];
    fireEvent.click(screen.getByText(tag));

    // Verifica se apenas os protótipos com a tag selecionada estão visíveis
    mockPrototypes.forEach(prototype => {
      if (prototype.tags.includes(tag)) {
        expect(screen.getByText(prototype.title)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(prototype.title)).not.toBeInTheDocument();
      }
    });
  });
});