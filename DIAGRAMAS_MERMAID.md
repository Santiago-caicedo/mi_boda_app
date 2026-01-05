# Diagramas Mermaid - Mi Boda App

> Estos diagramas pueden visualizarse en GitHub, VS Code con extensión Mermaid, o en [mermaid.live](https://mermaid.live)

---

## 1. Arquitectura de Alto Nivel

```mermaid
flowchart TB
    subgraph Cliente["Cliente (Browser)"]
        UI[React UI]
        RQ[React Query Cache]
        AC[Auth Context]
        RR[React Router]
    end

    subgraph Supabase["Supabase Cloud"]
        Auth[Supabase Auth]
        API[PostgREST API]
        RT[Realtime]
        subgraph DB["PostgreSQL"]
            WP[(wedding_profiles)]
            BU[(budgets)]
            TA[(tasks)]
            PR[(providers)]
            TR[(transactions)]
            GU[(guests)]
            ST[(seating_tables)]
            DS[(day_schedule)]
        end
    end

    UI --> RQ
    UI --> AC
    UI --> RR
    RQ <-->|HTTPS| API
    AC <-->|JWT| Auth
    API --> DB
    Auth --> DB
    RT -.->|WebSocket| UI
```

---

## 2. Diagrama de Componentes

```mermaid
flowchart TB
    subgraph Entry["Entry Point"]
        main[main.tsx]
    end

    subgraph App["App.tsx"]
        QCP[QueryClientProvider]
        AP[AuthProvider]
        BR[BrowserRouter]
        T[Toaster]
    end

    subgraph Routes["Rutas"]
        AUTH[/auth]
        OB[/onboarding]
        PR_ROUTE[ProtectedRoute]
        OR_ROUTE[OnboardingRoute]
    end

    subgraph Layout["AppLayout"]
        BN[BottomNavigation]
        OUTLET[Outlet]
    end

    subgraph Pages["Páginas"]
        DASH[Dashboard]
        BUDGET[Budget]
        TASKS[Tasks]
        PROV[Providers]
        MYDAY[MyDay]
    end

    main --> App
    QCP --> AP
    AP --> BR
    BR --> AUTH
    BR --> PR_ROUTE
    PR_ROUTE --> OB
    PR_ROUTE --> OR_ROUTE
    OR_ROUTE --> Layout
    Layout --> BN
    Layout --> OUTLET
    OUTLET --> DASH
    OUTLET --> BUDGET
    OUTLET --> TASKS
    OUTLET --> PROV
    OUTLET --> MYDAY
```

---

## 3. Modelo de Datos (ERD)

```mermaid
erDiagram
    auth_users ||--o{ wedding_profiles : "has one"
    auth_users ||--o{ budgets : "has many"
    auth_users ||--o{ tasks : "has many"
    auth_users ||--o{ providers : "has many"
    auth_users ||--o{ transactions : "has many"
    auth_users ||--o{ guests : "has many"
    auth_users ||--o{ seating_tables : "has many"
    auth_users ||--o{ day_schedule : "has many"

    providers ||--o{ transactions : "linked to"
    seating_tables ||--o{ guests : "seats"
    budgets ||--o{ transactions : "categorizes"

    auth_users {
        uuid id PK
        string email
        jsonb raw_user_meta_data
        timestamp created_at
    }

    wedding_profiles {
        uuid id PK
        uuid user_id FK
        string partner1_name
        string partner2_name
        date wedding_date
        int guest_count
        string city
        numeric total_budget
        string photo_url
    }

    budgets {
        uuid id PK
        uuid user_id FK
        enum category
        numeric planned_amount
        numeric spent_amount
    }

    tasks {
        uuid id PK
        uuid user_id FK
        string title
        text description
        date due_date
        boolean completed
        int months_before
        boolean is_custom
    }

    providers {
        uuid id PK
        uuid user_id FK
        string name
        enum category
        string city
        numeric price_approx
        string whatsapp
        string instagram
        text notes
        boolean contacted
        boolean hired
    }

    transactions {
        uuid id PK
        uuid user_id FK
        enum type
        numeric amount
        enum category
        string description
        date transaction_date
        uuid provider_id FK
    }

    guests {
        uuid id PK
        uuid user_id FK
        string name
        string email
        string phone
        enum rsvp_status
        uuid table_id FK
        int seat_number
    }

    seating_tables {
        uuid id PK
        uuid user_id FK
        string name
        int capacity
        string shape
        int position_x
        int position_y
    }

    day_schedule {
        uuid id PK
        uuid user_id FK
        string title
        time start_time
        time end_time
        string location
        text notes
        int order_index
    }
```

---

## 4. Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant App as React App
    participant AC as AuthContext
    participant SA as Supabase Auth
    participant DB as PostgreSQL

    U->>App: Visita la aplicación
    App->>AC: Inicializa AuthContext
    AC->>SA: getSession()
    SA-->>AC: session | null

    alt No hay sesión
        AC->>App: user = null
        App->>U: Redirige a /auth
        U->>App: Ingresa credenciales
        App->>SA: signInWithPassword()
        SA->>DB: Verifica credenciales
        DB-->>SA: Usuario válido
        SA-->>App: session + user
        SA->>AC: onAuthStateChange(SIGNED_IN)
        AC->>App: user = session.user
        App->>U: Redirige a Dashboard
    else Hay sesión válida
        AC->>App: user = session.user
        App->>U: Muestra Dashboard
    end
```

---

## 5. Flujo de Onboarding

```mermaid
sequenceDiagram
    participant U as Usuario
    participant OB as Onboarding
    participant Hook as useWeddingProfile
    participant SB as Supabase
    participant DB as PostgreSQL

    U->>OB: Accede después de login
    OB->>Hook: useWeddingProfile()
    Hook->>SB: SELECT * FROM wedding_profiles
    SB->>DB: Query
    DB-->>SB: null (no existe)
    SB-->>Hook: data = null
    Hook-->>OB: No tiene perfil
    OB->>U: Muestra Step 1 (Fecha)

    U->>OB: Selecciona fecha
    OB->>U: Muestra Step 2 (Presupuesto)

    U->>OB: Ingresa presupuesto
    OB->>U: Muestra Step 3 (Invitados)

    U->>OB: Ingresa número invitados
    OB->>U: Muestra Step 4 (Ciudad)

    U->>OB: Selecciona ciudad y confirma
    OB->>Hook: createOrUpdate(profileData)
    Hook->>SB: UPSERT wedding_profiles
    SB->>DB: INSERT
    DB-->>SB: OK

    Note over OB,DB: También crea 12 categorías de budget

    Hook->>SB: INSERT INTO budgets (12 rows)
    SB->>DB: INSERT
    DB-->>SB: OK

    SB-->>Hook: Success
    Hook-->>OB: Profile created
    OB->>U: Redirige a Dashboard
```

---

## 6. Flujo CRUD - Presupuesto

```mermaid
flowchart TD
    subgraph Usuario
        A[Abre página Budget]
    end

    subgraph ReactQuery["React Query"]
        B[useBudgets]
        C[useTransactions]
        D[useAddTransaction]
    end

    subgraph Supabase
        E[PostgREST API]
        F[(PostgreSQL)]
    end

    A --> B
    A --> C
    B -->|SELECT| E
    C -->|SELECT| E
    E --> F
    F -->|budgets[]| E
    F -->|transactions[]| E
    E -->|data| B
    E -->|data| C
    B -->|render| G[Mostrar categorías]
    C -->|render| H[Mostrar historial]

    I[Usuario agrega gasto] --> D
    D -->|INSERT transaction| E
    E --> F
    F -->|OK| E
    E -->|success| D
    D -->|invalidate| B
    D -->|invalidate| C
    B -->|refetch| E
    C -->|refetch| E
```

---

## 7. Flujo CRUD - Tareas

```mermaid
flowchart LR
    subgraph Lectura
        A1[useTasks] -->|SELECT| B1[API]
        B1 --> C1[(DB)]
        C1 -->|tasks[]| B1
        B1 -->|cache| A1
    end

    subgraph Crear
        A2[useAddTask] -->|INSERT| B2[API]
        B2 --> C2[(DB)]
        C2 -->|OK| B2
        B2 -->|invalidate| A1
    end

    subgraph Toggle
        A3[useToggleTask] -->|UPDATE| B3[API]
        B3 --> C3[(DB)]
        C3 -->|OK| B3
        B3 -->|invalidate| A1
    end

    subgraph Eliminar
        A4[useDeleteTask] -->|DELETE| B4[API]
        B4 --> C4[(DB)]
        C4 -->|OK| B4
        B4 -->|invalidate| A1
    end
```

---

## 8. Flujo CRUD - Proveedores

```mermaid
stateDiagram-v2
    [*] --> Listado: useProviders()

    Listado --> Filtrado: Selecciona categoría
    Filtrado --> Listado: Limpia filtro

    Listado --> CrearDialog: Click "Agregar"
    CrearDialog --> Listado: Cancelar
    CrearDialog --> Creando: Submit form
    Creando --> Listado: useAddProvider() + invalidate

    Listado --> EditarDialog: Click en proveedor
    EditarDialog --> Listado: Cancelar
    EditarDialog --> Actualizando: Submit cambios
    Actualizando --> Listado: useUpdateProvider() + invalidate

    EditarDialog --> Eliminando: Click eliminar
    Eliminando --> Listado: useDeleteProvider() + invalidate
```

---

## 9. Estados de la Aplicación

```mermaid
stateDiagram-v2
    [*] --> Cargando: App inicia
    Cargando --> NoAutenticado: No hay sesión
    Cargando --> Autenticado: Sesión válida

    NoAutenticado --> Login: Muestra form
    Login --> Autenticado: Credenciales OK
    Login --> Login: Error, reintentar

    NoAutenticado --> Signup: Click registro
    Signup --> Autenticado: Registro OK
    Signup --> Signup: Error, reintentar

    Autenticado --> SinPerfil: No tiene wedding_profile
    Autenticado --> ConPerfil: Tiene wedding_profile

    SinPerfil --> Onboarding: Muestra wizard
    Onboarding --> ConPerfil: Completa 4 pasos

    ConPerfil --> Dashboard: Navega
    Dashboard --> Budget: Tab Presupuesto
    Dashboard --> Tasks: Tab Tareas
    Dashboard --> Providers: Tab Proveedores
    Dashboard --> MyDay: Tab Mi Día

    Budget --> Dashboard: Tab Home
    Tasks --> Dashboard: Tab Home
    Providers --> Dashboard: Tab Home
    MyDay --> Dashboard: Tab Home

    ConPerfil --> NoAutenticado: Logout
```

---

## 10. Arquitectura de Hooks

```mermaid
flowchart TB
    subgraph Contexto["Context Layer"]
        AUTH[useAuth]
    end

    subgraph ServerState["Server State Layer (React Query)"]
        WP[useWeddingProfile]
        BU[useBudgets]
        TA[useTasks]
        PR[useProviders]
        TR[useTransactions]
    end

    subgraph Mutations["Mutations"]
        WP_M[useCreateOrUpdateWeddingProfile]
        BU_M1[useUpdateBudgetSpent]
        BU_M2[useUpdateBudgetPlanned]
        BU_M3[useSetBudgetSpent]
        TA_M1[useAddTask]
        TA_M2[useToggleTask]
        TA_M3[useDeleteTask]
        PR_M1[useAddProvider]
        PR_M2[useUpdateProvider]
        PR_M3[useDeleteProvider]
        TR_M[useAddTransaction]
    end

    subgraph UI["UI Hooks"]
        MOB[useMobile]
        TOAST[useToast]
    end

    subgraph Supabase["Supabase Client"]
        SB[supabase]
    end

    AUTH --> SB
    WP --> SB
    BU --> SB
    TA --> SB
    PR --> SB
    TR --> SB

    WP_M --> WP
    BU_M1 --> BU
    BU_M2 --> BU
    BU_M3 --> BU
    TA_M1 --> TA
    TA_M2 --> TA
    TA_M3 --> TA
    PR_M1 --> PR
    PR_M2 --> PR
    PR_M3 --> PR
    TR_M --> TR
    TR_M --> BU
```

---

## 11. Navegación de la App

```mermaid
flowchart TB
    subgraph Public["Rutas Públicas"]
        AUTH_PAGE["/auth<br/>Login/Signup"]
    end

    subgraph Protected["Rutas Protegidas"]
        subgraph Setup["Sin Perfil"]
            ONBOARDING["/onboarding<br/>Wizard 4 pasos"]
        end

        subgraph Main["Con Perfil - AppLayout"]
            HOME["/<br/>Dashboard"]
            BUDGET["/presupuesto<br/>Budget"]
            TASKS["/tareas<br/>Tasks"]
            PROVIDERS["/proveedores<br/>Providers"]
            MYDAY["/mi-dia<br/>MyDay"]
        end
    end

    NOT_FOUND["/*<br/>404 Not Found"]

    AUTH_PAGE -->|Login OK| ONBOARDING
    AUTH_PAGE -->|Login OK + Perfil| HOME
    ONBOARDING -->|Completa| HOME

    HOME <--> BUDGET
    HOME <--> TASKS
    HOME <--> PROVIDERS
    HOME <--> MYDAY
    BUDGET <--> TASKS
    BUDGET <--> PROVIDERS
    TASKS <--> PROVIDERS
    PROVIDERS <--> MYDAY
```

---

## 12. Ciclo de Vida de una Transacción

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Form (Zod)
    participant M as useAddTransaction
    participant RQ as React Query
    participant API as Supabase API
    participant DB as PostgreSQL
    participant T as Toast

    U->>F: Llena formulario (tipo, monto, categoría)
    F->>F: Validación Zod

    alt Validación falla
        F-->>U: Muestra errores
    else Validación OK
        F->>M: mutate(transactionData)
        M->>API: POST /transactions
        API->>DB: INSERT INTO transactions
        DB->>DB: RLS check (user_id)

        alt RLS OK
            DB-->>API: row inserted
            API-->>M: success
            M->>RQ: invalidateQueries(['transactions'])
            M->>RQ: invalidateQueries(['budgets'])
            RQ->>API: refetch queries
            API-->>RQ: fresh data
            RQ-->>U: UI actualizada
            M->>T: toast.success()
            T-->>U: "Transacción registrada"
        else RLS Denied
            DB-->>API: error 403
            API-->>M: error
            M->>T: toast.error()
            T-->>U: "Error al registrar"
        end
    end
```

---

## 13. Estructura de Componentes UI (shadcn/ui)

```mermaid
mindmap
  root((shadcn/ui))
    Forms
      Button
      Input
      Label
      Select
      Textarea
      Checkbox
      DatePicker
      Form
    Layout
      Card
      Dialog
      Sheet
      Tabs
      Separator
      ScrollArea
    Feedback
      Toast/Sonner
      Skeleton
      Progress
      Badge
      Alert
    Navigation
      BottomNavigation
      Breadcrumb
      Command
    Data Display
      Avatar
      Table
      Carousel
    Overlay
      Popover
      Tooltip
      AlertDialog
      DropdownMenu
```

---

## 14. Categorías de Presupuesto

```mermaid
pie title Distribución de Categorías de Boda
    "Lugar de Ceremonia" : 10
    "Lugar de Recepción" : 15
    "Banquete y Bebida" : 20
    "Fotografía y Video" : 10
    "Flores y Decoración" : 8
    "Música y Entretenimiento" : 7
    "Vestido de Novia" : 8
    "Traje del Novio" : 4
    "Invitaciones" : 3
    "Transporte" : 5
    "Luna de Miel" : 7
    "Otros Gastos" : 3
```

---

## 15. Timeline del Onboarding

```mermaid
journey
    title Proceso de Onboarding
    section Registro
      Crear cuenta: 5: Usuario
      Confirmar email: 3: Usuario
    section Configuración
      Seleccionar fecha boda: 5: Usuario
      Definir presupuesto: 4: Usuario
      Número de invitados: 5: Usuario
      Elegir ciudad: 5: Usuario
    section Completado
      Ver Dashboard: 5: Usuario
      Explorar funciones: 4: Usuario
```

---

## 16. Seguridad - Row Level Security

```mermaid
flowchart TD
    subgraph Request["Request del Cliente"]
        REQ[SELECT * FROM budgets]
    end

    subgraph Auth["Autenticación"]
        JWT[JWT Token]
        UID[auth.uid]
    end

    subgraph RLS["Row Level Security"]
        POLICY["POLICY: auth.uid() = user_id"]
        CHECK{user_id match?}
    end

    subgraph Result["Resultado"]
        OK[Retorna filas del usuario]
        DENIED[Retorna vacío / Error]
    end

    REQ --> JWT
    JWT --> UID
    UID --> POLICY
    POLICY --> CHECK
    CHECK -->|Sí| OK
    CHECK -->|No| DENIED
```

---

## 17. Stack Tecnológico Visual

```mermaid
block-beta
    columns 3

    block:frontend:3
        columns 3
        A["React 18"] B["TypeScript"] C["Vite"]
    end

    block:state:3
        columns 3
        D["React Query"] E["React Context"] F["React Hook Form"]
    end

    block:ui:3
        columns 3
        G["shadcn/ui"] H["TailwindCSS"] I["Framer Motion"]
    end

    block:backend:3
        columns 3
        J["Supabase Auth"] K["PostgREST"] L["PostgreSQL"]
    end

    frontend --> state
    state --> ui
    ui --> backend
```

---

## Cómo Visualizar Estos Diagramas

1. **GitHub**: Copia este archivo a un repo de GitHub, los diagramas se renderizan automáticamente.

2. **VS Code**: Instala la extensión "Markdown Preview Mermaid Support"

3. **Online**: Ve a [mermaid.live](https://mermaid.live) y pega cualquier bloque de código Mermaid

4. **Notion**: Soporta bloques de código Mermaid nativamente

5. **Obsidian**: Soporta Mermaid con el plugin de preview

---

*Diagramas generados para Mi Boda App*
