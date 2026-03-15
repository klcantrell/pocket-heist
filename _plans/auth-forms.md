# Auth Forms Implementation Plan

## Context

The `/login` and `/signup` pages are currently shells with only titles. This plan adds functional auth forms with email/password fields, password visibility toggle, console-logged submission, and cross-links between the two pages. No real auth backend yet.

## Approach: Composable Primitives + Separate Form Components

Decompose into small reusable primitives (`FormField`, `PasswordInput`) and separate `LoginForm` / `SignupForm` components that compose them. This keeps login and signup decoupled so they can diverge independently.

## Files to Create

### 1. `components/FormField/` — labeled input wrapper

**FormField.tsx** — Stateless, no `"use client"`. Props: `{ label: string, id: string, children: React.ReactNode }`. Renders a `<div>` with `<label htmlFor={id}>` and `{children}`.

**FormField.module.css** — `.fieldGroup` (flex column, gap), `.label` (text styling).

**index.ts** — barrel export.

### 2. `components/PasswordInput/` — input with visibility toggle

**PasswordInput.tsx** — `"use client"`, owns `useState(false)` for visibility. Props: extends `Omit<InputHTMLAttributes, "type">`. Renders `<input type={visible ? "text" : "password"}>` plus a `<button type="button">` with `Eye`/`EyeOff` from lucide-react. Toggle button gets `aria-label="Toggle password visibility"`.

**PasswordInput.module.css** — `.wrapper` (relative positioning), `.input` (styled input), `.toggle` (absolutely positioned icon button).

**index.ts** — barrel export.

### 3. `components/LoginForm/` — login-specific form

**LoginForm.tsx** — `"use client"`. Composes `FormField` + `PasswordInput`. Manages form submission via `FormData` → `console.log({ email, password })`. Renders email input, password input, "Log In" submit button (uses global `.btn`), and a link to `/signup` ("Don't have an account? Sign up").

**LoginForm.module.css** — `.form`, `.input`, `.submitBtn`, `.footer`, `.link`.

**index.ts** — barrel export.

### 4. `components/SignupForm/` — signup-specific form

**SignupForm.tsx** — Same structure as LoginForm but with "Sign Up" button and link to `/login` ("Already have an account? Log in"). Separate component so it can diverge freely.

**SignupForm.module.css** — Same structure as LoginForm's CSS module.

**index.ts** — barrel export.

## Files to Modify

### `app/globals.css`

Add a `.form-input` utility class so both LoginForm and PasswordInput share consistent input styling:

```css
.form-input {
  @apply w-full px-3 py-2 rounded-lg bg-lighter text-white border border-body/20 outline-none focus:border-primary;
}
```

### `app/(public)/login/page.tsx`

- Fix function name from `SignupPage` → `LoginPage`
- Import and render `<LoginForm />` below the `<h2>`

### `app/(public)/signup/page.tsx`

- Import and render `<SignupForm />` below the `<h2>`

## Tests

### `tests/components/LoginForm.test.tsx`

1. Renders email field, password field, toggle icon, and "Log In" button
2. Password visibility toggles on icon click
3. Form submission calls `console.log` with `{ email, password }`
4. Contains link to `/signup`

### `tests/components/SignupForm.test.tsx`

1. Renders email field, password field, toggle icon, and "Sign Up" button
2. Password visibility toggles on icon click
3. Form submission calls `console.log` with `{ email, password }`
4. Contains link to `/login`

## Implementation Order

1. `FormField` — no dependencies
2. `PasswordInput` — no dependencies beyond lucide-react
3. `.form-input` in globals.css
4. `LoginForm` — depends on FormField, PasswordInput
5. `SignupForm` — depends on FormField, PasswordInput
6. Update login/page.tsx and signup/page.tsx
7. Tests

## Verification

1. `npx vitest run tests/components/LoginForm.test.tsx tests/components/SignupForm.test.tsx` — all tests pass
2. `npm run build` — no build errors
3. `npm run dev` → visit `/login` and `/signup` — forms render, toggle works, submit logs to console, cross-links navigate correctly
