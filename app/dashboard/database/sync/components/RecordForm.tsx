import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

interface RecordFormProps {
  tableName: string | null; // Allow null for tableName
  columns: string[];
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  relatedTables?: Record<string, string[]>; 
  allTables?: string[];
}

export default function RecordForm({
  tableName,
  columns,
  onSave,
  onCancel,
  relatedTables = {},
  allTables = []
}: RecordFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [relations, setRelations] = useState<Record<string, string>>({});
  
  // Initialize form data when columns change
  useEffect(() => {
    if (!columns || columns.length === 0) return;
    
    const initialData: Record<string, any> = {};
    columns.forEach(col => {
      initialData[col] = "";
    });
    setFormData(initialData);
  }, [columns]);
  
  const handleChange = (column: string, value: any) => {
    setFormData({
      ...formData,
      [column]: value
    });
  };
  
  const handleRelationChange = (column: string, relatedTable: string) => {
    setRelations({
      ...relations,
      [column]: relatedTable
    });
  };
  
  const handleSave = async () => {
    if (!tableName) {
      console.error("Cannot save record: No table selected");
      return;
    }
    
    setIsSaving(true);
    try {
      const dataWithRelations = {
        ...formData,
        _relations: relations
      };
      await onSave(dataWithRelations);
    } catch (error) {
      console.error("Error saving record:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show an error message if no table is selected
  if (!tableName) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="alert alert-error">
          <AlertCircle className="h-5 w-5" />
          <span>Error: No se ha seleccionado ninguna tabla</span>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            className="btn btn-outline"
            onClick={onCancel}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  
  // Show an error message if no columns are available
  if (!columns || columns.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          Agregar Registro a {tableName}
        </h2>
        <div className="alert alert-warning">
          <AlertCircle className="h-5 w-5" />
          <span>No se encontraron columnas para esta tabla</span>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            className="btn btn-outline"
            onClick={onCancel}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        Agregar Registro a {tableName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map(column => (
          <div key={column} className="form-control w-full">
            <label className="label">
              <span className="label-text">{column}</span>
            </label>
            
            {relatedTables[column] ? (
              <div className="flex flex-col gap-2">
                <select 
                  className="select select-bordered"
                  value={relations[column] || ""}
                  onChange={(e) => handleRelationChange(column, e.target.value)}
                >
                  <option value="">Seleccionar relación</option>
                  {allTables.map(table => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
                
                {relations[column] && (
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    placeholder="ID del registro relacionado"
                    value={formData[column] || ""}
                    onChange={(e) => handleChange(column, e.target.value)}
                  />
                )}
              </div>
            ) : (
              <input 
                type="text" 
                className="input input-bordered" 
                value={formData[column] || ""}
                onChange={(e) => handleChange(column, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          className="btn btn-outline mr-2"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loading loading-spinner loading-xs mr-2"></span>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Guardar
        </button>
      </div>
    </div>
  );
}