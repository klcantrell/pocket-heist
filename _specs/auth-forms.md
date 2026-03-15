# Spec for Auth Forms

branch: claude/feature/auth-forms

## Summary

- Build login and signup forms for the `/login` and `/signup` pages
- Both forms share the same fields: email, password, and a submit button
- Password field includes a visibility toggle icon to show/hide the password
- Form submission logs the entered email and password to the console (no real auth yet)
- Each form links to the other for easy navigation between login and signup

## Functional Requirements

- Email field with appropriate input type and placeholder text
- Password field with a toggle icon (e.g. `Eye` / `EyeOff` from lucide-react) to show or hide the password
- Password visibility defaults to hidden
- Submit button labeled "Log In" on the login page and "Sign Up" on the signup page
- On submit, prevent default form behavior and log `{ email, password }` to the console
- Below each form, include a text link to switch between login and signup (e.g. "Don't have an account? Sign up" / "Already have an account? Log in")
- Both forms should use the existing `.center-content`, `.page-content`, and `.form-title` layout utilities
- Styling should follow existing CSS Modules + Tailwind conventions from the project

## Possible Edge Cases

- Empty field submission — form should use native HTML `required` validation
- Toggling password visibility preserves the current input value
- Very long email or password strings should not break the layout

## Acceptance Criteria

- Visiting `/login` shows a login form with email, password (with visibility toggle), and a "Log In" button
- Visiting `/signup` shows a signup form with the same fields and a "Sign Up" button
- Clicking the password visibility icon toggles between showing and hiding the password text
- Submitting either form logs the email and password to the browser console
- Each page has a link navigating to the other auth page
- Forms use native HTML required validation to prevent empty submissions

## Open Questions

- Should there be any additional fields on the signup form (e.g. confirm password, display name)?
  - No.
- Should there be a "Forgot password?" link on the login form?
  - No.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Login form renders email field, password field, toggle icon, and submit button
- Signup form renders email field, password field, toggle icon, and submit button
- Password visibility toggles when the icon is clicked
- Form submission calls console.log with the entered email and password
- Navigation link to the other auth page is present on each form
