/**
 * Tipos de campo soportados para los modelos
 */
export type FieldType = 
  | 'uuid'
  | 'text'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'json'
  | 'jsonb'
  | 'timestamp'
  | 'date'
  | 'time';

/**
 * Definición de un campo en un modelo
 */
export interface FieldDefinition {
  type: FieldType;
  nullable?: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  unique?: boolean;
  references?: {
    model: string;
    field: string;
  };
}

/**
 * Definición de un modelo
 */
export interface ModelDefinition {
  name: string;
  fields: Record<string, FieldDefinition>;
  timestamps?: boolean; // Si es true, añade createdAt y updatedAt
}

/**
 * Registro de modelos disponibles
 */
export const models: Record<string, ModelDefinition> = {};

/**
 * Registra un nuevo modelo
 */
export function defineModel(model: ModelDefinition): ModelDefinition {
  // Asegurarse de que el modelo tenga un ID si no se ha definido
  if (!Object.values(model.fields).some(field => field.primaryKey)) {
    model.fields = {
      id: {
        type: 'uuid',
        primaryKey: true,
        defaultValue: 'gen_random_uuid()'
      },
      ...model.fields
    };
  }
  
  // Añadir timestamps si están habilitados
  if (model.timestamps) {
    model.fields = {
      ...model.fields,
      createdAt: {
        type: 'timestamp',
        defaultValue: 'now()',
        nullable: false
      },
      updatedAt: {
        type: 'timestamp',
        defaultValue: 'now()',
        nullable: false
      }
    };
  }
  
  // Registrar el modelo
  models[model.name] = model;
  
  return model;
}

/**
 * Obtiene un modelo por su nombre
 */
export function getModel(name: string): ModelDefinition | undefined {
  return models[name];
}

/**
 * Obtiene todos los modelos registrados
 */
export function getAllModels(): ModelDefinition[] {
  return Object.values(models);
}