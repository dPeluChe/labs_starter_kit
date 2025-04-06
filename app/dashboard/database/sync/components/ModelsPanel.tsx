import { RefreshCw } from "lucide-react";
import { AvailableModel } from "../types";

interface ModelsPanelProps {
  models: AvailableModel[];  // Cambiado de availableModels a models
  isLoading: boolean;
  onSyncModel: (modelName: string) => Promise<void>;  // Cambiado de syncSpecificModel a onSyncModel
}

export default function ModelsPanel({ models, onSyncModel, isLoading }: ModelsPanelProps) {
  // Add a check to ensure models is defined before mapping
  const modelsList = models || [];
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Modelos Predefinidos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sincroniza modelos predefinidos con la base de datos
        </p>
        
        <div className="space-y-4">
          {modelsList.map((model) => (
            <div key={model.name} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-gray-500">{model.description}</p>
                </div>
                <button
                  className={`btn btn-sm ${model.exists ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => onSyncModel(model.name)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : model.exists ? (
                    'Actualizar'
                  ) : (
                    'Sincronizar'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}