import { useCallback } from 'react';
import { useApiManager } from './api-manager';

interface UseApiOptions {
  apiId: string;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export function useApi({ apiId }: UseApiOptions) {
  const getApi = useApiManager(state => state.getApi);
  
  const request = useCallback(async <T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    const api = getApi(apiId);
    
    if (!api) {
      throw new Error(`API with ID ${apiId} not found`);
    }
    
    if (!api.isActive) {
      throw new Error(`API with ID ${apiId} is not active`);
    }
    
    const { params, ...fetchOptions } = options;
    
    // Construir URL con parámetros de consulta
    let url = `${api.baseUrl}${endpoint}`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url = `${url}?${queryParams.toString()}`;
    }
    
    // Configurar headers según el tipo de autenticación
    const headers = new Headers(fetchOptions.headers);
    
    // Añadir headers predefinidos de la API
    if (api.headers) {
      Object.entries(api.headers).forEach(([key, value]) => {
        headers.append(key, value);
      });
    }
    
    // Configurar autenticación
    switch (api.authType) {
      case 'apiKey':
        if (api.apiKey) {
          if (api.apiKey.in === 'header') {
            headers.append(api.apiKey.key, api.apiKey.value);
          } else if (api.apiKey.in === 'query') {
            const urlObj = new URL(url);
            urlObj.searchParams.append(api.apiKey.key, api.apiKey.value);
            url = urlObj.toString();
          }
        }
        break;
      case 'bearer':
        if (api.bearerToken) {
          headers.append('Authorization', `Bearer ${api.bearerToken}`);
        }
        break;
      case 'basic':
        if (api.basicAuth) {
          const credentials = btoa(`${api.basicAuth.username}:${api.basicAuth.password}`);
          headers.append('Authorization', `Basic ${credentials}`);
        }
        break;
      // Otros tipos de autenticación se manejarían aquí
    }
    
    // Realizar la solicitud
    const response = await fetch(url, {
      ...fetchOptions,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    // Intentar parsear como JSON, si falla devolver texto
    try {
      return await response.json();
    } catch (e) {
      return await response.text() as unknown as T;
    }
  }, [apiId, getApi]);
  
  return { request };
}