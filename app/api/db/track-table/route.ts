import { NextRequest, NextResponse } from 'next/server';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName } = body;
    
    if (!tableName) {
      return NextResponse.json({
        success: false,
        error: "Se requiere el nombre de la tabla"
      }, { status: 400 });
    }
    
    // Obtener el servicio Hasura
    const hasuraService = ApiServiceProvider.getHasuraService();
    
    // Rastrear la tabla en Hasura
    await hasuraService.trackTable(tableName);
    
    // También intentar rastrear las relaciones de la tabla
    try {
      // Consulta para obtener las restricciones de clave foránea
      const fkQuery = `
        SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='${tableName}';
      `;
      
      const fkResult = await hasuraService.runSQL(fkQuery);
      
      // Si hay relaciones, rastrearlas
      if (fkResult.result && fkResult.result.length > 1) {
        for (let i = 1; i < fkResult.result.length; i++) {
          const [table, column, foreignTable, foreignColumn] = fkResult.result[i];
          
          // Crear la relación en Hasura
          await fetch(`${process.env.NEXT_PUBLIC_HASURA_ENDPOINT}/v1/metadata`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || '',
            },
            body: JSON.stringify({
              type: 'pg_create_object_relationship',
              args: {
                table: {
                  name: table,
                  schema: 'public',
                },
                name: `${foreignTable}_rel`,
                using: {
                  foreign_key_constraint_on: column
                }
              }
            })
          });
        }
      }
    } catch (error) {
      console.warn('Error al rastrear relaciones:', error);
      // Continuamos incluso si hay error al rastrear relaciones
    }
    
    return NextResponse.json({
      success: true,
      message: `Tabla "${tableName}" rastreada correctamente`
    });
  } catch (error) {
    console.error('Error al rastrear tabla:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al rastrear tabla'
    }, { status: 500 });
  }
}