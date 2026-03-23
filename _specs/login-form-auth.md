# Spec for Login Form Auth

branch: claude/feature/login-form-auth

## Summary

- Wire the existing login form in `app/(public)/login/` to Firebase Authentication
- Authenticate users with email and password on form submission
- Display a success message upon successful login (no redirect for now)
- Handle and display errors for invalid credentials, missing fields, and other auth failures

## Functional Requirements

- Submitting the login form calls Firebase `signInWithEmailAndPassword` with the entered email and password
- While the request is in flight, the submit button is disabled and shows a loading state (e.g. "Logging in...")
- On successful authentication, a success message is displayed to the user (e.g. "Login successful!")
- On failure, a user-friendly error message is displayed based on the Firebase error code (wrong password, user not found, too many requests, etc.)
- The form should not redirect after login — only show the success message
- Email and password fields should be required; the form should not submit if either is empty
- Error messages should clear when the user begins editing the form again

## Possible Edge Cases

- User submits with an email that does not exist in Firebase
- User submits with an incorrect password
- User submits with an empty email or password
- Firebase rate-limiting (too many failed attempts)
- Network failure during authentication
- User rapidly clicks the submit button multiple times

## Acceptance Criteria

- [ ] Login form authenticates against Firebase Auth using email and password
- [ ] Submit button is disabled and shows loading text while authenticating
- [ ] A visible success message appears after successful login
- [ ] User-friendly error messages are shown for invalid credentials, unknown users, and rate limiting
- [ ] Form does not redirect on success
- [ ] Error messages clear when the user modifies form input
- [ ] Multiple rapid submissions are prevented by the loading/disabled state

## Open Questions

- Should the success message auto-dismiss after a timeout, or persist until the user navigates away? it can persist until navigation.
- What exact wording should the success and error messages use? Use "Login success!" for success. For errors, use "Invalid credentials" for all cases except when there's a network failure. For network failure, use "Something went wrong, please try again".

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Successful login displays a success message
- Invalid credentials display an appropriate error message
- Submit button is disabled while the form is submitting
- Error message clears when user edits the email or password field
- Form does not submit when email or password is empty
