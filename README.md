# React Todo Learning App

A production-ready React Todo List application built as a comprehensive learning resource
covering the most important React and ecosystem concepts.

---

## React Concepts Covered

| Concept | Where to find it |
|---|---|
| JSX & rendering | Every component file |
| useState | `ThemeContext`, `LoginForm`, `DashboardPage` |
| useReducer | `AuthContext` |
| useEffect + cleanup | `useDebounce`, `Modal`, `TodoSearch` |
| useRef | `TodoSearch`, `Modal`, `useClickOutside` |
| useCallback | `DashboardPage`, `AuthContext` |
| useMemo | `TodoStats` |
| Context API | `AuthContext`, `ThemeContext` |
| Custom hooks | `useAuth`, `useTheme`, `useTodos`, `useDebounce`, `useLocalStorage`, `useClickOutside` |
| React.memo | `Button`, `TodoList`, `TodoItem` |
| forwardRef | `Input` |
| Portals | `Modal`, `ConfirmDialog` |
| Error Boundary (class) | `ErrorBoundary` |
| Lazy loading + Suspense | `AppRouter` -> `ProfilePage` |
| React Router v6 | `AppRouter`, `ProtectedRoute`, `PublicRoute` |
| React Query | `useTodos` (query + mutations + optimistic updates) |
| react-hook-form + Zod | `LoginForm`, `RegisterForm`, `TodoForm` |
| Axios interceptors | `apiClient`, `dummyBackend/index.js` |

---

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Demo Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@example.com   | Admin@123 |
| User  | user@example.com    | User@123  |

Both accounts are seeded automatically in `localStorage` on first load.

---

## How the Dummy API Works

All HTTP requests are intercepted **before** reaching the network using an Axios
request interceptor in `src/api/dummyBackend/index.js`. Requests matching
`/api/auth/*` or `/api/todos*` are routed to handler functions that read/write
from `localStorage` as a pseudo-database.

### To switch to a real API

1. Open `src/api/apiClient.js`
2. Remove the line: `import './dummyBackend/index.js';`
3. Create a `.env` file: `VITE_API_BASE_URL=https://your-real-api.com/api`

---

## Project Structure

```
src/
+-- api/
|   +-- dummyBackend/     # Axios-interceptor mock backend
|   |   +-- index.js      # Interceptor setup
|   |   +-- authHandlers.js
|   |   +-- todoHandlers.js
|   +-- apiClient.js      # Configured axios instance + token refresh
|   +-- authApi.js
|   +-- todoApi.js
+-- assets/styles/        # CSS Modules
+-- components/
|   +-- auth/             # LoginForm, RegisterForm
|   +-- common/           # Button, Input, Modal, Spinner, ErrorBoundary, ...
|   +-- layout/           # Header, Footer, Layout
|   +-- todos/            # TodoList, TodoItem, TodoForm, TodoFilters, TodoStats, TodoSearch
+-- context/              # AuthContext, ThemeContext
+-- hooks/                # useAuth, useTheme, useTodos, useDebounce, ...
+-- pages/                # LoginPage, RegisterPage, DashboardPage, ProfilePage, NotFoundPage
+-- router/               # AppRouter, ProtectedRoute, PublicRoute
+-- utils/                # constants, helpers, validators
```

---

## Suggested Reading Order

1. `src/utils/constants.js`
2. `src/utils/validators.js`
3. `src/api/dummyBackend/`
4. `src/api/apiClient.js`
5. `src/context/AuthContext.jsx`
6. `src/context/ThemeContext.jsx`
7. `src/hooks/`
8. `src/components/common/`
9. `src/components/todos/`
10. `src/pages/DashboardPage.jsx`
11. `src/router/AppRouter.jsx`

---

## Available Scripts

| Script            | Description               |
|-------------------|---------------------------|
| `npm run dev`     | Start development server  |
| `npm run build`   | Production build          |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Lint source files         |
