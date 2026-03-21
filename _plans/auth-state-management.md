# Plan: Auth State Management (`useUser` hook)

## Context

The app has Firebase initialized (`lib/firebase.ts`) but no way to access the current user's auth state from components. This feature adds a global `AuthProvider` + `useUser` hook so any client component can reactively access `{ user, isLoading }` via Firebase's `onAuthStateChanged`. No login/signup/logout flows are included — just the realtime listener infrastructure.

## Steps

### 1. Create `contexts/AuthContext/AuthContext.tsx`

New `"use client"` file containing:

- `AuthContext` created with `createContext<AuthContextType | undefined>(undefined)`
- `AuthProvider` component:
  - `useState<User | null>(null)` for user
  - `useState(true)` for isLoading (true until first auth callback)
  - `useEffect` subscribing to `onAuthStateChanged(auth, callback)` — sets user and isLoading
  - Returns unsubscribe from the effect for cleanup
  - Renders `<AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>`
- `useUser` hook:
  - Reads context, throws `"useUser must be used within an AuthProvider"` if undefined
  - Returns `{ user, isLoading }`

### 2. Create `contexts/AuthContext/index.ts`

Barrel export: `export { AuthProvider, useUser } from "./AuthContext"`

### 3. Modify `app/layout.tsx`

- Import `AuthProvider` from `@/contexts/AuthContext`
- Wrap `{children}` with `<AuthProvider>` inside `<body>`
- Layout stays a server component (no `"use client"` needed — importing a client component is fine)

### 4. Create `tests/contexts/AuthContext.test.tsx`

Mock `firebase/auth` (specifically `onAuthStateChanged`) and `@/lib/firebase`.

Test cases:

1. **Throws outside provider** — render `useUser` consumer without `AuthProvider`, expect throw
2. **Loading state initially** — mock `onAuthStateChanged` to not call callback, assert `isLoading: true`
3. **User set after auth resolves** — mock callback with fake user, assert `user` and `isLoading: false`
4. **Auth change updates state** — fire callback with user, then with `null`, assert state updates
5. **Unsubscribes on unmount** — assert the unsubscribe function returned by `onAuthStateChanged` is called

### 5. No changes to Navbar or other components

No components currently access user state. The Navbar is a server component and doesn't need changes for this spec. Future features (e.g. showing user info, logout button) will consume `useUser` when needed.

## Files

| File                                   | Action                                   |
| -------------------------------------- | ---------------------------------------- |
| `contexts/AuthContext/AuthContext.tsx` | Create                                   |
| `contexts/AuthContext/index.ts`        | Create                                   |
| `app/layout.tsx`                       | Modify (wrap children with AuthProvider) |
| `tests/contexts/AuthContext.test.tsx`  | Create                                   |

## Key references

- `lib/firebase.ts` — exports `auth` from `getAuth(app)`, consumed by AuthProvider
- `tests/components/Navbar.test.tsx` — reference for test patterns (vi.mock, render, screen queries)

## Verification

1. `npx vitest run tests/contexts/AuthContext.test.tsx` — all 5 tests pass
2. `npm run build` — no type or build errors
3. `npm run lint` — clean
4. `npm run dev` — app loads without errors, no console warnings from the provider
