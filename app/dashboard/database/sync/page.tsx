"use client"

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import CreateModelModal from "./components/CreateModelModal";
import InsertDataModal from "./components/InsertDataModal";
import Toast from './components/Toast';
import TabsLayout from "./components/TabsLayout";
import ModelsTab from "./components/ModelsTab";
import ConfigTab from "./components/ConfigTab";
import { useDatabase } from "./hooks/useDatabase";
import { useModels } from "./hooks/useModels";
import { useTableData } from "./hooks/useTableData";
import LinearProgress from "@/components/ui/LinearProgress";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ErrorToast, { ToastSeverity } from "@/components/ui/ErrorToast";

export default function DatabaseSyncPage() {
  // State for global loading
  const [globalLoading, setGlobalLoading] = useState(false);
  
  // Use our custom hooks
  const { 
    isLoading, 
    isFetchingTables, 
    existingTables, 
    result, 
    clearResult, 
    handleSync, 
    syncSpecificModel,
    setResult,
    fetchExistingTables
  } = useDatabase();
  
  // Now pass the correct function to useModels
  const {
    showCreateModel,
    setShowCreateModel,
    modelName,
    setModelName,
    modelFields,
    availableModels,
    addField,
    updateField,
    removeField,
    createModel
  } = useModels(existingTables, setResult, fetchExistingTables);
  
  const {
    selectedTable,
    tableData,
    tableColumns,
    isLoadingTableData,
    showInsertForm,
    setShowInsertForm,
    newRowData,
    setNewRowData,
    loadTableData,
    insertRow
  } = useTableData(setResult);

  // Enhanced sync handler with global loading state
  const enhancedHandleSync = async () => {
    setGlobalLoading(true);
    try {
      await handleSync();
    } finally {
      setGlobalLoading(false);
    }
  };

  // Enhanced sync specific model handler
  const enhancedSyncSpecificModel = async (modelName: string) => {
    setGlobalLoading(true);
    try {
      await syncSpecificModel(modelName);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Linear progress indicator at the top of the page */}
      <LinearProgress 
        isLoading={globalLoading || isLoading || isFetchingTables || isLoadingTableData} 
        color="bg-primary" 
        height={3}
      />
      
      <h1 className="text-3xl font-bold mb-6">Gestor de Base de Datos</h1>
      
      {/* Enhanced Toast notifications */}
      {result && (result.visible !== false) && (
        <ErrorToast
          message={result.success ? (result.message || "") : (result.error || "")}
          severity={result.success ? 'success' : 'error'}
          onClose={clearResult}
          duration={6000}
        />
      )}
      
      {/* Tabs Layout */}
      <TabsLayout>
        {/* Models Tab */}
        <ModelsTab 
          tables={existingTables}
          isLoading={isFetchingTables}
          selectedTable={selectedTable}
          tableData={tableData}
          tableColumns={tableColumns}
          isLoadingTableData={isLoadingTableData}
          onSelectTable={loadTableData}
          onInsert={() => setShowInsertForm(true)}
          onCreateModel={() => setShowCreateModel(true)}
          TableSkeletonComponent={TableSkeleton} // Pass the skeleton component
        />
        
        {/* Config Tab */}
        <ConfigTab 
          models={availableModels}
          isLoading={isLoading}
          onSync={enhancedHandleSync} // Use enhanced handler
          onSyncModel={enhancedSyncSpecificModel} // Use enhanced handler
        />
      </TabsLayout>
      
      {/* Modal para crear modelo */}
      {showCreateModel && (
        <CreateModelModal
          modelName={modelName}
          setModelName={setModelName}
          modelFields={modelFields}
          addField={addField}
          updateField={updateField}
          removeField={removeField}
          createModel={createModel}
          isLoading={isLoading}
          setShowCreateModel={setShowCreateModel}
          existingTables={existingTables}
        />
      )}
      
      {/* Modal para insertar datos */}
      {showInsertForm && selectedTable && (
        <InsertDataModal
          selectedTable={selectedTable}
          tableColumns={tableColumns}
          newRowData={newRowData}
          setNewRowData={setNewRowData}
          isLoading={isLoading}
          insertRow={insertRow}
          setShowInsertForm={setShowInsertForm}
        />
      )}
    </div>
  );
}