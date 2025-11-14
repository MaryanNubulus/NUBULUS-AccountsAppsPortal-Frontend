# Submòdul d'Usuaris (Users)

## Descripció General

El submòdul d'usuaris és una funcionalitat dins del mòdul de comptes que permet gestionar els usuaris associats a cada compte. Permet crear, editar, llistar, pausar i reprendre usuaris d'un compte específic.

## Arquitectura MVVM

El submòdul segueix estrictament el patró MVVM amb separació de capes:

```
View (page.tsx, components/)
↓
ViewModel (viewmodel.ts) - Hooks amb lògica de negoci
↓
Service (service.ts) - Funcions async pures
↓
API Backend (/api/v1/accounts/{accountId}/users)
```

### Responsabilitats per Capa

- **View**: Només JSX, sense lògica de negoci
- **ViewModel**: Estat local (loading, errors, data), validació frontend, crida serveis
- **Service**: Comunicació amb backend, retorna strings d'estat específics (no booleans)
- **Types**: Definicions TypeScript + funcions de validació

## Estructura d'Arxius

```
modules/accounts/users/
├── index.tsx                      # Descriptor i registre del submòdul
├── routes.tsx                     # Configuració de rutes
├── page.tsx                       # Pàgina principal
├── viewmodel.ts                   # Hooks de lògica de negoci
├── service.ts                     # Serveis d'API
├── types.ts                       # Tipus i validacions
├── translations.ts                # Registre de traduccions
├── components/
│   ├── UsersTable.tsx            # Taula d'usuaris
│   ├── AddNewUserModal.tsx       # Modal de creació
│   ├── EditUserModal.tsx         # Modal d'edició
│   └── ConfirmStateChangeDialog.tsx
└── locales/
    ├── en.json
    ├── es.json
    └── ca.json
```

## Tipus de Dades Principals

### User

```typescript
interface User {
  userId: number; // ID de l'usuari
  name: string; // Nom de l'usuari (2-100 caràcters)
  email: string; // Email de l'usuari (5-100 caràcters)
  status: string; // "A" = Actiu, "I" = Inactiu/Pausat
  isCreator: boolean; // True si és el creador del compte
}
```

### Requests

```typescript
interface CreateUserRequest {
  name: string; // 2-100 caràcters
  email: string; // 5-100 caràcters, format vàlid
}

interface UpdateUserRequest {
  name: string; // 2-100 caràcters
  email: string; // 5-100 caràcters, format vàlid
}
```

### PaginatedUsersResponse

```typescript
interface PaginatedUsersResponse {
  items: User[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## Serveis API

Tots els serveis usen `credentials: "include"` per autenticació basada en cookies.

### Endpoints Disponibles

| Mètode | Endpoint                                                         | Retorna                                                                                       |
| ------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/api/v1/accounts/{accountId}/users?page={page}&pageSize={size}` | `PaginatedUsersResponse` o `null`                                                             |
| POST   | `/api/v1/accounts/{accountId}/users`                             | `"created"` \| `"user_exists"` \| `"validation_error"` \| `"account_not_found"` \| `"failed"` |
| PUT    | `/api/v1/accounts/{accountId}/users/{userId}`                    | `"updated"` \| `"not_found"` \| `"user_exists"` \| `"validation_error"` \| `"failed"`         |
| PATCH  | `/api/v1/accounts/{accountId}/users/{userId}/pause`              | `"paused"` \| `"not_found"` \| `"failed"`                                                     |
| PATCH  | `/api/v1/accounts/{accountId}/users/{userId}/resume`             | `"resumed"` \| `"not_found"` \| `"failed"`                                                    |

### Exemple de Servei

