# Plan: useHeists Hook

## Context

The heists dashboard page (`app/(dashboard)/heists/page.tsx`) is a stub with three empty sections. We need a `useHeists` hook that subscribes to real-time Firestore data and filters heists by mode (`active`, `assigned`, `expired`), then integrate it into the page to display heist titles. The spec with answered open questions is at `_specs/use-heists-hook.md`.

## Files to Create

1. **`hooks/useHeists/useHeists.ts`** — the hook
2. **`hooks/useHeists/index.ts`** — barrel export
3. **`tests/hooks/useHeists.test.tsx`** — hook tests
4. **`tests/app/heists-page.test.tsx`** — page integration tests

## Files to Modify

5. **`app/(dashboard)/heists/page.tsx`** — add `"use client"`, integrate hook
6. **`app/(dashboard)/heists/page.module.css`** — create page styles (new file)

## Implementation

### Step 1: `hooks/useHeists/useHeists.ts`

Export `type HeistFilter = "active" | "assigned" | "expired"` and the hook.

Hook signature: `useHeists(filter: HeistFilter)` → `{ heists: Heist[], isLoading: boolean, error: Error | null }`

Logic:

- Get user via `useUser()` from `@/contexts/AuthContext`
- `useEffect` with deps `[filter, user?.uid]`:
  - If no user → set empty heists, not loading, return early
  - Build query using `collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)` + `where`:
    - `"active"` → `where("createdBy", "==", user.uid)`
    - `"assigned"` → `where("assignedTo", "==", user.uid)`
    - `"expired"` → `where("finalStatus", "in", ["success", "failure"])`
  - Subscribe with `onSnapshot(q, onNext, onError)`:
    - `onNext`: map `snapshot.docs` → `doc.data()`, then client-side filter:
      - active/assigned: keep `deadline > now`
      - expired: keep `deadline < now`, sort by deadline descending (most recent first)
    - `onError`: set error state
  - Return unsubscribe from cleanup

Reuses: `heistConverter` and `COLLECTIONS` from `@/types/firestore`, `db` from `@/lib/firebase`, `useUser` from `@/contexts/AuthContext`.

### Step 2: `hooks/useHeists/index.ts`

```
export { useHeists, type HeistFilter } from "./useHeists"
```

### Step 3: Update `app/(dashboard)/heists/page.tsx`

Add `"use client"`. Call hook 3 times:

```
const active = useHeists("active")
const assigned = useHeists("assigned")
const expired = useHeists("expired")
```

Extract a small local `HeistSection` component (within the same file) to avoid repetition. It renders:

- `<h2>` heading
- Loading text when `isLoading`
- Error alert when `error`
- `<ul>` of heist titles
- Empty message when no heists and not loading

### Step 4: `app/(dashboard)/heists/page.module.css`

Minimal styles with `@apply` for section spacing, list styling, and state indicators. Reference theme via `@reference "../../app/globals.css"`.

### Step 5: Tests

**`tests/hooks/useHeists.test.tsx`** — Mock `useUser`, `firebase/firestore` (`collection`, `query`, `where`, `onSnapshot`), and `@/lib/firebase`. Use `renderHook` from `@testing-library/react`.

- Returns empty array when user is null
- Active filter: queries `assignedTo` + filters future deadline
- Assigned filter: queries `createdBy` + filters future deadline
- Expired filter: queries `finalStatus in [...]` + filters past deadline, sorted desc
- Cleans up subscription on unmount
- Sets error state on snapshot error

**`tests/app/heists-page.test.tsx`** — Mock `@/hooks/useHeists` and `@/contexts/AuthContext`.

- Renders three section headings
- Renders heist titles from each section
- Empty state renders without errors

## Verification

1. `npx vitest run` — all tests pass
2. `npm run lint` — no lint errors
3. `npm run build` — no type errors
4. Manual: log in → navigate to `/heists` → verify sections populate with real-time data
