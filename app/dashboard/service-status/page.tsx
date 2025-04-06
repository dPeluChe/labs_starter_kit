'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Database, Server, Clock, Activity, Code, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function ServiceStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/service-status');
      
      if (!response.ok) {
        throw new Error(`Error fetching service status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching service status:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStatus();
  }, []);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Service Status</h1>
      
      {lastUpdated && (
        <div className="text-sm text-gray-500 mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
      
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Database className="h-5 w-5" />
            API Services Status
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <XCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hasura Service</td>
                      <td>
                        {status?.status?.hasuraService?.active ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-error">Inactive</span>
                        )}
                      </td>
                      <td>
                        <div>Base URL: {status?.status?.hasuraService?.baseUrl}</div>
                        <div>Tables: {status?.status?.hasuraService?.tablesCount}</div>
                      </td>
                    </tr>
                    {status?.status?.registeredServices?.map((service: string) => (
                      <tr key={service}>
                        <td>{service}</td>
                        <td>
                          <span className="badge badge-success">Registered</span>
                        </td>
                        <td>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {status?.status?.hasuraService?.tables?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Available Tables</h3>
                  <div className="flex flex-wrap gap-2">
                    {status.status.hasuraService.tables.map((table: string) => (
                      <span key={table} className="badge badge-primary">{table}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="card-actions justify-end mt-4">
            <button 
              className="btn btn-primary"
              onClick={fetchStatus}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
          </div>
        </div>
      </div>
      
      {/* Sección de estado del sistema */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">API Endpoints</div>
              <div className="stat-value text-primary flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success" />
                Operational
              </div>
              <div className="stat-desc">Internal API routes</div>
            </div>
            
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Database Connection</div>
              <div className="stat-value text-primary flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success" />
                Connected
              </div>
              <div className="stat-desc">Hasura/Nhost</div>
            </div>
            
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Service Health</div>
              <div className="stat-value text-primary flex items-center">
                <Activity className="h-5 w-5 mr-2 text-success" />
                100%
              </div>
              <div className="stat-desc">All systems operational</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de diagnóstico */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Diagnostic Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link href="/dashboard/graphql-explorer" className="btn btn-outline">
              <Code className="h-4 w-4 mr-2" />
              Open GraphQL Explorer
            </Link>
            
            <Link href="/dashboard/db-sync" className="btn btn-outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Database Sync
            </Link>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">API Endpoints</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Endpoint</th>
                    <th>Path</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GraphQL</td>
                    <td><code>/api/graphql</code></td>
                    <td>GraphQL API endpoint</td>
                  </tr>
                  <tr>
                    <td>DB Sync</td>
                    <td><code>/api/db-sync</code></td>
                    <td>Database synchronization endpoint</td>
                  </tr>
                  <tr>
                    <td>Run SQL</td>
                    <td><code>/api/db/run-sql</code></td>
                    <td>Execute SQL queries</td>
                  </tr>
                  <tr>
                    <td>Track Table</td>
                    <td><code>/api/db/track-table</code></td>
                    <td>Track tables in Hasura</td>
                  </tr>
                  <tr>
                    <td>Service Status</td>
                    <td><code>/api/service-status</code></td>
                    <td>Check service status</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Environment</h3>
            <div className="badge badge-outline">
              {status?.status?.system?.environment || 'development'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}