import { NextRequest, NextResponse } from 'next/server';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Obtener el servicio Hasura
    const hasuraService = ApiServiceProvider.getHasuraService();
    
    // Ejecutar la consulta GraphQL
    const result = await hasuraService.executeGraphQL(
      body.query,
      body.variables,
      body.operationName
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    
    return NextResponse.json({
      errors: [{ message: error instanceof Error ? error.message : String(error) }]
    }, { status: 500 });
  }
}