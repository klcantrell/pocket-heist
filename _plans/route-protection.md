# Plan: Route Protection

## Context

Public pages (login, signup, preview, home) are accessible to everyone and dashboard pages (heists) have no auth guards. We need client-side route protection so public pages redirect authenticated users to `/heists`, and dashboard pages redirect unauthenticated users to `/login`. A loader should display while Firebase auth state resolves.

## Approach: Shared `AuthGuard` Component

Create a single reusable `"use client"` component that both layouts wrap around their content. Layouts stay as server components — children pass through the client boundary (standard App Router pattern).

## Steps

### 1. Check Next.js docs via Context7

Look up `useRouter` from `next/navigation` for client-side redirects in App Router.

### 2. Create `components/AuthGuard/`

**`AuthGuard.tsx`** (`"use client"`):

- Props: `{ children, mode: "requireAuth" | "requireGuest" }`
- Calls `useUser()` for `{ user, isLoading }` and `useRouter()` from `next/navigation`
- `useEffect` fires redirect when auth state resolves:
  - `requireAuth` + no user → `router.push("/login")`
  - `requireGuest` + user → `router.push("/heists")`
- Render logic (prevents content flash):
  - `isLoading` → show loader
  - Auth mismatch (redirect pending) → show loader
  - Auth matches mode → render `children`

**`AuthGuard.module.css`**: Loader class with centering + min-height (CSS Module with `@apply`, referencing globals.css)

**`index.ts`**: Barrel export

### 3. Update `app/(public)/layout.tsx`

Wrap content with `<AuthGuard mode="requireGuest">`. Layout remains a server component.

### 4. Update `app/(dashboard)/layout.tsx`

Wrap content with `<AuthGuard mode="requireAuth">`. Layout remains a server component.

### 5. Create `tests/components/AuthGuard.test.tsx`

Mock `@/contexts/AuthContext` (matching Navbar test pattern) and `next/navigation`:

- Loading state → shows loader, no children
- `requireAuth` + authenticated → renders children
- `requireAuth` + unauthenticated → calls `router.push("/login")`, no children
- `requireGuest` + unauthenticated → renders children
- `requireGuest` + authenticated → calls `router.push("/heists")`, no children

### 6. Run all tests

Verify no regressions from existing test suite.

## Files

| Action | File                                        |
| ------ | ------------------------------------------- |
| Create | `components/AuthGuard/AuthGuard.tsx`        |
| Create | `components/AuthGuard/AuthGuard.module.css` |
| Create | `components/AuthGuard/index.ts`             |
| Modify | `app/(public)/layout.tsx`                   |
| Modify | `app/(dashboard)/layout.tsx`                |
| Create | `tests/components/AuthGuard.test.tsx`       |

## Key references

- `useUser()` from `@/contexts/AuthContext` — returns `{ user, isLoading, logout }`
- `@/contexts/AuthContext/index.ts` — barrel export
- Navbar test (`tests/components/Navbar.test.tsx`) — pattern for mocking `useUser`
- `.center-content` in `globals.css` — existing centering utility (has `text-justify` so we'll make a dedicated loader class)

## Verification

1. `npx vitest run` — all tests pass
2. `npm run build` — no build errors
3. Manual: visit `/heists` logged out → redirected to `/login`
4. Manual: visit `/login` logged in → redirected to `/heists`
5. Both routes show loader briefly before redirect
