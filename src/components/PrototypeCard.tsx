import React, { useState } from 'react';
import { Star, ExternalLink, MessageCircle, RefreshCw } from 'lucide-react';
import { Prototype } from '../types';
import { generateImage } from '../services/openai';
import { useError } from '../contexts/ErrorContext';

interface Props {
  prototype: Prototype;
  onClick: (id: string) => void;
}

export function PrototypeCard({ prototype, onClick }: Props) {
  const [imageUrl, setImageUrl] = useState(prototype.imageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const { showError } = useError();

  const handleRegenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      const newImageUrl = await generateImage(prototype.description);
      if (newImageUrl) {
        setImageUrl(newImageUrl);
      } else {
        showError(
          'Não foi possível gerar uma nova imagem.',
          'OpenAI API não está configurada ou ocorreu um erro na geração.'
        );
      }
    } catch (error) {
      showError(
        'Erro ao gerar nova imagem.',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden border border-itau-gray-200"
      onClick={() => onClick(prototype.id)}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={prototype.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleRegenerateImage}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-itau-gray-100 transition-colors duration-200"
          disabled={isGenerating}
        >
          <RefreshCw className={`w-5 h-5 text-itau-orange ${isGenerating ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-itau-gray-800">{prototype.title}</h3>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-itau-orange fill-current" />
            <span className="ml-1 text-itau-gray-600">{prototype.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-itau-gray-600 mb-4 line-clamp-2">{prototype.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {prototype.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-itau-gray-100 text-itau-blue rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 text-itau-gray-500" />
            <span className="ml-1 text-itau-gray-600">Feedback</span>
          </div>
          {prototype.demoUrl && (
            <a 
              href={prototype.demoUrl}
              className="flex items-center text-itau-orange hover:text-itau-blue"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}