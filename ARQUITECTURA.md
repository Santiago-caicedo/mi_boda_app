# Arquitectura de Mi Boda App

## Resumen Ejecutivo

**Mi Boda App** es una aplicación web SPA (Single Page Application) para planificación de bodas, diseñada específicamente para usuarios colombianos. Permite gestionar presupuestos, tareas, proveedores y el día de la boda.

---

## 1. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 18.3 + TypeScript 5.8 |
| **Build Tool** | Vite 5.4 (SWC) |
| **Routing** | React Router DOM 6.30 |
| **Estado Servidor** | TanStack React Query 5.83 |
| **Formularios** | React Hook Form + Zod |
| **UI Components** | shadcn/ui (Radix UI) |
| **Estilos** | TailwindCSS 3.4 |
| **Animaciones** | Framer Motion 12 |
| **Backend/DB** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |

---

## 2. Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE (Browser)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         REACT APPLICATION                               │ │
│  │                                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│  │  │   Pages     │  │ Components  │  │   Hooks     │  │   Contexts   │  │ │
│  │  │             │  │             │  │             │  │              │  │ │
│  │  │ - Dashboard │  │ - UI (40+)  │  │ - useBudgets│  │ - AuthContext│  │ │
│  │  │ - Budget    │  │ - Layout    │  │ - useTasks  │  │              │  │ │
│  │  │ - Tasks     │  │ - Dashboard │  │ - useProviders              │  │ │
│  │  │ - Providers │  │ - Auth      │  │ - useTransactions           │  │ │
│  │  │ - MyDay     │  │             │  │ - useWeddingProfile         │  │ │
│  │  │ - Auth      │  │             │  │             │  │              │  │ │
│  │  │ - Onboarding│  │             │  │             │  │              │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘  │ │
│  │                                                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │  │                      REACT QUERY CACHE                            │  │ │
│  │  │   Budgets | Tasks | Providers | Transactions | WeddingProfile    │  │ │
│  │  └──────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                       │                                      │
│                                       ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        SUPABASE CLIENT SDK                              │ │
│  │              @supabase/supabase-js (TypeScript Types)                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTPS/WSS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE CLOUD                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │   SUPABASE AUTH  │    │    PostgREST     │    │   Realtime Server    │  │
│  │                  │    │   (REST API)     │    │    (WebSockets)      │  │
│  │  - Email/Pass    │    │                  │    │                      │  │
│  │  - JWT Tokens    │    │  Auto-generated  │    │  (Configurado pero   │  │
│  │  - Session Mgmt  │    │  endpoints from  │    │   no usado activo)   │  │
│  │                  │    │  DB schema       │    │                      │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────────┘  │
│           │                       │                                         │
│           │                       ▼                                         │
│           │    ┌───────────────────────────────────────────────────────┐   │
│           │    │                   PostgreSQL                          │   │
│           │    │                                                       │   │
│           │    │   Tables:                                             │   │
│           │    │   - wedding_profiles    - guests                      │   │
│           │    │   - budgets             - seating_tables              │   │
│           │    │   - tasks               - day_schedule                │   │
│           │    │   - providers           - notifications               │   │
│           └───►│   - transactions                                      │   │
│                │                                                       │   │
│                │   Security: Row-Level Security (RLS) Policies         │   │
│                │   auth.uid() = user_id on all tables                  │   │
│                └───────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Diagrama de Flujo de Datos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           FLUJO DE DATOS                                     │
└──────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   Usuario Interactúa│
                    │   (Click, Submit)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  React Component    │
                    │  (Page/Dashboard)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  React Hook Form    │
                    │  + Zod Validation   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │   ¿Válido?          │
                    └──────────┬──────────┘
                       │              │
                    Sí ▼              ▼ No
         ┌─────────────────┐  ┌─────────────────┐
         │ Custom Hook     │  │ Mostrar errores │
         │ (useBudgets,    │  │ de validación   │
         │  useTasks, etc) │  └─────────────────┘
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ React Query     │
         │ useMutation()   │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Supabase Client │
         │ .from('table')  │
         │ .insert/update  │
         └────────┬────────┘
                  │
                  ▼ HTTPS
         ┌─────────────────┐
         │ Supabase API    │
         │ (PostgREST)     │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ PostgreSQL      │
         │ + RLS Check     │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │   ¿Autorizado?  │
         └────────┬────────┘
              │        │
           Sí ▼        ▼ No
