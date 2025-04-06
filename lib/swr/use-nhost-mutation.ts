import { useState } from 'react';
import { graphql } from '../nhost/nhost-client';
import { mutate } from 'swr';

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useNhostMutation<T = any, V = any>(
  mutation: string,
  options: MutationOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (variables: V) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: responseData, error: responseError } = await graphql.request({
        query: mutation,
        variables
      });
      
      if (responseError) {
        throw new Error(responseError.message);
      }
      
      setData(responseData);
      options.onSuccess?.(responseData);
      
      return responseData;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      options.onError?.(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    data
  };
}