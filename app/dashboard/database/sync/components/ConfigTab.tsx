import DatabaseActions from "./DatabaseActions";
import ModelsPanel from "./ModelsPanel";

interface ConfigTabProps {
  models: any[];
  isLoading: boolean;
  onSync: () => Promise<void>;
  onSyncModel: (modelName: string) => Promise<void>;
}

export default function ConfigTab({
  models,
  isLoading,
  onSync,
  onSyncModel
}: ConfigTabProps) {
  console.log("ConfigTab rendering with models:", models);
  
  return (
    <div>
      {/* Acciones de base de datos */}
      <DatabaseActions 
        onSync={onSync} 
        isLoading={isLoading}
        onCreateModel={() => {}} // No needed here as it's in the Models tab
      />
      
      <div className="mt-8">
        {/* Panel de modelos predefinidos */}
        <ModelsPanel 
          models={models}
          onSyncModel={onSyncModel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}