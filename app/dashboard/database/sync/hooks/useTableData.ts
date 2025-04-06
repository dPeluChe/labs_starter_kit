import { useState } from "react";
import { nhost } from "@/lib/nhost";
import { gql } from "graphql-request";

export function useTableData(setResult: Function) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);
  const [showInsertForm, setShowInsertForm] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  
  // Función para cargar los datos de una tabla
  const loadTableData = async (tableName: string | null) => {
    // Añadir verificación para evitar cargar datos cuando tableName es null
    if (!tableName) {
      setSelectedTable(null);
      setTableData([]);
      setTableColumns([]);
      return;
    }
    
    setIsLoadingTableData(true);
    setSelectedTable(tableName);
    
    try {
      console.log(`Fetching data for table: ${tableName}`);
      
      // For development/testing without a real Nhost connection
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN) {
        console.log('Using mock data for development');
        // Generate mock data
        const mockData = Array(5).fill(0).map((_, i) => ({
          id: `mock-id-${i}`,
          name: `Mock Item ${i}`,
          description: `This is a mock description for item ${i}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          metadata: {}
        }));
        
        setTableData(mockData);
        setTableColumns(Object.keys(mockData[0]));
        return;
      }
      
      // Use GraphQL to fetch data
      const dynamicQuery = gql`
        query Get${tableName}Data {
          ${tableName} {
            id
            # We'll get all fields dynamically in the actual implementation
          }
        }
      `;
      
      try {
        const data = await nhost.graphql.request(dynamicQuery);
        
        if (data && data[tableName] && Array.isArray(data[tableName])) {
          setTableData(data[tableName]);
          
          // Extract columns from the first object if available
          if (data[tableName].length > 0) {
            setTableColumns(Object.keys(data[tableName][0]));
          } else {
            // If no data, try to get schema information
            await fetchTableSchema(tableName);
          }
        } else {
          console.log(`No data found for table: ${tableName}`);
          setTableData([]);
          await fetchTableSchema(tableName);
        }
      } catch (error) {
        console.error('GraphQL query error:', error);
        setResult({
          success: false,
          error: 'Error fetching data via GraphQL. The table might not exist or you may not have permission to access it.',
          visible: true
        });
        setTableData([]);
        setTableColumns([]);
      }
    } catch (error) {
      console.error('Error loading table data:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        visible: true
      });
    } finally {
      setIsLoadingTableData(false);
    }
  };
  
  // Helper function to fetch table schema when no data is available
  const fetchTableSchema = async (tableName: string) => {
    try {
      // For development, return mock columns
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN) {
        const mockColumns = ['id', 'name', 'description', 'created_at', 'updated_at', 'is_active', 'metadata'];
        setTableColumns(mockColumns);
        return;
      }
      
      // In a real implementation, you would use introspection to get the schema
      const introspectionQuery = gql`
        query GetTableSchema {
          __type(name: "${tableName}") {
            fields {
              name
              type {
                name
                kind
              }
            }
          }
        }
      `;
      
      const schemaData = await nhost.graphql.request(introspectionQuery);
      
      if (schemaData && schemaData.__type && schemaData.__type.fields) {
        const columnNames = schemaData.__type.fields.map((field: any) => field.name);
        setTableColumns(columnNames);
      } else {
        setTableColumns([]);
      }
    } catch (error) {
      console.error('Error fetching table schema:', error);
      setTableColumns([]);
    }
  };
  
  // Función para insertar una nueva fila usando GraphQL
  const insertRow = async () => {
    try {
      if (!selectedTable) return;
      
      const [isLoading, setIsLoading] = useState(false);
      setIsLoading(true);
      
      // Filtrar campos vacíos
      const fieldsToInsert: Record<string, any> = {};
      Object.entries(newRowData).forEach(([key, value]) => {
        if (value !== "") {
          fieldsToInsert[key] = value;
        }
      });
      
      if (Object.keys(fieldsToInsert).length === 0) {
        throw new Error("Debes completar al menos un campo");
      }
      
      // For development/testing without a real Nhost connection
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN) {
        console.log('Simulating data insertion in development mode');
        console.log('Data to insert:', fieldsToInsert);
        
        // Simulate successful insertion
        setTimeout(() => {
          setResult({
            success: true,
            message: "Datos insertados correctamente (simulado)",
            visible: true
          });
          
          // Add the new row to the table data
          setTableData([...tableData, { id: 'mock-new-id', ...fieldsToInsert }]);
          
          // Clean up the form
          const initialRowData: Record<string, any> = {};
          tableColumns.forEach(key => {
            initialRowData[key] = "";
          });
          setNewRowData(initialRowData);
          setShowInsertForm(false);
          setIsLoading(false);
        }, 1000);
        
        return;
      }
      
      // Use GraphQL mutation to insert data
      const variables = {
        object: fieldsToInsert
      };
      
      const insertMutation = gql`
        mutation Insert${selectedTable}($object: ${selectedTable}_insert_input!) {
          insert_${selectedTable}_one(object: $object) {
            id
          }
        }
      `;
      
      const response = await nhost.graphql.request(insertMutation, variables);
      
      if (response && response[`insert_${selectedTable}_one`]) {
        setResult({
          success: true,
          message: "Datos insertados correctamente",
          visible: true
        });
        
        // Reload table data
        await loadTableData(selectedTable);
        
        // Clean up the form
        const initialRowData: Record<string, any> = {};
        tableColumns.forEach(key => {
          initialRowData[key] = "";
        });
        setNewRowData(initialRowData);
        setShowInsertForm(false);
      } else {
        throw new Error("Error al insertar datos");
      }
      
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error al insertar datos',
        visible: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    selectedTable,
    setSelectedTable,
    tableData,
    tableColumns,
    isLoadingTableData,
    showInsertForm,
    setShowInsertForm,
    newRowData,
    setNewRowData,
    loadTableData,
    insertRow
  };
}