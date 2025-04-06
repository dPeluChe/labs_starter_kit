import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ApiConfig, ApiManagerStore } from './types';

export const useApiManager = create<ApiManagerStore>()(
  persist(
    (set, get) => ({
      apis: [],
      
      addApi: (api) => {
        const newApi: ApiConfig = {
          ...api,
          id: uuidv4(),
        };
        
        set((state) => ({
          apis: [...state.apis, newApi],
        }));
        
        return newApi.id;
      },
      
      updateApi: (id, updates) => {
        set((state) => ({
          apis: state.apis.map((api) => 
            api.id === id ? { ...api, ...updates } : api
          ),
        }));
      },
      
      removeApi: (id) => {
        set((state) => ({
          apis: state.apis.filter((api) => api.id !== id),
        }));
      },
      
      getApi: (id) => {
        return get().apis.find((api) => api.id === id);
      },
    }),
    {
      name: 'api-manager-storage',
      // Optional: You can add storage configuration here
      // storage: createJSONStorage(() => localStorage),
    }
  )
);