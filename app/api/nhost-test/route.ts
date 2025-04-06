import { NextRequest, NextResponse } from 'next/server';
import { nhost, graphql } from '@/lib/nhost/nhost-client';

export async function GET(request: NextRequest) {
  try {
    // Paso 1: Verificar la conexión básica
    console.log('Testing Nhost connection...');
    
    // Obtener la URL de GraphQL desde las variables de entorno
    let graphqlUrl = process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL;
    const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
    const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
    const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';
    
    // Crear un array de posibles URLs para probar
    const urlsToTry = [];
    
    // Si no tenemos la URL completa, intentamos construirla con diferentes formatos
    if (subdomain) {
      // Formato 1: Estándar de Nhost
      urlsToTry.push(`https://${subdomain}.db.${region}.nhost.run/v1/graphql`);
      
      // Formato 2: Alternativo sin .db.
      urlsToTry.push(`https://${subdomain}.${region}.nhost.run/v1/graphql`);
      
      // Formato 3: Con hasura en lugar de db
      urlsToTry.push(`https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`);
      
      // Formato 4: Solo con el subdominio
      urlsToTry.push(`https://${subdomain}.nhost.run/v1/graphql`);
    }
    
    // Añadir la URL original si existe
    if (graphqlUrl) {
      urlsToTry.unshift(graphqlUrl); // Poner al principio para probarla primero
    }
    
    console.log('URLs to try:', urlsToTry);
    
    // Variable para almacenar resultados de los intentos
    const attemptResults = [];
    let successfulUrl = null;
    let successfulResponse = null;
    
    // Probar cada URL hasta que una funcione
    for (const url of urlsToTry) {
      try {
        console.log(`Attempting connection to: ${url}`);
        
        // Configurar headers
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (adminSecret) {
          headers['x-hasura-admin-secret'] = adminSecret;
        }
        
        // Consulta de introspección simple
        const introspectionQuery = {
          query: `{ __schema { queryType { name } } }`
        };
        
        // Intentar hacer ping al servidor primero
        try {
          const pingResponse = await fetch(url.replace('/v1/graphql', '/healthz'), {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          attemptResults.push({
            url,
            pingStatus: pingResponse.status,
            pingOk: pingResponse.ok
          });
          
          console.log(`Ping to ${url.replace('/v1/graphql', '/healthz')}: ${pingResponse.status}`);
        } catch (pingError) {
          console.log(`Ping failed for ${url}: ${pingError}`);
          attemptResults.push({
            url,
            pingError: pingError instanceof Error ? pingError.message : String(pingError)
          });
        }
        
        // Intentar la consulta GraphQL
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(introspectionQuery),
          signal: AbortSignal.timeout(5000) // 5 segundos de timeout
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`Success with URL: ${url}`);
          successfulUrl = url;
          successfulResponse = result;
          
          // Guardar esta URL como la correcta
          graphqlUrl = url;
          break;
        } else {
          const errorText = await response.text();
          attemptResults.push({
            url,
            status: response.status,
            error: errorText
          });
          console.log(`Failed with URL ${url}: ${response.status}`);
        }
      } catch (urlError) {
        attemptResults.push({
          url,
          error: urlError instanceof Error ? urlError.message : String(urlError)
        });
        console.log(`Error with URL ${url}: ${urlError}`);
      }
    }
    
    if (!successfulUrl) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to any Nhost GraphQL endpoint',
        attempts: attemptResults,
        config: {
          graphqlUrl: process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL,
          subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
          region: process.env.NEXT_PUBLIC_NHOST_REGION,
          hasAdminSecret: !!process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
        }
      }, { status: 500 });
    }
    
    // Continuar con el resto del código solo si encontramos una URL exitosa
    console.log(`Using successful URL: ${graphqlUrl}`);
    
    // Paso 2: Ejecutar una consulta de introspección básica
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (adminSecret) {
      headers['x-hasura-admin-secret'] = adminSecret;
      console.log('Using admin secret for authentication');
    }
    
    // Consulta de introspección simple para verificar la conexión
    const introspectionQuery = {
      query: `{ __schema { queryType { name } } }`
    };
    
    console.log('Executing introspection query to:', graphqlUrl);
    
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(introspectionQuery),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GraphQL request failed: ${response.status} - ${errorText}`);
    }
    
    const introspectionResult = await response.json();
    
    // Paso 3: Obtener lista de tablas existentes
    const tablesQuery = {
      query: `
        query {
          __schema {
            types {
              name
              kind
              fields {
                name
              }
            }
          }
        }
      `
    };
    
    const tablesResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(tablesQuery),
    });
    
    const tablesResult = await tablesResponse.json();
    
    // Filtrar solo los tipos que son objetos y no empiezan con "__" (tipos del sistema)
    const tables = tablesResult.data.__schema.types
      .filter((type: any) => 
        type.kind === 'OBJECT' && 
        !type.name.startsWith('__') &&
        !['query_root', 'mutation_root', 'subscription_root'].includes(type.name)
      )
      .map((type: any) => ({
        name: type.name,
        fields: type.fields?.map((field: any) => field.name) || []
      }));
    
    // Paso 4: Intentar consultar la tabla test_table si existe
    let testTableData = null;
    try {
      const testTableQuery = {
        query: `
          query {
            test_table {
              ID
              nombre
              detalle
            }
          }
        `
      };
      
      const testTableResponse = await fetch(graphqlUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(testTableQuery),
      });
      
      if (testTableResponse.ok) {
        testTableData = await testTableResponse.json();
      }
    } catch (error) {
      console.error('Error querying test_table:', error);
      // No hacemos nada, simplemente continuamos
    }
    
    // Devolver información básica si todo lo demás falla
    return NextResponse.json({
      success: true,
      connection: {
        url: graphqlUrl,
        status: 'Connected successfully',
        headers: headers
      },
      attempts: attemptResults,
      introspection: successfulResponse || 'Not available',
      tables: tables || [],
      testTableData: testTableData || null
    }, { status: 200 });
    
  } catch (error) {
    console.error('Nhost test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      config: {
        graphqlUrl: process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL,
        subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
        region: process.env.NEXT_PUBLIC_NHOST_REGION,
        hasAdminSecret: !!process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
      }
    }, { status: 500 });
  }
}