```typescript
async function createUser(
  accountId: number,
  request: CreateUserRequest
): Promise<
  | "created"
  | "user_exists"
  | "validation_error"
  | "account_not_found"
  | "failed"
> {
  const response = await fetch(
    `${API_BASE}/api/v1/accounts/${accountId}/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(request),
    }
  );

  if (response.status === 201) return "created";
  if (response.status === 409) return "user_exists";
  if (response.status === 400) return "validation_error";
  if (response.status === 404) return "account_not_found";
  return "failed";
}
```

## ViewModels (Hooks)

### useUsers

Hook principal que gestiona la llista d'usuaris amb paginació i cerca.

```typescript
function useUsers() {
  return {
    users: User[];
    isLoading: boolean;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;  // Executa cerca i recarrega
    reload: () => void;                      // Recarrega sense cerca
    goToPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    changePageSize: (newSize: number) => void;
    t: (key: string) => string;
  };
}
```

### useGetSharedUsers

Hook que gestiona la llista d'usuaris ja compartits.

```typescript
function useGetSharedUsers() {
  return {
    sharedUsers: UserToShare[];
    isLoading: boolean;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    nextPage: () => void;
    previousPage: () => void;
    goToPage: (page: number) => void;
    changePageSize: (newSize: number) => void;
    reload: () => void;
    t: (key: string) => string;
  };
}
```

### useGetUsersToShare

Hook que gestiona usuaris disponibles per compartir (deferred search).

```typescript
function useGetUsersToShare() {
  return {
    availableUsers: UserToShare[];
    isLoading: boolean;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    searchTerm: string;
    hasSearched: boolean;              // True si s'ha fet almenys una cerca
    setSearchTerm: (term: string) => void;
    nextPage: () => void;
    previousPage: () => void;
    goToPage: (page: number) => void;
    changePageSize: (newSize: number) => void;
    load: (page: number, pageSize: number, search: string) => Promise<void>;
    t: (key: string) => string;
  };
}
```

### useCreateUser

Hook per crear nous usuaris amb validació.

```typescript
function useCreateUser(onSuccess: () => void) {
  return {
    handleSubmit: (data: CreateUserRequest) => Promise<void>;
    isSubmitting: boolean;
    status: { type: "none" | "error" | "success"; message: string };
    validationErrors: ValidationErrors;
    clearErrors: () => void;
    clearStatus: () => void;
    t: (key: string) => string;
  };
}
```

### useUpdateUser

Hook per actualitzar usuaris existents.

```typescript
function useUpdateUser(onSuccess: () => void) {
  return {
    handleSubmit: (userId: string, data: UpdateUserRequest) => Promise<void>;
    isSubmitting: boolean;
    status: { type: "none" | "error" | "success"; message: string };
    validationErrors: ValidationErrors;
    clearErrors: () => void;
    clearStatus: () => void;
    t: (key: string) => string;
  };
}
```

### useChangeUserState

Hook per pausar/reprendre usuaris.

```typescript
function useChangeUserState(onSuccess: () => void) {
  return {
    handleChangeState: (userId: string, shouldResume: boolean) => Promise<void>;
    isSubmitting: boolean;
    error: string;
    clearError: () => void;
    t: (key: string) => string;
  };
}
```

### useShareUser

Hook per compartir usuaris.

```typescript
function useShareUser(onSuccess: () => void) {
  return {
    handleShare: (userId: string) => Promise<void>;
    isSubmitting: boolean;
    error: string;
    clearError: () => void;
    t: (key: string) => string;
  };
}
```

### useUnshareUser

Hook per deixar de compartir usuaris.

```typescript
function useUnshareUser(onSuccess: () => void) {
  return {
    handleUnshare: (userId: string) => Promise<void>;
    isSubmitting: boolean;
    error: string;
    clearError: () => void;
    t: (key: string) => string;
  };
}
```

### useFetchUserInfo

Hook per obtenir la informació completa d'un usuari.

```typescript
function useFetchUserInfo() {
  return {
    user: User | null;
    isLoading: boolean;
    fetchUser: (userId: string) => Promise<void>;
  };
}
```

### Patró ModalState

```typescript
interface ModalState {
  isSubmitting: boolean;
  status: {
    type: "none" | "error" | "success";
    message: string;
  };
}
```

## Validació Dual

El submòdul implementa validació en dos nivells:

### 1. Frontend (HTML5 + JavaScript)

**HTML5** - Validació mentre s'escriu:

```tsx
<input
  type="email"
  required
  minLength={5}
  maxLength={100}
  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
/>
```

**JavaScript** - Validació al submit:

```typescript
function validateCreateUserRequest(
  data: CreateUserRequest,
  t: (key: string) => string
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = t("addModal.validation.nameRequired");
  } else if (data.name.length < 2) {
    errors.name = t("addModal.validation.nameMinLength");
  } else if (data.name.length > 100) {
    errors.name = t("addModal.validation.nameMaxLength");
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = t("addModal.validation.emailRequired");
  } else if (data.email.length < 5) {
    errors.email = t("addModal.validation.emailMinLength");
  } else if (data.email.length > 100) {
    errors.email = t("addModal.validation.emailMaxLength");
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      errors.email = t("addModal.validation.emailInvalid");
    }
  }

  return errors;
}
```

### 2. Backend

El servei retorna estats específics:

- `validation_error`: Dades invàlides segons les regles del backend
- `user_exists`: Ja existeix un usuari amb el mateix nom o email
- `account_not_found`: El compte no existeix

### Regles de Validació

- **name**: Obligatori, 2-100 caràcters
- **email**: Obligatori, 5-100 caràcters, format vàlid (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`)

