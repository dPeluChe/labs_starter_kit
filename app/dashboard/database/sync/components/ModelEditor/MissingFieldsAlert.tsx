import { AlertTriangle, RefreshCw } from 'lucide-react';

interface MissingFieldsAlertProps {
  missingFields: string[];
  onValidate: () => Promise<void>;
  isLoading: boolean;
}

export default function MissingFieldsAlert({ 
  missingFields, 
  onValidate, 
  isLoading 
}: MissingFieldsAlertProps) {
  return (
    <div className="alert alert-warning mb-4">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <h3 className="font-bold">Campos estándar faltantes</h3>
        <div className="text-sm">
          Este modelo no tiene los siguientes campos estándar: 
          <span className="font-semibold">{missingFields.join(', ')}</span>
        </div>
      </div>
      <button 
        className="btn btn-sm btn-warning"
        onClick={onValidate}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin mr-1" />
            Validando...
          </>
        ) : (
          'Validar Estructura'
        )}
      </button>
    </div>
  );
}