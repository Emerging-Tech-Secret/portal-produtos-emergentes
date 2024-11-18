import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { PrototypeCard } from '../../components/PrototypeCard';
import { mockPrototypes } from '../../data/mockData';
import { ErrorProvider } from '../../contexts/ErrorContext';

describe('Componente PrototypeCard', () => {
  const mockOnClick = vi.fn();
  const prototype = mockPrototypes[0];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    render(
      <ErrorProvider>
        <PrototypeCard prototype={prototype} onClick={mockOnClick} />
      </ErrorProvider>
    );

    expect(screen.getByText(prototype.title)).toBeInTheDocument();
    expect(screen.getByText(prototype.description)).toBeInTheDocument();
    expect(screen.getByAltText(prototype.title)).toHaveAttribute('src', prototype.imageUrl);
  });

  it('deve chamar onClick ao clicar no card', () => {
    render(
      <ErrorProvider>
        <PrototypeCard prototype={prototype} onClick={mockOnClick} />
      </ErrorProvider>
    );

    fireEvent.click(screen.getByText(prototype.title));
    expect(mockOnClick).toHaveBeenCalledWith(prototype.id);
  });

  it('deve mostrar todas as tags', () => {
    render(
      <ErrorProvider>
        <PrototypeCard prototype={prototype} onClick={mockOnClick} />
      </ErrorProvider>
    );

    prototype.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('deve mostrar o link de demo quando disponível', () => {
    const prototypeWithDemo = {
      ...prototype,
      demoUrl: 'https://demo.example.com'
    };

    render(
      <ErrorProvider>
        <PrototypeCard prototype={prototypeWithDemo} onClick={mockOnClick} />
      </ErrorProvider>
    );

    const demoLink = screen.getByText('Demo');
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute('href', prototypeWithDemo.demoUrl);
  });
});