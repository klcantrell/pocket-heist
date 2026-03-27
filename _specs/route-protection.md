# Spec for Route Protection

branch: claude/feature/route-protection

## Summary

- Add client-side route protection so that public pages (login, signup, preview, home) are only accessible to unauthenticated users, and dashboard pages (heists list, create, details) are only accessible to authenticated users.
- Use the existing `useUser` hook from `AuthContext` to determine auth state and conditionally redirect users.
- Show a simple loading indicator in each route group layout while Firebase auth state is being resolved.

## Functional Requirements

- **Public group (`(public)`)**: If a user is authenticated, they should be redirected away from all public pages to the dashboard (e.g. `/heists`).
- **Dashboard group (`(dashboard)`)**: If a user is unauthenticated, they should be redirected away from all dashboard pages to the login page (e.g. `/login`).
- **Loading state**: While `isLoading` is `true` from the `useUser` hook, both group layouts should display a simple centered loading indicator (e.g. a spinner or "Loading..." text) instead of their child content.
- **Redirect timing**: Redirects should only fire after `isLoading` becomes `false`, ensuring the auth state is fully resolved before making a routing decision.
- **Layout-level implementation**: Protection logic should live in the `(public)/layout.tsx` and `(dashboard)/layout.tsx` files so it applies to all pages within each group without per-page changes.

## Possible Edge Cases

- User lands on a public page, auth state resolves as authenticated — should redirect without briefly flashing the public page content.
- User lands on a dashboard page, auth state resolves as unauthenticated — should redirect without briefly flashing the dashboard page content.
- User logs out while on a dashboard page — should be redirected to login.
- User logs in while on a public page (e.g. after form submission) — existing login/signup flows already navigate on success, but the layout guard should handle any edge cases.
- Deep linking to a specific dashboard route (e.g. `/heists/abc123`) while unauthenticated — should redirect to login.

## Acceptance Criteria

- Unauthenticated users cannot see any page in the `(dashboard)` group and are redirected to `/login`.
- Authenticated users cannot see any page in the `(public)` group and are redirected to `/heists`.
- A loading indicator is visible in both group layouts while auth state is being determined.
- No flash of protected content occurs before a redirect.
- Existing login and signup flows continue to work correctly after route protection is added.

## Open Questions

- Should the home/splash page (`/`) follow the same public-group redirect rules, or should it have unique behavior (e.g. redirect authenticated users to `/heists` but still be visible to unauthenticated users)? same public-group rules please.
- Should the redirect destination be configurable or is hardcoding `/heists` and `/login` acceptable for now? hardcoding is fine for now.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Public layout renders loading indicator when auth state is loading.
- Public layout redirects authenticated users to `/heists`.
- Public layout renders children for unauthenticated users.
- Dashboard layout renders loading indicator when auth state is loading.
- Dashboard layout redirects unauthenticated users to `/login`.
- Dashboard layout renders children for authenticated users.
