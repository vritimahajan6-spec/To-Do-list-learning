# Todo List Learning — Production-Ready React Application

A **complete, production-ready React Todo List** built with **Vite + React 18**, designed to demonstrate every important React concept, pattern, and modern tooling choice.

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open **http://localhost:5173** in your browser.

### Demo Credentials

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@example.com    | Admin@123  |
| User  | user@example.com     | User@123   |

---

## ✅ React Concepts Checklist

| Concept | Where |
|---------|-------|
| JSX | Every `.jsx` file |
| Functional Components | All components except `ErrorBoundary` |
| Class Component | `src/components/ErrorBoundary.jsx` |
| Props + default props | `Button`, `Input`, `Modal`, `ConfirmDialog` |
| Children prop | `Button`, `Modal`, `ErrorBoundary` |
| `useState` | `DashboardPage`, `TodoItem`, `ProfilePage` |
| `useReducer` | `AuthContext` (6 action types) |
| `useEffect` | `AuthContext`, `ThemeContext`, `Modal`, `ProfilePage` |
| `useContext` | `useAuth`, `useTheme` hooks |
| `useRef` | `Modal` (focus management), `useClickOutside` |
| `useMemo` | `useTodos` (filtered/sorted todos + stats) |
| `useCallback` | `AuthContext`, `TodoItem`, `DashboardPage` |
| Custom Hooks | `useAuth`, `useTheme`, `useTodos`, `useDebounce`, `useLocalStorage`, `useClickOutside` |
| Context API | `AuthContext`, `ThemeContext` |
| `React.memo` | `TodoItem`, `Button` |
| `React.lazy` + `Suspense` | `ProfilePage` in `AppRouter` |
| `forwardRef` | `Input` component |
| Error Boundaries | `ErrorBoundary` (class component) |
| Portals | `Modal`, `ConfirmDialog` — render into `#portal-root` |
| Lists & Keys | `TodoList` — each `TodoItem` has a unique `key` |
| Conditional Rendering | Throughout (empty states, loading, error, role checks) |
| Event Handling | Forms, buttons, checkboxes, keyboard events |
| Lifting State Up | Filters and search live in `DashboardPage` |
| Composition | `Layout` with `<Outlet>`, provider nesting in `App.jsx` |
| One-way data flow | Props down → callbacks up pattern |

---

## 📦 NPM Packages

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | Core React library |
| `react-router-dom` v6 | Routing, protected/public routes, nested layouts |
| `axios` | HTTP client with request/response interceptors |
| `@tanstack/react-query` | Server state management, caching, optimistic updates |
| `react-hook-form` | Performant form handling |
| `zod` | Schema-based validation |
| `@hookform/resolvers` | Bridge between react-hook-form and Zod |
| `react-hot-toast` | Toast notifications |
| `react-icons` | SVG icon library |
| `uuid` | Unique ID generation for todos/users |
| `date-fns` | Date formatting and comparison |
| `vite` | Fast dev server and bundler |
| `@vitejs/plugin-react` | React Fast Refresh for Vite |
| `eslint` | Linting |
| `eslint-plugin-react-hooks` | React hooks rules enforcement |

---

## 🗂 Folder Structure

```
src/
├── api/                  # API layer
│   ├── apiClient.js      # Axios instance + interceptors
│   ├── authApi.js        # Auth endpoints
│   ├── todoApi.js        # Todo CRUD endpoints
│   └── dummyBackend/     # localStorage-backed mock API
├── assets/styles/        # CSS Modules + global CSS
├── components/
│   ├── common/           # Button, Input, Modal, Spinner, …
│   ├── layout/           # Header, Footer, Layout
│   ├── auth/             # LoginForm, RegisterForm
│   ├── todos/            # TodoList, TodoItem, TodoForm, …
│   └── ErrorBoundary.jsx # Class component
├── context/              # AuthContext, ThemeContext
├── hooks/                # Custom hooks
├── pages/                # Route-level page components
├── router/               # AppRouter, ProtectedRoute, PublicRoute
└── utils/                # constants, helpers, validators (Zod)
```

---

## 🔧 How the Dummy API Works

The dummy backend lives in `src/api/dummyBackend/`. It works by installing an **axios request interceptor** that:

1. Intercepts every outgoing request before it leaves the browser
2. Routes the request to the correct handler (`authHandlers.js` or `todoHandlers.js`)
3. Reads/writes data from `localStorage` (`db_users`, `db_todos`)
4. Returns a fake axios response via `Promise.resolve()` / `Promise.reject()`

No real HTTP requests are ever sent. An artificial 300–800 ms delay simulates network latency.

### Seed Data

On the very first page load, two users are created automatically:

```
admin@example.com / Admin@123 (role: admin)
user@example.com  / User@123  (role: user)
```

---

## 🔌 Switching to a Real API

1. Remove the `installDummyBackend(apiClient)` call from `src/api/apiClient.js`
2. Remove the import of `./dummyBackend/index` from the same file
3. Update `.env`: `VITE_API_BASE_URL=https://your-real-api.com/api`
4. Ensure your server exposes the same endpoints:
   - `POST /auth/login`
   - `POST /auth/register`
   - `POST /auth/refresh`
   - `GET  /auth/me`
   - `GET  /todos`
   - `POST /todos`
   - `PUT  /todos/:id`
   - `DELETE /todos/:id`
   - `PATCH /todos/:id/toggle`

---

## 🔐 Authentication Flow

- **Access token**: base64-encoded JSON `{userId, email, role, exp}` — expires in 15 min (or 30 days with "Remember me")
- **Refresh token**: same format, expires in 7 days
- **Auto-refresh**: axios response interceptor catches 401 responses, silently refreshes the token, and retries the original request
- **Login lockout**: 5 failed attempts → 15-minute lockout
- **AuthContext** uses `useReducer` with actions: `LOGIN_START`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `REFRESH_TOKEN`, `SET_USER`

---

## 🎨 Theme Support

Toggle between **light** and **dark** mode via the moon/sun button in the header. Theme preference is persisted in `localStorage`. All colours are CSS custom properties defined in `global.css`.

---

## 📚 Learning Path

1. Start with `src/main.jsx` → `src/App.jsx` to see the provider tree
2. Follow `src/router/AppRouter.jsx` to understand routing
3. Read `src/context/AuthContext.jsx` for `useReducer` + Context API
4. Explore `src/hooks/` for custom hooks patterns
5. Study `src/components/todos/` for CRUD patterns and React.memo
6. Look at `src/api/dummyBackend/` to understand the mock API

Happy learning! 🎉