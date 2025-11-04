# Guía de Programación - NUBULUS AccountsAppsPortal Frontend

## Análisis Profundo del Proyecto

### 1. ARQUITECTURA GENERAL

#### 1.1 Stack Tecnológico

- **Framework**: React 19.1.1 con TypeScript
- **Build Tool**: Vite 5.x
- **Routing**: React Router DOM 7.9.4
- **UI Framework**:
  - Tailwind CSS 4.1.14
  - Radix UI (componentes accesibles)
  - Chakra UI 3.27.1
  - Lucide React & Tabler Icons (iconos)
- **Internacionalización**: i18next 25.6.0 + react-i18next 16.2.0
- **Animaciones**: Framer Motion 12.23.22
- **Utilidades**:
  - clsx para clases condicionales
  - tailwind-merge para merge de clases
  - class-variance-authority para variantes de componentes

#### 1.2 Estructura de Carpetas

```
src/
├── components/          # Componentes UI reutilizables (theme, language, mode-toggle)
├── hooks/              # Custom hooks (use-mobile)
├── lib/                # Utilidades (utils.ts con cn())
├── modules/            # Módulos de funcionalidad
│   ├── shared/         # Código compartido entre módulos
│   │   ├── components/ # Componentes compartidos (AppSidebar, Header, NavEmployee)
│   │   ├── layouts/    # Layouts (PrivateLayout, PublicLayout)
│   │   ├── locales/    # Traducciones compartidas
│   │   ├── registry.ts # Sistema de registro de módulos
│   │   └── types.ts    # Tipos compartidos
│   ├── auth/           # Módulo de autenticación
│   ├── apps/           # Módulo de aplicaciones
│   └── employees/      # Módulo de empleados
├── i18n.ts             # Configuración de internacionalización
├── router.tsx          # Configuración de rutas
├── main.tsx            # Punto de entrada
└── translations.ts     # Registro de traducciones
```

### 2. PATRONES DE DISEÑO Y ARQUITECTURA

#### 2.1 Patrón de Módulos (Module Pattern)

**Observación**: Cada funcionalidad está organizada como un módulo independiente y autocontenido.

**Estructura de un módulo**:

```
module-name/
├── index.tsx           # Descriptor del módulo y registro
├── routes.tsx          # Definición de rutas
├── page.tsx            # Componente principal de página
├── viewmodel.ts        # Lógica de negocio (MVVM pattern)
├── service.ts          # Llamadas API
├── types.ts            # Interfaces y validaciones
├── translations.ts     # Registro de traducciones
├── components/         # Componentes específicos del módulo
└── locales/           # Traducciones (en.json, es.json, ca.json)
```

**Ejemplo de registro de módulo** (`apps/index.tsx`):

```typescript
import { LayoutPanelLeft } from "lucide-react";
import type { ModuleDescriptor } from "../shared/types";
import { routes } from "./routes";

export const appModule: ModuleDescriptor = {
  id: "apps",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "apps.list",
      label: "apps:page.title",
      path: "/private/apps",
      icon: <LayoutPanelLeft />,
      order: 2,
    },
  ],
};

import { moduleRegistry } from "../shared/registry";
moduleRegistry.register(appModule);
```

#### 2.2 MVVM (Model-View-ViewModel)

**Observación**: Separación clara entre UI (View), lógica de negocio (ViewModel) y datos (Service/Types).

**ViewModel Pattern** (`viewmodel.ts`):

- Custom hooks que encapsulan toda la lógica de negocio
- Gestión de estado local con `useState`
- Efectos secundarios con `useEffect` y `useCallback`
- Retorna solo lo necesario para la vista
- Maneja estados de carga, error y datos

**Ejemplo**:

```typescript
export function useAppsViewModel() {
  const { t } = useTranslation("apps");
  const [apps, setApps] = useState<AppInfoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addAppState, setAddAppState] = useState<ModalState>({
    isSubmitting: false,
    status: { type: "none", message: "" },
  });

  // Handlers
  const loadApps = useCallback(async () => {
    /* ... */
  }, []);
  const handleCreateApp = async (request: CreateAppRequest) => {
    /* ... */
  };

  return {
    apps,
    isLoading,
    error,
    isAddModalOpen,
    setIsAddModalOpen,
    createApp: handleCreateApp,
    // ... más propiedades y métodos
  };
}
```

#### 2.3 Service Layer

**Observación**: Todas las llamadas HTTP están centralizadas en archivos `service.ts`.

**Características**:

- Funciones async puras
- Uso de `fetch` API nativa
- Variables de entorno para API base
- Retorno de tipos específicos, no solo "success/failed"
- Manejo de códigos HTTP específicos

