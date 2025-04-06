# CHANGELOG DEL PROYECTO

## [0.2.0] - 2023-06-10

### Añadido
- Panel de administración para gestión de base de datos
- Componente ModelEditor para edición de modelos de datos
- Visualización de estructura de tablas y datos
- Sistema de campos estándar automáticos para todos los modelos:
  - created_at: Timestamp de creación
  - updated_at: Timestamp de actualización
  - is_active: Flag para eliminación lógica
  - metadata: Campo JSON para datos adicionales
- Interfaz para gestión de columnas con tooltips informativos
- Visualización de ejemplos de JSON para el campo metadata
- API endpoints para sincronización de base de datos

### Mejorado
- Estructura de componentes modular para el editor de modelos
- Sistema de notificaciones para acciones del usuario
- Validación de nombres de columnas y relaciones

## [0.1.0] - 2023-05-15

### Añadido
- Configuración inicial del proyecto con Next.js 15
- Integración de Tailwind CSS 4 y DaisyUI 5
- Implementación del sistema de temas con soporte para modo oscuro
- Componentes base para la landing page:
  - Navbar con navegación suave
  - Hero section
  - Features section
  - Gallery section
  - Footer
- Configuración de rutas para landing y dashboard
- Estructura base del proyecto

### Cambios técnicos
- Migración a la nueva sintaxis de Tailwind CSS 4 con `@import "tailwindcss"`
- Implementación del plugin de DaisyUI 5 usando `@plugin "daisyui"`
- Configuración centralizada de temas en `config/themes.ts`
- Navbar con efecto sticky y transiciones al hacer scroll