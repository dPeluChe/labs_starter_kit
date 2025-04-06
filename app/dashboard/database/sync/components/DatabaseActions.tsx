import { RefreshCw, Database, Plus } from "lucide-react";

interface DatabaseActionsProps {
  onSync: () => Promise<void>;
  isLoading: boolean;
  onCreateModel: () => void;
}

export default function DatabaseActions({ 
  onSync, 
  isLoading, 
  onCreateModel 
}: DatabaseActionsProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title flex items-center gap-2">
            <Database className="h-5 w-5" />
            Acciones de Base de Datos
          </h2>
          
          <button 
            className="btn btn-primary"
            onClick={onCreateModel}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Nuevo Modelo
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Acciones generales para la base de datos
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className="btn btn-primary"
            onClick={onSync}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs mr-2"></span>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sincronizar Base de Datos
          </button>
        </div>
      </div>
    </div>
  );
}