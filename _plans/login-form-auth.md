# Plan: Login Form Auth

## Context

The login form at `app/(public)/login/` currently only logs form data to the console. We need to wire it to Firebase Auth so users can actually sign in. On success, show a success message (no redirect). On failure, show user-friendly errors. The SignupForm already implements this pattern end-to-end, so we follow the same structure.

## Files to Modify

- `lib/login.ts` — **new** — login utility + error mapper
- `components/LoginForm/LoginForm.tsx` — wire to Firebase Auth
- `components/LoginForm/LoginForm.module.css` — add error, success, and disabled button styles
- `tests/components/LoginForm.test.tsx` — update tests for auth behavior

## Implementation Steps

### 1. Create `lib/login.ts`

Mirror `lib/signup.ts` (`signUpUser` / `getSignupErrorMessage`) pattern:

- `loginUser(email, password)` — calls `signInWithEmailAndPassword(auth, email, password)` from `firebase/auth`, returns the user credential
- `getLoginErrorMessage(code)` — maps Firebase error codes to friendly strings:
  - `auth/invalid-credential` → "Invalid email or password"
  - `auth/user-not-found` → "Invalid email or password" (same message to avoid enumeration)
  - `auth/wrong-password` → "Invalid email or password"
  - `auth/too-many-requests` → "Too many failed attempts. Please try again later."
  - `auth/invalid-email` → "Please enter a valid email address"
  - default → "Something went wrong. Please try again."

### 2. Update `components/LoginForm/LoginForm.tsx`

Follow the SignupForm state pattern:

- Add state: `error`, `isSubmitting`, `isSuccess`
- `handleSubmit`: clear error/success → set submitting → call `loginUser` → on success set `isSuccess` true → on failure map error code with `getLoginErrorMessage` → finally clear submitting
- Add `onChange` handler to email and password fields to clear error/success when user edits
- Conditionally render error message with `role="alert"` (same as SignupForm)
- Conditionally render success message (e.g. "Login successful!") with `role="status"`
- Disable submit button + change text to "Logging in..." while submitting

### 3. Update `components/LoginForm/LoginForm.module.css`

Add styles from SignupForm.module.css that LoginForm is missing:

- `.error` — `@apply text-error text-sm text-center`
- `.success` — `@apply text-green-400 text-sm text-center` (new for success message)
- `.submitBtnDisabled` — `@apply w-full px-4 py-2 rounded-lg font-semibold text-sm text-white bg-primary/50 mt-2 cursor-not-allowed`

### 4. Update `tests/components/LoginForm.test.tsx`

Replace the console.log test. Mock `@/lib/login` (same pattern as SignupForm tests mock `@/lib/signup`). Add tests:

- Successful login displays success message
- Invalid credentials display error message
- Submit button disabled and shows "Logging in..." while submitting
- Error message clears when user edits email or password
- Keep existing tests for rendering and password toggle

## Verification

1. Run `npx vitest run tests/components/LoginForm.test.tsx` — all tests pass
2. Run `npm run build` — no build errors
3. Run `npm run lint` — no lint errors
4. Manual: `npm run dev` → navigate to `/login` → test with valid/invalid credentials
