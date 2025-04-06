export interface ApiService {
  // Métodos básicos
  get(endpoint: string, params?: any): Promise<any>;
  post(endpoint: string, data?: any): Promise<any>;
  put(endpoint: string, data?: any): Promise<any>;
  delete(endpoint: string): Promise<any>;
  
  // Configuración
  setHeaders(headers: Record<string, string>): void;
  setTimeout(timeout: number): void;
}