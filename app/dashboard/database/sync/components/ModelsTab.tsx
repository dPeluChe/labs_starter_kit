import TablesPanel from "./TablesPanel";
import TableDataViewer from "./TableDataViewer";
import { useState, useEffect } from "react";
import { Plus, RefreshCw, Database, Edit, Eye, AlertTriangle, X, CheckCircle } from "lucide-react";
import ModelEditor from './ModelEditor/index';
// Remove this duplicate import
// import TableDataViewer from "./TableDataViewer";

interface ModelsTabProps {
  tables: string[];
  isLoading: boolean;
  selectedTable: string | null;
  tableData: any[];
  tableColumns: string[];
  isLoadingTableData: boolean;
  onSelectTable: (tableName: string | null) => void;
  onInsert: () => void;
  onCreateModel: () => void;
  onRefreshTables?: () => void;
  TableSkeletonComponent?: React.ComponentType<{ rows?: number, columns?: number }>;
}

export default function ModelsTab({
  tables,
  isLoading,
  selectedTable,
  tableData,
  tableColumns,
  isLoadingTableData,
  onSelectTable,
  onInsert,
  onCreateModel,
  onRefreshTables,
  TableSkeletonComponent
}: ModelsTabProps) {
  // Calculate table counts (this would ideally come from your API)
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  // Add state to track if we're editing a model
  const [editingTable, setEditingTable] = useState<string | null>(null);
  // Add state to track if we're viewing table data
  const [viewingTableData, setViewingTableData] = useState<string | null>(null);
  // Add state for table structure
  const [tableStructure, setTableStructure] = useState<any[]>([]);
  // Add state for loading and error
  const [isLoadingStructure, setIsLoadingStructure] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state for error alert
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Example of how you might calculate counts - replace with actual data
  useEffect(() => {
    // This is just a placeholder - in a real app, you'd get this from your backend
    const counts: Record<string, number> = {};
    tables.forEach(table => {
      counts[table] = Math.floor(Math.random() * 100); // Dummy data
    });
    setTableCounts(counts);
  }, [tables]);
  
  // Add state for missing standard fields
  const [missingStandardFields, setMissingStandardFields] = useState<string[]>([]);
  
  // Add state for cached table structures
  const [tableStructureCache, setTableStructureCache] = useState<Record<string, any[]>>({});
  
  // Add this function to fetch table structure
  const fetchTableStructure = async (tableName: string) => {
    setIsLoadingStructure(true);
    setError(null);
    setMissingStandardFields([]);
    
    try {
      console.log("Fetching structure for table:", tableName);
      
      // Check if we have a cached structure for this table from a previous edit
      if (tableStructureCache[tableName]) {
        console.log("Using cached table structure");
        setTableStructure(tableStructureCache[tableName]);
        
        // Check for missing standard fields
        const standardFields = ['created_at', 'updated_at', 'is_active', 'metadata'];
        const existingColumns = tableStructureCache[tableName].map((col: any) => col.name.toLowerCase());
        const missing = standardFields.filter(field => !existingColumns.includes(field.toLowerCase()));
        setMissingStandardFields(missing);
        
        setIsLoadingStructure(false);
        return;
      }
      
      const response = await fetch(`/api/db-sync/get-table-structure?table=${tableName}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching table structure: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Table structure API response:", data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch table structure');
      }
      
      // Format the column structure to match the expected format
      const formattedColumns = data.columns.map((col: any) => {
        // Preserve the original column data
        return {
          ...col,
          // Add additional properties that might be needed for the editor
          isRelation: col.name.endsWith('_id') && col.name !== 'id',
          relatedTable: col.name.endsWith('_id') ? col.name.replace('_id', '') : null,
          isStandardField: ['created_at', 'updated_at', 'is_active', 'metadata'].includes(col.name)
        };
      });
      
      // Update the state with the formatted column information
      setTableStructure(formattedColumns);
      
      // Check for missing standard fields
      const standardFields = ['created_at', 'updated_at', 'is_active', 'metadata'];
      const existingColumns = data.columns.map((col: any) => col.name.toLowerCase());
      const missing = standardFields.filter(field => !existingColumns.includes(field.toLowerCase()));
      setMissingStandardFields(missing);
      
      console.log('Table structure loaded:', formattedColumns);
      console.log('Missing standard fields:', missing);
    } catch (error) {
      console.error('Error loading table structure:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoadingStructure(false);
    }
  };
  
  // Handle editing a model
  const handleEdit = (tableName: string) => {
    setEditingTable(tableName);
    setViewingTableData(null);
    fetchTableStructure(tableName);
  };
  
  // Handle viewing table data
  const handleViewData = (tableName: string) => {
    setViewingTableData(tableName);
    setEditingTable(null);
    onSelectTable(tableName);
  };
  
  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTable(null);
    setTableStructure([]);
  };
  
  // Handle saving model changes
  const handleSaveModel = async (tableName: string, columns: any[]) => {
    console.log('ModelsTab - Saving model:', tableName, columns);
    
    try {
      // Log the request payload for debugging
      const payload = {
        tableName,
        columns
      };
      console.log('Request payload:', JSON.stringify(payload, null, 2));
      
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        console.log('Attempting to call API endpoint: /api/db-sync/update-model');
        
        // ACTUAL API CALL with better error handling
        try {
          const response = await fetch('/api/db-sync/update-model', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId); // Clear the timeout if fetch completes
          
          // Get the response text first for debugging
          const responseText = await response.text();
          console.log('Raw API response:', responseText);
          
          // Try to parse the response as JSON
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
          }
          
          if (!response.ok) {
            console.error('API returned error status:', response.status);
            throw new Error(`Error updating model: ${response.status} - ${data?.error || responseText.substring(0, 100) || 'Unknown error'}`);
          }
          
          console.log('Model update response:', data);
          
          if (!data.success) {
            throw new Error(data.error || 'Failed to update model');
          }
          
          // Update the cache with the new structure
          setTableStructureCache(prev => ({
            ...prev,
            [tableName]: columns
          }));
          
          // Show a success message to the user
          setErrorMessage(`Modelo "${tableName}" actualizado correctamente`);
          setShowErrorAlert(true);
          
          // After saving, exit edit mode
          setEditingTable(null);
          setTableStructure([]);
          
          // Refresh tables
          if (onRefreshTables) {
            onRefreshTables();
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          
          // FALLBACK: Use mock success for now
          console.warn('Using fallback mock success due to API failure');
          
          // Update the cache with the new structure
          setTableStructureCache(prev => ({
            ...prev,
            [tableName]: columns
          }));
          
          // Show a warning message to the user
          setErrorMessage(`Modelo "${tableName}" actualizado en modo simulación (API no disponible). Los cambios no persistirán al recargar la página.`);
          setShowErrorAlert(true);
          
          // After saving, exit edit mode
          setEditingTable(null);
          setTableStructure([]);
          
          // Refresh tables
          if (onRefreshTables) {
            onRefreshTables();
          }
          
          // Log the error for debugging
          console.error('Original API error:', apiError);
        }
      } catch (fetchError) {
        // Handle fetch-specific errors
        if (fetchError.name === 'AbortError') {
          throw new Error('La solicitud ha expirado. El servidor tardó demasiado en responder.');
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Error saving model:', error);
      // Replace alert with custom error display
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setShowErrorAlert(true);
    } finally {
      // Any cleanup code if needed
    }
  };
  
  // Render the appropriate content based on state
  let content;
  
  if (editingTable) {
    // Show model editor
    content = (
      <ModelEditor
        tableName={editingTable}
        columns={[]}
        columnStructure={tableStructure}
        onSave={handleSaveModel}
        onCancel={() => setEditingTable(null)}
        allTables={tables}
      />
    );
  } else if (viewingTableData) {
    // Show table data viewer
    content = (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="btn btn-sm btn-ghost gap-1"
            onClick={() => {
              setViewingTableData(null);
              onSelectTable(null);
            }}
          >
            <Database className="h-4 w-4" />
            Volver a Modelos
          </button>
          <h2 className="text-xl font-bold">Datos de {viewingTableData}</h2>
        </div>
        
        <TableDataViewer
          tableName={viewingTableData}
          data={tableData}
          columns={tableColumns}
          isLoading={isLoadingTableData}
          onInsert={onInsert}
          TableSkeletonComponent={TableSkeletonComponent}
        />
      </div>
    );
  } else {
    // Show models list
    content = (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tablas Existentes</h2>
          <div className="flex gap-2">
            <button 
              className="btn btn-sm btn-outline gap-1"
              onClick={onRefreshTables}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualizar
            </button>
            <button 
              className="btn btn-sm btn-primary gap-1"
              onClick={onCreateModel}
            >
              <Plus className="h-4 w-4" />
              Crear Nuevo Modelo
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Nombre de la Tabla</th>
                <th>Total Registros</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                    <span className="mt-2 block">Cargando tablas...</span>
                  </td>
                </tr>
              ) : tables.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No se encontraron tablas en la base de datos
                  </td>
                </tr>
              ) : (
                tables.map((table, index) => (
                  <tr key={index}>
                    <td>{table}</td>
                    <td>{tableCounts[table] || 0}</td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-xs btn-outline gap-1"
                          onClick={() => handleViewData(table)}
                        >
                          <Eye className="h-3 w-3" />
                          Ver Datos
                        </button>
                        <button 
                          className="btn btn-xs btn-outline gap-1"
                          onClick={() => handleEdit(table)}
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {content}
      
      {/* Alert Modal (for both errors and success) */}
      {showErrorAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start mb-4">
              <div className={`p-2 rounded-full ${errorMessage.includes('actualizado correctamente') ? 'bg-success bg-opacity-20' : 'bg-error bg-opacity-20'}`}>
                {errorMessage.includes('actualizado correctamente') ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-error" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold">
                  {errorMessage.includes('actualizado correctamente') ? 'Éxito' : 'Error'}
                </h3>
                <p className="text-base-content/70">{errorMessage}</p>
              </div>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setShowErrorAlert(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                className={`btn ${errorMessage.includes('actualizado correctamente') ? 'btn-success' : 'btn-error'}`}
                onClick={() => setShowErrorAlert(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}