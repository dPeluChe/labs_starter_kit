import { Link2, Shield, Code, Trash2 } from 'lucide-react';

interface FieldsListProps {
  columns: any[];
  originalColumns: any[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onShowJsonExample: (column: any) => void;
}

export default function FieldsList({ 
  columns, 
  originalColumns, 
  onEdit, 
  onRemove, 
  onShowJsonExample 
}: FieldsListProps) {
  return (
    <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Nullable</th>
            <th>Valor por defecto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((column, index) => {
            const isStandardField = ['created_at', 'updated_at', 'is_active', 'metadata'].includes(column.name);
            const originalIndex = originalColumns.findIndex(col => col.name === column.name);
            
            return (
              <tr key={index} className={isStandardField ? "bg-base-200" : ""}>
                <td className="flex items-center gap-2">
                  {column.name}
                  {column.isRelation && (
                    <span className="badge badge-info badge-sm">
                      <Link2 className="h-3 w-3 mr-1" />
                      Relación
                    </span>
                  )}
                  {isStandardField && (
                    <span className="badge badge-secondary badge-sm">
                      <Shield className="h-3 w-3 mr-1" />
                      Default
                    </span>
                  )}
                </td>
                <td>{column.type}</td>
                <td>{column.nullable === 'YES' ? 'Sí' : 'No'}</td>
                <td>{column.default_value || '-'}</td>
                <td>
                  <div className="flex gap-2">
                    {(column.type === 'jsonb' || column.name === 'metadata') && (
                      <button 
                        className="btn btn-xs btn-outline"
                        onClick={() => onShowJsonExample(column)}
                      >
                        <Code className="h-3 w-3 mr-1" />
                        Ver Ejemplo
                      </button>
                    )}
                    {!isStandardField && (
                      <>
                        <button 
                          className="btn btn-xs btn-outline"
                          onClick={() => onEdit(originalIndex)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-xs btn-error btn-outline"
                          onClick={() => onRemove(originalIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {columns.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No se encontraron columnas para esta tabla
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}