## Components Principals

### UsersPage

Component principal que renderitza la pàgina d'usuaris.

**Funcionalitats:**

- Títol "Usuaris del Compte"
- Botó "Afegir Usuari" que obre modal
- Taula amb paginació
- Navegació amb botons Anterior/Següent
- Indicador: "Mostrant X a Y de Z resultats"

### UsersTable

Taula responsiva amb les columnes:

- **Nom**: Nom de l'usuari
- **Email**: Email de l'usuari
- **Estat**: Badge verd ("Actiu") o gris ("Pausat")
- **Creador**: Badge blau ("Sí") o outline ("No") - indica si és el creador del compte
- **Accions**: Botons d'editar, pausar/reprendre

**Estats:**

- Loading: Mostra skeletons
- Error: Mostra missatge d'error
- Empty: "No hi ha usuaris registrats"
- Data: Mostra taula amb dades

**Icones d'Accions:**

- Editar: Icona `Edit` de lucide-react
- Pausar: Icona `Pause` (taronja)
- Reprendre: Icona `Play` (verd)

### AddNewUserModal

Modal per crear nous usuaris amb:

- Formulari amb camps: Nom i Email
- Botó "Crear Usuari" / "Creant..." (disabled durant submit)
- Validació inline amb vores vermelles
- Esborrat d'error en canviar input
- Missatge d'èxit després de crear
- Tancament automàtic després d'èxit (1.5s)

**Gestió d'Errors:**

- `user_exists`: "Ja existeix un usuari amb aquest nom o email"
- `account_not_found`: "El compte no existeix"
- `validation_error`: "Error de validació. Revisa els camps"
- `failed`: "Error en crear l'usuari"

### EditUserModal

Similar a AddNewUserModal però:

- Carrega dades de l'usuari (`userId`)
- Mostra skeleton durant càrrega inicial
- Botó "Desar Canvis" / "Desant..."
- Gestiona error `not_found`

### ConfirmStateChangeDialog

Diàleg de confirmació per pausar/reprendre usuaris amb:

- **Títol**: "Pausar Usuari" o "Reactivar Usuari"
- **Descripció**: Informa sobre l'impacte (l'usuari no podrà accedir)
- **Botons**: "Cancel·lar" i "Confirmar"
- **Loading**: "Processant..." durant l'operació

## Componentes Reutilitzables

### SearchBar

Component reutilitzable per a cerca de usuaris amb interfície:

```tsx
<SearchBar
  placeholder={t("page.searchPlaceholder")}
  value={localSearchTerm}
  onChange={setLocalSearchTerm}
  onSearch={handleSearch}
  onClear={handleClearSearch}
  hasSearchTerm={!!searchTerm}
  searchButton={t("page.searchButton")}
  clearButton={t("page.clearButton")}
/>
```

**Funcionalitats:**

- Input de text per cercar
- Botó "Cercar" per executar la cerca
- Botó "Netejar" (visible si hi ha cerca activa)
- Icona de cerca integrada
- Permet cerques buides (refresca la taula amb tots els usuaris)

**Props:**

```typescript
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
  hasSearchTerm: boolean;
}
```

### Pagination

Component reutilitzable per a paginació amb:

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalCount={totalCount}
  pageSize={pageSize}
  hasPreviousPage={hasPreviousPage}
  hasNextPage={hasNextPage}
  onNextPage={nextPage}
  onPreviousPage={previousPage}
  onGoToPage={goToPage}
  onChangePageSize={changePageSize}
  pageSizeOptions={[5, 10, 25, 50]}
  t={t}
