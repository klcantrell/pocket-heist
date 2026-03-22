# Plan: Signup Firebase Auth

## Context

The SignupForm component currently logs form data to console. This plan wires it to Firebase Auth to create real user accounts, generates a heist-themed codename as `displayName`, and stores a user document in Firestore with only `id` and `codename` (no email).

## New Files

### 1. `lib/codename.ts` — Codename generator

- Three arrays (~20 words each): `ADJECTIVES`, `NOUNS`, `VERBS` — heist-themed, PascalCase
- `pickRandom(list)` helper using `Math.random()`
- Export `generateCodename()` → concatenates one pick from each list (e.g. `SilentFoxDashes`)

### 2. `lib/signup.ts` — Signup orchestration

- `signUpUser(email, password)`:
  1. `createUserWithEmailAndPassword(auth, email, password)`
  2. `generateCodename()`
  3. `updateProfile(user, { displayName: codename })`
  4. `setDoc(doc(db, "users", uid), { id: uid, codename })`
  5. Return `{ user, codename }`
- `getSignupErrorMessage(code: string): string` — maps Firebase error codes to friendly messages:
  - `auth/email-already-in-use` → "That email is already registered"
  - `auth/weak-password` → "Password must be at least 6 characters"
  - `auth/invalid-email` → "Please enter a valid email address"
  - default → "Something went wrong. Please try again."

## Modified Files

### 3. `components/SignupForm/SignupForm.module.css`

Add:

- `.error` — `text-error text-sm text-center`
- `.submitBtnDisabled` — same layout as `.submitBtn` but `bg-primary/50 cursor-not-allowed`

### 4. `components/SignupForm/SignupForm.tsx`

- Add `useState` for `error` (string | null) and `isSubmitting` (boolean)
- Add `useRouter` from `next/navigation`
- Replace `handleSubmit` with async version:
  - Clear error, set submitting
  - Call `signUpUser(email, password)`
  - On success: `router.push("/heists")`
  - On error: `setError(getSignupErrorMessage(err.code))`
  - Finally: `setIsSubmitting(false)`
- Render error message with `role="alert"` above submit button
- Conditionally disable button and swap class/text during submission

## Test Files

### 5. `tests/lib/codename.test.ts` (new)

- Returns a string
- Matches PascalCase pattern (3 capitalized segments)
- Multiple calls produce varying results

### 6. `tests/lib/signup.test.ts` (new)

- Mock `firebase/auth`, `firebase/firestore`, `@/lib/firebase`, `@/lib/codename`
- Verify `createUserWithEmailAndPassword` called with correct args
- Verify `updateProfile` called with generated codename
- Verify `setDoc` called with `users/{uid}` containing only `id` and `codename`
- Verify errors propagate

### 7. `tests/components/SignupForm.test.tsx` (modify)

- Mock `@/lib/signup` and `next/navigation` (useRouter)
- Update "logs email and password" → verify `signUpUser` called with correct args
- Add: "redirects to /heists on success"
- Add: "displays error on failure" (check `role="alert"`)
- Add: "disables button while submitting"
- Keep existing render and password toggle tests unchanged

## Implementation Order

1. `lib/codename.ts` + `tests/lib/codename.test.ts`
2. `lib/signup.ts` + `tests/lib/signup.test.ts`
3. `SignupForm.module.css` updates
4. `SignupForm.tsx` updates
5. `SignupForm.test.tsx` updates
6. Run all tests, verify build

## Verification

- `npx vitest run` — all tests pass
- `npm run build` — no type errors
- `npm run lint` — no lint errors
- Manual: visit `/signup`, submit form, confirm user created in Firebase console with codename as displayName and Firestore `users/{uid}` doc with `id` + `codename` only
