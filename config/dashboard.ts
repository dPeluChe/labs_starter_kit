// ... existing code ...

export const dashboardConfig = {
  mainNav: [
    // ... existing navigation items ...
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    // ... other existing items ...
    
    // Añadir la sección de Base de Datos
    {
      title: "Base de Datos",
      icon: "database",
      items: [
        {
          title: "Sincronizar Modelos",
          href: "/dashboard/database/sync",
          icon: "refresh",
        },
        {
          title: "Explorador GraphQL",
          href: "/dashboard/graphql-explorer",
          icon: "code",
        },
      ],
    },
    
    // ... other existing items ...
    
    // Quitar la opción de API Test si ya existe y no se necesita
    // {
    //   title: "API Test",
    //   href: "/dashboard/api-test",
    //   icon: "testTube",
    // },
  ],
}

// ... existing code ...