# NEW PROJECT PLAN ULTRA SECRETO


## Base de datos

Nos iremos por un esquema hibrydo entre Drizzle + supabase para unas futuras migraciones tenerlo más eficientemente. 
primero se haran los schemas iniciales desde la UI de supbase y posterior en drizzle se actualizaran las migraciones

### Esquema Extensible
Diseñaremos un esquema de base de datos flexible desde el inicio:
- Uso de campos `metadata` (JSONB) para extender entidades sin necesidad de migraciones
- Relaciones polimórficas para modelos que puedan conectarse con diferentes tipos de entidades
- Campos de auditoría consistentes (created_at, updated_at, created_by, updated_by)
- Soft delete para todas las entidades principales

## Autenticación

Aprovechamos a supabse para la autenticación de usuarios, ya que nos ofrece un sistema de autenticación robusto y seguro.

## File Upload archivos

Seguiremos con cloudinary por su plan gratuito y facilidad de integración, ademas de sus servicios para modificar imageenes y videos. 

## Frontend

### Estructura
Mantendremos la estructura actual con:
- Landing page pública (marketing, información)
- Dashboard privado (área de usuario, administración)

### Bibliotecas de UI
Adoptaremos un enfoque unificado con:
- **DaisyUI 4.0** como biblioteca principal de componentes UI para toda la aplicación
- **Tremor** solo para componentes específicos de visualización de datos (gráficos, tablas de datos complejas)

Esta combinación nos permitirá:
- Mantener consistencia visual en toda la aplicación
- Reducir la curva de aprendizaje para nuevos desarrolladores
- Aprovechar el sistema de temas de DaisyUI para dark/light mode
- Conservar las capacidades avanzadas de visualización de datos de Tremor

### Gestión de Estado
Utilizaremos Zustand para la gestión de estado global por su simplicidad y rendimiento:
- Mejor rendimiento que Context API
- Fácil integración con TypeScript
- API simple y directa

### APIs y Validación
- API Routes de Next.js para endpoints del backend
- Zod para validación de datos y tipado en runtime
- **Capa de servicios** entre las API routes y las consultas a la base de datos para separar la lógica de negocio

### SEO y Metadatos
Implementaremos el sistema nativo de metadatos de Next.js 14:
- Metadatos estáticos para páginas fijas
- generateMetadata para páginas dinámicas
- Optimización para Open Graph y redes sociales

### Formularios
React Hook Form con Zod para manejo de formularios:
- Mejor rendimiento con menos re-renders
- Validación integrada con Zod
- Soporte para formularios complejos

### Estructura de Carpetas

/app
/(landing)/       # Páginas públicas
/dashboard/       # Área privada
/api/             # API routes
/components
/ui/              # Componentes de UI básicos
/landing/         # Componentes específicos de landing
/dashboard/       # Componentes específicos de dashboard
/shared/          # Componentes compartidos
/lib
/db/              # Configuración de base de datos
/auth/            # Lógica de autenticación
/api/             # Lógica de API compartida
/utils/           # Utilidades generales
/services/        # Capa de servicios para lógica de negocio
/hooks/           # Custom hooks
/types/           # TypeScript types/interfaces
/public/          # Archivos estáticos
/middleware/      # Middleware de autenticación y permisos


### Deployment
Utilizaremos Vercel para el despliegue:
- Optimizado para Next.js
- CI/CD integrado con GitHub
- Previews por PR
- Analytics incluido

### Optimización de Rendimiento
- Implementación de estrategias de caché para reducir consultas a la base de datos
- Paginación en todas las consultas que puedan devolver grandes conjuntos de datos
- Lazy loading de componentes y rutas para mejorar el tiempo de carga inicial
- Optimización de imágenes con next/image

### Seguridad
- Implementación de CSRF protection
- Sanitización de inputs para prevenir XSS
- Rate limiting en APIs sensibles
- Autenticación con tokens JWT y manejo seguro de sesiones
- **Sistema de roles y permisos** para control de acceso granular

### Control de Versiones y Colaboración
- Estructura de ramas Git: main (producción), staging, develop
- Convención de commits: Conventional Commits
- Pull Requests con revisión de código obligatoria
- CI/CD desde el inicio con GitHub Actions para:
  - Linting y formateo de código
  - Verificación de tipos TypeScript
  - Ejecución de tests básicos
  - Análisis de calidad de código

### Automatización de Desarrollo
Implementaremos scripts y herramientas para facilitar el desarrollo:
- Generadores de código para componentes, páginas y servicios
- Scripts para la creación de migraciones y modelos
- Comandos personalizados para tareas recurrentes
- Plantillas predefinidas para diferentes tipos de componentes

### Documentación como Código
Mantendremos documentación técnica junto al código:
- Directorio `/docs` con documentación en Markdown
- README detallado con instrucciones de configuración
- Documentación de API generada automáticamente
- Guías de contribución y estándares de código
- Diagramas de arquitectura y flujos de datos

