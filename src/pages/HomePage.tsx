import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { TagFilter } from '../components/TagFilter';
import { PrototypeCard } from '../components/PrototypeCard';
import { FeedbackForm } from '../components/FeedbackForm';
import { getPrototypes } from '../services/prototypes';
import { createFeedback } from '../services/feedback';
import { useDataMode } from '../contexts/DataModeContext';
import { useError } from '../contexts/ErrorContext';
import { Prototype } from '../types';

export function HomePage() {
  const { dataMode } = useDataMode();
  const { showError } = useError();
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [selectedPrototype, setSelectedPrototype] = useState<Prototype | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrototypes();
  }, [dataMode]);

  async function loadPrototypes() {
    try {
      setLoading(true);
      const data = await getPrototypes(dataMode === 'mock');
      setPrototypes(data);
    } catch (error) {
      showError(
        'Não foi possível carregar os produtos no momento. Por favor, tente novamente mais tarde.',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  const allTags = Array.from(
    new Set(prototypes.flatMap((p) => p.tags))
  );

  const filteredPrototypes = prototypes.filter((prototype) => {
    const matchesSearch = prototype.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prototype.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every((tag) => prototype.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFeedbackSubmit = async (feedback: any) => {
    try {
      await createFeedback({
        ...feedback,
        userId: 'temp-user-id',
      }, dataMode === 'mock');
      setSelectedPrototype(null);
      loadPrototypes();
    } catch (error) {
      showError(
        'Não foi possível enviar seu feedback. Por favor, tente novamente.',
        error instanceof Error ? error.stack : String(error)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrototypes.map((prototype) => (
          <PrototypeCard
            key={prototype.id}
            prototype={prototype}
            onClick={() => setSelectedPrototype(prototype)}
          />
        ))}
      </div>

      {selectedPrototype && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPrototype.title}
                </h2>
                <button
                  onClick={() => setSelectedPrototype(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <FeedbackForm
                prototypeId={selectedPrototype.id}
                onSubmit={handleFeedbackSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}