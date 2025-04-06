import React, { useState } from "react";
import { Database, Settings } from "lucide-react";

interface TabsLayoutProps {
  children: React.ReactNode;
}

export default function TabsLayout({ children }: TabsLayoutProps) {
  const [activeTab, setActiveTab] = useState<"models" | "config">("models");
  
  // Convert children to array to make it easier to work with
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className="w-full">
      {/* Estructura de pestañas modificada para seguir el patrón de DaisyUI */}
      <div role="tablist" className="tabs tabs-boxed mb-6">
        <a 
          role="tab"
          className={`tab ${activeTab === "models" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("models")}
        >
          <Database className="h-4 w-4 mr-2" />
          Modelos
        </a>
        <a 
          role="tab"
          className={`tab ${activeTab === "config" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configuración
        </a>
      </div>
      
      {/* Contenido de las pestañas */}
      <div className="border p-4 rounded-lg">
        {/* Pestaña de Modelos */}
        <div className={activeTab === "models" ? "block" : "hidden"}>
          {childrenArray[0]}
        </div>
        
        {/* Pestaña de Configuración */}
        <div className={activeTab === "config" ? "block" : "hidden"}>
          {childrenArray[1]}
        </div>
      </div>
    </div>
  );
}