// Modificar para no depender directamente del contexto de cliente
import { ModelDefinition, FieldDefinition, getAllModels } from './model-schema';

// Obtener la URL de GraphQL desde las variables de entorno directamente
const getNhostGraphqlUrl = () => {
  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';
  
  return process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL || 
    `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`;
};

/**
 * Convierte un tipo de campo a su equivalente en SQL
 */
function fieldTypeToSql(field: FieldDefinition): string {
  switch (field.type) {
    case 'uuid': return 'uuid';
    case 'text': return 'text';
    case 'integer': return 'integer';
    case 'float': return 'float';
    case 'boolean': return 'boolean';
    case 'json': return 'json';
    case 'jsonb': return 'jsonb';
    case 'timestamp': return 'timestamp with time zone';
    case 'date': return 'date';
    case 'time': return 'time';
    default: return 'text';
  }
}

/**
 * Genera una consulta SQL para crear una tabla
 */
function generateCreateTableSQL(model: ModelDefinition): string {
  const fields = Object.entries(model.fields).map(([name, field]) => {
    let sql = `"${name}" ${fieldTypeToSql(field)}`;
    
    if (field.primaryKey) {
      sql += ' PRIMARY KEY';
    }
    
    if (field.unique) {
      sql += ' UNIQUE';
    }
    
    if (field.nullable === false) {
      sql += ' NOT NULL';
    }
    
    if (field.defaultValue !== undefined) {
      sql += ` DEFAULT ${field.defaultValue}`;
    }
    
    if (field.references) {
      sql += ` REFERENCES "${field.references.model}"("${field.references.field}")`;
    }
    
    return sql;
  });
  
  return `CREATE TABLE IF NOT EXISTS "${model.name}" (
    ${fields.join(',\n    ')}
  );`;
}

/**
 * Ejecuta una consulta SQL en Hasura
 */
// Busca la función executeSQL y actualiza la URL del endpoint

async function executeSQL(sql: string) {
  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';
  const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  
  if (!subdomain || !adminSecret) {
    throw new Error('Missing required environment variables (NEXT_PUBLIC_NHOST_SUBDOMAIN, NEXT_PUBLIC_HASURA_ADMIN_SECRET)');
  }
  
  // Usar el mismo endpoint que funciona en create-model
  const hasuraEndpoint = `https://${subdomain}.hasura.${region}.nhost.run/v1/query`;
  
  console.log(`Executing SQL at ${hasuraEndpoint}`);
  
  const response = await fetch(hasuraEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': adminSecret
    },
    body: JSON.stringify({
      type: 'run_sql',
      args: {
        sql: sql,
        cascade: true
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to execute SQL: ${error}`);
  }
  
  return response.json();
}

// También actualiza la función para rastrear tablas si existe
async function trackTable(tableName: string) {
  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';
  const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  
  if (!subdomain || !adminSecret) {
    throw new Error('Missing required environment variables');
  }
  
  // Usar el mismo endpoint que funciona en create-model
  const hasuraEndpoint = `https://${subdomain}.hasura.${region}.nhost.run/v1/query`;
  
  const response = await fetch(hasuraEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': adminSecret
    },
    body: JSON.stringify({
      type: 'track_table',
      args: {
        schema: 'public',
        name: tableName
      }
    })
  });
  
  if (!response.ok) {
    // Intentar con formato alternativo si el primero falla
    const altResponse = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret
      },
      body: JSON.stringify({
        type: 'pg_track_table',
        args: {
          source: 'default',
          schema: 'public',
          name: tableName
        }
      })
    });
    
    if (!altResponse.ok) {
      const error = await altResponse.text();
      throw new Error(`Failed to track table: ${error}`);
    }
  }
  
  return true;
}

/**
 * Sincroniza todos los modelos con la base de datos
 */
export async function syncModels(): Promise<void> {
  const models = getAllModels();
  
  for (const model of models) {
    try {
      const sql = generateCreateTableSQL(model);
      console.log(`Syncing model ${model.name}...`);
      console.log(sql);
      
      const result = await executeSQL(sql);
      console.log(`Model ${model.name} synced successfully:`, result);
    } catch (error) {
      console.error(`Failed to sync model ${model.name}:`, error);
    }
  }
}