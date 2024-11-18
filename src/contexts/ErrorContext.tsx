import React, { createContext, useContext, useState } from 'react';

interface ErrorState {
  userMessage: string;
  technicalDetails?: string;
}

interface ErrorContextType {
  error: ErrorState | null;
  setError: (error: ErrorState | null) => void;
  showError: (userMessage: string, technicalDetails?: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorState | null>(null);

  const showError = (userMessage: string, technicalDetails?: string) => {
    setError({ userMessage, technicalDetails });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setError, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}