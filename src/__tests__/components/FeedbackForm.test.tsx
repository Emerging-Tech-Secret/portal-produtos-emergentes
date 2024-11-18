import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { FeedbackForm } from '../../components/FeedbackForm';

describe('Componente FeedbackForm', () => {
  const mockOnSubmit = vi.fn();
  const prototypeId = '1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar todos os campos', () => {
    render(<FeedbackForm prototypeId={prototypeId} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/avaliação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reação rápida/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comentários/i)).toBeInTheDocument();
    expect(screen.getByText(/enviar feedback/i)).toBeInTheDocument();
  });

  it('deve enviar feedback completo', async () => {
    render(<FeedbackForm prototypeId={prototypeId} onSubmit={mockOnSubmit} />);

    // Seleciona avaliação
    fireEvent.click(screen.getByText('★'));

    // Seleciona reação
    fireEvent.click(screen.getByLabelText(/love/i));

    // Adiciona comentário
    fireEvent.change(screen.getByPlaceholderText(/compartilhe sua opinião/i), {
      target: { value: 'Ótimo produto!' }
    });

    // Envia o formulário
    fireEvent.click(screen.getByText(/enviar feedback/i));

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      prototypeId,
      rating: 1,
      reaction: 'love',
      comment: 'Ótimo produto!'
    }));
  });

  it('deve limpar o formulário após envio', () => {
    render(<FeedbackForm prototypeId={prototypeId} onSubmit={mockOnSubmit} />);

    // Preenche e envia o formulário
    fireEvent.click(screen.getByText('★'));
    fireEvent.click(screen.getByLabelText(/love/i));
    fireEvent.change(screen.getByPlaceholderText(/compartilhe sua opinião/i), {
      target: { value: 'Teste' }
    });
    fireEvent.click(screen.getByText(/enviar feedback/i));

    // Verifica se os campos foram limpos
    expect(screen.getByPlaceholderText(/compartilhe sua opinião/i)).toHaveValue('');
  });
});