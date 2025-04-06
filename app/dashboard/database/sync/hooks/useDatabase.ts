import { useState, useEffect } from "react";
import { ModelField } from "../types";

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTables, setIsFetchingTables] = useState(true);
  const [existingTables, setExistingTables] = useState<string[]>([]);
  
  // Estado para resultados y notificaciones
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    visible?: boolean;
  } | null>(null);
  
  // Función para limpiar el resultado
  const clearResult = () => {
    setResult(null);
  };
  
  // Obtener las tablas existentes al cargar la página
  useEffect(() => {
    fetchExistingTables();
  }, []);

  // Función para obtener las tablas existentes
  const fetchExistingTables = async () => {
    try {
      setIsFetchingTables(true);
      
      const response = await fetch('/api/db-sync/list-models', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener tablas: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.tables) {
        setExistingTables(data.tables);
      } else {
        console.error('Error al obtener tablas:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener tablas:', error);
    } finally {
      setIsFetchingTables(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/db-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      setResult({
        ...data,
        visible: true
      });
      
      // Actualizar la lista de tablas después de sincronizar
      if (data.success) {
        await fetchExistingTables();
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al sincronizar',
        visible: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para sincronizar un modelo específico
  const syncSpecificModel = async (modelName: string) => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/db-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName
        })
      });
      
      const data = await response.json();
      
      setResult({
        ...data,
        visible: true
      });
      
      // Actualizar la lista de tablas después de sincronizar
      if (data.success) {
        await fetchExistingTables();
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al sincronizar',
        visible: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    isFetchingTables,
    existingTables,
    result,
    clearResult,
    fetchExistingTables,
    handleSync,
    syncSpecificModel,
    setResult
  };
}