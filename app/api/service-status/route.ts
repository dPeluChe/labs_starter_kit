import { NextRequest, NextResponse } from 'next/server';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';

export async function GET(request: NextRequest) {
  try {
    // Obtener el servicio Hasura
    const hasuraService = ApiServiceProvider.getHasuraService();
    
    // Verificar que el servicio esté funcionando
    const tables = await hasuraService.listTables();
    
    // Verificar la conexión GraphQL
    let graphqlStatus = true;
    try {
      // Simple introspection query
      await hasuraService.executeGraphQL(`{ __schema { queryType { name } } }`);
    } catch (error) {
      console.error('GraphQL connection test failed:', error);
      graphqlStatus = false;
    }
    
    // Obtener información sobre todos los servicios
    const servicesInfo = ApiServiceProvider.getServicesInfo();
    
    // Verificar la conexión de todos los servicios
    const connections = await ApiServiceProvider.checkAllConnections();
    
    // Obtener información sobre el entorno
    const environment = process.env.NODE_ENV || 'development';
    
    return NextResponse.json({
      success: true,
      status: {
        hasuraService: {
          active: true,
          baseUrl: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN 
            ? `https://${process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN}.hasura.${process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1'}.nhost.run` 
            : 'URL not configured',
          tablesCount: tables.length,
          tables: tables,
          graphqlStatus
        },
        registeredServices: Object.keys(ApiServiceProvider.getRegisteredServices?.() || {}),
        servicesInfo,
        connections,
        system: {
          environment,
          timestamp: new Date().toISOString(),
          apiEndpoints: {
            graphql: '/api/graphql',
            dbSync: '/api/db-sync',
            runSql: '/api/db/run-sql',
            trackTable: '/api/db/track-table',
            serviceStatus: '/api/service-status'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error checking service status:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}