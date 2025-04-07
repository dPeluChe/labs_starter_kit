# Feedby - Starter Kit

Este proyecto es un starter kit para aplicaciones de feedback, construido con Next.js 15, Tailwind CSS 4 y DaisyUI 5.

## Características

- 🚀 Next.js 15 con App Router
- 🎨 Tailwind CSS 4 para estilos
- 🧩 DaisyUI 5 como biblioteca de componentes
- 🌓 Soporte para múltiples temas y modo oscuro
- 📱 Diseño responsive
- 🔄 Navegación con scroll suave
- 🔒 Estructura de proyecto organizada y escalable
- 📊 Panel de administración con gestión de base de datos
- 🗄️ Sincronización y gestión de modelos de datos
- 🔍 Visualización y edición de datos en tablas
- 🧰 Campos estándar automáticos para todos los modelos
- 🔌 Integración con Nhost para GraphQL y gestión de base de datos
- 🔄 Simulación de operaciones para desarrollo sin dependencias externas

## Inicio rápido

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Visita http://localhost:3000 para ver la aplicación.

## Configuración de entorno
Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:

```plaintext
# Nhost/Hasura
NEXT_PUBLIC_NHOST_SUBDOMAIN=tu-subdomain
NEXT_PUBLIC_NHOST_REGION=tu-region
NEXT_PUBLIC_NHOST_GRAPHQL_URL=https://tu-subdomain.db.tu-region.nhost.run/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=tu-admin-secret

# Conexión a PostgreSQL (opcional)
NHOST_PUBLIC_URL=tu-subdomain.db.tu-region.nhost.run
NHOST_POSTGRESS_PORT=5432
NHOST_POSTGRESS_DB_NAME=tu-db-name
NHOST_POSTGRESS_DB_USR=postgres
NHOST_POSTGRESS_DB_PASS=tu-password
NHOST_POSTGRESS_URI=postgres://postgres:tu-password@tu-subdomain.db.tu-region.nhost.run:5432/
```

## Estructura del proyecto
```plaintext
/
├── app/                    # App Router de Next.js
│   ├── (landing)/          # Grupo de rutas para la landing page
│   ├── dashboard/          # Rutas para el dashboard
│   │   ├── database/       # Gestión de base de datos
│   │   │   └── sync/       # Sincronización y gestión de modelos
│   │   └── layout.tsx      # Layout del dashboard
│   ├── api/                # Rutas de API
│   │   └── db-sync/        # Endpoints para sincronización de DB
│   └── globals.css         # Estilos globales
├── components/             # Componentes reutilizables
│   ├── landing/            # Componentes específicos de la landing
│   └── ui/                 # Componentes de UI genéricos
├── config/                 # Configuraciones globales
│   └── themes.ts           # Configuración de temas
├── public/                 # Archivos estáticos
└── docs/                   # Documentación
    ├── changelog.md        # Registro de cambios
    └── tech_explanation.md # Explicaciones técnicas
```

## Campos estándar en modelos
Todos los modelos creados incluyen automáticamente estos campos estándar:

- created_at : Fecha y hora de creación del registro
- updated_at : Fecha y hora de la última actualización
- is_active : Indicador de estado activo (para eliminación lógica)
- metadata : Campo JSON para datos adicionales sin modificar el esquema

## Modo de desarrollo
El sistema incluye un modo de simulación para desarrollo que permite trabajar sin una conexión activa a Nhost/Hasura. Esto facilita el desarrollo y pruebas de la interfaz de usuario sin depender de servicios externos.

## Temas disponibles
El proyecto incluye soporte para varios temas de DaisyUI:

- Light
- Dark
- Corporate
- Nord
- Cupcake
- Sunset
## Licencia
MIT