import { ApiService } from './api-service';
import { HasuraService } from './hasura-service';

export class ApiServiceProvider {
  private static instances: Record<string, ApiService> = {};
  
  static getHasuraService(): HasuraService {
    if (!this.instances['hasura']) {
      this.instances['hasura'] = new HasuraService({
        subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || '',
        region: process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1',
        adminSecret: process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || ''
      });
    }
    return this.instances['hasura'] as HasuraService;
  }
  
  static getService(id: string): ApiService | null {
    return this.instances[id] || null;
  }
  
  static registerService(id: string, service: ApiService): void {
    this.instances[id] = service;
  }
  
  static getRegisteredServices(): Record<string, ApiService> {
    return { ...this.instances };
  }
  
  // Método para verificar la conexión de todos los servicios
  static async checkAllConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [id, service] of Object.entries(this.instances)) {
      if (typeof (service as any).checkConnection === 'function') {
        results[id] = await (service as any).checkConnection();
      } else {
        results[id] = true; // Asumimos que está conectado si no tiene método de verificación
      }
    }
    
    return results;
  }
  
  // Método para obtener información sobre todos los servicios
  static getServicesInfo(): Record<string, any> {
    const info: Record<string, any> = {};
    
    for (const [id, service] of Object.entries(this.instances)) {
      if (typeof (service as any).getServiceInfo === 'function') {
        info[id] = (service as any).getServiceInfo();
      } else {
        info[id] = { type: 'unknown' };
      }
    }
    
    return info;
  }
}