**Ejemplo**:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE;

export async function createApp(request: CreateAppRequest) {
  const url = new URL("/api/v1/apps", API_BASE);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (response.status === 201) return "created";
  if (response.status === 409) return "key_exists";
  if (response.status === 400) return "validation_error";

  return "failed";
}
```

#### 2.4 Type Safety

**Observación**: TypeScript se usa extensivamente con tipos explícitos.

**Prácticas**:

- Interfaces para DTOs y requests
- Funciones de validación junto a tipos
- Tipos de retorno explícitos
- Interfaces de validación separadas
- Uso de `type` para unions y `interface` para objetos

**Ejemplo** (`types.ts`):

```typescript
export interface CreateAppRequest {
  key: string;
  name: string;
}

export interface ValidationErrors {
  key?: string;
  name?: string;
}

export function validateCreateAppRequest(
  data: CreateAppRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.key || data.key.trim().length === 0) {
    errors.key = t("addModal.validation.keyRequired");
  } else if (data.key.length < 5) {
    errors.key = t("addModal.validation.keyTooShort");
  } else if (data.key.length > 50) {
    errors.key = t("addModal.validation.keyTooLong");
  }

  return errors;
}
```

### 3. GESTIÓN DE ESTADO

#### 3.1 Estado Local

- **useState**: Para estado simple en componentes
- **useCallback**: Para memorizar funciones que se pasan como props
- **useEffect**: Para efectos secundarios (cargar datos, suscripciones)

#### 3.2 Patrón de Estado de Modales

```typescript
interface ModalState {
  isSubmitting: boolean;
  status: {
    type: "none" | "error" | "success";
    message: string;
  };
}
```

### 4. INTERNACIONALIZACIÓN (i18n)

#### 4.1 Configuración

**Idiomas soportados**: Catalán (ca), Español (es), Inglés (en)
**Fallback**: Español (es)
**Detección automática**: Mediante `i18next-browser-languagedetector`

#### 4.2 Estructura de Traducciones

**Organización jerárquica por contexto**:

```json
{
  "errors": {
    /* errores generales */
  },
  "page": {
    /* contenido de página */
  },
  "addModal": {
    "title": "",
    "messages": {
      /* mensajes de estado */
    },
    "validation": {
      /* mensajes de validación */
    },
    "form": {
      /* etiquetas de formulario */
    }
  }
}
```

#### 4.3 Uso en Componentes

```typescript
const { t } = useTranslation("apps"); // namespace específico
<span>{t("page.title")}</span>;
```

#### 4.4 Uso en Menu Items

```typescript
label: "apps:page.title", // formato namespace:key
```

### 5. VALIDACIÓN

#### 5.1 Validación en el Frontend

**Dos niveles de validación**:

1. **HTML5 Nativo**: Atributos `required`, `minLength`, `maxLength`, `pattern`
2. **JavaScript Custom**: Funciones de validación en `types.ts`

**Patrón de validación**:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const errors = validateCreateAppRequest(formData, t);
  setValidationErrors(errors);

  if (Object.keys(errors).length === 0) {
    onSubmit(formData);
  }
};
```

#### 5.2 Reglas de Validación Alineadas con Backend

**Las validaciones del frontend replican las del backend C#**:

- Key: 5-50 caracteres, solo letras, números, guiones y guiones bajos
- Name: 2-256 caracteres

### 6. COMPONENTES UI

#### 6.1 Sistema de Componentes

**Basados en shadcn/ui con Radix UI**:

- Componentes altamente composables
- Accesibilidad por defecto
- Estilos con Tailwind CSS
- Variantes con `class-variance-authority`

#### 6.2 Patrón de Props

```typescript
interface ComponentProps {
  // Datos
  data?: DataType;

  // Estados
  isLoading?: boolean;
  error?: string | null;

  // Callbacks
  onAction?: (param: Type) => void;

  // Opcional con defaults
  variant?: "default" | "outline";
}

export function Component({
  data = [],
  isLoading = false,
  error = null,
  onAction,
  variant = "default",
}: ComponentProps) {
  // ...
}
```

### 7. MANEJO DE ERRORES

#### 7.1 Estados de Error

**Tres niveles**:

1. **Error de carga**: Mostrado en la UI principal
2. **Error de validación**: Mostrado inline en formularios
3. **Error de operación**: Mostrado en mensajes de estado

#### 7.2 Mensajes de Error

- Siempre traducidos
- Específicos al contexto
- Usuario-friendly

### 8. ROUTING Y NAVEGACIÓN

#### 8.1 Sistema de Rutas

- **Rutas públicas**: Layout público sin autenticación
- **Rutas privadas**: Layout privado con `requireAuth` loader

