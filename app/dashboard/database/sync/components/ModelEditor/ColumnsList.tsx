import { X, Link, Clock, ToggleLeft, Database, Info } from "lucide-react";
import { ColumnData } from "./index";
import { useState } from "react";

interface ColumnsListProps {
  columns: ColumnData[];
  onRemove: (index: number) => void;
}

export default function ColumnsList({ columns, onRemove }: ColumnsListProps) {
  // Standard field names for visual identification
  const standardFieldNames = ["created_at", "updated_at", "is_active", "metadata"];
  
  // State for showing JSON preview
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  
  // Field descriptions for tooltips
  const fieldDescriptions: Record<string, string> = {
    "created_at": "Fecha y hora de creación del registro. Se establece automáticamente y no debe modificarse.",
    "updated_at": "Fecha y hora de la última actualización. Se actualiza automáticamente al modificar el registro.",
    "is_active": "Indica si el registro está activo. Útil para implementar eliminación lógica.",
    "metadata": "Campo JSON para almacenar datos adicionales sin necesidad de modificar el esquema."
  };
  
  // Function to get appropriate icon for standard fields
  const getFieldIcon = (fieldName: string) => {
    switch(fieldName) {
      case "created_at":
      case "updated_at":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "is_active":
        return <ToggleLeft className="h-4 w-4 text-green-500" />;
      case "metadata":
        return <Database className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nombre de Columna</th>
            <th>Tipo</th>
            <th>Relación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {columns && columns.length > 0 ? (
            columns.map((column, index) => {
              const isStandardField = standardFieldNames.includes(column.name);
              
              return (
                <tr 
                  key={index} 
                  className={
                    isStandardField 
                      ? "bg-blue-50 dark:bg-blue-900/10" 
                      : column.isNew 
                        ? "bg-green-50 dark:bg-green-900/20" 
                        : ""
                  }
                >
                  <td className="flex items-center">
                    {isStandardField && getFieldIcon(column.name)}
                    <span className={isStandardField ? "ml-2 font-medium" : ""}>
                      {column.name}
                    </span>
                    {isStandardField && (
                      <>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          (campo estándar)
                        </span>
                        <div className="tooltip ml-2" data-tip={fieldDescriptions[column.name]}>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </div>
                      </>
                    )}
                  </td>
                  <td>{column.type}</td>
                  <td>
                    {column.type === "relation" && column.relationTable ? (
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-1" />
                        <span>{column.relationTable} ({column.relationType})</span>
                      </div>
                    ) : column.name === "metadata" ? (
                      <div>
                        <button 
                          className="btn btn-xs btn-outline"
                          onClick={() => setShowJsonPreview(!showJsonPreview)}
                        >
                          {showJsonPreview ? "Ocultar ejemplo" : "Ver ejemplo"}
                        </button>
                        
                        {showJsonPreview && (
                          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                            {`{
  "tags": ["importante", "destacado"],
  "analytics": {
    "vistas": 1250,
    "conversiones": 35
  },
  "camposPersonalizados": {
    "color": "azul",
    "tamaño": "mediano"
  }
}`}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {!isStandardField && (
                      <button 
                        className="btn btn-sm btn-ghost text-red-500"
                        onClick={() => onRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay columnas definidas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}