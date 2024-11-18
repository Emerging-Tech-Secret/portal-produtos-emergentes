import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react';

interface Props {
  prototypeId: string;
  onSubmit: (feedback: any) => void;
}

export function FeedbackForm({ prototypeId, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reaction, setReaction] = useState<'like' | 'love' | 'dislike' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      prototypeId,
      rating,
      comment,
      reaction,
      createdAt: new Date()
    });
    setRating(0);
    setComment('');
    setReaction(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-itau-gray-700 mb-2">
          Avaliação (1-5)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`p-2 rounded transition-colors duration-200 ${
                rating >= value ? 'bg-itau-orange text-white' : 'bg-itau-gray-200 text-itau-gray-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-itau-gray-700 mb-2">
          Reação Rápida
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setReaction('like')}
            className={`p-3 rounded-full transition-colors duration-200 ${
              reaction === 'like' ? 'bg-itau-orange text-white' : 'bg-white border border-itau-gray-300 text-itau-gray-600 hover:bg-itau-gray-100'
            }`}
          >
            <ThumbsUp className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => setReaction('love')}
            className={`p-3 rounded-full transition-colors duration-200 ${
              reaction === 'love' ? 'bg-itau-orange text-white' : 'bg-white border border-itau-gray-300 text-itau-gray-600 hover:bg-itau-gray-100'
            }`}
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => setReaction('dislike')}
            className={`p-3 rounded-full transition-colors duration-200 ${
              reaction === 'dislike' ? 'bg-itau-orange text-white' : 'bg-white border border-itau-gray-300 text-itau-gray-600 hover:bg-itau-gray-100'
            }`}
          >
            <ThumbsDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-itau-gray-700 mb-2">
          Comentários
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-itau-gray-300 rounded-md focus:ring-2 focus:ring-itau-orange focus:border-itau-orange"
          rows={4}
          placeholder="Compartilhe sua opinião..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-itau-orange text-white py-3 px-4 rounded-md hover:bg-itau-blue transition-colors duration-200 font-medium"
      >
        Enviar Feedback
      </button>
    </form>
  );
}