#### 8.2 Module Registry

**Sistema centralizado de rutas**:

```typescript
class ModuleRegistry {
  register(module: ModuleDescriptor) {
    /* ... */
  }
  getMenuItems() {
    /* ... */
  }
  getPrivateRoutes() {
    /* ... */
  }
  getRouteTitle(path: string): string {
    /* ... */
  }
}
```

### 9. AUTENTICACIÓN

#### 9.1 Patrón de Autenticación

- Cookie-based (credentials: "include")
- Validación en loader de React Router
- Redirect automático si no autenticado

```typescript
export async function requireAuth({}: LoaderFunctionArgs) {
  const url = new URL("/api/v1/auth/is-valid-session", API_BASE);
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok || res.status > 299) {
    throw redirect(`/`);
  }
  return null;
}
```

### 10. ESTILOS Y DISEÑO

#### 10.1 Tailwind CSS

- Utility-first approach
- Responsive design con breakpoints
- Dark mode support

#### 10.2 Función `cn()`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 10.3 Patrón de Estilos Condicionales

```typescript
className={cn(
  "base-classes",
  condition && "conditional-classes",
  validationErrors.field ? "border-red-500" : ""
)}
```

### 11. COMUNICACIÓN CON BACKEND

#### 11.1 Convenciones

- Base URL desde variables de entorno: `VITE_API_BASE`
- Paths API: `/api/v1/{resource}`
- Headers estándar: `Accept: application/json`, `Content-Type: application/json`
- Credentials: Siempre `include` para cookies

#### 11.2 Mapeo de Estados HTTP

```typescript
// 201 Created -> "created"
// 200 OK -> "success"
// 404 Not Found -> "not_found"
// 409 Conflict -> "key_exists"
// 400 Bad Request -> "validation_error"
// Otros -> "failed"
```

---

## INSTRUCCIONES PARA IA/DESARROLLADORES

### Cuando crees un NUEVO MÓDULO:

1. **Estructura de archivos**:

   ```
   modules/{module-name}/
   ├── index.tsx           # Descriptor y registro
   ├── routes.tsx          # Rutas
   ├── page.tsx            # Página principal
   ├── viewmodel.ts        # Lógica de negocio
   ├── service.ts          # API calls
   ├── types.ts            # Tipos y validaciones
   ├── translations.ts     # Registro i18n
   ├── components/         # Componentes específicos
   └── locales/
       ├── en.json
       ├── es.json
       └── ca.json
   ```

2. **Registrar el módulo**:

   ```typescript
   // En index.tsx
   export const myModule: ModuleDescriptor = {
     id: "module-id",
     isPrivate: true,
     routes,
     menu: [
       {
         /* ... */
       },
     ],
   };

   import { moduleRegistry } from "../shared/registry";
   moduleRegistry.register(myModule);
   ```

3. **Importar en router**:
   ```typescript
   // En src/router.tsx
   import "./modules/my-module";
   ```

### Cuando crees un VIEWMODEL:

```typescript
export function useMyFeatureViewModel() {
  const { t } = useTranslation("namespace");

  // Estado
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDataFromService();
      setData(response.data ?? []);
    } catch (err) {
      setError(t("errors.fetchData"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleAction = async (param: Type) => {
    // Lógica
  };

  return {
    data,
    isLoading,
    error,
    handleAction,
    t, // Exportar t si la vista lo necesita
  };
}
```

### Cuando crees un SERVICE:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE;

export async function getResources(): Promise<GetResourcesResponse> {
  const url = new URL("/api/v1/resources", API_BASE);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  const data: GetResourcesResponse = { items: await response.json() };
  return data;
}

export async function createResource(request: CreateRequest) {
  const url = new URL("/api/v1/resources", API_BASE);

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (response.status === 201) return "created";
  if (response.status === 409) return "conflict";
  if (response.status === 400) return "validation_error";

  return "failed";
}
```

### Cuando crees TYPES con VALIDACIÓN:

```typescript
export interface CreateRequest {
  field1: string;
  field2: string;
}

export interface ValidationErrors {
  field1?: string;
  field2?: string;
}

