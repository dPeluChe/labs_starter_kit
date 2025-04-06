"use client";

import { NhostClient } from '@nhost/nextjs';

// Actualizar la URL de GraphQL para usar el formato correcto
const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
const region = process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1';

// Usar el formato correcto con 'hasura' en lugar de 'db'
export const nhostGraphqlUrl = process.env.NEXT_PUBLIC_NHOST_GRAPHQL_URL || 
  `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`;

// Crear una instancia de Nhost
export const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || 'ktpraremjqwjjurynmtx',
  region: process.env.NEXT_PUBLIC_NHOST_REGION || 'us-east-1',
  graphqlUrl: graphqlUrl // Usar la URL completa de GraphQL
});

// Exportar funciones de utilidad
export const auth = nhost.auth;
export const storage = nhost.storage;
export const functions = nhost.functions;
export const graphql = nhost.graphql;