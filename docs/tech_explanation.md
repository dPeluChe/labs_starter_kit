# Explicación Técnica

Este documento proporciona detalles técnicos sobre las características y componentes clave del proyecto Feedby Starter Kit.

## Arquitectura del Sistema

El proyecto está construido con Next.js 15 utilizando el App Router, lo que permite una estructura de rutas basada en el sistema de archivos y renderizado híbrido (servidor/cliente).

### Estructura de Componentes

Los componentes están organizados siguiendo un patrón modular:

- **Componentes de UI**: Elementos reutilizables y genéricos
- **Componentes de Landing**: Específicos para la página de aterrizaje
- **Componentes de Dashboard**: Para la interfaz de administración

## Sistema de Gestión de Base de Datos

### ModelEditor

El componente `ModelEditor` permite la creación y edición de modelos de datos (tablas) con las siguientes características:

- Visualización de columnas existentes
- Adición de nuevas columnas con validación
- Eliminación de columnas
- Gestión de relaciones entre tablas
- Campos estándar automáticos

#### Campos Estándar

Cada modelo incluye automáticamente estos campos estándar:

1. **created_at**
   - Tipo: date/timestamp
   - Propósito: Registra cuándo se creó el registro
   - Comportamiento: Se establece automáticamente al crear el registro y no debe modificarse

2. **updated_at**
   - Tipo: date/timestamp
   - Propósito: Registra la última actualización
   - Comportamiento: Se actualiza automáticamente cada vez que el registro es modificado

3. **is_active**
   - Tipo: boolean
   - Propósito: Indica si el registro está activo
   - Uso: Facilita la implementación de eliminación lógica (soft delete)
   - Valor predeterminado: true

4. **metadata**
   - Tipo: json
   - Propósito: Almacena datos adicionales sin necesidad de modificar el esquema
   - Casos de uso:
     - Almacenar preferencias de usuario
     - Guardar atributos extendidos
     - Información de versiones
     - Datos de integración con terceros
     - Datos temporales o experimentales

### Campo Metadata

El campo `metadata` es particularmente útil por su flexibilidad. Permite almacenar datos estructurados en formato JSON sin necesidad de modificar el esquema de la base de datos.

Ejemplo de uso:

```json
{
  "tags": ["importante", "destacado"],
  "analytics": {
    "vistas": 1250,
    "conversiones": 35
  },
  "camposPersonalizados": {
    "color": "azul",
    "tamaño": "mediano"
  }
}
```

Beneficios:

- Reduce la necesidad de migraciones frecuentes
- Facilita el prototipado rápido
- Permite personalización sin cambios en el esquema
- Simplifica la integración con sistemas externos

## API de Sincronización
El sistema incluye endpoints de API para:

- Obtener la lista de tablas
- Consultar la estructura de una tabla
- Obtener datos de una tabla
- Crear/actualizar modelos

Estos endpoints facilitan la sincronización entre la interfaz de usuario y la base de datos, permitiendo una gestión visual de los modelos de datos.

## Interfaz de Usuario
La interfaz utiliza DaisyUI 5 sobre Tailwind CSS 4, proporcionando:

- Componentes pre-estilizados
- Sistema de temas con soporte para modo oscuro
- Diseño responsive
- Tooltips informativos para campos estándar
- Visualización de ejemplos para campos JSON