### Componentes de Referencia
Desarrollaremos componentes de ejemplo completos:
- CRUD completo para una entidad (ej: Productos)
- Flujo de autenticación y gestión de perfil
- Dashboard con visualizaciones de datos
- Formulario complejo con validación y subida de archivos
- Estos componentes servirán como referencia para implementaciones futuras


#### UI y Componentes
- **DaisyUI**: Componentes de UI basados en Tailwind
- **Tremor**: Componentes de visualización de datos
- **TanStack Table**: Para tablas de datos avanzadas con ordenación, filtrado y paginación
- **Tailwind CSS**: Framework de utilidades CSS
- **Tailwind Merge**: Para combinar clases de Tailwind
- **Class Variance Authority**: Para crear variantes de componentes
- **Lucide React**: Iconos
- **Heroicons**: Iconos adicionales
- **Next Themes**: Soporte para temas claro/oscuro

#### Formularios y Validación
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **Hookform Resolvers**: Integración entre React Hook Form y Zod
- **Uppy**: Mejora de experiencia de subida de archivos

#### Gestión de Estado
- **Zustand**: Gestión de estado global

#### Comunicaciones
- **Resend**: Para envío de correos electrónicos
- **Sistema de notificaciones**: Arquitectura unificada para notificaciones in-app, correos y SMS

#### Utilidades
- **Cloudinary**: Gestión de imágenes y archivos
- **Next Cloudinary**: Integración de Cloudinary con Next.js
- **UUID**: Generación de IDs únicos
- **Sonner**: Notificaciones toast
- **React Intersection Observer**: Detección de elementos en viewport
- **React Markdown**: Renderizado de markdown
- **React-PDF**: Generación y visualización de PDFs


### Componentes Personalizados

Implementaremos un sistema de componentes personalizados siguiendo estos principios:

1. **Componentes Atómicos**: Crearemos componentes base que extiendan DaisyUI
   - Cada componente tendrá una API consistente
   - Utilizaremos Class Variance Authority para manejar variantes

2. **Sistema de Composición**: Los componentes complejos se construirán componiendo componentes más simples
   - Utilizaremos el patrón Compound Components donde sea apropiado
   - Mantendremos una jerarquía clara de componentes

3. **Documentación Interna**: Cada componente personalizado incluirá:
   - Propiedades aceptadas
   - Ejemplos de uso
   - Variantes disponibles

4. **Estructura de Archivos**:
components
/ui
/button
/index.tsx       # Exportación principal
/button.tsx      # Implementación
/variants.ts     # Definición de variantes con CVA
/types.ts        # Tipos TypeScript

### Arquitectura de Aplicación

#### Sistema de Permisos
Implementaremos un sistema de roles y permisos desde el inicio utilizando CASL:
- Definición de habilidades (abilities) basadas en roles y atributos
- Integración con Supabase para obtener roles de usuario
- Middleware de autorización para proteger rutas y API endpoints
- Componentes de UI condicionales usando el hook `useAbility`
- Reglas de permisos centralizadas y reutilizables

- Roles basados en funciones (admin, usuario, editor, etc.)
- Permisos granulares para acciones específicas
- Middleware de autenticación y autorización
- Componentes de UI condicionales basados en permisos

#### API de Notificaciones
Crearemos un sistema unificado para manejar diferentes tipos de notificaciones:
- Notificaciones in-app (tiempo real con WebSockets)
- Correos electrónicos (usando Resend)
- SMS (integración futura si es necesario)
- Plantillas de notificaciones reutilizables

#### Soporte Multi-tenant
Diseñaremos la arquitectura considerando el soporte multi-tenant desde el inicio:
- Aislamiento de datos por organización/cliente
- Personalización por tenant (temas, configuraciones)
- Gestión de suscripciones y facturación por tenant

### Monitoreo y Análisis
Implementaremos PostHog para análisis y monitoreo:
- Plan basado en consumo con hasta 6 proyectos
- Seguimiento de eventos y conversiones
- Mapas de calor y grabaciones de sesión
- Análisis de embudos de conversión

### Estrategia de Caché
Implementaremos una estrategia de caché en múltiples niveles:
- Caché del lado del cliente con SWR o React Query
- Caché del servidor con LRU Cache
- Políticas de invalidación basadas en eventos
- Caché de respuestas de API para endpoints frecuentes

### Futuras Consideraciones
- Internacionalización (i18n) con next-intl cuando sea necesario
- Monitoreo de errores con Sentry en etapas posteriores
- Implementación de PWA para experiencia móvil mejorada
- Estrategia de migración de datos para actualizaciones mayores
- CI/CD automatizado con pruebas antes del merge
- Testing con Jest y React Testing Library
- **BlockNote**: Editor de texto enriquecido
- **DND Kit**: Funcionalidad de arrastrar y soltar
- **Shiki**: Resaltado de sintaxis para código


#### Seguridad y Autorización
- **CASL**: Sistema de autorización isomórfico para gestión de permisos
- **Supabase Auth**: Autenticación de usuarios