/>
```

**Funcionalitats:**

- Botons "Anterior" i "Següent" amb estats disabled
- Selector de mida de pàgina (5, 10, 25, 50 items)
- Indicador "Pàgina X de Y"
- Indicador "Mostrant X a Y de Z resultats"

### SelectUsersModal

Modal per seleccionar usuaris disponibles per compartir amb:

- **SearchBar**: Per filtrar usuaris disponibles
- **Pagination**: Per navegar pels resultats
- **Deferred Search**: No carrega fins clicar "Cercar" (flag `hasSearched`)
- **SharedUsersTable**: Mostra usuaris ja compartits
- **Pagination compartits**: Busca i paginació en usuaris compartits

**Funcionalitats:**

- Primera pestanya: Usuaris disponibles (amb deferred search)
- Segona pestanya: Usuaris ja compartits
- Botons d'acció: Compartir (primera) i Descompartir (segona)
- Modal de confirmació integrat
- Gestor d'errors i loading states

**Ús des de page.tsx:**

```typescript
<SelectUsersModal
  isOpen={isSelectModalOpen}
  onClose={() => setIsSelectModalOpen(false)}
  onSelectUser={handleSelectUser}
  availableUsers={availableUsers}
  sharedUsers={sharedUsers}
  isAvailableLoading={isAvailableLoading}
  isSharedLoading={isSharedLoading}
  availableCurrentPage={availableCurrentPage}
  availableTotalPages={availableTotalPages}
  availableTotalCount={availableTotalCount}
  availablePageSize={availablePageSize}
  hasAvailablePreviousPage={availableHasPreviousPage}
  hasAvailableNextPage={availableHasNextPage}
  availableNextPage={availableNextPage}
  availablePreviousPage={availablePreviousPage}
  availableGoToPage={availableGoToPage}
  availableChangePageSize={changeAvailablePageSize}
  availableSearchTerm={availableSearchTerm}
  availableSetSearchTerm={setAvailableSearchTerm}
  availableHasSearched={hasSearched}
  // ... més props per a usuaris compartits
