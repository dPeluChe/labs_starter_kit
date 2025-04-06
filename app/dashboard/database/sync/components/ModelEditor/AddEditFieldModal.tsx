import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddEditFieldModalProps {
  isEditing: boolean;
  fieldData: {
    name: string;
    type: string;
    nullable: string;
    default_value: string;
    isRelation: boolean;
    relatedTable: string;
  };
  allTables: string[];
  onSave: (fieldData: any) => void;
  onCancel: () => void;
}

export default function AddEditFieldModal({
  isEditing,
  fieldData,
  allTables,
  onSave,
  onCancel
}: AddEditFieldModalProps) {
  const [field, setField] = useState(fieldData);
  
  useEffect(() => {
    setField(fieldData);
  }, [fieldData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setField(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setField(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = () => {
    onSave(field);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {isEditing ? 'Editar Campo' : 'Añadir Nuevo Campo'}
            </h3>
            <button 
              className="btn btn-sm btn-circle"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre del Campo</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                name="name"
                value={field.name}
                onChange={handleChange}
                placeholder="Ej: name, description, price..."
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tipo de Dato</span>
              </label>
              <select 
                className="select select-bordered"
                name="type"
                value={field.type}
                onChange={handleChange}
                disabled={field.isRelation}
              >
                <option value="text">Texto (text)</option>
                <option value="varchar">Texto corto (varchar)</option>
                <option value="integer">Número entero (integer)</option>
                <option value="decimal">Número decimal (decimal)</option>
                <option value="boolean">Booleano (boolean)</option>
                <option value="date">Fecha (date)</option>
                <option value="timestamp">Fecha y hora (timestamp)</option>
                <option value="uuid">UUID</option>
                <option value="jsonb">JSON (jsonb)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">¿Puede ser nulo?</span>
              </label>
              <select 
                className="select select-bordered"
                name="nullable"
                value={field.nullable}
                onChange={handleChange}
              >
                <option value="NO">No</option>
                <option value="YES">Sí</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Valor por defecto</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                name="default_value"
                value={field.default_value}
                onChange={handleChange}
                placeholder="Ej: 0, 'texto', true..."
              />
            </div>
          </div>
          
          <div className="form-control mb-4">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox" 
                name="isRelation"
                checked={field.isRelation}
                onChange={handleCheckboxChange}
              />
              <span className="label-text">Este campo es una relación a otra tabla</span>
            </label>
          </div>
          
          {field.isRelation && (
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Tabla relacionada</span>
              </label>
              <select 
                className="select select-bordered"
                name="relatedTable"
                value={field.relatedTable}
                onChange={handleChange}
              >
                <option value="">Selecciona una tabla</option>
                {allTables.map((table, i) => (
                  <option key={i} value={table}>{table}</option>
                ))}
              </select>
              <label className="label">
                <span className="label-text-alt">
                  El nombre del campo se convertirá automáticamente a {field.name ? `${field.name}_id` : 'nombre_id'}
                </span>
              </label>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              className="btn btn-outline"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {isEditing ? 'Actualizar Campo' : 'Añadir Campo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}