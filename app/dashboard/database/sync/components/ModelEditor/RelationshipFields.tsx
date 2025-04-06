interface RelationshipFieldsProps {
  relationTable: string;
  relationType: string;
  availableTables: string[];
  onRelationTableChange: (table: string) => void;
  onRelationTypeChange: (type: string) => void;
}

export default function RelationshipFields({
  relationTable,
  relationType,
  availableTables,
  onRelationTableChange,
  onRelationTypeChange
}: RelationshipFieldsProps) {
  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Tabla Relacionada</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={relationTable}
          onChange={(e) => onRelationTableChange(e.target.value)}
        >
          <option value="">Seleccionar tabla</option>
          {availableTables.map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>
      
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Tipo de Relación</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={relationType}
          onChange={(e) => onRelationTypeChange(e.target.value)}
        >
          <option value="oneToOne">Uno a Uno</option>
          <option value="oneToMany">Uno a Muchos</option>
          <option value="manyToOne">Muchos a Uno</option>
          <option value="manyToMany">Muchos a Muchos</option>
        </select>
      </div>
    </>
  );
}