export function validateCreateRequest(
  data: CreateRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validar field1
  if (!data.field1 || data.field1.trim().length === 0) {
    errors.field1 = t("modal.validation.field1Required");
  } else if (data.field1.length < MIN) {
    errors.field1 = t("modal.validation.field1TooShort");
  } else if (data.field1.length > MAX) {
    errors.field1 = t("modal.validation.field1TooLong");
  }

  return errors;
}
```

### Cuando crees COMPONENTES de FORMULARIO:

```typescript
export function MyFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  status,
}: ModalProps) {
  const { t } = useTranslation("namespace");
  const [formData, setFormData] = useState<RequestType>({
    /* */
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRequest(formData, t);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* Header */}

          {/* Fields con validación */}
          <Input
            value={formData.field}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, field: e.target.value }));
              if (validationErrors.field) {
                setValidationErrors((prev) => ({ ...prev, field: undefined }));
              }
            }}
            className={validationErrors.field ? "border-red-500" : ""}
            minLength={MIN}
            maxLength={MAX}
            required
          />
          {validationErrors.field && (
            <p className="text-sm text-red-500 mt-1">
              {validationErrors.field}
            </p>
          )}

          {/* Status message */}
          {status.message && (
            <div
              className={cn(
                "mb-4 p-2 text-sm rounded",
                status.type === "error" && "bg-red-100 text-red-700",
                status.type === "success" && "bg-green-100 text-green-700"
              )}
            >
              {status.message}
            </div>
          )}

          {/* Footer con botones */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Cuando crees TRADUCCIONES:

**Estructura obligatoria en cada idioma (en.json, es.json, ca.json)**:

```json
{
  "errors": {
    "fetchData": "...",
    "unexpected": "..."
  },
  "page": {
    "title": "...",
    "addButton": "..."
  },
  "modal": {
    "title": "...",
    "description": "...",
    "messages": {
      "success": "...",
      "failed": "...",
      "validationError": "..."
    },
    "validation": {
      "fieldRequired": "...",
      "fieldTooShort": "...",
      "fieldTooLong": "..."
    },
    "form": {
      "field": "...",
      "submit": "...",
      "submitting": "...",
      "cancel": "..."
    }
  }
}
```

### Cuando crees TABLAS:

```typescript
export default function DataTable({
  data = [],
  isLoading = false,
  error = null,
  onEdit,
  t,
}: TableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <span className="ml-2 text-sm text-muted-foreground">
          {t("table.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">{t("table.error")}</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("table.noData")}
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>{t("table.caption")}</TableCaption>
      <TableHeader>
        <TableRow>{/* Headers */}</TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="hover:bg-muted/50">
            {/* Cells */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## PRINCIPIOS Y BUENAS PRÁCTICAS

### 1. **Separación de Responsabilidades**

- **View** (page.tsx, components): Solo presentación
- **ViewModel** (viewmodel.ts): Lógica de negocio y estado
- **Service** (service.ts): Comunicación con API
- **Types** (types.ts): Definiciones y validaciones

### 2. **TypeScript Strict**

- Siempre tipar explícitamente
- Evitar `any`
- Usar interfaces para objetos
- Usar type para unions

### 3. **Internacionalización**

- NUNCA texto hardcodeado
- Siempre usar `t()` función
- Organizar traducciones jerárquicamente
- Mantener consistencia entre idiomas

### 4. **Validación Doble**

- HTML5 para UX inmediato
- JavaScript para lógica compleja
- Alineada con backend

### 5. **Gestión de Estado**

- Estado local cuando sea posible
- `useCallback` para funciones en dependencias
- `useMemo` solo cuando sea necesario
- Cleanup en `useEffect` cuando aplique

### 6. **Componentes**

- Props con defaults
- Props opcionales con `?`
- Desestructuración con defaults
- Componentes pequeños y enfocados

### 7. **Estilos**

- Tailwind utility-first
- Función `cn()` para merge
- Responsive design
- Dark mode support

### 8. **API**

- Siempre `credentials: "include"`
- Manejo de códigos HTTP específicos
- Tipos de retorno descriptivos
- Try-catch en viewmodels

### 9. **Navegación**

- Module registry para rutas dinámicas
- Loaders para protección de rutas
- Traducciones en títulos de página

### 10. **Accesibilidad**

- Usar componentes Radix UI
- Labels en inputs
- Aria attributes cuando sea necesario
- Keyboard navigation

---

## CHECKLIST PARA NUEVAS FEATURES

- [ ] Crear estructura de módulo completa
- [ ] Implementar types con validaciones
- [ ] Crear service con manejo de HTTP correcto
- [ ] Implementar viewmodel con patrón establecido
- [ ] Crear componentes de UI
- [ ] Añadir traducciones en 3 idiomas
- [ ] Registrar módulo en registry
- [ ] Importar en router
- [ ] Validación frontend alineada con backend
- [ ] Manejo de estados de carga y error
- [ ] Responsive design
- [ ] Dark mode compatible
- [ ] TypeScript sin errores
- [ ] Accessibilidad básica

---

**Fecha de creación**: 4 de noviembre de 2025
**Última actualización**: 4 de noviembre de 2025
**Versión**: 1.0
