import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, XCircle } from 'lucide-react';

interface ErrorDisplayProps {
  userMessage: string;
  technicalDetails?: string;
  onDismiss?: () => void;
}

export function ErrorDisplay({ userMessage, technicalDetails, onDismiss }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 max-w-md bg-white rounded-lg shadow-lg border border-red-200 p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-gray-700 font-medium">{userMessage}</p>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {technicalDetails && (
            <div className="mt-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-sm text-itau-blue hover:text-itau-orange transition-colors"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Ocultar detalhes técnicos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Ver detalhes técnicos
                  </>
                )}
              </button>
              
              {showDetails && (
                <pre className="mt-2 p-3 bg-gray-50 rounded-md text-xs text-gray-600 overflow-x-auto">
                  {technicalDetails}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}