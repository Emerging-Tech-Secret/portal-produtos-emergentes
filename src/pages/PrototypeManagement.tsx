import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
import { Prototype } from '../types';
import { getPrototypes, deletePrototype } from '../services/prototypes';

export function PrototypeManagement() {
  const { user } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();
  const [prototypes, setPrototypes] = useState<Prototype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrototypes();
  }, []);

  async function loadPrototypes() {
    try {
      setLoading(true);
      const data = await getPrototypes(false);
      // Filter prototypes based on user role
      const filteredData = user?.role === 'admin' 
        ? data 
        : data.filter(p => p.authorId === user?.id);
      setPrototypes(filteredData);
    } catch (error) {
      showError(
        'Não foi possível carregar os produtos.',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await deletePrototype(id);
      setPrototypes(prototypes.filter(p => p.id !== id));
    } catch (error) {
      showError(
        'Erro ao excluir o produto.',
        error instanceof Error ? error.stack : String(error)
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-itau-gray-800">
          Gestão de Produtos
        </h1>
        <button
          onClick={() => navigate('/admin/prototypes/new')}
          className="flex items-center gap-2 px-4 py-2 bg-itau-orange text-white rounded-md hover:bg-itau-blue transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prototypes.map(prototype => (
          <div key={prototype.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={prototype.imageUrl} 
              alt={prototype.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-itau-gray-800 mb-2">
                {prototype.title}
              </h3>
              <p className="text-itau-gray-600 mb-4 line-clamp-2">
                {prototype.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {prototype.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-itau-gray-100 text-itau-blue rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/prototypes/edit/${prototype.id}`)}
                    className="p-2 text-itau-gray-400 hover:text-itau-orange transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(prototype.id)}
                    className="p-2 text-itau-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/admin/pmf/${prototype.id}`)}
                  className="flex items-center gap-1 text-itau-orange hover:text-itau-blue transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Análise PMF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}