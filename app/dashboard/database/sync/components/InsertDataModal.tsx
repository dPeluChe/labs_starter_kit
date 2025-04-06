import { X, Save, RefreshCw, Calendar, Hash, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import LinearProgress from "@/components/ui/LinearProgress";
import TableSkeleton from "@/components/ui/TableSkeleton";

interface InsertDataModalProps {
  selectedTable: string;
  tableColumns: string[];
  newRowData: Record<string, any>;
  setNewRowData: (data: Record<string, any>) => void;
  isLoading: boolean;
  insertRow: () => Promise<void>;
  setShowInsertForm: (show: boolean) => void;
}

export default function InsertDataModal({
  selectedTable,
  tableColumns,
  newRowData,
  setNewRowData,
  isLoading,
  insertRow,
  setShowInsertForm
}: InsertDataModalProps) {
  const [localLoading, setLocalLoading] = useState(true);
  const [validatedColumns, setValidatedColumns] = useState<string[]>([]);
  const [showValidateButton, setShowValidateButton] = useState(false);
  
  // Load and validate columns when the modal opens
  useEffect(() => {
    const validateColumns = async () => {
      setLocalLoading(true);
      try {
        // Check if the table structure exists in the database
        const response = await fetch(`/api/db-sync/get-table-structure?table=${selectedTable}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.columns) {
            // Get actual column names from the database
            const actualColumns = data.columns.map((col: any) => col.name);
            setValidatedColumns(actualColumns);
            
            // Check if there are differences between tableColumns and actualColumns
            const missingColumns = actualColumns.filter(col => !tableColumns.includes(col));
            const extraColumns = tableColumns.filter(col => !actualColumns.includes(col));
            
            if (missingColumns.length > 0 || extraColumns.length > 0) {
              setShowValidateButton(true);
            }
          }
        }
      } catch (error) {
        console.error("Error validating columns:", error);
      } finally {
        // Simulate a short loading time for better UX
        setTimeout(() => setLocalLoading(false), 500);
      }
    };
    
    validateColumns();
  }, [selectedTable, tableColumns]);
  
  // Function to validate and update the table structure
  const validateTableStructure = async () => {
    setLocalLoading(true);
    try {
      // Call the API to validate and update the table structure
      const response = await fetch('/api/db-sync/validate-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName: selectedTable })
      });
      
      if (!response.ok) {
        throw new Error(`Error validating table structure: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to validate table structure');
      }
      
      // Update the validated columns
      if (data.columns) {
        const updatedColumns = data.columns.map((col: any) => col.name);
        setValidatedColumns(updatedColumns);
        
        // Update the newRowData with the validated columns
        const updatedRowData: Record<string, any> = {};
        updatedColumns.forEach(col => {
          updatedRowData[col] = newRowData[col] || "";
        });
        
        setNewRowData(updatedRowData);
      }
      
      setShowValidateButton(false);
      
    } catch (error) {
      console.error("Error validating table structure:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Determine field types based on column names and values
  const getFieldType = (columnName: string) => {
    const lowerName = columnName.toLowerCase();
    
    if (lowerName === 'id' || lowerName.endsWith('_id') || lowerName.includes('uuid')) {
      return 'uuid';
    } else if (
      lowerName.includes('date') || 
      lowerName.includes('time') || 
      lowerName === 'created_at' || 
      lowerName === 'updated_at'
    ) {
      return 'datetime';
    } else if (lowerName.includes('is_') || lowerName.startsWith('has_') || lowerName.startsWith('is')) {
      return 'boolean';
    } else if (lowerName.includes('json') || lowerName === 'metadata' || lowerName === 'settings') {
      return 'json';
    }
    
    return 'text';
  };

  // Generate UUID
  const generateUUID = (columnName: string) => {
    setNewRowData({
      ...newRowData,
      [columnName]: uuidv4()
    });
  };

  // Set current date/time
  const setCurrentDateTime = (columnName: string) => {
    const now = new Date().toISOString();
    setNewRowData({
      ...newRowData,
      [columnName]: now
    });
  };

  // Use validated columns if available, otherwise use the provided tableColumns
  const columnsToUse = validatedColumns.length > 0 ? validatedColumns : tableColumns;

  // Group columns by category for better organization
  const groupedColumns = {
    id: columnsToUse.filter(col => col.toLowerCase() === 'id'),
    primary: columnsToUse.filter(col => 
      col.toLowerCase().endsWith('_id') && col.toLowerCase() !== 'id'
    ),
    dates: columnsToUse.filter(col => 
      getFieldType(col) === 'datetime' && !['created_at', 'updated_at'].includes(col.toLowerCase())
    ),
    system: columnsToUse.filter(col => 
      ['created_at', 'updated_at'].includes(col.toLowerCase())
    ),
    boolean: columnsToUse.filter(col => 
      getFieldType(col) === 'boolean'
    ),
    json: columnsToUse.filter(col => 
      getFieldType(col) === 'json'
    ),
    other: columnsToUse.filter(col => 
      !['id'].includes(col.toLowerCase()) && 
      !col.toLowerCase().endsWith('_id') && 
      getFieldType(col) !== 'datetime' &&
      getFieldType(col) !== 'boolean' &&
      getFieldType(col) !== 'json'
    )
  };

  // Render input field based on column type
  const renderInputField = (column: string) => {
    const fieldType = getFieldType(column);
    
    switch (fieldType) {
      case 'uuid':
        return (
          <div className="flex gap-2">
            <input 
              type="text" 
              className="input input-bordered flex-1" 
              value={newRowData[column] || ""}
              onChange={(e) => setNewRowData({
                ...newRowData,
                [column]: e.target.value
              })}
              placeholder={`UUID para ${column}`}
            />
            <button 
              type="button"
              className="btn btn-outline btn-square"
              onClick={() => generateUUID(column)}
              title="Generar UUID"
            >
              <Hash className="h-4 w-4" />
            </button>
          </div>
        );
        
      case 'datetime':
        return (
          <div className="flex gap-2">
            <input 
              type="datetime-local" 
              className="input input-bordered flex-1" 
              value={newRowData[column]?.slice(0, 16) || ""}
              onChange={(e) => setNewRowData({
                ...newRowData,
                [column]: e.target.value ? new Date(e.target.value).toISOString() : ""
              })}
            />
            <button 
              type="button"
              className="btn btn-outline btn-square"
              onClick={() => setCurrentDateTime(column)}
              title="Usar fecha actual"
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        );
        
      case 'boolean':
        return (
          <select 
            className="select select-bordered w-full"
            value={newRowData[column] || ""}
            onChange={(e) => setNewRowData({
              ...newRowData,
              [column]: e.target.value === "true" ? true : 
                        e.target.value === "false" ? false : ""
            })}
          >
            <option value="">Seleccionar</option>
            <option value="true">Verdadero</option>
            <option value="false">Falso</option>
          </select>
        );
        
      case 'json':
        return (
          <textarea 
            className="textarea textarea-bordered w-full h-24 font-mono text-sm"
            value={newRowData[column] ? 
                  (typeof newRowData[column] === 'object' ? 
                   JSON.stringify(newRowData[column], null, 2) : 
                   newRowData[column]) : 
                  ""}
            onChange={(e) => {
              try {
                // Try to parse as JSON if it looks like JSON
                const value = e.target.value.trim().startsWith('{') ? 
                              JSON.parse(e.target.value) : 
                              e.target.value;
                setNewRowData({
                  ...newRowData,
                  [column]: value
                });
              } catch (err) {
                // If not valid JSON, store as string
                setNewRowData({
                  ...newRowData,
                  [column]: e.target.value
                });
              }
            }}
            placeholder={`JSON para ${column}`}
          />
        );
        
      default:
        return (
          <input 
            type="text" 
            className="input input-bordered w-full" 
            value={newRowData[column] || ""}
            onChange={(e) => setNewRowData({
              ...newRowData,
              [column]: e.target.value
            })}
            placeholder={`Valor para ${column}`}
          />
        );
    }
  };

  // Render a section of fields
  const renderFieldSection = (title: string, columns: string[]) => {
    if (columns.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="font-medium text-sm uppercase text-gray-500 mb-2">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map((column) => (
            <div key={column} className="form-control">
              <label className="label">
                <span className="label-text font-medium">{column}</span>
              </label>
              {renderInputField(column)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Add LinearProgress at the top */}
        <LinearProgress isLoading={localLoading || isLoading} color="bg-primary" height={3} />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold">Insertar Datos en {selectedTable}</h3>
            <button 
              className="btn btn-sm btn-circle"
              onClick={() => setShowInsertForm(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Show validation button if needed */}
          {showValidateButton && (
            <div className="alert alert-warning mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>La estructura de la tabla puede haber cambiado. Algunos campos pueden faltar o sobrar.</span>
              <button 
                className="btn btn-sm btn-warning ml-auto"
                onClick={validateTableStructure}
                disabled={localLoading}
              >
                Validar Estructura
              </button>
            </div>
          )}
          
          {/* Show skeleton loader while loading */}
          {localLoading ? (
            <div className="space-y-4">
              <TableSkeleton rows={3} columns={2} />
            </div>
          ) : (
            <div className="space-y-2">
              {renderFieldSection("Identificadores", groupedColumns.id)}
              {renderFieldSection("Claves Foráneas", groupedColumns.primary)}
              {renderFieldSection("Datos Principales", groupedColumns.other)}
              {renderFieldSection("Fechas", groupedColumns.dates)}
              {renderFieldSection("Valores Booleanos", groupedColumns.boolean)}
              {renderFieldSection("Datos JSON", groupedColumns.json)}
              {renderFieldSection("Campos del Sistema", groupedColumns.system)}
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-8 pt-4 border-t">
            <button 
              className="btn btn-outline"
              onClick={() => setShowInsertForm(false)}
              disabled={localLoading || isLoading}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary"
              onClick={insertRow}
              disabled={localLoading || isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Insertando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Insertar Datos
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}