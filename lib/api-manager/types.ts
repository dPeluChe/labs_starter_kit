export interface ApiConfig {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  authType: 'none' | 'apiKey' | 'bearer' | 'basic';
  apiKey?: {
    key: string;
    value: string;
    in: 'header' | 'query';
  };
  bearerToken?: string;
  basicAuth?: {
    username: string;
    password: string;
  };
  headers?: Record<string, string>;
  isActive: boolean;
}

export interface ApiManagerStore {
  apis: ApiConfig[];
  addApi: (api: Omit<ApiConfig, 'id'>) => void;
  updateApi: (id: string, updates: Partial<ApiConfig>) => void;
  removeApi: (id: string) => void;
  getApi: (id: string) => ApiConfig | undefined;
}