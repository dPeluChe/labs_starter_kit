import { X, Plus, Trash2, Save, RefreshCw, Link2 } from "lucide-react";
import { ModelField } from "../types";

interface CreateModelModalProps {
  modelName: string;
  setModelName: (name: string) => void;
  modelFields: ModelField[];
  existingTables: string[];
  isLoading: boolean;
  addField: () => void;
  updateField: (index: number, field: ModelField) => void;
  removeField: (index: number) => void;
  createModel: () => Promise<void>;
  setShowCreateModel: (show: boolean) => void;
}

export default function CreateModelModal({
  modelName,
  setModelName,
  modelFields,
  existingTables,
  isLoading,
  addField,
  updateField,
  removeField,
  createModel,
  setShowCreateModel
}: CreateModelModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Crear Nuevo Modelo</h3>
            <button 
              className="btn btn-sm btn-circle"
              onClick={() => setShowCreateModel(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nombre del Modelo</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered" 
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Ej: products, users, orders..."
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Campos del Modelo</h4>
              <button 
                className="btn btn-sm btn-outline"
                onClick={addField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir Campo
              </button>
            </div>
            
            {modelFields.length === 0 ? (
              <div className="alert alert-info">
                <span>Añade al menos un campo al modelo.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {modelFields.map((field, index) => (
                  <div key={index} className="card bg-base-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Nombre del Campo</span>
                        </label>
                        <input 
                          type="text" 
                          className="input input-bordered" 
                          value={field.name}
                          onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                          placeholder="Ej: id, name, price..."
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Tipo de Dato</span>
                        </label>
                        <select 
                          className="select select-bordered w-full"
                          value={field.type}
                          onChange={(e) => updateField(index, { ...field, type: e.target.value })}
                        >
                          <option value="text">Texto (text)</option>
                          <option value="integer">Entero (integer)</option>
                          <option value="bigint">Entero Grande (bigint)</option>
                          <option value="decimal">Decimal (decimal)</option>
                          <option value="boolean">Booleano (boolean)</option>
                          <option value="jsonb">JSON (jsonb)</option>
                          <option value="timestamp with time zone">Fecha y Hora (timestamp)</option>
                          <option value="uuid">UUID</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="form-control">
                        <label className="cursor-pointer label justify-start gap-2">
                          <input 
                            type="checkbox" 
                            className="checkbox" 
                            checked={field.isPrimary}
                            onChange={(e) => updateField(index, { ...field, isPrimary: e.target.checked })}
                          />
                          <span className="label-text">Clave Primaria</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="cursor-pointer label justify-start gap-2">
                          <input 
                            type="checkbox" 
                            className="checkbox" 
                            checked={field.isNullable}
                            onChange={(e) => updateField(index, { ...field, isNullable: e.target.checked })}
                            disabled={field.isPrimary}
                          />
                          <span className="label-text">Permite NULL</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="cursor-pointer label justify-start gap-2">
                          <input 
                            type="checkbox" 
                            className="checkbox" 
                            checked={field.isUnique}
                            onChange={(e) => updateField(index, { ...field, isUnique: e.target.checked })}
                            disabled={field.isPrimary}
                          />
                          <span className="label-text">Valor Único</span>
                        </label>
                      </div>
                    </div>
                    
                    {existingTables.length > 0 && (
                      <div className="mt-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text flex items-center gap-1">
                              <Link2 className="h-4 w-4" />
                              Referencia (Clave Foránea)
                            </span>
                          </label>
                          <select 
                            className="select select-bordered w-full"
                            value={field.references ? `${field.references.table}.${field.references.column}` : ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value) {
                                const [table, column] = value.split('.');
                                updateField(index, { 
                                  ...field, 
                                  references: { table, column } 
                                });
                              } else {
                                const { references, ...rest } = field;
                                updateField(index, rest);
                              }
                            }}
                          >
                            <option value="">Sin referencia</option>
                            {existingTables.map(table => (
                              <option key={table} value={`${table}.id`}>
                                {table}.id
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-4">
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => removeField(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Campo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              className="btn btn-outline"
              onClick={() => setShowCreateModel(false)}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary"
              onClick={createModel}
              disabled={isLoading || modelFields.length === 0 || !modelName}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Modelo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}