┌──────────────────┐  ┌─────────────────┐
│ Ejecutar query   │  │ Error 403/401   │
│ Retornar datos   │  │ Forbidden       │
└────────┬─────────┘  └────────┬────────┘
         │                     │
         ▼                     ▼
┌─────────────────────────────────────────┐
│         React Query Cache               │
│  - Actualiza cache                      │
│  - Invalida queries relacionados        │
│  - Re-fetch automático                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Component       │
         │ Re-render       │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Sonner Toast    │
         │ (Notificación)  │
         └─────────────────┘
```

---

## 4. Diagrama Entidad-Relación (Base de Datos)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODELO DE BASE DE DATOS                               │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────────┐
                         │    auth.users        │
                         │   (Supabase Auth)    │
                         ├──────────────────────┤
                         │ PK id: UUID          │
                         │    email: TEXT       │
                         │    raw_user_meta_data│
                         │    created_at        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
          ┌─────────▼─────────┐     │     ┌─────────▼─────────┐
          │ wedding_profiles  │     │     │      budgets      │
          ├───────────────────┤     │     ├───────────────────┤
          │ PK id: UUID       │     │     │ PK id: UUID       │
          │ FK user_id ───────┼─────┤     │ FK user_id ───────┤
          │    partner1_name  │     │     │    category (ENUM)│
          │    partner2_name  │     │     │    planned_amount │
          │    wedding_date   │     │     │    spent_amount   │
          │    guest_count    │     │     │    created_at     │
          │    city           │     │     │    updated_at     │
          │    total_budget   │     │     └───────────────────┘
          │    photo_url      │     │              │
          │ UNIQUE(user_id)   │     │              │ category
          └───────────────────┘     │              │
                                    │              ▼
          ┌───────────────────┐     │     ┌───────────────────┐
          │      tasks        │     │     │   transactions    │
          ├───────────────────┤     │     ├───────────────────┤
          │ PK id: UUID       │     │     │ PK id: UUID       │
          │ FK user_id ───────┼─────┤     │ FK user_id ───────┤
          │    title          │     │     │    type (ENUM)    │
          │    description    │     │     │    amount         │
          │    due_date       │     │     │ FK category ──────┼──► budget_category
          │    completed      │     │     │    description    │
          │    months_before  │     │     │    transaction_date│
          │    is_custom      │     │     │ FK provider_id────┼──┐
          └───────────────────┘     │     └───────────────────┘  │
                                    │                            │
          ┌───────────────────┐     │     ┌───────────────────┐  │
          │    providers      │◄────┼─────┼───────────────────┼──┘
          ├───────────────────┤     │     │                   │
          │ PK id: UUID       │     │     │                   │
          │ FK user_id ───────┼─────┤     │                   │
          │    name           │     │     │                   │
          │    category (ENUM)│     │     │                   │
          │    city           │     │     │                   │
          │    price_approx   │     │     │                   │
          │    whatsapp       │     │     │                   │
          │    instagram      │     │     │                   │
          │    notes          │     │     │                   │
          │    contacted      │     │     │                   │
          │    hired          │     │     │                   │
          └───────────────────┘     │     │                   │
                                    │     │                   │
          ┌───────────────────┐     │     │                   │
          │     guests        │     │     │                   │
          ├───────────────────┤     │     │                   │
          │ PK id: UUID       │     │     │                   │
          │ FK user_id ───────┼─────┤     │                   │
          │    name           │     │     │                   │
          │    email          │     │     │                   │
          │    phone          │     │     │                   │
          │    rsvp_status    │     │     │                   │
          │ FK table_id ──────┼──┐  │     │                   │
          │    seat_number    │  │  │     │                   │
          │    dietary_notes  │  │  │     │                   │
          └───────────────────┘  │  │     │                   │
                                 │  │     │                   │
          ┌───────────────────┐  │  │     │                   │
          │  seating_tables   │◄─┘  │     │                   │
          ├───────────────────┤     │     │                   │
          │ PK id: UUID       │     │     │                   │
          │ FK user_id ───────┼─────┤     │                   │
          │    name           │     │     │                   │
          │    capacity       │     │     │                   │
          │    shape          │     │     │                   │
          │    position_x/y   │     │     │                   │
          └───────────────────┘     │     │                   │
                                    │     │                   │
          ┌───────────────────┐     │     │                   │
          │   day_schedule    │     │     │                   │
          ├───────────────────┤     │     │                   │
          │ PK id: UUID       │     │     │                   │
          │ FK user_id ───────┼─────┘     │                   │
          │    title          │           │                   │
          │    start_time     │           │                   │
          │    end_time       │           │                   │
          │    location       │           │                   │
          │    notes          │           │                   │
          │    order_index    │           │                   │
          └───────────────────┘           │                   │
                                          │                   │
          ┌───────────────────┐           │                   │
          │   notifications   │           │                   │
          ├───────────────────┤           │                   │
          │ PK id: UUID       │           │                   │
          │ FK user_id        │           │                   │
          │    type           │           │                   │
          │    title          │           │                   │
          │    message        │           │                   │
          │    read           │           │                   │
          │    related_id     │           │                   │
          └───────────────────┘           │                   │
                                          │                   │

┌─────────────────────────────────────────┴───────────────────┴───────────────┐
│                              ENUMS                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│  budget_category:                                                            │
│    'Lugar de Ceremonia' | 'Lugar de Recepción' | 'Banquete y Bebida' |      │
│    'Fotografía y Video' | 'Flores y Decoración' | 'Música y Entretenimiento'│
│    'Vestido de Novia' | 'Traje del Novio' | 'Invitaciones y Papelería' |    │
│    'Transporte' | 'Luna de Miel' | 'Otros Gastos'                           │
│                                                                              │
│  transaction_type: 'ingreso' | 'gasto'                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Diagrama de Componentes React

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       JERARQUÍA DE COMPONENTES                               │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   main.tsx  │
                              │  (Entry)    │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │   App.tsx   │
                              │  (Router)   │
                              └──────┬──────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  QueryClient      │    │   AuthProvider    │    │   Toaster         │
│  Provider         │    │   (Context)       │    │   (Sonner)        │
└───────────────────┘    └─────────┬─────────┘    └───────────────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │  BrowserRouter      │
                         │  (React Router)     │
                         └─────────┬───────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   /auth         │      │  ProtectedRoute │      │   /*            │
│   Auth.tsx      │      │                 │      │   NotFound.tsx  │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ OnboardingRoute │
                         │                 │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐
          │   /onboarding   │         │   AppLayout     │
          │   Onboarding.tsx│         │                 │
          └─────────────────┘         └────────┬────────┘
                                               │
                      ┌────────────────────────┼────────────────────────┐
                      │                        │                        │
                      ▼                        ▼                        ▼
             ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
             │ BottomNavigation     │    <Outlet>    │      │   Header       │
             │                │      │   (Pages)     │      │   (opcional)   │
             └────────────────┘      └───────┬───────┘      └────────────────┘
                                             │
     ┌───────────────┬───────────────┬───────┴───────┬───────────────┬───────────────┐
     │               │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│    /    │   │/presup- │   │ /tareas │   │/proved- │   │ /mi-dia │   │ Index   │
│Dashboard│   │  uesto  │   │ Tasks   │   │  ores   │   │  MyDay  │   │(redirect)
└────┬────┘   │ Budget  │   └────┬────┘   │Providers│   └────┬────┘   └─────────┘
     │        └────┬────┘        │        └────┬────┘        │
     │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENTES DE PÁGINA                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Dashboard.tsx                                                                   │
│  ├── CountdownTimer                                                              │
│  ├── BudgetDonutChart (Recharts)                                                │
│  ├── QuickStats                                                                  │
│  ├── BudgetCard (por categoría)                                                 │
│  └── MotivationalQuote                                                           │
│                                                                                  │
│  Budget.tsx                                                                      │
│  ├── Card (resumen total)                                                        │
│  ├── Dialog (agregar ingreso/gasto)                                             │
│  │   ├── Select (tipo, categoría)                                               │
│  │   ├── Input (monto, descripción)                                             │
│  │   └── Button (submit)                                                         │
│  ├── Tabs (categorías/transacciones)                                            │
│  └── Progress (por categoría)                                                    │
│                                                                                  │
│  Tasks.tsx                                                                       │
│  ├── Tabs (todas/pendientes/completadas)                                        │
│  ├── Dialog (nueva tarea)                                                        │
│  │   ├── Input (título)                                                         │
│  │   ├── Textarea (descripción)                                                 │
│  │   └── DatePicker                                                              │
│  └── TaskCard[] (lista de tareas)                                               │
│      ├── Checkbox                                                                │
│      ├── Badge (estado)                                                          │
│      └── Button (eliminar)                                                       │
│                                                                                  │
│  Providers.tsx                                                                   │
│  ├── Select (filtro categoría)                                                  │
│  ├── Dialog (nuevo/editar proveedor)                                            │
│  │   ├── Input (nombre, WhatsApp, Instagram)                                    │
│  │   ├── Select (categoría, ciudad)                                             │
│  │   └── Checkbox (contactado, contratado)                                      │
│  └── ProviderCard[] (lista de proveedores)                                      │
│                                                                                  │
│  MyDay.tsx                                                                       │
│  ├── Tabs (cronograma/checklist/mesas)                                          │
│  ├── TimelineItem[] (eventos del día)                                           │
│  └── Checklist[] (tareas del día)                                               │
│                                                                                  │
│  Onboarding.tsx                                                                  │
│  ├── Step 1: DatePicker (fecha boda)                                            │
│  ├── Step 2: Input (presupuesto)                                                │
│  ├── Step 3: Input (número invitados)                                           │
│  └── Step 4: Select (ciudad)                                                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Diagrama de Flujo de Autenticación

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE AUTENTICACIÓN                                │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   Usuario   │
                              │   visita    │
                              │   la app    │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ AuthContext │
                              │ initializes │
                              └──────┬──────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  supabase.auth.getSession()   │
                    │  + onAuthStateChange listener │
                    └───────────────┬───────────────┘
                                    │
                          ┌─────────┴─────────┐
                          │ ¿Sesión válida?   │
                          └─────────┬─────────┘
                             │           │
                          Sí │           │ No
                             ▼           ▼
              ┌──────────────────┐   ┌──────────────────┐
              │  user = session  │   │  user = null     │
              │  loading = false │   │  loading = false │
              └────────┬─────────┘   └────────┬─────────┘
                       │                      │
                       ▼                      ▼
              ┌──────────────────┐   ┌──────────────────┐
              │ ProtectedRoute   │   │   Redirige a     │
              │    permite       │   │   /auth          │
              └────────┬─────────┘   └────────┬─────────┘
                       │                      │
                       ▼                      ▼
              ┌──────────────────┐   ┌──────────────────┐
              │ OnboardingRoute  │   │   Auth.tsx       │
              │   verifica       │   │   (Login/Signup) │
              │   wedding_profile│   └────────┬─────────┘
              └────────┬─────────┘            │
                       │                      │
          ┌────────────┴────────────┐         │
          │ ¿Tiene wedding_profile? │         │
          └────────────┬────────────┘         │
             │              │                 │
          Sí │              │ No              │
             ▼              ▼                 │
┌──────────────────┐ ┌──────────────────┐     │
│   AppLayout      │ │  Onboarding.tsx  │     │
│   + Dashboard    │ │  (4 pasos)       │     │
└──────────────────┘ └────────┬─────────┘     │
                              │               │
                              │               │
                              ▼               │
                    ┌──────────────────┐      │
                    │ Crear perfil OK  │      │
                    │ Redirige a /     │      │
                    └──────────────────┘      │
                                             │
                    ┌────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Usuario completa   │
         │   formulario         │
         └──────────┬───────────┘
                    │
         ┌──────────┴───────────┐
         │  ¿Login o Signup?    │
         └──────────┬───────────┘
              │          │
        Login │          │ Signup
              ▼          ▼
┌───────────────────┐  ┌───────────────────┐
│signInWithPassword │  │signUp + metadata  │
│                   │  │(nombre)           │
└─────────┬─────────┘  └─────────┬─────────┘
          │                      │
          └──────────┬───────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ onAuthStateChange   │
          │ dispara evento      │
          └─────────┬───────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │ AuthContext update  │
          │ user = session.user │
          └─────────┬───────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │ React Router        │
          │ navega según estado │
          └─────────────────────┘
```

