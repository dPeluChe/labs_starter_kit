import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tableName, columns } = await request.json();
    
    console.log('API - Updating model:', tableName, columns);
    
    // Validate input
    if (!tableName || !columns || !Array.isArray(columns)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input. Table name and columns array are required.' 
      }, { status: 400 });
    }
    
    // Use the correct environment variable names that are already defined
    const graphqlEndpoint = process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL;
    const hasuraAdminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
    
    // Log environment variables (without sensitive values)
    console.log('GRAPHQL_ENDPOINT value:', graphqlEndpoint);
    console.log('HASURA_ADMIN_SECRET configured:', !!hasuraAdminSecret);
    
    // Check if required environment variables are set
    if (!graphqlEndpoint) {
      console.error('NEXT_PUBLIC_NHOST_GRAPHQL_URL environment variable is not set');
      return NextResponse.json({ 
        success: false, 
        error: 'GraphQL endpoint configuration is missing' 
      }, { status: 500 });
    }
    
    if (!hasuraAdminSecret) {
      console.error('NEXT_PUBLIC_HASURA_ADMIN_SECRET environment variable is not set');
      return NextResponse.json({ 
        success: false, 
        error: 'Hasura admin secret configuration is missing' 
      }, { status: 500 });
    }
    
    // Prepare the columns data for the GraphQL mutation
    const formattedColumns = columns.map(col => ({
      name: col.name,
      type: col.type,
      nullable: col.nullable || false,
      default_value: col.default_value || null,
      relationTable: col.relatedTable || null
    }));
    
    console.log('Formatted columns for GraphQL:', formattedColumns);
    
    // Use the correct environment variables
    try {
      // Log the full URL we're trying to access
      console.log('Attempting to fetch from URL:', graphqlEndpoint);
      
      // Try to make a simple test request first to verify connectivity
      try {
        const testResponse = await fetch(graphqlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': hasuraAdminSecret,
          },
          body: JSON.stringify({
            query: `{ __schema { queryType { name } } }`
          })
        });
        
        console.log('Test request status:', testResponse.status);
        if (!testResponse.ok) {
          const testErrorText = await testResponse.text();
          console.error('Test request failed:', testErrorText);
        } else {
          console.log('Test request succeeded');
        }
      } catch (testError) {
        console.error('Test request error:', testError);
      }
      
      // Proceed with the actual mutation
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': hasuraAdminSecret,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateModelStructure($tableName: String!, $columns: [ColumnInput!]!) {
              updateModelStructure(tableName: $tableName, columns: $columns) {
                success
                message
              }
            }
          `,
          variables: {
            tableName,
            columns: formattedColumns
          }
        })
      });
      
      // Check if the fetch request was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GraphQL request failed:', response.status, errorText);
        return NextResponse.json({ 
          success: false, 
          error: `GraphQL request failed: ${response.status} - ${errorText}` 
        }, { status: response.status });
      }
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', JSON.stringify(result.errors));
        return NextResponse.json({ 
          success: false, 
          error: result.errors[0].message 
        }, { status: 500 });
      }
      
      console.log('GraphQL response:', result);
      
      return NextResponse.json({ 
        success: true,
        data: result.data?.updateModelStructure || { success: true, message: 'Model updated successfully' }
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ 
        success: false, 
        error: fetchError instanceof Error ? `Fetch error: ${fetchError.message}` : 'Unknown fetch error' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}