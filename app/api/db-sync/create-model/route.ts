import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sql, modelName, fields } = await request.json();
    
    if (!sql || !modelName || !fields) {
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos (sql, modelName, fields)'
      }, { status: 400 });
    }
    
    // Obtener la URL de GraphQL y el admin secret
    const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
    const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';
    const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
    
    if (!subdomain || !adminSecret) {
      return NextResponse.json({
        success: false,
        error: 'Faltan variables de entorno requeridas (NEXT_PUBLIC_NHOST_SUBDOMAIN, NEXT_PUBLIC_HASURA_ADMIN_SECRET)'
      }, { status: 500 });
    }
    
    // Construir la URL para el endpoint de metadata de Hasura
    // Usamos el endpoint v1/query para operaciones de metadatos y SQL
    const hasuraEndpoint = `https://${subdomain}.hasura.${region}.nhost.run/v1/query`;
    
    console.log('Ejecutando SQL en:', hasuraEndpoint);
    console.log('SQL:', sql);
    
    // Ejecutar la consulta SQL
    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret
      },
      body: JSON.stringify({
        type: 'run_sql',
        args: {
          sql: sql,
          cascade: true
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en respuesta HTTP:', response.status, errorText);
      throw new Error(`Error al ejecutar SQL: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Verificar si hay errores en la respuesta de Hasura
    if (result.error) {
      throw new Error(`Error de Hasura: ${result.error}`);
    }
    
    // Rastrear el modelo creado
    console.log(`Modelo "${modelName}" creado con éxito`);
    console.log('Campos:', fields);
    
    // Ahora necesitamos rastrear la tabla en Hasura para que esté disponible en GraphQL
    // Usamos el endpoint correcto para metadata
    const trackTableResponse = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret
      },
      body: JSON.stringify({
        type: 'track_table',
        args: {
          schema: 'public',
          name: modelName
        }
      })
    });
    
    if (!trackTableResponse.ok) {
      const trackErrorText = await trackTableResponse.text();
      console.warn(`Advertencia: No se pudo rastrear la tabla en Hasura: ${trackErrorText}`);
      
      // Intentar con un formato alternativo de la API de Hasura
      const alternativeTrackResponse = await fetch(hasuraEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': adminSecret
        },
        body: JSON.stringify({
          type: 'pg_track_table',
          args: {
            source: 'default',
            schema: 'public',
            name: modelName
          }
        })
      });
      
      if (alternativeTrackResponse.ok) {
        console.log(`Tabla "${modelName}" rastreada exitosamente usando pg_track_table`);
      } else {
        const altErrorText = await alternativeTrackResponse.text();
        console.error(`Error al rastrear tabla con método alternativo: ${altErrorText}`);
      }
    } else {
      console.log(`Tabla "${modelName}" rastreada exitosamente en Hasura`);
    }
    
    return NextResponse.json({
      success: true,
      message: `Modelo "${modelName}" creado exitosamente`,
      result
    });
    
  } catch (error) {
    console.error('Error al crear modelo:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}