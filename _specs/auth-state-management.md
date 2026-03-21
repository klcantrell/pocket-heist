# Spec for Auth State Management

branch: claude/feature/auth-state-management

## Summary

- Introduce a global auth state management layer using a React context provider and a `useUser` hook
- The hook exposes the current Firebase user (or `null` when logged out) and a loading state
- A realtime `onAuthStateChanged` listener keeps the state in sync automatically
- Update any existing components that need access to the current user to consume the hook

## Functional Requirements

- Create an `AuthProvider` component that wraps the application and subscribes to Firebase `onAuthStateChanged`
- The provider should store the current `User | null` and an `isLoading` boolean (true until the first auth check resolves)
- Expose a `useUser` hook that returns `{ user, isLoading }` from the auth context
- The hook should throw a clear error if used outside of `AuthProvider`
- Mount `AuthProvider` in the root layout (`app/layout.tsx`) so every page and component can access user state
- Unsubscribe from the `onAuthStateChanged` listener on provider unmount to prevent memory leaks
- Do NOT implement any signup, login, or logout flows in this feature

## Possible Edge Cases

- Initial page load before auth state resolves (use `isLoading` to avoid flash of wrong UI)
- Multiple rapid auth state changes (e.g. quick sign-out then sign-in) should always settle to the latest state
- Server components cannot use hooks — `useUser` should only be consumed in client components
- The `AuthProvider` must be a client component (`"use client"`) since it uses React context and effects

## Acceptance Criteria

- `useUser` returns `{ user: null, isLoading: false }` when no user is signed in
- `useUser` returns `{ user: <FirebaseUser>, isLoading: false }` when a user is signed in
- `useUser` returns `{ user: null, isLoading: true }` during initial auth resolution
- Calling `useUser` outside of `AuthProvider` throws a descriptive error
- The listener is cleaned up when the provider unmounts
- The root layout wraps children with `AuthProvider`
- No signup/login/logout logic is included

## Open Questions

- Should the dashboard layout show a loading skeleton or redirect while `isLoading` is true? yes
- Should the user object be the raw Firebase `User` or a slimmed-down subset? slimmed down subset. just email, uid, and displayName

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` throws when rendered outside `AuthProvider`
- `useUser` returns loading state initially, then resolves to null when no user is signed in
- `useUser` returns the user object when a user is signed in
- Auth state updates when the listener fires a change
