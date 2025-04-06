import { useState, useEffect } from 'react';
import { ArrowLeft, Save, RefreshCw, Plus } from 'lucide-react';
import FieldsList from './FieldsList';
import AddEditFieldModal from './AddEditFieldModal';
import JsonExampleModal from './JsonExampleModal';
import MissingFieldsAlert from './MissingFieldsAlert';

interface ModelEditorProps {
  tableName: string;
  columns: string[];
  columnStructure: any[];
  onSave: (tableName: string, columns: any[]) => Promise<void>;
  onCancel: () => void;
  allTables: string[];
}

export default function ModelEditor({
  tableName,
  columns,
  columnStructure,
  onSave,
  onCancel,
  allTables
}: ModelEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [missingStandardFields, setMissingStandardFields] = useState<string[]>([]);
  const [showJsonExample, setShowJsonExample] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<any>(null);
  const [editableColumns, setEditableColumns] = useState<any[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    nullable: 'NO',
    default_value: '',
    isRelation: false,
    relatedTable: ''
  });
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  
  // Initialize editable columns from columnStructure
  useEffect(() => {
    setEditableColumns([...columnStructure]);
  }, [columnStructure]);
  
  // Sort columns to put standard fields at the end
  const sortedColumns = [...editableColumns].sort((a, b) => {
    const aIsStandard = ['created_at', 'updated_at', 'is_active', 'metadata'].includes(a.name);
    const bIsStandard = ['created_at', 'updated_at', 'is_active', 'metadata'].includes(b.name);
    
    if (aIsStandard && !bIsStandard) return 1;
    if (!aIsStandard && bIsStandard) return -1;
    return 0;
  });
  
  useEffect(() => {
    // Check for missing standard fields
    const standardFields = ['created_at', 'updated_at', 'is_active', 'metadata'];
    const existingColumns = editableColumns.map(col => col.name.toLowerCase());
    const missing = standardFields.filter(field => !existingColumns.includes(field.toLowerCase()));
    setMissingStandardFields(missing);
  }, [editableColumns]);
  
  const validateTableStructure = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/db-sync/validate-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName })
      });
      
      if (!response.ok) {
        throw new Error(`Error validating table structure: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to validate table structure');
      }
      
      // Refresh the page to show updated structure
      window.location.reload();
      
    } catch (error) {
      console.error("Error validating table structure:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to show JSON example for a column
  const showJsonExampleForColumn = (column: any) => {
    setSelectedColumn(column);
    setShowJsonExample(true);
  };
  
  // Function to add a new field
  const addField = () => {
    setNewField({
      name: '',
      type: 'text',
      nullable: 'NO',
      default_value: '',
      isRelation: false,
      relatedTable: ''
    });
    setEditingFieldIndex(null);
    setShowAddFieldModal(true);
  };
  
  // Function to edit an existing field
  const editField = (index: number) => {
    const field = editableColumns[index];
    setNewField({
      name: field.name,
      type: field.type,
      nullable: field.nullable,
      default_value: field.default_value || '',
      isRelation: field.isRelation || false,
      relatedTable: field.relatedTable || ''
    });
    setEditingFieldIndex(index);
    setShowAddFieldModal(true);
  };
  
  // Function to remove a field
  const removeField = (index: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este campo?')) {
      const updatedColumns = [...editableColumns];
      updatedColumns.splice(index, 1);
      setEditableColumns(updatedColumns);
    }
  };
  
  // Function to save a new or edited field
  const saveField = (fieldData: any) => {
    // Validate field
    if (!fieldData.name) {
      alert('El nombre del campo es obligatorio');
      return;
    }
    
    // Format field name if it's a relation
    let fieldName = fieldData.name;
    if (fieldData.isRelation && !fieldName.endsWith('_id')) {
      fieldName = `${fieldName}_id`;
    }
    
    // Create the field object with proper structure for the API
    const fieldObject = {
      name: fieldName,
      type: fieldData.isRelation ? 'uuid' : fieldData.type,
      nullable: fieldData.nullable,
      default_value: fieldData.default_value || null,
      isRelation: fieldData.isRelation,
      relatedTable: fieldData.isRelation ? fieldData.relatedTable : null,
      // Add these properties to ensure compatibility with the API
      isNew: true,
      isPrimaryKey: false
    };
    
    console.log('Saving field:', fieldObject);
    
    // Update or add the field
    const updatedColumns = [...editableColumns];
    if (editingFieldIndex !== null) {
      updatedColumns[editingFieldIndex] = fieldObject;
    } else {
      updatedColumns.push(fieldObject);
    }
    
    setEditableColumns(updatedColumns);
    setShowAddFieldModal(false);
  };
  
  // Function to handle saving all changes
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Format columns for the API
      const formattedColumns = editableColumns.map(col => ({
        name: col.name,
        type: col.type,
        nullable: col.nullable === 'YES',
        default_value: col.default_value,
        isPrimaryKey: col.name === 'id',
        relationTable: col.relatedTable || null,
        relationType: col.isRelation ? 'belongs_to' : null,
        isNew: col.isNew || false
      }));
      
      console.log('Saving model with columns:', formattedColumns);
      
      await onSave(tableName, formattedColumns);
    } catch (error) {
      console.error('Error saving model:', error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="btn btn-sm btn-ghost gap-1"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <h2 className="text-xl font-bold">Editando Modelo: {tableName}</h2>
        <div className="flex gap-2">
          <button 
            className="btn btn-sm btn-outline gap-1"
            onClick={addField}
          >
            <Plus className="h-4 w-4" />
            Añadir Campo
          </button>
          <button 
            className="btn btn-sm btn-primary gap-1"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
      
      {missingStandardFields.length > 0 && (
        <MissingFieldsAlert 
          missingFields={missingStandardFields}
          onValidate={validateTableStructure}
          isLoading={isLoading}
        />
      )}
      
      <FieldsList 
        columns={sortedColumns}
        originalColumns={editableColumns}
        onEdit={editField}
        onRemove={removeField}
        onShowJsonExample={showJsonExampleForColumn}
      />
      
      {showAddFieldModal && (
        <AddEditFieldModal
          isEditing={editingFieldIndex !== null}
          fieldData={newField}
          allTables={allTables.filter(t => t !== tableName)}
          onSave={saveField}
          onCancel={() => setShowAddFieldModal(false)}
        />
      )}
      
      {showJsonExample && selectedColumn && (
        <JsonExampleModal
          column={selectedColumn}
          onClose={() => setShowJsonExample(false)}
        />
      )}
    </div>
  );
}