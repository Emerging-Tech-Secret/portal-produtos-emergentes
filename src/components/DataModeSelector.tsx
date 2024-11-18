import React from 'react';
import { Database, FileText } from 'lucide-react';
import { useDataMode } from '../contexts/DataModeContext';

export function DataModeSelector() {
  const { dataMode, setDataMode } = useDataMode();

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-itau-gray-200">
      <div className="flex gap-4">
        <button
          onClick={() => setDataMode('mock')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            dataMode === 'mock'
              ? 'bg-itau-orange text-white'
              : 'bg-white text-itau-gray-700 border border-itau-gray-300 hover:bg-itau-gray-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          Produtos Exemplo
        </button>
        <button
          onClick={() => setDataMode('real')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            dataMode === 'real'
              ? 'bg-itau-orange text-white'
              : 'bg-white text-itau-gray-700 border border-itau-gray-300 hover:bg-itau-gray-100'
          }`}
        >
          <Database className="w-5 h-5" />
          Produtos Reais
        </button>
      </div>
    </div>
  );
}