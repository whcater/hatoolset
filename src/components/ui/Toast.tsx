import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' 
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
    } animate-in slide-in-from-right duration-300`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
        )}
        <span className={`text-sm font-medium ${
          type === 'success' 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {message}
        </span>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 ${
          type === 'success' 
            ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200' 
            : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}