/>
```

## Internacionalització (i18n)

### Namespace: `users`

**Ús en components:**

```typescript
const { t } = useTranslation("users");
<span>{t("page.title")}</span>;
```

### Estructura de Traduccions

```json
{
  "page": {
    "title": "Usuaris del Compte",
    "description": "Gestiona els usuaris dins d'aquest compte",
    "addButton": "Afegir Usuari"
  },
  "table": {
    "name": "Nom",
    "email": "Email",
    "status": "Estat",
    "isCreator": "Creador",
    "actions": "Accions",
    "active": "Actiu",
    "inactive": "Pausat",
    "noData": "No hi ha usuaris registrats",
    "edit": "Editar",
    "resume": "Reactivar",
    "pause": "Pausar",
    "creator": {
      "yes": "Sí",
      "no": "No"
    }
  },
  "addModal": {
    "title": "Afegir Nou Usuari",
    "submit": "Crear Usuari",
    "submitting": "Creant...",
    "cancel": "Cancel·lar",
    "form": {
      "name": "Nom",
      "namePlaceholder": "Nom complet de l'usuari",
      "email": "Email",
      "emailPlaceholder": "usuari@exemple.com"
    },
    "validation": { ... },
    "messages": {
      "success": "Usuari creat correctament",
      "error": "Error en crear l'usuari"
    }
  },
  "errors": {
    "userExists": "Ja existeix un usuari amb aquest nom o email",
    "accountNotFound": "El compte no existeix",
    "userNotFound": "L'usuari no existeix o no pertany a aquest compte",
    "changeStateFailed": "Error en canviar l'estat de l'usuari",
    "invalidAccountId": "ID de compte invàlid"
  }
}
```

## Fluxos d'Usuari

### Crear Usuari

1. Usuari clica "Afegir Usuari"
2. S'obre `AddNewUserModal`
3. Usuari completa formulari (Nom, Email)
4. Validació HTML5 mentre s'escriu
5. Clic "Crear Usuari" → Validació JavaScript
6. Si hi ha errors → Mostra inline (no envia al backend)
7. Si passa → Crida `service.createUser(accountId, data)`
8. Backend valida i retorna estat
9. Si èxit → Missatge, tanca modal (1.5s), recarrega llista
10. Si error → Mostra missatge d'error específic

### Editar Usuari

1. Clic botó "Editar" (icona `Edit`)
2. S'obre `EditUserModal`
3. Formulari pre-omplert amb dades actuals
4. Usuari modifica camps
5. Validació HTML5 + JS al submit
6. Si passa → Crida `service.updateUser(accountId, userId, data)`
7. Gestiona resposta del backend
8. Si èxit → Tanca modal, recarrega llista

### Pausar/Reprendre Usuari

1. Clic "Pausar" (icona `Pause`) o "Reprendre" (icona `Play`)
2. S'obre `ConfirmStateChangeDialog`
3. Mostra descripció de l'acció
4. Clic "Confirmar"
5. Executa `pauseUser` o `resumeUser`
6. Backend actualitza estat a la taula `AccountUsers`
7. Si èxit → Tanca diàleg, recarrega llista
8. Llista mostra nou estat (badge verd/gris)

### Paginació

1. Clic "Següent" o "Anterior"
2. Verifica `hasNextPage` / `hasPreviousPage`
3. Crida `goToPage(currentPage ± 1)`
4. Executa `loadUsers(accountId, page)`
5. Taula mostra nova pàgina
6. Indicador s'actualitza

### Deferred Search (SelectUsersModal)

Pattern de cerca diferida només pel modal de SelectUsersModal:

1. Modal s'obre
2. **NO es carrega automàticament** (flag `hasSearched = false`)
3. Usuari escriu terme de cerca en SearchBar
4. Usuari clica botó "Cercar"
5. Executa `loadUsersToShare(1, pageSize, searchTerm)`
6. Flag `hasSearched` es posa a `true`
7. Es mostren resultats amb paginació
8. Si canvia terme i clica de nou → Nova cerca amb `hasSearched = true`

**Benefici:** Evita peticions innecessàries als primers carrecs del modal.

**Diferència amb llista principal:**

- **useUsers**: Carrega automàticament al canviar `searchTerm` (ús estàndard)
- **useGetUsersToShare**: Només carrega quan es clica "Cercar" (deferred search)

## Registre del Submòdul

```typescript
export const usersModule: ModuleDescriptor = {
  id: "users",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "users.list",
      label: "users:page.title",
      path: "/private/accounts/:accountId/users",
      icon: <Users />,
      order: 3,
    },
  ],
};
moduleRegistry.register(usersModule);
```

## Comportament de Cerca

### Cerca amb Input Buit

La funcionalitat de cerca permet executar una cerca **sense cap term** (input buit) per refrescar la taula amb tots els usuaris:

1. Usuari deixa input buit
2. Clica botó "Cercar"
3. Se executa `handleSearch` que crida `setSearchTerm("")`
4. Viewmodel actualitza estat amb `searchTerm = ""`
5. `useEffect` es dispara i crida `loadUsers(currentPage, pageSize, "")`
6. Service rep `searchTerm = ""` i **no afegeix paràmetre a la URL**
7. Backend retorna tots els usuaris (sense filtrar per terme de cerca)
8. Taula es refresca amb tots els usuaris

**Pattern idèntic al mòdul de Comptes** (module `accounts`).

## Estructura Actualitzada

```
modules/accounts/users/
├── index.tsx                      # Descriptor i registre del submòdul
├── routes.tsx                     # Configuració de rutes
├── page.tsx                       # Pàgina principal
├── viewmodel.ts                   # Hooks de lògica de negoci (8 hooks)
├── service.ts                     # Serveis d'API (9 funcions)
├── types.ts                       # Tipus i validacions
├── translations.ts                # Registre de traduccions
├── components/
│   ├── UsersTable.tsx            # Taula d'usuaris
│   ├── SharedUsersTable.tsx       # Taula d'usuaris compartits
│   ├── AddNewUserModal.tsx       # Modal de creació
│   ├── EditUserModal.tsx         # Modal d'edició
│   ├── ConfirmStateChangeDialog.tsx
│   ├── SearchBar.tsx              # Component de cerca reutilitzable
│   ├── Pagination.tsx             # Component de paginació reutilitzable
│   └── SelectUsersModal.tsx       # Modal de selecció amb deferred search
└── locales/
    ├── en.json
    ├── es.json
    └── ca.json
