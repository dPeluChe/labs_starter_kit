import { useState } from "react";
import { Plus } from "lucide-react";
import { ColumnData } from "./index";
import RelationshipFields from "./RelationshipFields";

interface AddColumnFormProps {
  onAdd: (column: ColumnData) => void;
  availableTables: string[];
  existingColumns: string[];
  showNotification: (message: string, type: 'success' | 'error') => void;
}

export default function AddColumnForm({ 
  onAdd, 
  availableTables, 
  existingColumns,
  showNotification 
}: AddColumnFormProps) {
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("string");
  const [newRelationTable, setNewRelationTable] = useState("");
  const [newRelationType, setNewRelationType] = useState("oneToMany");
  
  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      showNotification("El nombre de la columna no puede estar vacío", "error");
      return;
    }
    
    // Check if column name already exists
    if (existingColumns.includes(newColumnName)) {
      showNotification("Ya existe una columna con ese nombre", "error");
      return;
    }
    
    // Create new column object
    const newColumn: ColumnData = { 
      name: newColumnName, 
      type: newColumnType, 
      isNew: true,
      relationTable: "",
      relationType: "oneToMany",
      isPrimaryKey: false,
      nullable: true,
      default: null
    };
    
    // If it's a relation, add the relation details
    if (newColumnType === "relation") {
      if (!newRelationTable) {
        showNotification("Debe seleccionar una tabla para la relación", "error");
        return;
      }
      newColumn.relationTable = newRelationTable;
      newColumn.relationType = newRelationType;
    }
    
    onAdd(newColumn);
    setNewColumnName("");
    setNewColumnType("string");
    setNewRelationTable("");
  };
  
  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h3 className="font-medium mb-3">Agregar Nueva Columna</h3>
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nombre</span>
          </label>
          <input 
            type="text" 
            className="input input-bordered w-full" 
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="nombre_columna"
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">Solo letras, números y guiones bajos</span>
          </label>
        </div>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Tipo</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={newColumnType}
            onChange={(e) => setNewColumnType(e.target.value)}
          >
            <option value="string">Texto</option>
            <option value="number">Número</option>
            <option value="boolean">Booleano</option>
            <option value="date">Fecha</option>
            <option value="relation">Relación</option>
          </select>
        </div>
        
        {newColumnType === "relation" && (
          <RelationshipFields
            relationTable={newRelationTable}
            relationType={newRelationType}
            availableTables={availableTables}
            onRelationTableChange={setNewRelationTable}
            onRelationTypeChange={setNewRelationType}
          />
        )}
        
        <button 
          className="btn btn-primary w-full md:w-auto"
          onClick={handleAddColumn}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </button>
      </div>
    </div>
  );
}