import { Table, Eye, Code, RefreshCw, AlertCircle } from "lucide-react";

interface TablesPanelProps {
  tables: string[];
  isLoading: boolean;
  onSelectTable: (tableName: string) => void;
  selectedTable: string | null;
}

export default function TablesPanel({
  tables,
  isLoading,
  onSelectTable,
  selectedTable
}: TablesPanelProps) {
  // Add a null check for tables
  const tablesList = tables || [];
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <Table className="h-5 w-5" />
          Tablas Existentes
        </h2>
        <p className="text-sm text-gray-500">
          Tablas que ya existen en la base de datos.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : tablesList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Nombre de la Tabla</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tablesList.map((table) => (
                  <tr key={table} className={selectedTable === table ? "bg-base-200" : ""}>
                    <td>{table}</td>
                    <td>
                      <div className="flex gap-1">
                        <button 
                          className="btn btn-xs btn-outline"
                          onClick={() => onSelectTable(table)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Datos
                        </button>
                        <button 
                          className="btn btn-xs btn-outline"
                          onClick={() => window.open(`/dashboard/graphql-explorer?table=${table}`, '_blank')}
                        >
                          <Code className="h-3 w-3 mr-1" />
                          GraphQL
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">
            <div>
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>No hay tablas en la base de datos.</span>
            </div>
          </div>
        )}
        
        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}