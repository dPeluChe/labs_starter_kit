
# CHANGELOG DEL PROYECTO

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