---

## 7. Diagrama de Estado de la Aplicación

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    GESTIÓN DE ESTADO                                         │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPA 1: ESTADO GLOBAL                                │
│                         (React Context)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         AuthContext                                    │  │
│  │                                                                        │  │
│  │  Estado:                      Métodos:                                 │  │
│  │  ┌─────────────────────┐      ┌─────────────────────┐                 │  │
│  │  │ user: User | null   │      │ login(email, pass)  │                 │  │
│  │  │ session: Session    │      │ signup(email,pass,n)│                 │  │
│  │  │ loading: boolean    │      │ logout()            │                 │  │
│  │  │ hasCompletedSetup   │      │                     │                 │  │
│  │  └─────────────────────┘      └─────────────────────┘                 │  │
│  │                                                                        │  │
│  │  Sincronizado con: supabase.auth.onAuthStateChange                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPA 2: ESTADO DEL SERVIDOR                          │
│                         (TanStack React Query)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │     ['budgets']     │  │     ['tasks']       │  │   ['providers']     │  │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤  │
│  │ useBudgets()        │  │ useTasks()          │  │ useProviders()      │  │
│  │ useUpdateBudgetSpent│  │ useAddTask()        │  │ useAddProvider()    │  │
│  │ useUpdateBudgetPlnd │  │ useToggleTask()     │  │ useUpdateProvider() │  │
│  │ useSetBudgetSpent() │  │ useDeleteTask()     │  │ useDeleteProvider() │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐                           │
│  │  ['transactions']   │  │ ['wedding_profile'] │                           │
│  ├─────────────────────┤  ├─────────────────────┤                           │
│  │ useTransactions()   │  │ useWeddingProfile() │                           │
│  │ useAddTransaction() │  │ useCreateOrUpdate.. │                           │
│  └─────────────────────┘  └─────────────────────┘                           │
│                                                                              │
│  Características:                                                            │
│  • Caché automático                                                          │
│  • Invalidación en mutaciones                                                │
│  • Stale-while-revalidate                                                    │
│  • Automatic refetch on window focus                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPA 3: ESTADO LOCAL                                 │
│                         (useState en componentes)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Ejemplos:                                                                   │
│  • isDialogOpen (modales)                                                    │
│  • activeTab (tabs de navegación)                                            │
│  • filterCategory (filtros)                                                  │
│  • formData (formularios antes de submit)                                    │
│  • currentStep (wizard de onboarding)                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Diagrama de Navegación (Rutas)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ESTRUCTURA DE RUTAS                                   │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │     /       │
                              │  (Index)    │
                              └──────┬──────┘
                                     │
                                     │ redirect
                                     ▼
              ┌──────────────────────────────────────────┐
              │              /auth                        │
              │         (Sin protección)                 │
              │                                          │
              │  ┌─────────────────────────────────────┐ │
              │  │  Auth.tsx                           │ │
              │  │  • Login form                       │ │
              │  │  • Signup form                      │ │
              │  │  • Validación Zod                   │ │
              │  └─────────────────────────────────────┘ │
              └──────────────────────────────────────────┘
                                     │
                                     │ login success
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RUTAS PROTEGIDAS                                      │
│                    (RequireAuth: ProtectedRoute)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │               /onboarding                                              │  │
│  │          (Solo si no tiene wedding_profile)                            │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Onboarding.tsx (Wizard 4 pasos)                                │  │  │
│  │  │  Step 1: Fecha de la boda (DatePicker)                          │  │  │
│  │  │  Step 2: Presupuesto total (Input numérico)                     │  │  │
│  │  │  Step 3: Número de invitados (Input numérico)                   │  │  │
│  │  │  Step 4: Ciudad (Select con ciudades colombianas)               │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     │ profile created                        │
│                                     ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         AppLayout                                      │  │
│  │              (OnboardingRoute: requiere wedding_profile)               │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐   │  │
│  │  │                    BottomNavigation                             │   │  │
│  │  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │   │  │
│  │  │  │ Home │  │Budget│  │Tasks │  │Provdr│  │MyDay │              │   │  │
│  │  │  │  /   │  │/presu│  │/tareas│  │/prove│ │/mi-dia│             │   │  │
│  │  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘              │   │  │
│  │  └────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                        │  │
│  │  PÁGINAS DENTRO DE AppLayout:                                          │  │
│  │                                                                        │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │  │
│  │  │      /        │  │ /presupuesto  │  │   /tareas     │              │  │
│  │  │  Dashboard    │  │   Budget      │  │    Tasks      │              │  │
│  │  │               │  │               │  │               │              │  │
│  │  │ • Countdown   │  │ • Resumen     │  │ • Lista tareas│              │  │
│  │  │ • Budget pie  │  │ • Agregar     │  │ • Filtros     │              │  │
│  │  │ • Quick stats │  │ • Categorías  │  │ • Agregar     │              │  │
│  │  │ • Tasks list  │  │ • Historial   │  │ • Completar   │              │  │
│  │  │ • Quote       │  │               │  │               │              │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘              │  │
│  │                                                                        │  │
│  │  ┌───────────────┐  ┌───────────────┐                                 │  │
│  │  │ /proveedores  │  │   /mi-dia     │                                 │  │
│  │  │  Providers    │  │    MyDay      │                                 │  │
│  │  │               │  │               │                                 │  │
│  │  │ • Lista       │  │ • Cronograma  │                                 │  │
│  │  │ • Filtros     │  │ • Checklist   │                                 │  │
│  │  │ • Agregar     │  │ • Mesas       │                                 │  │
│  │  │ • Contactar   │  │ (mock data)   │                                 │  │
│  │  └───────────────┘  └───────────────┘                                 │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

              ┌──────────────────────────────────────────┐
              │              /*                          │
              │          (Catch-all)                     │
              │                                          │
              │  ┌─────────────────────────────────────┐ │
              │  │  NotFound.tsx                       │ │
              │  │  "404 - Página no encontrada"       │ │
              │  └─────────────────────────────────────┘ │
              └──────────────────────────────────────────┘
```

---

## 9. Diagrama de Hooks Personalizados

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        HOOKS PERSONALIZADOS                                  │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           useBudgets.ts                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  useBudgets()                                                                │
│  ├── useQuery(['budgets', userId])                                          │
│  └── return { data: Budget[], isLoading, error }                            │
│                                                                              │
│  useUpdateBudgetSpent()                                                      │
│  ├── useMutation()                                                           │
│  ├── Incrementa spent_amount                                                 │
│  └── invalidateQueries(['budgets'])                                         │
│                                                                              │
│  useUpdateBudgetPlanned()                                                    │
│  ├── useMutation()                                                           │
│  ├── Actualiza planned_amount                                                │
│  └── invalidateQueries(['budgets'])                                         │
│                                                                              │
│  useSetBudgetSpent()                                                         │
│  ├── useMutation()                                                           │
│  ├── Establece spent_amount directamente                                     │
│  └── invalidateQueries(['budgets'])                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           useTasks.ts                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  useTasks()                                                                  │
│  ├── useQuery(['tasks', userId])                                            │
│  └── return { data: Task[], isLoading }                                     │
│                                                                              │
│  useAddTask()                                                                │
│  ├── useMutation()                                                           │
│  ├── Insert nueva tarea                                                      │
│  └── invalidateQueries(['tasks'])                                           │
│                                                                              │
│  useToggleTask()                                                             │
│  ├── useMutation()                                                           │
│  ├── Toggle completed: true/false                                            │
│  └── invalidateQueries(['tasks'])                                           │
│                                                                              │
│  useDeleteTask()                                                             │
│  ├── useMutation()                                                           │
│  └── invalidateQueries(['tasks'])                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         useProviders.ts                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  useProviders()                                                              │
│  ├── useQuery(['providers', userId])                                        │
│  └── return { data: Provider[], isLoading }                                 │
│                                                                              │
│  useAddProvider()                                                            │
│  ├── useMutation()                                                           │
│  └── invalidateQueries(['providers'])                                       │
│                                                                              │
│  useUpdateProvider()                                                         │
│  ├── useMutation()                                                           │
│  └── invalidateQueries(['providers'])                                       │
│                                                                              │
│  useDeleteProvider()                                                         │
│  ├── useMutation()                                                           │
│  └── invalidateQueries(['providers'])                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       useTransactions.ts                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  useTransactions()                                                           │
│  ├── useQuery(['transactions', userId])                                     │
│  └── return { data: Transaction[], isLoading }                              │
│                                                                              │
│  useAddTransaction()                                                         │
│  ├── useMutation()                                                           │
│  ├── Insert transacción                                                      │
│  └── invalidateQueries(['transactions', 'budgets'])                         │
│       ↑ También invalida budgets porque afecta spent_amount                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      useWeddingProfile.ts                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  useWeddingProfile()                                                         │
│  ├── useQuery(['wedding_profile', userId])                                  │
│  └── return { data: WeddingProfile, isLoading }                             │
│                                                                              │
│  useCreateOrUpdateWeddingProfile()                                           │
│  ├── useMutation()                                                           │
│  ├── Upsert (insert or update)                                              │
│  └── invalidateQueries(['wedding_profile'])                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         Hooks de UI                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  use-mobile.tsx                                                              │
│  ├── Detecta si es dispositivo móvil                                        │
│  └── return { isMobile: boolean }                                           │
│                                                                              │
│  use-toast.ts                                                                │
│  ├── Wrapper para Sonner                                                     │
│  └── return { toast, dismiss }                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Características de la Aplicación

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        FUNCIONALIDADES POR MÓDULO                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  1. AUTENTICACIÓN                                                            │
│  ────────────────                                                            │
│  • Registro con email, contraseña y nombre                                   │
│  • Login con email y contraseña                                              │
│  • Sesión persistente (localStorage)                                         │
│  • Logout                                                                    │
│  • Protección de rutas                                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  2. ONBOARDING (Configuración inicial)                                       │
│  ──────────────────────────────────────                                      │
│  • Wizard de 4 pasos:                                                        │
│    - Fecha de la boda                                                        │
│    - Presupuesto total                                                       │
│    - Número de invitados                                                     │
│    - Ciudad                                                                  │
│  • Inicialización de 12 categorías de presupuesto                            │
│  • Creación de perfil de boda                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  3. DASHBOARD                                                                │
│  ───────────                                                                 │
│  • Contador regresivo hasta la boda                                          │
│  • Gráfico de dona con distribución del presupuesto                         │
│  • Estadísticas rápidas:                                                     │
│    - Total gastado vs presupuestado                                          │
│    - Tareas completadas                                                      │
│    - Proveedores contratados                                                 │
│  • Próximas tareas                                                           │
│  • Frase motivacional (colombianismos)                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  4. PRESUPUESTO                                                              │
│  ──────────────                                                              │
│  • 12 categorías predefinidas:                                               │
│    - Lugar de Ceremonia                                                      │
│    - Lugar de Recepción                                                      │
│    - Banquete y Bebida                                                       │
│    - Fotografía y Video                                                      │
│    - Flores y Decoración                                                     │
│    - Música y Entretenimiento                                                │
│    - Vestido de Novia                                                        │
│    - Traje del Novio                                                         │
│    - Invitaciones y Papelería                                                │
│    - Transporte                                                              │
│    - Luna de Miel                                                            │
│    - Otros Gastos                                                            │
│  • Registrar ingresos y gastos                                               │
│  • Progreso por categoría                                                    │
│  • Historial de transacciones                                                │
│  • Moneda: Pesos Colombianos (COP)                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  5. TAREAS                                                                   │
│  ────────                                                                    │
│  • 90+ tareas predefinidas organizadas por meses antes de la boda           │
│  • Crear tareas personalizadas                                               │
│  • Filtrar: todas / pendientes / completadas                                 │
│  • Marcar como completada                                                    │
│  • Eliminar tareas                                                           │
│  • Fecha límite con DatePicker                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  6. PROVEEDORES                                                              │
│  ─────────────                                                               │
│  • Registrar proveedores con:                                                │
│    - Nombre                                                                  │
│    - Categoría (mismas 12 del presupuesto)                                  │
│    - Ciudad                                                                  │
│    - Precio aproximado                                                       │
│    - WhatsApp                                                                │
│    - Instagram                                                               │
│    - Notas                                                                   │
│  • Estados: contactado / contratado                                          │
│  • Filtrar por categoría                                                     │
│  • Editar y eliminar                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  7. MI DÍA (En desarrollo)                                                   │
│  ─────────────────────────                                                   │
│  • Cronograma del día de la boda                                             │
│  • Checklist del día                                                         │
│  • Distribución de mesas (seating)                                           │
│  • Actualmente usa datos mock                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Seguridad

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        MODELO DE SEGURIDAD                                   │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPAS DE SEGURIDAD                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CAPA DE APLICACIÓN (Frontend)                                            │
│  ────────────────────────────────                                            │
│  • ProtectedRoute: Redirige a /auth si no hay sesión                        │
│  • OnboardingRoute: Redirige a /onboarding si no hay perfil                 │
│  • Validación de formularios con Zod antes de enviar                        │
│                                                                              │
│  2. CAPA DE TRANSPORTE                                                       │
│  ──────────────────────                                                      │
│  • HTTPS obligatorio (Supabase)                                              │
│  • JWT tokens para autenticación                                             │
│  • Auto-refresh de tokens                                                    │
│                                                                              │
│  3. CAPA DE BASE DE DATOS                                                    │
│  ─────────────────────────                                                   │
│  • Row-Level Security (RLS) en todas las tablas                             │
│  • Políticas: auth.uid() = user_id                                          │
│  • Usuarios solo ven/modifican sus propios datos                            │
│                                                                              │
│  Ejemplo de política RLS:                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CREATE POLICY "Users can only see their own budgets"               │    │
│  │  ON budgets                                                         │    │
│  │  FOR ALL                                                            │    │
│  │  USING (auth.uid() = user_id);                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Localización

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        LOCALIZACIÓN COLOMBIANA                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  IDIOMA: Español (Colombia)                                                  │
│  MONEDA: COP (Pesos Colombianos)                                             │
│  FORMATO FECHA: DD/MM/YYYY                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CIUDADES DISPONIBLES:                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Bogotá      │  │ Medellín    │  │ Cali        │  │ Barranquilla│         │
│  │ Cartagena   │  │ Bucaramanga │  │ Santa Marta │  │ Pereira     │         │
│  │ Manizales   │  │ Armenia     │  │ Villavicencio│ │ Cúcuta      │         │
│  │ Ibagué      │  │ Pasto       │  │ Montería    │  │ ...         │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                                              │
│  FRASES MOTIVACIONALES (Colombianismos):                                     │
│  • "¡No te vayas a enguayabar! Tu boda va a quedar divina."                 │
│  • "¡Uy, qué chimba de progreso!"                                           │
│  • "Más puntual que bus de Transmilenio en hora pico."                      │
│  • "¡Qué nota, parcero! Van súper bien."                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Resumen de Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `src/main.tsx` | Entry point de la aplicación |
| `src/App.tsx` | Configuración de rutas y providers |
| `src/contexts/AuthContext.tsx` | Gestión global de autenticación |
| `src/integrations/supabase/client.ts` | Cliente Supabase configurado |
| `src/integrations/supabase/types.ts` | Tipos TypeScript de la DB |
| `src/hooks/*.ts` | Custom hooks para cada entidad |
| `src/pages/*.tsx` | Componentes de página |
| `src/components/ui/*.tsx` | Componentes shadcn/ui |
| `src/lib/constants.ts` | Categorías, ciudades, frases |
| `tailwind.config.ts` | Tema personalizado de boda |

---

*Documento generado automáticamente - Mi Boda App v1.0*
