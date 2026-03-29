# Plan: Create Heist Form

## Context

The `app/(dashboard)/heists/create/page.tsx` page is a stub with just a heading. We need to build a form that lets authenticated users create heist documents in Firestore. The form collects title, description, and an assignee (selected from the `users` collection), then programmatically adds metadata (createdBy, deadline, timestamps) before writing to Firestore and redirecting to `/heists`.

Spec: `_specs/create-heist-form.md`

## Files to Modify

1. **`types/firestore/index.ts`** — add `export * from "./user"` (currently missing)

## Files to Create

2. **`lib/users.ts`** — `fetchUsers()`: queries `users` collection, returns `User[]`
3. **`lib/heist.ts`** — `createHeist(input: CreateHeistInput)`: calls `addDoc` on `heists` collection
4. **`components/CreateHeistForm/CreateHeistForm.tsx`** — the form component
5. **`components/CreateHeistForm/CreateHeistForm.module.css`** — scoped styles
6. **`components/CreateHeistForm/index.ts`** — barrel export
7. **`app/(dashboard)/heists/create/page.tsx`** — update to render `<CreateHeistForm />`
8. **`tests/components/CreateHeistForm.test.tsx`** — component tests
9. **`tests/lib/heist.test.ts`** — unit tests for createHeist
10. **`tests/lib/users.test.ts`** — unit tests for fetchUsers

## Implementation Steps

### Step 1: Fix barrel export

Add `export * from "./user"` to `types/firestore/index.ts` so `User` is accessible via `@/types/firestore`.

### Step 2: Create `lib/users.ts`

- Import `collection`, `getDocs` from `firebase/firestore`
- Import `db` from `@/lib/firebase`, `COLLECTIONS` from `@/types/firestore`
- `fetchUsers()` calls `getDocs(collection(db, COLLECTIONS.USERS))` and maps docs to `User[]` (`{ id: doc.id, codename: doc.data().codename }`)

### Step 3: Create `lib/heist.ts`

- Import `addDoc`, `collection` from `firebase/firestore`
- Import `db` from `@/lib/firebase`, `CreateHeistInput`, `COLLECTIONS` from `@/types/firestore`
- `createHeist(input: CreateHeistInput)` calls `addDoc(collection(db, COLLECTIONS.HEISTS), input)`, returns the doc ID

### Step 4: Create `CreateHeistForm` component

Follow `SignupForm` patterns exactly:

- `"use client"` component
- State: `error`, `isSubmitting`, `users`, `isLoadingUsers`
- `useEffect` on mount: call `fetchUsers()` to populate dropdown
- `useUser()` for current user's `uid` and `displayName` (codename)
- `useRouter()` for redirect after success
- Filter out the current user from the users list (exclude self-assignment)

**Form fields:**

- Title — `<input type="text">` inside `<FormField>`
- Description — `<textarea>` inside `<FormField>`
- Assign To — `<select>` inside `<FormField>`, options from `users` array showing codenames

**handleSubmit:**

1. Read title, description, assignTo from `FormData`
2. Look up assignee codename from `users` array
3. Build `CreateHeistInput`: computed `deadline` (48h from now), `createdAt: serverTimestamp()`, `finalStatus: null`, `createdBy/createdByCodename` from auth
4. Call `createHeist(input)`
5. `router.push("/heists")` on success
6. Set error on failure, `try/catch/finally` pattern

**CSS Module** — reuse same structure as `SignupForm.module.css` (`.form`, `.submitBtn`, `.submitBtnDisabled`, `.error`)

### Step 5: Update page file

Import and render `<CreateHeistForm />` below the existing heading in `app/(dashboard)/heists/create/page.tsx`. Page stays as a server component.

### Step 6: Tests

**`tests/lib/users.test.ts`** — mock `firebase/firestore` and `@/lib/firebase`, verify `fetchUsers` maps docs correctly

**`tests/lib/heist.test.ts`** — mock `firebase/firestore` and `@/lib/firebase`, verify `createHeist` calls `addDoc` with correct args

**`tests/components/CreateHeistForm.test.tsx`** — mock `next/navigation`, `@/contexts/AuthContext/AuthContext`, `@/lib/users`, `@/lib/heist`, `firebase/firestore`:

- Renders all form fields
- Populates assign-to dropdown from fetched users
- Calls `createHeist` with correct input shape on submit
- Redirects to `/heists` on success
- Shows error on failure
- Disables submit while submitting or while users are loading

## Key Patterns to Reuse

- `SignupForm` (`components/SignupForm/SignupForm.tsx`) — form structure, error/loading state, redirect pattern
- `FormField` (`components/FormField/FormField.tsx`) — label+input wrapper (works with textarea/select)
- `lib/signup.ts` — Firestore write pattern
- `SignupForm.test.tsx` — test mocking patterns, controlled promise for loading state tests
- `SignupForm.module.css` — CSS Module structure

## Verification

1. `npx vitest run` — all tests pass
2. `npm run lint` — no lint errors
3. `npm run build` — no type errors
4. Manual: navigate to `/heists/create`, fill form, submit, verify redirect and Firestore doc creation
