import React from 'react';
import { Layout, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminNav } from './AdminNav';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Layout className="w-8 h-8 text-itau-orange mr-2" />
            <h1 className="text-2xl font-bold text-itau-gray-800">Portal de Produtos Emergentes</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user && (user.role === 'admin' || user.role === 'member') && (
              <Link 
                to="/admin"
                className="flex items-center px-4 py-2 bg-itau-blue text-white rounded-md hover:bg-itau-orange transition-colors duration-200"
              >
                <Settings className="w-5 h-5 mr-2" />
                Administração
              </Link>
            )}
            <Link 
              to="/add"
              className="flex items-center px-4 py-2 bg-itau-orange text-white rounded-md hover:bg-itau-blue transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Produto
            </Link>
          </div>
        </div>
      </div>
      {user && (user.role === 'admin' || user.role === 'member') && <AdminNav />}
    </header>
  );
}