// Implementación del servicio Hasura
import { ApiService } from './api-service';

export class HasuraService implements ApiService {
  private baseUrl: string;
  private adminSecret: string;
  private headers: Record<string, string>;
  private lastStatus: 'connected' | 'disconnected' | 'unknown' = 'unknown';
  private lastChecked: Date | null = null;
  
  constructor(config: {
    subdomain: string,
    region: string,
    adminSecret: string
  }) {
    this.baseUrl = `https://${config.subdomain}.hasura.${config.region}.nhost.run`;
    this.adminSecret = config.adminSecret;
    this.headers = {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': this.adminSecret
    };
  }
  
  // Método para obtener el estado de conexión
  async checkConnection(): Promise<boolean> {
    try {
      // Simple introspection query
      await this.executeGraphQL(`{ __schema { queryType { name } } }`);
      this.lastStatus = 'connected';
      this.lastChecked = new Date();
      return true;
    } catch (error) {
      this.lastStatus = 'disconnected';
      this.lastChecked = new Date();
      return false;
    }
  }
  
  // Método para obtener información sobre el servicio
  getServiceInfo(): any {
    return {
      type: 'hasura',
      baseUrl: this.baseUrl,
      lastStatus: this.lastStatus,
      lastChecked: this.lastChecked,
      headers: Object.keys(this.headers).map(key => 
        key === 'x-hasura-admin-secret' ? 'x-hasura-admin-secret: [HIDDEN]' : `${key}: ${this.headers[key]}`
      )
    };
  }
  
  // Método para ejecutar SQL
  /**
   * Ejecuta una consulta SQL en Hasura
   * @param sql Consulta SQL a ejecutar
   * @returns Resultado de la consulta
   */
  async runSQL(sql: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': this.adminSecret,
        },
        body: JSON.stringify({
          type: 'run_sql',
          args: {
            sql,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ejecutar SQL: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al ejecutar SQL:', error);
      throw error;
    }
  }

  /**
   * Rastrea una tabla en Hasura
   * @param tableName Nombre de la tabla a rastrear
   * @returns Resultado de la operación
   */
  async trackTable(tableName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': this.adminSecret,
        },
        body: JSON.stringify({
          type: 'track_table',
          args: {
            schema: 'public',
            name: tableName,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al rastrear tabla: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al rastrear tabla:', error);
      throw error;
    }
  }
  
  // Método para rastrear tablas
  async trackTable(tableName: string): Promise<boolean> {
    try {
      // Intentar con el primer formato
      const response = await this.post('/v1/query', {
        type: 'track_table',
        args: {
          schema: 'public',
          name: tableName
        }
      }).catch(() => null);
      
      if (response) return true;
      
      // Si falla, intentar con formato alternativo
      const altResponse = await this.post('/v1/query', {
        type: 'pg_track_table',
        args: {
          source: 'default',
          schema: 'public',
          name: tableName
        }
      }).catch(() => null);
      
      return !!altResponse;
    } catch (error) {
      console.error(`Error tracking table ${tableName}:`, error);
      return false;
    }
  }
  
  // Método específico para ejecutar consultas GraphQL
  async executeGraphQL(query: string, variables?: any, operationName?: string): Promise<any> {
    console.log('HasuraService: Executing GraphQL query', { query, variables, operationName });
    
    try {
      const response = await this.post('/v1/graphql', {
        query,
        variables,
        operationName
      });
      
      return response;
    } catch (error) {
      console.error('HasuraService: GraphQL query error:', error);
      throw error;
    }
  }
  
  // Método para listar tablas
  async listTables(): Promise<string[]> {
    const sql = `
      SELECT 
        table_name 
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'public' 
      ORDER BY 
        table_name;
    `;
    
    const result = await this.runSQL(sql);
    
    // Procesar el resultado para obtener los nombres de las tablas
    // El resultado viene como un array de arrays, donde el primer elemento es el encabezado
    // y los siguientes son los valores
    return result.result.slice(1).map((row: string[]) => row[0]);
  }
  
  // Implementación de métodos de la interfaz
  async get(endpoint: string, params?: any): Promise<any> {
    const url = new URL(this.baseUrl + endpoint);
    
    if (params) {
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasura API error: ${error}`);
    }
    
    return response.json();
  }
  
  async post(endpoint: string, data?: any): Promise<any> {
    console.log(`HasuraService: POST request to ${this.baseUrl + endpoint}`);
    
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasura API error: ${error}`);
    }
    
    return response.json();
  }
  
  // Otros métodos de la interfaz...
  async put(endpoint: string, data?: any): Promise<any> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasura API error: ${error}`);
    }
    
    return response.json();
  }
  
  async delete(endpoint: string): Promise<any> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'DELETE',
      headers: this.headers
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hasura API error: ${error}`);
    }
    
    return response.json();
  }
  
  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...this.headers, ...headers };
  }
  
  setTimeout(timeout: number): void {
    // Implementar si es necesario
  }
}