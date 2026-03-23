# Plan: Navbar Logout Button

## Context

The spec (`_specs/navbar-logout-button.md`) calls for a logout button in the Navbar that signs the user out via Firebase Auth. The button should only appear when the user is authenticated. Currently the Navbar is a stateless server component with no auth awareness, and the auth context doesn't expose a sign-out function.

## Implementation Steps

### 1. Add a `logout` function to AuthContext

**File:** `contexts/AuthContext/AuthContext.tsx`

- Import `signOut` from `firebase/auth`
- Add `logout: () => Promise<void>` to `AuthContextType`
- Implement `logout` in the provider that calls `signOut(auth)`
- Expose it through the context value

### 2. Create a LogoutButton client component

**Files:** `components/LogoutButton/LogoutButton.tsx`, `components/LogoutButton/LogoutButton.module.css`, `components/LogoutButton/index.ts`

- `"use client"` component that calls `useUser()` to check auth state
- Renders a `<button>` calling `logout()` on click
- Returns `null` when no user is authenticated
- Style per Figma: outlined button with white 1px border, 10px radius, transparent background, white "Logout" text, Inter 16px, -0.3px letter-spacing

### 3. Add LogoutButton to Navbar

**File:** `components/Navbar/Navbar.tsx`

- Import and render `<LogoutButton />` inside the `<ul>` nav items
- Navbar stays a server component; LogoutButton handles its own client-side logic

### 4. Add tests

**File:** `tests/components/LogoutButton.test.tsx`

- Mock `@/contexts/AuthContext` to control `user` and `logout`
- Test: button renders when user is present
- Test: button does not render when user is null
- Test: clicking button calls the logout function

## Files to modify

- `contexts/AuthContext/AuthContext.tsx` — add logout
- `components/LogoutButton/LogoutButton.tsx` — new component
- `components/LogoutButton/LogoutButton.module.css` — new styles
- `components/LogoutButton/index.ts` — barrel export
- `components/Navbar/Navbar.tsx` — render LogoutButton
- `tests/components/LogoutButton.test.tsx` — new tests

## Verification

1. Run `npx vitest run` — all existing and new tests pass
2. Run `npm run build` — no build errors
3. Manual: log in, verify logout button appears in navbar, click it, confirm sign-out occurs and button disappears
