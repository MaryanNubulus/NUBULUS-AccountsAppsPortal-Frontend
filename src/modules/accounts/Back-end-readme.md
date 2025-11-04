# API Documentation - Módulo Accounts

## Información General

**Base URL:** `http://localhost:5000/api/v1` (desarrollo)  
**Autenticación:** OAuth2 con Microsoft Identity (OpenID Connect)  
**CORS:** Configurado para `http://localhost:5173`  
**Requiere Autenticación:** ✅ Todos los endpoints

---

## Tabla de Contenidos

- [Descripción del Módulo](#descripción-del-módulo)
- [Endpoints](#endpoints)
  - [Crear Cuenta](#1-crear-cuenta)
  - [Obtener Todas las Cuentas](#2-obtener-todas-las-cuentas)
  - [Actualizar Cuenta](#3-actualizar-cuenta)
  - [Desactivar Cuenta](#4-desactivar-cuenta)
  - [Activar Cuenta](#5-activar-cuenta)
- [Modelos de Datos](#modelos-de-datos)
- [Validaciones](#validaciones)
- [Códigos de Respuesta](#códigos-de-respuesta)

---

## Descripción del Módulo

El módulo **Accounts** gestiona las operaciones relacionadas con las cuentas del sistema. Cada cuenta representa una organización o empresa y tiene asociado un usuario propietario.

### Características Principales

- ✅ **Creación de Cuentas:** Al crear una cuenta se crea automáticamente un usuario propietario
- ✅ **Gestión de Estado:** Las cuentas pueden activarse o desactivarse
- ✅ **Actualización:** Modificar información de la cuenta y su usuario propietario
- ✅ **Consulta:** Obtener listado completo de todas las cuentas

### Relación Cuenta-Usuario

Cada cuenta tiene asociado:

- **Account** (Cuenta): Información de la organización
- **User** (Usuario Propietario): Datos del contacto principal
- **AccountsUsers** (Relación): Vincula el usuario propietario con la cuenta

### Reglas de Negocio

1. **Al crear una cuenta:**

   - Se crea automáticamente un usuario propietario
   - Se establece la relación AccountsUsers
   - La cuenta se crea activa por defecto (`isActive: true`)

2. **Al desactivar una cuenta:**

   - La cuenta cambia su estado a `isActive: false`
   - Todos los usuarios asociados se desactivan
   - Los datos NO se eliminan

3. **Al activar una cuenta:**

   - La cuenta cambia su estado a `isActive: true`
   - Todos los usuarios asociados se activan

4. **Al actualizar una cuenta:**
   - Se actualiza la información de la cuenta
   - Se actualiza la información del usuario propietario
   - Se valida que no haya duplicados (nombre, email, teléfono)

---

## Endpoints

### 1. Crear Cuenta

```http
POST /api/v1/accounts
```

**Descripción:** Crea una nueva cuenta con un usuario propietario asociado.

**Headers:**

```
Content-Type: application/json
Cookie: [sesión de autenticación]
```

**Request Body:**

```json
{
  "accountName": "Acme Corporation",
  "userName": "John Doe",
  "userEmail": "john.doe@acme.com",
  "userPhone": "+34600123456"
}
```

**Validaciones del Request:**

| Campo         | Requerido | Min Length | Max Length | Formato      |
| ------------- | --------- | ---------- | ---------- | ------------ |
| `accountName` | ✅        | 2          | 256        | Texto libre  |
| `userName`    | ✅        | 2          | 256        | Texto libre  |
| `userEmail`   | ✅        | -          | -          | Email válido |
| `userPhone`   | ✅        | 7          | 15         | Texto libre  |

**Respuesta Exitosa (201 Created):**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Acme Corporation",
  "isActive": true,
  "userName": "John Doe",
  "userEmail": "john.doe@acme.com",
  "userPhone": "+34600123456"
}
```

**Headers de Respuesta:**

```
Location: /api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6
Content-Type: application/json
```

**Errores Posibles:**

**409 Conflict** - Nombre de cuenta duplicado:

```json
{
  "message": "An account with this name already exists."
}
```

**409 Conflict** - Email de usuario duplicado:

```json
{
  "message": "A user with this email already exists."
}
```

**400 Bad Request** - Validación fallida:

```json
{
  "errors": {
    "Request": ["Invalid account name."]
  }
}
```

**Ejemplos adicionales de errores de validación:**

```json
{
  "errors": {
    "Request": ["Invalid user name."]
  }
}
```

```json
{
  "errors": {
    "Request": ["Invalid user phone."]
  }
}
```

```json
{
  "errors": {
    "Request": ["Invalid email format."]
  }
}
```

---

### 2. Obtener Todas las Cuentas

```http
GET /api/v1/accounts
```

**Descripción:** Obtiene la lista completa de cuentas registradas en el sistema.

**Headers:**

```
Cookie: [sesión de autenticación]
```

**Parámetros:** Ninguno

**Respuesta Exitosa (200 OK):**

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Acme Corporation",
    "isActive": true,
    "userName": "John Doe",
    "userEmail": "john.doe@acme.com",
    "userPhone": "+34600123456"
  },
  {
    "id": "7ba95f64-1234-4562-b3fc-2c963f66afa7",
    "name": "Tech Solutions",
    "isActive": false,
    "userName": "Jane Smith",
    "userEmail": "jane.smith@techsolutions.com",
    "userPhone": "+34611234567"
  }
]
```

**Respuesta cuando no hay cuentas:**

```json
[]
```

---

### 3. Actualizar Cuenta

```http
PUT /api/v1/accounts/{accountId}
```

**Descripción:** Actualiza la información de una cuenta existente y su usuario propietario.

**Headers:**

```
Content-Type: application/json
Cookie: [sesión de autenticación]
```

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta a actualizar
  - Ejemplo: `3fa85f64-5717-4562-b3fc-2c963f66afa6`

**Request Body:**

```json
{
  "name": "Acme Corporation Updated",
  "userName": "John Doe Jr.",
  "userEmail": "john.doe.jr@acme.com",
  "userPhone": "+34600999888"
}
```

**Validaciones del Request:**

| Campo       | Requerido | Min Length | Max Length | Formato      |
| ----------- | --------- | ---------- | ---------- | ------------ |
| `name`      | ✅        | 2          | 256        | Texto libre  |
| `userName`  | ✅        | 2          | 256        | Texto libre  |
| `userEmail` | ✅        | -          | -          | Email válido |
| `userPhone` | ✅        | 7          | 15         | Texto libre  |

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Acme Corporation Updated",
  "isActive": true,
  "userName": "John Doe Jr.",
  "userEmail": "john.doe.jr@acme.com",
  "userPhone": "+34600999888"
}
```

**Errores Posibles:**

**409 Conflict** - Nombre de cuenta duplicado:

```json
{
  "message": "An account with this name already exists."
}
```

**409 Conflict** - Email duplicado:

```json
{
  "message": "A user with this email already exists."
}
```

**409 Conflict** - Teléfono duplicado:

```json
{
  "message": "A user with this phone already exists."
}
```

**400 Bad Request** - ID inválido:

```json
{
  "errors": {
    "Request": ["Invalid ID provided."]
  }
}
```

---

### 4. Desactivar Cuenta

```http
POST /api/v1/accounts/{accountId}/deactivate
```

**Descripción:** Desactiva una cuenta y todos sus usuarios asociados. Los datos NO se eliminan.

**Headers:**

```
Cookie: [sesión de autenticación]
```

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta a desactivar

**Request Body:** Ninguno

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Acme Corporation",
  "isActive": false,
  "userName": "John Doe",
  "userEmail": "john.doe@acme.com",
  "userPhone": "+34600123456"
}
```

**Errores Posibles:**

**400 Bad Request** - ID inválido:

```json
{
  "errors": {
    "Request": ["Invalid ID provided."]
  }
}
```

---

### 5. Activar Cuenta

```http
POST /api/v1/accounts/{accountId}/activate
```

**Descripción:** Activa una cuenta y todos sus usuarios asociados.

**Headers:**

```
Cookie: [sesión de autenticación]
```

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta a activar

**Request Body:** Ninguno

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Acme Corporation",
  "isActive": true,
  "userName": "John Doe",
  "userEmail": "john.doe@acme.com",
  "userPhone": "+34600123456"
}
```

**Errores Posibles:**

**400 Bad Request** - ID inválido:

```json
{
  "errors": {
    "Request": ["Invalid ID provided."]
  }
}
```

---

## Modelos de Datos

### Request: Crear Cuenta

```json
{
  "accountName": "string (2-256 caracteres, requerido)",
  "userName": "string (2-256 caracteres, requerido)",
  "userEmail": "string (formato email válido, requerido)",
  "userPhone": "string (7-15 caracteres, requerido)"
}
```

### Request: Actualizar Cuenta

```json
{
  "name": "string (2-256 caracteres, requerido)",
  "userName": "string (2-256 caracteres, requerido)",
  "userEmail": "string (formato email válido, requerido)",
  "userPhone": "string (7-15 caracteres, requerido)"
}
```

### Response: Información de Cuenta

```json
{
  "id": "string (UUID)",
  "name": "string",
  "isActive": "boolean",
  "userName": "string",
  "userEmail": "string",
  "userPhone": "string"
}
```

### Response: Error Estándar

```json
{
  "message": "string (descripción del error)"
}
```

### Response: Error de Validación

```json
{
  "errors": {
    "campo": ["array de mensajes de error"]
  }
}
```

---

## Validaciones

### accountName / name

| Regla       | Valor | Mensaje de Error                                    |
| ----------- | ----- | --------------------------------------------------- |
| Requerido   | Sí    | "Invalid account name."                             |
| Min Length  | 2     | "Invalid account name."                             |
| Max Length  | 256   | "Invalid account name."                             |
| No Espacios | Sí    | "Invalid account name." (si solo contiene espacios) |

### userName

| Regla       | Valor | Mensaje de Error                                 |
| ----------- | ----- | ------------------------------------------------ |
| Requerido   | Sí    | "Invalid user name."                             |
| Min Length  | 2     | "Invalid user name."                             |
| Max Length  | 256   | "Invalid user name."                             |
| No Espacios | Sí    | "Invalid user name." (si solo contiene espacios) |

### userEmail

| Regla         | Valor                                 | Mensaje de Error        |
| ------------- | ------------------------------------- | ----------------------- |
| Requerido     | Sí                                    | "Invalid email format." |
| Formato Email | pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Invalid email format." |

### userPhone

| Regla       | Valor | Mensaje de Error                                  |
| ----------- | ----- | ------------------------------------------------- |
| Requerido   | Sí    | "Invalid user phone."                             |
| Min Length  | 7     | "Invalid user phone."                             |
| Max Length  | 15    | "Invalid user phone."                             |
| No Espacios | Sí    | "Invalid user phone." (si solo contiene espacios) |

### ID (accountId en rutas)

| Regla        | Valor | Mensaje de Error       |
| ------------ | ----- | ---------------------- |
| Formato UUID | Sí    | "Invalid ID provided." |
| No Vacío     | Sí    | "Invalid ID provided." |

**Patrón UUID:** `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` (case insensitive)

---

## Códigos de Respuesta

### Códigos de Éxito

| Código | Nombre  | Descripción                 | Endpoints que lo usan                |
| ------ | ------- | --------------------------- | ------------------------------------ |
| 200    | OK      | Operación exitosa           | GET, PUT, POST (activate/deactivate) |
| 201    | Created | Recurso creado exitosamente | POST (create)                        |

### Códigos de Error

| Código | Nombre                | Descripción        | Cuándo ocurre                        |
| ------ | --------------------- | ------------------ | ------------------------------------ |
| 400    | Bad Request           | Datos inválidos    | Validación fallida, ID inválido      |
| 401    | Unauthorized          | No autenticado     | Usuario no ha iniciado sesión        |
| 409    | Conflict              | Conflicto de datos | Duplicados (nombre, email, teléfono) |
| 500    | Internal Server Error | Error del servidor | Error no controlado                  |

---

## Testing de Endpoints

### Ejemplos con cURL

```bash
# 1. Crear cuenta
curl -X POST http://localhost:5000/api/v1/accounts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "accountName": "Acme Corporation",
    "userName": "John Doe",
    "userEmail": "john.doe@acme.com",
    "userPhone": "+34600123456"
  }'

# 2. Obtener todas las cuentas
curl -X GET http://localhost:5000/api/v1/accounts \
  -b cookies.txt

# 3. Actualizar cuenta
curl -X PUT http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Acme Corp Updated",
    "userName": "John Doe Jr.",
    "userEmail": "john.jr@acme.com",
    "userPhone": "+34600999888"
  }'

# 4. Desactivar cuenta
curl -X POST http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/deactivate \
  -b cookies.txt

# 5. Activar cuenta
curl -X POST http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/activate \
  -b cookies.txt
```

---

## Notas Importantes

1. **Autenticación:** Todas las peticiones requieren cookie de sesión OAuth2 con Microsoft Identity
2. **CORS:** Las peticiones deben originarse desde `http://localhost:5173`
3. **IDs:** Todos los IDs son UUIDs en formato string (ej: `3fa85f64-5717-4562-b3fc-2c963f66afa6`)
4. **Estados:** `isActive` true = activa, false = desactivada (NO eliminada)
5. **Validación:** El backend valida todos los campos; el frontend debería hacer validación preventiva
6. **Sesión Expirada:** Respuestas 401 indican sesión expirada - redirigir a `/api/v1/auth/sign-in`

---

**Versión del documento:** 1.0  
**Última actualización:** 4 de noviembre de 2025  
**Módulo:** Accounts  
**Backend:** ASP.NET Core 8 - Minimal APIs
