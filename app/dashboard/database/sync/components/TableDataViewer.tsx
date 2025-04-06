import { FileText, X, Plus, RefreshCw, AlertCircle, ArrowLeft, Edit, Database, Code } from "lucide-react";
import { useState, useEffect } from "react";

// Update the interface to include onCreateModel
interface TableDataViewerProps {
  tableName: string | null;
  data: any[];
  columns: string[];
  isLoading: boolean;
  onInsert: () => void;
  tables?: string[];
  onSelectTable?: (tableName: string | null) => void; // Updated to accept null
  onRefresh?: () => void;
  tableCounts?: Record<string, number>;
  onCreateModel?: () => void; // Add this prop
}

// New component for the data view
const DataView = ({ 
  tableName, 
  data, 
  columns, 
  isLoading, 
  onInsert,
  onBack 
}: TableDataViewerProps & { onBack: () => void }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button 
          className="btn btn-ghost btn-sm"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>
        <h2 className="text-xl font-bold">
          Datos de {tableName}
        </h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={`${index}-${column}`}>
                      {row[column] !== null && row[column] !== undefined
                        ? String(row[column])
                        : <span className="text-gray-400">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          <div>
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>No hay datos en esta tabla</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button 
          className="btn btn-primary"
          onClick={onInsert}
        >
          <Plus className="h-4 w-4 mr-2" />
          Insertar Datos
        </button>
      </div>
    </div>
  );
};

// Tables list component
// Update the TablesListView component to include the onCreateModel prop
// Fix the type mismatch in TablesListView component
// Update the TablesListView props interface
const TablesListView = ({
  tables = [],
  selectedTable,
  onSelectTable,
  onViewData,
  onRefresh,
  tableCounts = {},
  onCreateModel,
  onEdit,
}: {
  tables: string[];
  selectedTable: string | null;
  onSelectTable?: (tableName: string | null) => void;
  onViewData: (tableName: string) => void;
  onRefresh?: () => void;
  tableCounts?: Record<string, number>;
  onCreateModel?: () => void;
  onEdit?: (tableName: string) => void;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Tablas Existentes
          </h2>
          <p className="text-sm text-gray-500 mt-1">Tablas que ya existen en la base de datos.</p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={onCreateModel}
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Nuevo Modelo
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nombre de la Tabla</th>
              <th>Total Registros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table} className={selectedTable === table ? "bg-base-200" : ""}>
                <td>{table}</td>
                <td>{tableCounts[table] || 0}</td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-sm"
                      onClick={() => onViewData(table)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Ver Datos
                    </button>
                    <button 
                      className="btn btn-sm btn-outline"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      GraphQL
                    </button>
                    {/* Remove the comment that was causing the issue */}
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => onEdit && onEdit(table)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end mt-4">
        <button 
          className="btn btn-outline"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </button>
      </div>
    </div>
  );
};

// Main component
// Then update the main component to pass onCreateModel to TablesListView
// Update the interface to include onEdit
interface TableDataViewerProps {
  tableName: string | null;
  data: any[];
  columns: string[];
  isLoading: boolean;
  onInsert: () => void;
  tables?: string[];
  onSelectTable?: (tableName: string | null) => void;
  onRefresh?: () => void;
  tableCounts?: Record<string, number>;
  onCreateModel?: () => void;
  onEdit?: (tableName: string) => void; // Add this prop
}

// In the main component, add a state to track if we're editing
// Main component
export default function TableDataViewer({ 
  tableName, 
  data, 
  columns, 
  isLoading, 
  onInsert,
  tables = [],
  onSelectTable,
  onRefresh,
  tableCounts = {},
  onCreateModel,
  onEdit
}: TableDataViewerProps) {
  // Add null checks for data and columns
  const tableData = data || [];
  const tableColumns = columns || [];
  
  // State to track if we're viewing data or models list
  const [viewingData, setViewingData] = useState(false);
  
  // Reset viewingData when tableName changes
  useEffect(() => {
    if (!tableName) {
      setViewingData(false);
    }
  }, [tableName]);
  
  // Handle going back to models list
  const handleBack = () => {
    setViewingData(false);
    if (onSelectTable) {
      onSelectTable(null);
    }
  };
  
  // Handle viewing data for a specific table
  const handleViewData = (table: string) => {
    if (onSelectTable) {
      onSelectTable(table);
      setViewingData(true);
    }
  };
  
  // Handle editing a table
  const handleEdit = (table: string) => {
    if (onEdit) {
      onEdit(table);
    }
  };
  
  // Render the appropriate view based on state
  if (viewingData && tableName) {
    return (
      <DataView
        tableName={tableName}
        data={tableData}
        columns={tableColumns}
        isLoading={isLoading}
        onInsert={onInsert}
        onBack={handleBack}
      />
    );
  } else {
    return (
      <TablesListView
        tables={tables}
        selectedTable={tableName}
        onSelectTable={onSelectTable}
        onViewData={handleViewData}
        onRefresh={onRefresh}
        tableCounts={tableCounts}
        onCreateModel={onCreateModel}
        onEdit={handleEdit}
      />
    );
  }
}