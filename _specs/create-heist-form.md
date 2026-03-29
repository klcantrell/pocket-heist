# Spec for Create Heist Form

branch: claude/feature/create-heist-form

## Summary

- Build the "Create a New Heist" form in `app/(dashboard)/heists/create/page.tsx`
- Form fields are derived from the `CreateHeistInput` interface (title, description, assignedTo)
- On submit, create a new document in the Firestore `heists` collection and redirect to `/heists`
- Fetch users from the Firestore `users` collection so the creator can assign the heist to another user by codename

## Functional Requirements

- Display a form with the following user-editable fields:
  - **Title** — text input (required)
  - **Description** — textarea (required)
  - **Assign To** — dropdown/select populated from the `users` collection, displaying each user's codename and storing both `assignedTo` (uid) and `assignedToCodename`
- The following fields are set programmatically (not shown in the form):
  - `createdBy` — current authenticated user's uid
  - `createdByCodename` — current authenticated user's codename
  - `deadline` — automatically set to 48 hours from creation time
  - `finalStatus` — always `null` on creation
  - `createdAt` — Firestore `serverTimestamp()`
- On successful submission:
  - Create a new document in the `heists` collection using `CreateHeistInput`
  - Redirect the user to `/heists`
- Show a loading/disabled state on the submit button while the document is being created
- Display an inline error message if the Firestore write fails

## Possible Edge Cases

- The `users` collection is empty or fails to load — show a message or disable the assign dropdown
- The current user is not yet loaded — disable the form until auth state is resolved
- Network error during Firestore write — display an error and allow retry
- User submits while a previous submission is still in flight — prevent duplicate submissions

## Acceptance Criteria

- [ ] Form renders with title, description, and assign-to fields
- [ ] Assign-to dropdown is populated from the `users` collection (codename displayed, uid stored)
- [ ] Submitting the form creates a correctly shaped `CreateHeistInput` document in Firestore
- [ ] `createdAt` uses `serverTimestamp()` and `deadline` is set to 48 hours from now
- [ ] User is redirected to `/heists` after successful creation
- [ ] Submit button shows a loading state and prevents duplicate submissions
- [ ] An error message is displayed if the write fails

## Open Questions

- Does a `users` collection and associated Firestore types already exist, or do they need to be created as part of this feature? They already exist, see @types/firestore/user.ts and @types/firestore/index.ts.
- Should the current user be excluded from the assign-to dropdown (i.e., can you assign a heist to yourself)? Yes, exclude the current user.
- Is there any max length or validation beyond "required" for title and description? No specific validation beyond required.
- What should we do if the `users` collection is empty? Show a message instead of the form.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Form renders all expected fields (title, description, assign-to dropdown)
- Submit button is disabled while loading
- Successful submission calls Firestore addDoc with the correct shape and redirects
- Failed submission displays an error message
- Assign-to dropdown shows user codenames fetched from the users collection
