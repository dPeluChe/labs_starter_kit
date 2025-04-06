import { NextRequest, NextResponse } from 'next/server';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';

export async function GET(request: NextRequest) {
  try {
    // Obtener el servicio Hasura
    const hasuraService = ApiServiceProvider.getHasuraService();
    
    // Consulta SQL para obtener las tablas
    const sql = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
    
    // Ejecutar la consulta SQL
    const result = await hasuraService.runSQL(sql);  // Fixed: runSql -> runSQL
    
    // Procesar el resultado para obtener los nombres de las tablas
    // El resultado viene como un array de arrays, donde el primer elemento es el encabezado
    const tables = result.result.slice(1).map((row: string[]) => row[0]);
    
    return NextResponse.json({
      success: true,
      tables
    });
  } catch (error) {
    console.error('Error al obtener tablas:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al obtener tablas'
    }, { status: 500 });
  }
}