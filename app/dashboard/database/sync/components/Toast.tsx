import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number; // in milliseconds
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    // Clear timeout on unmount
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  
  return (
    <div className={`fixed top-20 right-4 z-50 max-w-md animate-slide-in-right`}>
      <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            {type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{message}</span>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-ghost btn-xs btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}