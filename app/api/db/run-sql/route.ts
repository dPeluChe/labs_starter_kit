import { NextRequest, NextResponse } from 'next/server';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;
    
    if (!sql) {
      return NextResponse.json({
        success: false,
        error: "Se requiere una consulta SQL"
      }, { status: 400 });
    }
    
    // Obtener el servicio Hasura
    const hasuraService = ApiServiceProvider.getHasuraService();
    
    // Ejecutar la consulta SQL
    const result = await hasuraService.runSQL(sql);
    
    return NextResponse.json({
      success: true,
      result: result.result
    });
  } catch (error) {
    console.error('Error al ejecutar SQL:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al ejecutar SQL'
    }, { status: 500 });
  }
}