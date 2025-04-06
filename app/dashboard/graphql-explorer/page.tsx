'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GraphiQL } from 'graphiql';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';
import EnvErrorPage from '@/components/errors/EnvErrorPage';
import 'graphiql/graphiql.css';

export default function GraphQLExplorerPage() {
  const [ready, setReady] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [envError, setEnvError] = useState(false);
  const fetchInProgress = useRef(false);
  
  // Check if required environment variables are available
  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';
  
  // Construir la URL correcta con formato .hasura. en lugar de .db.
  const nhostGraphqlUrl = process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL || 
    (subdomain ? `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql` : null);
  
  useEffect(() => {
    // Check if required env vars are available
    if (!nhostGraphqlUrl) {
      console.error('Required environment variable NEXT_PUBLIC_NHOST_GRAPHQL_URL is missing');
      setEnvError(true);
      return;
    }
    
    // Set ready to true after initial setup
    setReady(true);
  }, [nhostGraphqlUrl]);
  
  // If env error, show error page
  if (envError) {
    return <EnvErrorPage />;
  }
  
  // Define the fetcher function directly
  const fetcher = async (graphQLParams: any) => {
    // Prevent concurrent fetches for the same query
    if (fetchInProgress.current) {
      console.log('Fetch already in progress, skipping duplicate request');
      return { errors: [{ message: 'A request is already in progress' }] };
    }
    
    fetchInProgress.current = true;
    
    try {
      setFetchError(null);
      
      // If no default URL is available, show error
      if (!nhostGraphqlUrl) {
        throw new Error('No GraphQL endpoint available. Please check your environment variables.');
      }
      
      // Use our new internal API endpoint instead of direct Hasura calls
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphQLParams),
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GraphQL request failed:', response.status, errorText);
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('GraphQL response:', result);
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
      }
      
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      setFetchError(error instanceof Error ? error.message : String(error));
      
      return {
        errors: [{ message: error instanceof Error ? error.message : String(error) }]
      };
    } finally {
      // Delay clearing the flag to prevent immediate retries
      setTimeout(() => {
        fetchInProgress.current = false;
      }, 2000);
    }
  };
  
  // Añadir un botón para probar la conexión
  const testConnection = async () => {
    try {
      setFetchError(null);
      
      console.log('Testing GraphQL connection...');
      
      // Simple introspection query
      const query = {
        query: `{ __schema { queryType { name } } }`,
      };
      
      // Usar nuestro nuevo endpoint en lugar de la llamada directa
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Connection test failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Connection test result:', result);
      
      alert('Connection successful! Server is reachable.');
    } catch (error) {
      console.error('Connection test error:', error);
      setFetchError(error instanceof Error ? error.message : String(error));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">GraphQL Explorer</h1>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-sm btn-primary" 
            onClick={testConnection}
          >
            Test Connection
          </button>
        </div>
      </div>
      
      {fetchError && (
        <div className="alert alert-error">
          <span>Error: {fetchError}</span>
        </div>
      )}
      
      {!ready ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Loading GraphQL Explorer...</p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <div className="card-body p-0 h-[calc(100vh-200px)]">
            <GraphiQL fetcher={fetcher} />
          </div>
        </div>
      )}
    </div>
  );
}
            