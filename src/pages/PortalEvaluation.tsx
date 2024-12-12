import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ThumbsUp, Smile, Meh, Frown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
import { createEvaluation } from '../services/evaluations';

const likertQuestions = [
  { id: 'usability', label: 'Facilidade de uso do portal' },
  { id: 'design', label: 'Design e aparência visual' },
  { id: 'performance', label: 'Velocidade e desempenho' },
  { id: 'features', label: 'Funcionalidades disponíveis' },
  { id: 'reliability', label: 'Confiabilidade do sistema' },
];

export function PortalEvaluation() {
  const { user } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();
  const [overallRating, setOverallRating] = useState(0);
  const [likertResponses, setLikertResponses] = useState({
    usability: 3,
    design: 3,
    performance: 3,
    features: 3,
    reliability: 3,
  });
  const [qualitativeResponse, setQualitativeResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLikertChange = (questionId: string, value: number) => {
    setLikertResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('Você precisa estar logado para enviar uma avaliação.');
      return;
    }

    setSubmitting(true);
    try {
      await createEvaluation({
        userId: user.id,
        overallRating,
        likertResponses,
        qualitativeResponse,
        createdAt: new Date(),
      });
      navigate('/evaluation/success');
    } catch (error) {
      showError(
        'Não foi possível enviar sua avaliação.',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-itau-gray-800 mb-6">
          Avaliação do Portal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall Rating */}
          <div>
            <h2 className="text-xl font-semibold text-itau-gray-700 mb-4">
              Avaliação Geral
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setOverallRating(rating)}
                  className={`p-3 rounded-full transition-colors duration-200 ${
                    overallRating >= rating
                      ? 'bg-itau-orange text-white'
                      : 'bg-itau-gray-100 text-itau-gray-400 hover:bg-itau-gray-200'
                  }`}
                >
                  <Star className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>

          {/* Likert Scale Questions */}
          <div>
            <h2 className="text-xl font-semibold text-itau-gray-700 mb-4">
              Avaliação Detalhada
            </h2>
            <div className="space-y-6">
              {likertQuestions.map(({ id, label }) => (
                <div key={id}>
                  <label className="block text-itau-gray-700 mb-2">{label}</label>
                  <div className="flex justify-between items-center gap-4">
                    <Frown className={`w-6 h-6 ${
                      likertResponses[id as keyof typeof likertResponses] <= 2
                        ? 'text-red-500'
                        : 'text-itau-gray-400'
                    }`} />
                    <div className="flex-1 flex justify-between">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleLikertChange(id, value)}
                          className={`w-12 h-12 rounded-full border-2 transition-colors duration-200 ${
                            likertResponses[id as keyof typeof likertResponses] === value
                              ? 'bg-itau-orange border-itau-orange text-white'
                              : 'border-itau-gray-300 hover:border-itau-orange'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <ThumbsUp className={`w-6 h-6 ${
                      likertResponses[id as keyof typeof likertResponses] >= 4
                        ? 'text-green-500'
                        : 'text-itau-gray-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div>
            <h2 className="text-xl font-semibold text-itau-gray-700 mb-4">
              Feedback Detalhado
            </h2>
            <textarea
              value={qualitativeResponse}
              onChange={(e) => setQualitativeResponse(e.target.value)}
              placeholder="Compartilhe sua experiência com o portal..."
              className="w-full h-40 px-4 py-3 border border-itau-gray-300 rounded-lg focus:ring-2 focus:ring-itau-orange focus:border-itau-orange resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !overallRating}
            className="w-full bg-itau-orange text-white py-4 px-6 rounded-lg font-semibold hover:bg-itau-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
}