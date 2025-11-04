# GitHub Copilot Instructions

## Architecture Overview

This is a **modular MVVM React + TypeScript** application using a plugin-style architecture where each feature is a self-contained module that registers itself dynamically.

### Core Pattern: Self-Registering Modules

Each feature lives in `src/modules/{feature-name}/` and registers with the central `moduleRegistry`:

```typescript
// modules/apps/index.tsx
export const appModule: ModuleDescriptor = {
  id: "apps",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "apps.list",
      label: "apps:page.title",
      path: "/private/apps",
      icon: <Icon />,
      order: 2,
    },
  ],
};
moduleRegistry.register(appModule);
```

**Import the module in `router.tsx`** to activate it. The registry automatically:

- Generates sidebar menu items sorted by `order`
- Provides routes to React Router
- Resolves page titles from i18n keys

### MVVM Layer Separation

**Never mix layers.** Each module follows strict separation:

1. **View** (`page.tsx`, `components/`) - Only JSX, no business logic
2. **ViewModel** (`viewmodel.ts`) - Custom hooks returning `{ data, isLoading, error, handlers, t }`
3. **Service** (`service.ts`) - Pure async functions, returns specific status strings not boolean
4. **Types** (`types.ts`) - Interfaces + validation functions (not classes)

Example service pattern:

```typescript
export async function createApp(request: CreateAppRequest) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include" /* ... */,
  });
  if (response.status === 201) return "created";
  if (response.status === 409) return "key_exists";
  if (response.status === 400) return "validation_error";
  return "failed";
}
```

### Internationalization (i18n)

**All text MUST be translated.** Use namespace-based translations:

- In components: `const { t } = useTranslation("apps"); <span>{t("page.title")}</span>`
- In menu labels: `label: "apps:page.title"` (namespace:key format)
- Create 3 files: `locales/en.json`, `locales/es.json`, `locales/ca.json`
- Structure: `{ errors: {...}, page: {...}, addModal: { messages: {...}, validation: {...}, form: {...} } }`

### Validation Pattern

**Dual validation**: HTML5 attributes + JavaScript functions in `types.ts`:

```typescript
export function validateCreateRequest(
  data: Request,
  t: Function
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.field || data.field.trim().length === 0) {
    errors.field = t("modal.validation.fieldRequired");
  }
  // ... more validations matching backend rules
  return errors;
}
```

Forms clear errors on input change and show red borders + inline messages.

### Authentication & API

- **Cookie-based auth**: Always use `credentials: "include"` in fetch
- **API base**: `import.meta.env.VITE_API_BASE` + path `/api/v1/{resource}`
- **Protected routes**: Use `loader: requireAuth` in route config
- **Proxy**: Vite dev server proxies `/api` to `localhost:5016` (see `vite.config.ts`)

### State Management

**No global state library.** Use local state with patterns:

```typescript
interface ModalState {
  isSubmitting: boolean;
  status: { type: "none" | "error" | "success"; message: string };
}
```

Modals: Open/close state in page, submit/status state in viewmodel.

### UI Components

- Based on **shadcn/ui + Radix UI** (in `components/ui/`)
- Always use `cn()` utility from `lib/utils.ts` for className merging
- Dark mode support via `ThemeProvider` (don't hardcode colors)
- Responsive: Use Tailwind breakpoints (`md:`, `lg:`)

### File Naming Conventions

- Components: PascalCase (`AppsTable.tsx`)
- Services/ViewModels/Types: camelCase (`viewmodel.ts`, `service.ts`)
- Index files export module descriptor: `index.tsx`
- Routes definition: `routes.tsx`
- Main page: `page.tsx`

## Development Commands

```bash
npm run dev          # Start dev server with HMR (proxies API to localhost:5016)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
```

## Adding a New Module Checklist

1. Create `src/modules/{name}/` with: `index.tsx`, `routes.tsx`, `page.tsx`, `viewmodel.ts`, `service.ts`, `types.ts`, `translations.ts`, `locales/{en,es,ca}.json`
2. Define `ModuleDescriptor` in `index.tsx` and call `moduleRegistry.register()`
3. Import module in `src/router.tsx`: `import "./modules/{name}";`
4. Add icon from `lucide-react` or `@tabler/icons-react`

## Common Pitfalls

- ❌ Don't hardcode text strings - always use `t()` with i18n
- ❌ Don't use `any` type - prefer `unknown` or specific interfaces
- ❌ Don't forget `credentials: "include"` in fetch calls
- ❌ Don't put business logic in components - use viewmodels
- ❌ Don't return boolean from services - return specific status strings
- ❌ Don't forget to handle all HTTP status codes (201, 400, 404, 409, etc.)
- ❌ Don't create modals without `ModalState` pattern for submit status

## Key Files Reference

- `src/modules/shared/registry.ts` - Module registration system
- `src/modules/shared/types.ts` - Core type definitions (ModuleDescriptor, etc.)
- `src/i18n.ts` - i18n configuration (fallback: "es", supported: en/es/ca)
- `src/lib/utils.ts` - `cn()` utility for className merging
- `CODING_GUIDELINES.md` - Comprehensive architecture documentation with examples

See `CODING_GUIDELINES.md` for detailed patterns, validation examples, and complete templates.
