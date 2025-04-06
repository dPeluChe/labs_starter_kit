import { useState, useEffect } from 'react';
import { graphql } from './nhost-client';

interface UseNhostQueryOptions<T> {
  query: string;
  variables?: Record<string, any>;
  skip?: boolean;
  onCompleted?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (variables?: Record<string, any>) => Promise<void>;
}

export function useNhostQuery<T = any>({
  query,
  variables = {},
  skip = false,
  onCompleted,
  onError
}: UseNhostQueryOptions<T>): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (currentVariables = variables) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: responseData, error: responseError } = await graphql.request<T>({
        query,
        variables: currentVariables
      });
      
      if (responseError) {
        throw new Error(responseError.message);
      }
      
      setData(responseData);
      onCompleted?.(responseData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [query, skip, JSON.stringify(variables)]);

  const refetch = async (newVariables?: Record<string, any>) => {
    await fetchData(newVariables || variables);
  };

  return { data, loading, error, refetch };
}