// Configuración central de temas
export type ThemeType = "light" | "dark" | "corporate" | "nord" | "cupcake" | "sunset";

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  isDark: boolean;
}

// Lista de temas disponibles
export const availableThemes: ThemeConfig[] = [
  { id: "light", name: "Light", isDark: false },
  { id: "dark", name: "Dark", isDark: true },
  { id: "corporate", name: "Corporate", isDark: false },
  { id: "nord", name: "Nord", isDark: true },
  { id: "cupcake", name: "Cupcake", isDark: false },
  { id: "sunset", name: "Sunset", isDark: true },
];

// Tema por defecto
export const defaultTheme: ThemeType = "nord";

// Tema alternativo (para el toggle)
export const alternateTheme: ThemeType = "cupcake";

// Temas para el CSS
export const cssThemes = "nord --default, sunset --prefersdark";