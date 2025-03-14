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

## Inicio rápido

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Visita http://localhost:3000 para ver la aplicación.

## Estructura del proyecto
```plaintext
/
├── app/                    # App Router de Next.js
│   ├── (landing)/          # Grupo de rutas para la landing page
│   ├── dashboard/          # Rutas para el dashboard
│   └── globals.css         # Estilos globales
├── components/             # Componentes reutilizables
│   ├── landing/            # Componentes específicos de la landing
│   └── ui/                 # Componentes de UI genéricos
├── config/                 # Configuraciones globales
│   └── themes.ts           # Configuración de temas
├── public/                 # Archivos estáticos
└── docs/                   # Documentación
 ```

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