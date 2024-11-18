import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-itau-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Buscar produtos emergentes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-itau-gray-300 rounded-md focus:ring-2 focus:ring-itau-orange focus:border-itau-orange text-itau-gray-700 placeholder-itau-gray-500"
      />
    </div>
  );
}