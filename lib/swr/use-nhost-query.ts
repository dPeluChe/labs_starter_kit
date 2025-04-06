import useSWR from 'swr';
import { graphql } from '../nhost/nhost-client';

// Tipos para TypeScript
interface QueryOptions {
  query: string;
  variables?: Record<string, any>;
}

// Fetcher personalizado para Nhost GraphQL
const nhostFetcher = async ({ query, variables = {} }: QueryOptions) => {
  const { data, error } = await graphql.request({
    query,
    variables
  });
  
  if (error) throw new Error(error.message);
  return data;
};

// Hook personalizado para usar SWR con Nhost
export function useNhostQuery<T = any>(
  query: string, 
  variables: Record<string, any> = {}, 
  options: Parameters<typeof useSWR>[2] = {}
) {
  return useSWR<T>(
    // La clave es una combinación de la consulta y las variables
    { query, variables },
    nhostFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options
    }
  );
}