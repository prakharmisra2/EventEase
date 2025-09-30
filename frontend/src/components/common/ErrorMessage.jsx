import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start mb-4">
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-3 text-red-600 hover:text-red-800">
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;