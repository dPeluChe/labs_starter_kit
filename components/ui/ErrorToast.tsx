import { useEffect, useState } from 'react';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export type ToastSeverity = 'error' | 'warning' | 'info' | 'success';

interface ErrorToastProps {
  message: string;
  severity?: ToastSeverity;
  duration?: number;
  onClose?: () => void;
}

export default function ErrorToast({ 
  message, 
  severity = 'error', 
  duration = 5000, 
  onClose 
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'info':
        return <Info className="h-5 w-5 text-info" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <AlertCircle className="h-5 w-5 text-error" />;
    }
  };

  const getToastClass = () => {
    const baseClass = "fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg z-50 max-w-md";
    switch (severity) {
      case 'error':
        return `${baseClass} bg-error/10 border border-error text-error`;
      case 'warning':
        return `${baseClass} bg-warning/10 border border-warning text-warning`;
      case 'info':
        return `${baseClass} bg-info/10 border border-info text-info`;
      case 'success':
        return `${baseClass} bg-success/10 border border-success text-success`;
      default:
        return `${baseClass} bg-error/10 border border-error text-error`;
    }
  };

  return (
    <div className={getToastClass()}>
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="ml-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}