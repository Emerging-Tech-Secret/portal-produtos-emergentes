import React, { createContext, useContext, useState, useEffect } from 'react';

type DataMode = 'mock' | 'real';

interface DataModeContextType {
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

export function DataModeProvider({ children }: { children: React.ReactNode }) {
  const [dataMode, setDataMode] = useState<DataMode>(() => {
    const saved = localStorage.getItem('dataMode');
    return (saved as DataMode) || 'mock';
  });

  useEffect(() => {
    localStorage.setItem('dataMode', dataMode);
  }, [dataMode]);

  return (
    <DataModeContext.Provider value={{ dataMode, setDataMode }}>
      {children}
    </DataModeContext.Provider>
  );
}

export function useDataMode() {
  const context = useContext(DataModeContext);
  if (context === undefined) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  return context;
}