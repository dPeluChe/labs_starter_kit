import { useState } from "react";
import { ModelField } from "../types";

export function useModels(existingTables: string[], setResult: Function, fetchExistingTables: Function) {
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [modelName, setModelName] = useState("");
  const [modelFields, setModelFields] = useState<ModelField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modelos predefinidos que podemos sincronizar
  const availableModels = [
    {
      name: 'examples',
      description: 'Modelo de ejemplo con campos básicos',
      exists: existingTables?.includes('examples') || false
    },
    {
      name: 'products',
      description: 'Modelo para gestionar productos',
      exists: existingTables?.includes('products') || false
    },
    {
      name: 'categories',
      description: 'Categorías para los productos',
      exists: existingTables?.includes('categories') || false
    },
    // Aquí puedes añadir más modelos a medida que los vayas creando
  ];
  
  // Funciones para el manejo de campos del modelo
  const addField = () => {
    setModelFields([
      ...modelFields,
      {
        name: "",
        type: "text",
        isPrimary: modelFields.length === 0, // El primer campo es primario por defecto
        isNullable: false,
        isUnique: false
      }
    ]);
  };
  
  const updateField = (index: number, field: ModelField) => {
    const newFields = [...modelFields];
    newFields[index] = field;
    setModelFields(newFields);
  };
  
  const removeField = (index: number) => {
    setModelFields(modelFields.filter((_, i) => i !== index));
  };
  
  // Función para crear un nuevo modelo
  const createModel = async () => {
    try {
      if (!modelName) {
        throw new Error("El nombre del modelo es obligatorio");
      }
      
      if (modelFields.length === 0) {
        throw new Error("Debes definir al menos un campo");
      }
      
      // Validar que haya un campo primario
      const hasPrimaryKey = modelFields.some(field => field.isPrimary);
      if (!hasPrimaryKey) {
        throw new Error("El modelo debe tener al menos un campo como clave primaria");
      }
      
      setIsLoading(true);
      
      // Crear la consulta SQL para crear la tabla
      const fieldsSQL = modelFields.map(field => {
        let sql = `"${field.name}" ${field.type}`;
        
        if (field.isPrimary) {
          sql += ' PRIMARY KEY';
        }
        
        if (!field.isNullable && !field.isPrimary) {
          sql += ' NOT NULL';
        }
        
        if (field.isUnique && !field.isPrimary) {
          sql += ' UNIQUE';
        }
        
        if (field.defaultValue) {
          sql += ` DEFAULT ${field.defaultValue}`;
        }
        
        return sql;
      }).join(', ');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS "${modelName}" (
          ${fieldsSQL}
        );
      `;
      
      // Enviar la solicitud para crear la tabla
      const response = await fetch('/api/db/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: createTableSQL
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Error al crear la tabla");
      }
      
      // Rastrear la tabla en Hasura
      const trackResponse = await fetch('/api/db/track-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: modelName
        })
      });
      
      const trackData = await trackResponse.json();
      
      if (!trackData.success) {
        throw new Error(trackData.error || "Error al rastrear la tabla en Hasura");
      }
      
      // Crear relaciones si existen
      for (const field of modelFields) {
        if (field.references) {
          const createRelationSQL = `
            ALTER TABLE "${modelName}" 
            ADD CONSTRAINT fk_${modelName}_${field.name}_${field.references.table}
            FOREIGN KEY ("${field.name}") 
            REFERENCES "${field.references.table}"("${field.references.column}");
          `;
          
          await fetch('/api/db/run-sql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sql: createRelationSQL
            })
          });
        }
      }
      
      setResult({
        success: true,
        message: `Modelo "${modelName}" creado exitosamente`,
        visible: true
      });
      
      // Actualizar la lista de tablas
      await fetchExistingTables();
      
      // Cerrar el modal
      setShowCreateModel(false);
      
      // Limpiar el formulario
      setModelName("");
      setModelFields([]);
      
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al crear el modelo',
        visible: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    showCreateModel,
    setShowCreateModel,
    modelName,
    setModelName,
    modelFields,
    isLoading,
    availableModels,
    addField,
    updateField,
    removeField,
    createModel
  };
}