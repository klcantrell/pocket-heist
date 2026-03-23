# Spec for Navbar Logout Button

branch: claude/feature/navbar-logout-button
figma_component: LogoutButton

## Summary

- Add a logout button to the Navbar component that signs the user out of Firebase Auth
- The button should only be visible when the user is authenticated
- No redirect behavior after logout for now

## Functional Requirements

- The Navbar displays a "Logout" button when the user is logged in
- Clicking the button calls Firebase Auth sign-out
- The button is hidden when no user is authenticated
- After sign-out the auth context updates to reflect the logged-out state

## Figma Design Reference

- File: https://www.figma.com/design/oCr1E4CF7QPO3QuLo81lDb/Claude-Code-Masterclass?node-id=57-18&m=dev
- Component name: LogoutButton
- Key visual constraints:
  - Outlined button with a 1px solid white border and 10px border radius
  - Transparent background (inherits dark navbar surface)
  - White "Logout" label, Inter font, 16px regular weight, centered
  - Approximate button size 127 x 38 px
  - Negative letter-spacing (-0.3px) on the label

## Possible Edge Cases

- User's session expires or is revoked server-side while the app is open
- Sign-out network request fails (e.g. offline)
- Rapid double-click on the logout button triggers multiple sign-out calls

## Acceptance Criteria

- Logout button appears in the Navbar only when the user is authenticated
- Logout button is not visible on public/unauthenticated pages
- Clicking the button successfully signs the user out via Firebase Auth
- The auth context reflects the signed-out state after logout
- Button styling matches the Figma design reference

## Open Questions

- Should the button show a loading or disabled state while sign-out is in progress? yes.
- Should there be error feedback if sign-out fails? yes.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Button renders when a user is authenticated
- Button does not render when no user is authenticated
- Clicking the button calls the Firebase sign-out function
