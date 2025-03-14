#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando configuración del proyecto...${NC}"

# Crear proyecto Next.js
echo -e "${GREEN}Creando proyecto Next.js...${NC}"
pnpm dlx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm

# Instalar dependencias principales iniciales
echo -e "${GREEN}Instalando dependencias principales iniciales...${NC}"
pnpm add daisyui@latest @tremor/react@latest zustand@latest zod@latest react-hook-form@latest @hookform/resolvers@latest class-variance-authority@latest clsx@latest tailwind-merge@latest

# Crear estructura de carpetas
echo -e "${GREEN}Creando estructura de carpetas...${NC}"
mkdir -p src/app/{api,dashboard,\(landing\)}
mkdir -p src/components/{ui,landing,dashboard,shared}
mkdir -p src/lib/{db,auth,api,utils}
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/middleware
mkdir -p docs
mkdir -p public

# Configuración básica de Tailwind con DaisyUI
echo -e "${GREEN}Configurando Tailwind con DaisyUI...${NC}"
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
EOL

# Crear archivo README.md básico
cat > README.md << 'EOL'
# Proyecto Base

Este proyecto está construido con Next.js 15, siguiendo el plan de arquitectura definido en `/docs/project_plan.md`.

## Inicio rápido

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