```

## Sumari de Hooks disponibles

| Hook                 | Propòsit                    | Carrega automàtica           |
| -------------------- | --------------------------- | ---------------------------- |
| `useUsers`           | Llista principal d'usuaris  | Sí (al cambiar `searchTerm`) |
| `useGetSharedUsers`  | Usuaris ja compartits       | Sí                           |
| `useGetUsersToShare` | Usuaris disponibles (modal) | No (deferred search)         |
| `useCreateUser`      | Crear usuari                | Manual                       |
| `useUpdateUser`      | Editar usuari               | Manual                       |
| `useChangeUserState` | Pausar/reprendre            | Manual                       |
| `useShareUser`       | Compartir usuari            | Manual                       |
| `useUnshareUser`     | Descompartir usuari         | Manual                       |
| `useFetchUserInfo`   | Obtenir dades completes     | Manual                       |

## Transicions de Versió

### v1.0 (Actual)

✅ Gestió completa d'usuaris (crear, editar, pausar/reprendre)  
✅ Compartir usuaris entre comptes  
✅ Cerca i paginació integrades  
✅ Deferred search al modal de selecció  
✅ Validació dual (HTML5 + JavaScript)  
✅ Internacionalització (3 idiomes)  
✅ Components reutilitzables (SearchBar, Pagination)

## Registre del Submòdul

```typescript
export const usersModule: ModuleDescriptor = {
  id: "users",
  isPrivate: true,
  routes,
  menu: [
    {
      id: "users.list",
      label: "users:page.title",
      path: "/private/accounts/:accountId/users",
      icon: <Users />,
      order: 3,
    },
  ],
};

moduleRegistry.register(usersModule);
```

**Activació:** El submòdul s'activa important-lo dins del mòdul `accounts`:

```typescript
import "./users"; // dins de modules/accounts/index.tsx
```

## Relació amb el Backend

### Taula `AccountUsers`

Els usuaris es guarden a la taula `AccountUsers` amb els camps:

- `AccountUsersId`: Clau primària
- `AccountId`: FK al compte (relació N:1)
- `Name`: Nom de l'usuari
- `Email`: Email de l'usuari
- `Status`: "A" (actiu) o "I" (inactiu)
- `Creator`: "Y" (sí) o "N" (no) - indica si és el creador del compte

### Camp `isCreator`

El camp `isCreator` (boolean) es calcula al backend:

```csharp
IsCreator = x.AccountUser.Creator == "Y"
```

Aquest camp indica si l'usuari és el **creador original del compte**. Es mostra a la taula amb un badge blau ("Sí") o outline ("No").

**Característiques:**

- **Només lectura**: No es pot modificar des del frontend
- **Calculat**: El backend el mapeja a partir de `AccountUsers.Creator`
- **Visual**: Badge blau per destacar el creador del compte

## Millors Pràctiques

### ❌ Errors Comuns

- No usar `any` → Usar interfícies específiques
- No hardcodejar text → Sempre usar `t()`
- No oblidar `credentials: "include"` al fetch
- No posar lògica de negoci als components → Usar viewmodels
- No retornar boolean dels serveis → Retornar strings d'estat
- No oblidar gestionar tots els codis HTTP (201, 400, 404, 409)
- No confondre `userId` amb `accountId` en les peticions

### ✅ Bones Pràctiques

- **Separació de capes**: View → ViewModel → Service → API
- **Validació dual**: HTML5 + JavaScript matching backend
- **Estats específics**: Strings descriptius (no booleans)
- **i18n complet**: Tot el text traduït en 3 idiomes (ca/es/en)
- **Gestió d'errors**: Missatges clars i específics
- **Loading states**: Skeletons durant càrregues
- **Confirmació**: Diàlegs per accions de canvi d'estat
- **Recàrrega automàtica**: Refrescar llista després d'operacions
- **Validació de `accountId`**: Verificar que sigui un número vàlid

## Diagrames

### Flux de Dades

```
Usuari → View → ViewModel → Service → API Backend
                    ↓            ↓
                Validació   Gestió HTTP
                    ↓            ↓
                  Estat    Retorn estat
                    ↓
                Re-render
```

### Estats del Modal

```
INICIAL (isSubmitting: false, status: "none")
  ↓
VALIDANT (frontend validation)
  ↓
  ├─ Errors? → MOSTRA ERRORS INLINE
  ↓
ENVIANT (isSubmitting: true)
  ↓
  ├─ Èxit → SUCCESS (status: "success") → Tanca modal
  └─ Error → ERROR (status: "error") → Mostra missatge
```

## Notes Importants

- **Totes les rutes són privades** (requereixen autenticació)
- **AccountId obligatori**: Totes les operacions requereixen un `accountId` vàlid
- **No es pot eliminar usuaris**: Només pausar/reprendre
- **Creador del compte**: El camp `isCreator` és només informatiu (no modificable)
- **Paginació**: Per defecte 10 resultats per pàgina
- **Camp `user_exists`**: Error genèric (no especifica si és nom o email duplicat)

---

**Última actualització**: Novembre 2025  
**Versió del submòdul**: 1.1  
**Estat**: Documentació completa amb camp `isCreator` ✅
