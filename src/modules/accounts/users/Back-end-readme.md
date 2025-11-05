# API Documentation - Módulo Users

## Información General

**Base URL:** `http://localhost:5000/api/v1` (desarrollo)  
**Autenticación:** OAuth2 con Microsoft Identity (OpenID Connect)  
**CORS:** Configurado para `http://localhost:5173`  
**Requiere Autenticación:** ✅ Todos los endpoints

---

## Tabla de Contenidos

- [Descripción del Módulo](#descripción-del-módulo)
- [Endpoints](#endpoints)
  - [Crear Usuario](#1-crear-usuario)
  - [Obtener Usuarios de una Cuenta](#2-obtener-usuarios-de-una-cuenta)
  - [Actualizar Usuario](#3-actualizar-usuario)
  - [Desactivar Usuario](#4-desactivar-usuario)
  - [Activar Usuario](#5-activar-usuario)
- [Modelos de Datos](#modelos-de-datos)
- [Validaciones](#validaciones)
- [Códigos de Respuesta](#códigos-de-respuesta)

---

## Descripción del Módulo

El módulo **Users** gestiona las operaciones relacionadas con los usuarios dentro de una cuenta específica del sistema. Los usuarios son miembros de una cuenta con roles asignados (Admin o User).

### Características Principales

- ✅ **Creación de Usuarios:** Crear usuarios dentro de una cuenta con rol específico (Admin o User)
- ✅ **Gestión de Estado:** Los usuarios pueden activarse o desactivarse
- ✅ **Actualización:** Modificar información del usuario y su rol
- ✅ **Consulta:** Obtener listado de usuarios de una cuenta específica
- ✅ **Restricciones de Rol:** No se puede crear ni modificar usuarios con rol Owner

### Relación Usuario-Cuenta

Cada usuario tiene asociado:

- **User** (Usuario): Información personal del usuario
- **AccountsUsers** (Relación): Vincula el usuario con la cuenta y define su rol

### Roles Disponibles

| Rol     | Descripción                         | Puede Asignarse                               |
| ------- | ----------------------------------- | --------------------------------------------- |
| `Owner` | Propietario de la cuenta            | ❌ No (se crea automáticamente con la cuenta) |
| `Admin` | Administrador con permisos elevados | ✅ Sí                                         |
| `User`  | Usuario estándar                    | ✅ Sí                                         |

### Reglas de Negocio

1. **Al crear un usuario:**

   - Se asocia a una cuenta específica
   - Se le asigna un rol (Admin o User)
   - NO se puede asignar el rol Owner
   - El usuario se crea activo por defecto (`isActive: true`)

2. **Al desactivar un usuario:**

   - El usuario cambia su estado a `isActive: false`
   - NO se puede desactivar usuarios con rol Owner
   - Los datos NO se eliminan

3. **Al activar un usuario:**

   - El usuario cambia su estado a `isActive: true`
   - NO se puede activar usuarios con rol Owner

4. **Al actualizar un usuario:**
   - Se actualiza la información personal
   - Se puede cambiar el rol (excepto a/desde Owner)
   - NO se puede modificar usuarios con rol Owner
   - Se valida que no haya duplicados (email, teléfono)

---

## Endpoints

### 1. Crear Usuario

```http
POST /api/v1/accounts/{accountId}/users
```

**Descripción:** Crea un nuevo usuario dentro de una cuenta específica con un rol asignado.

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta donde se creará el usuario

**Headers:**

```
Content-Type: application/json
Cookie: [sesión de autenticación]
```

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+34611234567",
  "role": "Admin"
}
```

**Validaciones del Request:**

| Campo   | Requerido | Min Length | Max Length | Formato      | Valores Permitidos |
| ------- | --------- | ---------- | ---------- | ------------ | ------------------ |
| `name`  | ✅        | 2          | 256        | Texto libre  | -                  |
| `email` | ✅        | -          | -          | Email válido | -                  |
| `phone` | ✅        | 7          | 15         | Texto libre  | -                  |
| `role`  | ✅        | -          | -          | Texto        | "Admin", "User"    |

**Respuesta Exitosa (201 Created):**

```json
{
  "id": "7ba95f64-1234-4562-b3fc-2c963f66afa7",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+34611234567",
  "isActive": true,
  "role": "Admin"
}
```

**Headers de Respuesta:**

```
Location: /api/v1/accounts/{accountId}/users/7ba95f64-1234-4562-b3fc-2c963f66afa7
Content-Type: application/json
```

**Errores Posibles:**

**404 Not Found** - Cuenta no existe:

```json
{
  "message": "Account with ID '{accountId}' does not exist."
}
```

**409 Conflict** - Email duplicado:

```json
{
  "message": "A user with the email 'jane.smith@example.com' already exists."
}
```

**409 Conflict** - Teléfono duplicado:

```json
{
  "message": "A user with the phone number '+34611234567' already exists."
}
```

**400 Bad Request** - Rol Owner no permitido:

```json
{
  "errors": {
    "Request": ["Cannot assign Owner role to a user."]
  }
}
```

**400 Bad Request** - Rol inválido:

```json
{
  "errors": {
    "Request": ["Role must be Admin or User."]
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

```json
{
  "errors": {
    "Request": ["Invalid account ID format."]
  }
}
```

---

### 2. Obtener Usuarios de una Cuenta

```http
GET /api/v1/accounts/{accountId}/users
```

**Descripción:** Obtiene la lista completa de usuarios asociados a una cuenta específica.

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta

**Headers:**

```
Cookie: [sesión de autenticación]
```

**Respuesta Exitosa (200 OK):**

```json
[
  {
    "id": "7ba95f64-1234-4562-b3fc-2c963f66afa7",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+34611234567",
    "isActive": true,
    "role": "Admin"
  },
  {
    "id": "8cb15f64-5678-4562-b3fc-2c963f66afa8",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+34622345678",
    "isActive": false,
    "role": "User"
  }
]
```

**Respuesta cuando no hay usuarios:**

```json
[]
```

**Errores Posibles:**

**404 Not Found** - Cuenta no existe:

```json
{
  "message": "Account with ID '{accountId}' does not exist."
}
```

**400 Bad Request** - ID inválido:

```json
{
  "errors": {
    "Request": ["Invalid account ID format."]
  }
}
```

---

### 3. Actualizar Usuario

```http
PUT /api/v1/accounts/{accountId}/users/{userId}
```

**Descripción:** Actualiza la información de un usuario existente dentro de una cuenta.

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta
- `userId` (UUID): ID del usuario a actualizar

**Headers:**

```
Content-Type: application/json
Cookie: [sesión de autenticación]
```

**Request Body:**

```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "+34611999888",
  "role": "User"
}
```

**Validaciones del Request:**

| Campo   | Requerido | Min Length | Max Length | Formato      | Valores Permitidos |
| ------- | --------- | ---------- | ---------- | ------------ | ------------------ |
| `name`  | ✅        | 2          | 256        | Texto libre  | -                  |
| `email` | ✅        | -          | -          | Email válido | -                  |
| `phone` | ✅        | 7          | 15         | Texto libre  | -                  |
| `role`  | ✅        | -          | -          | Texto        | "Admin", "User"    |

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "7ba95f64-1234-4562-b3fc-2c963f66afa7",
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "+34611999888",
  "isActive": true,
  "role": "User"
}
```

**Errores Posibles:**

**404 Not Found** - Cuenta no existe:

```json
{
  "message": "Account with ID '{accountId}' does not exist."
}
```

**404 Not Found** - Usuario no existe:

```json
{
  "message": "User with ID '{userId}' does not exist."
}
```

**404 Not Found** - Usuario no pertenece a la cuenta:

```json
{
  "message": "User with ID '{userId}' does not belong to account '{accountId}'."
}
```

**400 Bad Request** - Intento de modificar Owner:

```json
{
  "message": "Cannot modify the Owner user."
}
```

**409 Conflict** - Email duplicado:

```json
{
  "message": "A user with the email 'jane.updated@example.com' already exists."
}
```

**409 Conflict** - Teléfono duplicado:

```json
{
  "message": "A user with the phone number '+34611999888' already exists."
}
```

**400 Bad Request** - Rol Owner no permitido:

```json
{
  "errors": {
    "Request": ["Cannot assign Owner role to a user."]
  }
}
```

**400 Bad Request** - ID de cuenta inválido:

```json
{
  "errors": {
    "Request": ["Invalid account ID format."]
  }
}
```

**400 Bad Request** - ID de usuario inválido:

```json
{
  "errors": {
    "Request": ["Invalid user ID format."]
  }
}
```

---

### 4. Desactivar Usuario

```http
POST /api/v1/accounts/{accountId}/users/{userId}/deactivate
```

**Descripción:** Desactiva un usuario dentro de una cuenta. Los datos NO se eliminan.

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta
- `userId` (UUID): ID del usuario a desactivar

**Headers:**

```
Cookie: [sesión de autenticación]
```

**Request Body:** Ninguno

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "7ba95f64-1234-4562-b3fc-2c963f66afa7",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+34611234567",
  "isActive": false,
  "role": "Admin"
}
```

**Errores Posibles:**

**404 Not Found** - Cuenta no existe:

```json
{
  "message": "Account with ID '{accountId}' does not exist."
}
```

**404 Not Found** - Usuario no existe:

```json
{
  "message": "User with ID '{userId}' does not exist."
}
```

**404 Not Found** - Usuario no pertenece a la cuenta:

```json
{
  "message": "User with ID '{userId}' does not belong to account '{accountId}'."
}
```

**400 Bad Request** - Intento de desactivar Owner:

```json
{
  "message": "Cannot deactivate the Owner user."
}
```

**400 Bad Request** - ID inválido:

```json
{
  "errors": {
    "Request": ["Invalid account ID format."]
  }
}
```

---

### 5. Activar Usuario

```http
POST /api/v1/accounts/{accountId}/users/{userId}/activate
```

**Descripción:** Activa un usuario dentro de una cuenta.

**Parámetros de Ruta:**

- `accountId` (UUID): ID de la cuenta
- `userId` (UUID): ID del usuario a activar

**Headers:**

```
Cookie: [sesión de autenticación]
```

**Request Body:** Ninguno

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "7ba95f64-1234-4562-b3fc-2c963f66afa7",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+34611234567",
  "isActive": true,
  "role": "Admin"
}
```

**Errores Posibles:**

**404 Not Found** - Cuenta no existe:

```json
{
  "message": "Account with ID '{accountId}' does not exist."
}
```

**404 Not Found** - Usuario no existe:

```json
{
  "message": "User with ID '{userId}' does not exist."
}
```

**404 Not Found** - Usuario no pertenece a la cuenta:

```json
{
  "message": "User with ID '{userId}' does not belong to account '{accountId}'."
}
```

**400 Bad Request** - Intento de activar Owner:

```json
{
  "message": "Cannot activate the Owner user."
}
```

**400 Bad Request** - ID inválido:

```json
{
  "errors": {
    "Request": ["Invalid user ID format."]
  }
}
```

---

## Modelos de Datos

### Request: Crear Usuario

```json
{
  "name": "string (2-256 caracteres, requerido)",
  "email": "string (formato email válido, requerido)",
  "phone": "string (7-15 caracteres, requerido)",
  "role": "string ('Admin' o 'User', requerido)"
}
```

### Request: Actualizar Usuario

```json
{
  "name": "string (2-256 caracteres, requerido)",
  "email": "string (formato email válido, requerido)",
  "phone": "string (7-15 caracteres, requerido)",
  "role": "string ('Admin' o 'User', requerido)"
}
```

### Response: Información de Usuario

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "isActive": "boolean",
  "role": "string ('Owner', 'Admin', o 'User')"
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

### name

| Regla       | Valor | Mensaje de Error                                 |
| ----------- | ----- | ------------------------------------------------ |
| Requerido   | Sí    | "Invalid user name."                             |
| Min Length  | 2     | "Invalid user name."                             |
| Max Length  | 256   | "Invalid user name."                             |
| No Espacios | Sí    | "Invalid user name." (si solo contiene espacios) |

### email

| Regla         | Valor                                 | Mensaje de Error        |
| ------------- | ------------------------------------- | ----------------------- |
| Requerido     | Sí                                    | "Invalid email format." |
| Formato Email | pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Invalid email format." |

### phone

| Regla       | Valor | Mensaje de Error                                  |
| ----------- | ----- | ------------------------------------------------- |
| Requerido   | Sí    | "Invalid user phone."                             |
| Min Length  | 7     | "Invalid user phone."                             |
| Max Length  | 15    | "Invalid user phone."                             |
| No Espacios | Sí    | "Invalid user phone." (si solo contiene espacios) |

### role

| Regla           | Valor                | Mensaje de Error                      |
| --------------- | -------------------- | ------------------------------------- |
| Requerido       | Sí                   | "Invalid role."                       |
| Valores Válidos | "Admin", "User"      | "Role must be Admin or User."         |
| No Owner        | No puede ser "Owner" | "Cannot assign Owner role to a user." |

### accountId (en rutas)

| Regla        | Valor | Mensaje de Error                                |
| ------------ | ----- | ----------------------------------------------- |
| Formato UUID | Sí    | "Invalid account ID format."                    |
| Existe       | Sí    | "Account with ID '{accountId}' does not exist." |

### userId (en rutas)

| Regla              | Valor | Mensaje de Error                                                    |
| ------------------ | ----- | ------------------------------------------------------------------- |
| Formato UUID       | Sí    | "Invalid user ID format."                                           |
| Existe             | Sí    | "User with ID '{userId}' does not exist."                           |
| Pertenece a Cuenta | Sí    | "User with ID '{userId}' does not belong to account '{accountId}'." |

**Patrón UUID:** `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` (case insensitive)

---

## Códigos de Respuesta

### Códigos de Éxito

| Código | Nombre  | Descripción                 | Endpoints que lo usan                |
| ------ | ------- | --------------------------- | ------------------------------------ |
| 200    | OK      | Operación exitosa           | GET, PUT, POST (activate/deactivate) |
| 201    | Created | Recurso creado exitosamente | POST (create)                        |

### Códigos de Error

| Código | Nombre                | Descripción        | Cuándo ocurre                                               |
| ------ | --------------------- | ------------------ | ----------------------------------------------------------- |
| 400    | Bad Request           | Datos inválidos    | Validación fallida, ID inválido, intento de modificar Owner |
| 401    | Unauthorized          | No autenticado     | Usuario no ha iniciado sesión                               |
| 404    | Not Found             | Recurso no existe  | Cuenta o usuario no encontrado                              |
| 409    | Conflict              | Conflicto de datos | Duplicados (email, teléfono)                                |
| 500    | Internal Server Error | Error del servidor | Error no controlado                                         |

---

## Testing de Endpoints

### Ejemplos con cURL

```bash
# 1. Crear usuario
curl -X POST http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+34611234567",
    "role": "Admin"
  }'

# 2. Obtener todos los usuarios de una cuenta
curl -X GET http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/users \
  -b cookies.txt

# 3. Actualizar usuario
curl -X PUT http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/users/7ba95f64-1234-4562-b3fc-2c963f66afa7 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone": "+34611999888",
    "role": "User"
  }'

# 4. Desactivar usuario
curl -X POST http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/users/7ba95f64-1234-4562-b3fc-2c963f66afa7/deactivate \
  -b cookies.txt

# 5. Activar usuario
curl -X POST http://localhost:5000/api/v1/accounts/3fa85f64-5717-4562-b3fc-2c963f66afa6/users/7ba95f64-1234-4562-b3fc-2c963f66afa7/activate \
  -b cookies.txt
```

---

## Notas Importantes

1. **Autenticación:** Todas las peticiones requieren cookie de sesión OAuth2 con Microsoft Identity
2. **CORS:** Las peticiones deben originarse desde `http://localhost:5173`
3. **IDs:** Todos los IDs son UUIDs en formato string
4. **Roles:** Solo se puede asignar "Admin" o "User". El rol "Owner" se asigna automáticamente al crear una cuenta
5. **Restricción Owner:** No se puede crear, modificar, activar ni desactivar usuarios con rol Owner
6. **Estados:** `isActive` true = activo, false = desactivado (NO eliminado)
7. **Validación:** El backend valida todos los campos; el frontend debería hacer validación preventiva
8. **Sesión Expirada:** Respuestas 401 indican sesión expirada - redirigir a `/api/v1/auth/sign-in`
9. **Pertenencia:** Un usuario solo puede ser gestionado dentro de la cuenta a la que pertenece

---

**Versión del documento:** 1.0  
**Última actualización:** 5 de noviembre de 2025  
**Módulo:** Users  
**Backend:** ASP.NET Core 8 - Minimal APIs
