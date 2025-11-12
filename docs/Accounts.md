# Mòdul de Comptes (Accounts)

## Descripció General

El mòdul de comptes és un mòdul auto-registrable que gestiona els comptes de l'aplicació i els seus usuaris propietaris. Permet crear, editar, llistar, cercar, pausar i reprendre comptes.

## Arquitectura MVVM

El mòdul segueix estrictament el patró MVVM amb separació de capes:

\`\`\`
View (page.tsx, components/)
↓
ViewModel (viewmodel.ts) - Hooks amb lògica de negoci
↓
Service (service.ts) - Funcions async pures
↓
API Backend (/api/v1/accounts)
\`\`\`

### Responsabilitats per Capa

- **View**: Només JSX, sense lògica de negoci
- **ViewModel**: Estat local (loading, errors, data), validació frontend, crida serveis
- **Service**: Comunicació amb backend, retorna strings d'estat específics (no booleans)
- **Types**: Definicions TypeScript + funcions de validació

## Estructura d'Arxius

\`\`\`
modules/accounts/
├── index.tsx # Descriptor i registre del mòdul
├── routes.tsx # Configuració de rutes
├── page.tsx # Pàgina principal
├── viewmodel.ts # Hooks de lògica de negoci
├── service.ts # Serveis d'API
├── types.ts # Tipus i validacions
├── translations.ts # Registre de traduccions
├── components/
│ ├── AccountsTable.tsx # Taula de comptes
│ ├── AddNewAccountModal.tsx # Modal de creació
│ ├── EditAccountModal.tsx # Modal d'edició
│ └── ConfirmStateChangeDialog.tsx
└── locales/
├── en.json
├── es.json
└── ca.json
\`\`\`

## Tipus de Dades Principals

### Account

\`\`\`typescript
interface Account {
accountId: number;
name: string;
fullName: string;
email: string;
phone: string;
numberId: string; // CIF/NIF
status: string; // "A" = Activa, "I" = Inactiva
}
\`\`\`

### Requests

\`\`\`typescript
interface CreateAccountRequest {
name: string; // 2-100 caràcters
fullName: string; // 0-200 caràcters (opcional)
email: string; // 5-100 caràcters, format vàlid
phone: string; // 10-15 caràcters, numèric amb + opcional
address: string; // 5-200 caràcters
numberId: string; // 5-50 caràcters (CIF/NIF)
}

interface UpdateAccountRequest {
// Mateix que CreateAccountRequest
}
\`\`\`

## Serveis API

Tots els serveis usen `credentials: "include"` per autenticació basada en cookies.

### Endpoints Disponibles

| Mètode | Endpoint                       | Retorna                                                                                  |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------------- |
| GET    | `/api/v1/accounts`             | `PaginatedResponse<Account>` o `null`                                                    |
| GET    | `/api/v1/accounts/{id}`        | `AccountInfo` o `null`                                                                   |
| POST   | `/api/v1/accounts`             | `"created"` \| `"already_exists"` \| `"validation_error"` \| `"failed"`                  |
| PUT    | `/api/v1/accounts/{id}`        | `"updated"` \| `"not_found"` \| `"already_exists"` \| `"validation_error"` \| `"failed"` |
| PATCH  | `/api/v1/accounts/{id}/pause`  | `"paused"` \| `"not_found"` \| `"failed"`                                                |
| PATCH  | `/api/v1/accounts/{id}/resume` | `"resumed"` \| `"not_found"` \| `"failed"`                                               |

### Exemple de Servei

\`\`\`typescript
async function createAccount(
request: CreateAccountRequest
): Promise<"created" | "already_exists" | "validation_error" | "failed"> {
const response = await fetch(`${API_BASE}/api/v1/accounts`, {
method: "POST",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify(request),
});

if (response.status === 201) return "created";
if (response.status === 409) return "already_exists";
if (response.status === 422) return "validation_error";
return "failed";
}
\`\`\`

## ViewModels (Hooks)

### useAccounts

Hook principal que gestiona la llista de comptes amb paginació i cerca.

\`\`\`typescript
function useAccounts() {
return {
accounts: Account[];
isLoading: boolean;
error: string | null;
currentPage: number;
totalPages: number;
searchTerm: string;
search: (term: string) => void;
reload: () => void;
goToPage: (page: number) => void;
nextPage: () => void;
previousPage: () => void;
t: (key: string) => string;
};
}
\`\`\`

### useCreateAccount

Hook per crear nous comptes amb validació.

\`\`\`typescript
function useCreateAccount(onSuccess: () => void) {
return {
modalState: ModalState;
validationErrors: ValidationErrors;
createAccount: (data: CreateAccountRequest) => Promise<void>;
clearValidationError: (field: string) => void;
t: (key: string) => string;
};
}
\`\`\`

### Patró ModalState

\`\`\`typescript
interface ModalState {
isSubmitting: boolean;
status: {
type: "none" | "error" | "success";
message: string;
};
}
\`\`\`

## Validació Dual

El mòdul implementa validació en dos nivells:

### 1. Frontend (HTML5 + JavaScript)

**HTML5** - Validació mentre s'escriu:
\`\`\`tsx
<input
  required
  minLength={2}
  maxLength={100}
  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
/>
\`\`\`

**JavaScript** - Validació al submit:
\`\`\`typescript
function validateCreateAccountRequest(
data: CreateAccountRequest,
t: (key: string) => string
): ValidationErrors {
const errors: ValidationErrors = {};

if (!data.name || data.name.length < 2 || data.name.length > 100) {
errors.name = t("addModal.validation.nameRequired");
}

// ... més validacions

return errors;
}
\`\`\`

### 2. Backend

El servei retorna `validation_error` si el backend rebutja les dades (última línia de defensa).

### Regles de Validació

- **name**: Obligatori, 2-100 caràcters
- **fullName**: Opcional, màxim 200 caràcters
- **email**: Obligatori, 5-100 caràcters, format vàlid
- **phone**: Obligatori, 10-15 caràcters, numèric amb + opcional
- **address**: Obligatori, 5-200 caràcters
- **numberId**: Obligatori, 5-50 caràcters

## Components Principals

### AccountsPage

Component principal que renderitza la pàgina de comptes.

**Funcionalitats:**

- Formulari de cerca amb botó "Netejar"
- Botó "Afegir Compte" que obre modal
- Taula amb paginació
- Navegació amb botons Anterior/Següent
- Indicador: "Mostrant X a Y de Z resultats"

### AccountsTable

Taula responsiva amb les columnes:

- Nom
- Creador (fullName)
- Email
- Telèfon
- CIF/NIF
- Estat (badge verd "Activa" / vermell "Pausada")
- Accions (Editar, Pausar/Reprendre)

**Estats:**

- Loading: Mostra skeletons
- Error: Mostra missatge d'error
- Empty: "No hi ha comptes registrats"
- Data: Mostra taula amb dades

### AddNewAccountModal

Modal per crear nous comptes amb:

- Formulari amb tots els camps
- Botó "Crear Compte" / "Creant..." (disabled durant submit)
- Validació inline amb vores vermelles
- Esborrat d'error en canviar input
- Missatge d'èxit després de crear
- Tancament automàtic després d'èxit (1.5s)

### EditAccountModal

Similar a AddNewAccountModal però:

- Carrega dades del compte a l'obrir
- Mostra skeleton durant càrrega
- Botó "Actualitzar" / "Actualitzant..."
- Gestiona error `not_found`

### ConfirmStateChangeDialog

Diàleg de confirmació per pausar/reprendre comptes amb:

- Títol segons l'acció
- Descripció sobre l'impacte als usuaris
- Botons "Cancel·lar" i "Confirmar"

## Internacionalització (i18n)

### Namespace: `accounts`

**Ús en components:**
\`\`\`typescript
const { t } = useTranslation("accounts");
<span>{t("page.title")}</span>
\`\`\`

**Ús en menú:**
\`\`\`typescript
label: "accounts:page.title"
\`\`\`

### Estructura de Traduccions

\`\`\`json
{
"page": {
"title": "Comptes",
"description": "Gestiona els comptes de l'aplicació",
"addButton": "Afegir Compte"
},
"table": {
"headers": {
"name": "Nom",
"creator": "Creador",
"email": "Email"
},
"status": {
"active": "Activa",
"paused": "Pausada"
}
},
"addModal": {
"title": "Afegir Nova Compte",
"form": { ... },
"validation": { ... },
"messages": { ... }
}
}
\`\`\`

## Fluxos d'Usuari

### Crear Compte

1. Usuari clica "Afegir Compte"
2. S'obre `AddNewAccountModal`
3. Usuari completa formulari
4. Validació HTML5 mentre s'escriu
5. Clic "Crear Compte" → Validació JavaScript
6. Si hi ha errors → Mostra inline (no envia al backend)
7. Si passa → Crida `service.createAccount`
8. Backend valida i retorna estat
9. Si èxit → Missatge, tanca modal (1.5s), recarrega llista
10. Si error → Mostra missatge d'error

### Editar Compte

1. Clic botó "Editar"
2. S'obre `EditAccountModal`
3. Càrrega dades amb `getAccount`
4. Mostra skeleton durant càrrega
5. Formulari pre-omplert
6. Usuari modifica camps
7. Validació HTML5 + JS al submit
8. Si passa → Crida `service.updateAccount`
9. Gestiona resposta del backend
10. Si èxit → Tanca modal, recarrega llista

### Pausar/Reprendre Compte

1. Clic "Pausar" o "Reprendre"
2. S'obre `ConfirmStateChangeDialog`
3. Clic "Confirmar"
4. Executa `pauseAccount` o `resumeAccount`
5. Backend actualitza estat
6. Si èxit → Tanca diàleg, recarrega llista
7. Llista mostra nou estat (badge verd/vermell)

### Cercar Comptes

1. Usuari escriu al camp de cerca
2. Pressiona Enter o clic "Cercar"
3. Reseteja a pàgina 1
4. Crida `loadAccounts(1, searchTerm)`
5. Taula mostra resultats filtrats
6. Clic "Netejar" per resetejar cerca

### Paginació

1. Clic "Següent" o "Anterior"
2. Verifica `hasNextPage` / `hasPreviousPage`
3. Crida `goToPage(currentPage ± 1)`
4. Executa `loadAccounts(page, searchTerm)`
5. Taula mostra nova pàgina
6. Indicador s'actualitza

## Registre del Mòdul

\`\`\`typescript
export const accountsModule: ModuleDescriptor = {
id: "accounts",
isPrivate: true,
routes,
menu: [
{
id: "accounts.list",
label: "accounts:page.title",
path: "/private/accounts",
icon: <Building2 />,
order: 1,
},
],
};

moduleRegistry.register(accountsModule);
\`\`\`

**Activació:** El mòdul s'activa important-lo a `src/router.tsx`:

\`\`\`typescript
import "./modules/accounts";
\`\`\`

## Millors Pràctiques

### ❌ Errors Comuns

- No usar `any` → Usar interfícies específiques
- No hardcodejar text → Sempre usar `t()`
- No oblidar `credentials: "include"` al fetch
- No posar lògica de negoci als components → Usar viewmodels
- No retornar boolean dels serveis → Retornar strings d'estat
- No oblidar gestionar tots els codis HTTP

### ✅ Bones Pràctiques

- **Separació de capes**: View → ViewModel → Service → API
- **Validació dual**: HTML5 + JavaScript matching backend
- **Estats específics**: Strings descriptius, no booleans
- **i18n complet**: Tot el text traduït en 3 idiomes
- **Gestió d'errors**: Missatges clars a l'usuari
- **Loading states**: Skeletons i spinners durant càrregues
- **Confirmació**: Diàlegs per accions destructives
- **Recàrrega automàtica**: Refrescar llista després d'operacions
- **Neteja d'estat**: Resetejar modals en tancar

## Diagrames

### Flux de Dades

\`\`\`
Usuari → View → ViewModel → Service → API Backend
↓ ↓
Validació Gestió HTTP
↓ ↓
Estat Retorn estat
↓
Re-render
\`\`\`

### Estats del Modal

\`\`\`
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
\`\`\`

## Configuració

### Proxy API (vite.config.ts)

\`\`\`typescript
proxy: {
"/api": {
target: "http://localhost:5016",
changeOrigin: true,
},
}
\`\`\`

### Variables d'Entorn

\`\`\`
VITE_API_BASE=http://localhost:5173
\`\`\`

En desenvolupament, les peticions a `/api` es proxeen automàticament a `localhost:5016`.

## Dependències

- **React Router**: Navegació
- **React i18next**: Internacionalització
- **shadcn/ui + Radix UI**: Components UI
- **Tailwind CSS**: Estils
- **lucide-react**: Icones
- **Vite**: Build tool amb proxy API

## Notes Importants

- Totes les rutes del mòdul són **privades** (requereixen autenticació)
- El submòdul `accounts/users/` NO està documentat aquí
- Les cookies d'autenticació s'envien automàticament amb totes les peticions

---

**Última actualització**: Novembre 2025  
**Versió del mòdul**: 1.0  
**Estat**: Documentació completa ✅
