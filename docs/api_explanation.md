# API Documentation

Este documento detalla los endpoints de API disponibles en el proyecto Feedby Starter Kit, su funcionamiento, parámetros y respuestas.

## Índice de Endpoints

- [Obtener Lista de Tablas](#obtener-lista-de-tablas)
- [Obtener Estructura de Tabla](#obtener-estructura-de-tabla)
- [Obtener Datos de Tabla](#obtener-datos-de-tabla)
- [Crear Modelo](#crear-modelo)
- [Actualizar Modelo](#actualizar-modelo)
- [Insertar Datos](#insertar-datos)

## Base URL

Todos los endpoints están disponibles bajo la ruta base:

/api

## Endpoints de Sincronización de Base de Datos

Los siguientes endpoints permiten la gestión y sincronización de la base de datos.

### Obtener Lista de Tablas

Recupera todas las tablas disponibles en la base de datos.

- **URL**: `/api/db-sync/get-tables`
- **Método**: `GET`
- **Autenticación**: Requerida

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "tables": [
    "users",
    "products",
    "orders",
    "categories"
  ]
}
```

 Respuesta de Error (400, 401, 500)

```json
{
  "success": false,
  "error": "Mensaje de error"
}
 ```

### Obtener Estructura de Tabla
Recupera la estructura detallada de una tabla específica.

- URL : `/api/db-sync/get-table-structure`
- Método : `GET`
- Autenticación : Requerida
- Parámetros de Query :
  - table (requerido): Nombre de la tabla

Respuesta Exitosa (200 OK)
```json
{
  "success": true,
  "columns": [
    {
      "name": "id",
      "type": "integer",
      "nullable": false,
      "default": null,
      "isPrimaryKey": true,
      "referencesTable": null
    },
    {
      "name": "name",
      "type": "varchar(255)",
      "nullable": false,
      "default": null,
      "isPrimaryKey": false,
      "referencesTable": null
    },
    {
      "name": "created_at",
      "type": "timestamp",
      "nullable": false,
      "default": "CURRENT_TIMESTAMP",
      "isPrimaryKey": false,
      "referencesTable": null
    }
  ]
}
 ```
 Respuesta de Error (400, 401, 500)
```json
{
  "success": false,
  "error": "Tabla no encontrada"
}
 ```

### Obtener Datos de Tabla
Recupera los datos de una tabla específica.

- URL : `/api/db-sync/get-table-data`
- Método : `GET`
- Autenticación : Requerida
- Parámetros de Query :
  - table (requerido): Nombre de la tabla
  - limit (opcional): Número máximo de registros a devolver (default: 100)
  - offset (opcional): Número de registros a saltar (default: 0)


Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ejemplo 1",
      "created_at": "2023-06-10T12:00:00Z"
    },
    {
      "id": 2,
      "name": "Ejemplo 2",
      "created_at": "2023-06-11T14:30:00Z"
    }
  ],
  "total": 45,
  "limit": 10,
  "offset": 0
}
 ```
 Respuesta de Error (400, 401, 500)
```json
{
  "success": false,
  "error": "Error al obtener datos de la tabla"
}
 ```

### Crear Modelo
Crea un nuevo modelo (tabla) en la base de datos.

- URL : `/api/db-sync/create-model`
- Método : `POST`
- Autenticación : Requerida
- Cuerpo de la Solicitud :
```json
{
  "tableName": "new_model",
  "columns": [
    {
      "name": "id",
      "type": "number",
      "isPrimaryKey": true
    },
    {
      "name": "title",
      "type": "string"
    },
    {
      "name": "category_id",
      "type": "number",
      "relationTable": "categories",
      "relationType": "manyToOne"
    }
  ]
}
 ```
 Respuesta Exitosa (200 OK)
```json
{
  "success": true,
  "message": "Modelo creado correctamente"
}
 ```
 Respuesta de Error (400, 401, 500)
```json
{
  "success": false,
  "error": "Error al crear el modelo"
}
 ```

### Actualizar Modelo
Actualiza un modelo (tabla) existente en la base de datos.

- URL : `/api/db-sync/update-model`
- Método : `PUT`
- Autenticación : Requerida
- Cuerpo de la Solicitud :

```json
{
  "tableName": "existing_model",
  "columns": [
    {
      "name": "id",
      "type": "number",
      "isPrimaryKey": true
    },
    {
      "name": "title",
      "type": "string"
    },
    {
      "name": "description",
      "type": "string"
    }
  ]
}

 ```
 Respuesta Exitosa (200 OK)
```json
{
  "success": true,
  "message": "Modelo actualizado correctamente"
}
 ```
 Respuesta de Error (400, 401, 500)
```json
{
  "success": false,
  "error": "Error al actualizar el modelo"
}
 ```

### Insertar Datos
Inserta nuevos datos en una tabla específica.

- URL : `/api/db-sync/insert-data`
- Método : `POST`
- Autenticación : Requerida
- Cuerpo de la Solicitud :
```json
{
  "tableName": "users",
  "data": {
    "name": "Nuevo Usuario",
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
 ```
 Respuesta Exitosa (200 OK)
```json
{
  "success": true,
  "message": "Datos insertados correctamente",
  "id": 123
}
 ```
 Respuesta de Error (400, 401, 500)
```json
{
  "success": false,
  "error": "Error al insertar datos"
}
 ```

## Códigos de Estado HTTP
- `200 OK` : La solicitud se completó correctamente
- `400 Bad Request` : La solicitud contiene parámetros inválidos o faltantes
- `401 Unauthorized` : Autenticación requerida o inválida
- `403 Forbidden` : El usuario no tiene permisos para acceder al recurso
- `404 Not Found` : El recurso solicitado no existe
- `500 Internal Server Error` : Error interno del servidor
## Manejo de Errores
Todas las respuestas de error siguen el mismo formato:

```json
{
  "success": false,
  "error": "Descripción del error"
}
 ```

## Campos Estándar
Todos los modelos creados a través de la API incluirán automáticamente estos campos estándar:

- created_at : Fecha y hora de creación del registro
- updated_at : Fecha y hora de la última actualización
- is_active : Indicador de estado activo (para eliminación lógica)
- metadata : Campo JSON para datos adicionales


## Consideraciones de Seguridad
- Todas las solicitudes deben incluir autenticación adecuada
- Los nombres de tablas y columnas son validados para prevenir inyección SQL
- Se recomienda utilizar HTTPS para todas las solicitudes a la API
- Las operaciones de escritura (POST, PUT) requieren verificación adicional de permisos

