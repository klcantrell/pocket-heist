# Spec for useHeists Hook

branch: claude/feature/use-heists-hook

## Summary

- Create a `useHeists` custom React hook that subscribes to real-time Firestore data from the `heists` collection
- The hook accepts a filter argument (`'active'`, `'assigned'`, or `'expired'`) and returns an array of `Heist` objects matching the criteria
- Integrate the hook into the heists dashboard page to display heist titles under three sections: active, assigned, and expired

## Functional Requirements

- The hook is named `useHeists` and accepts a single argument of type `'active' | 'assigned' | 'expired'`
- The hook returns an array of `Heist` objects (using the existing type from `types/firestore/heist.ts`)
- The hook subscribes to real-time updates using Firestore's `onSnapshot` listener and cleans up on unmount
- Filter behavior based on the argument:
  - `'active'`: Heists where `assignedTo` equals the current user's UID AND `deadline` is in the future
  - `'assigned'`: Heists where `createdBy` equals the current user's UID AND `deadline` is in the future
  - `'expired'`: Heists where `deadline` is in the past AND `finalStatus` is not null (regardless of user)
- The current user's UID should come from the existing Firebase auth setup (`auth.currentUser`)
- The hook should use the existing `heistConverter` for proper type-safe deserialization
- The hook should use the existing `COLLECTIONS.HEISTS` constant for the collection path
- On the heists dashboard page (`app/(dashboard)/heists/page.tsx`), call the hook three times (once per filter) and render only the `title` of each heist under the corresponding section heading

## Possible Edge Cases

- User is not authenticated when the hook is called (no `auth.currentUser`)
- The heists collection is empty or no documents match the filter
- Deadline comparison should use the current time at the moment of query, and real-time updates should reflect changes as they happen
- A heist's deadline passes while the user is on the page (it may shift from active/assigned to expired on the next snapshot)
- The `'expired'` filter requires `finalStatus` to be non-null, so heists past deadline but without a final status should not appear

## Acceptance Criteria

- Calling `useHeists('active')` returns only heists assigned to the current user with a future deadline
- Calling `useHeists('assigned')` returns only heists created by the current user with a future deadline
- Calling `useHeists('expired')` returns only heists with a past deadline and a non-null `finalStatus`
- All three hook instances subscribe to real-time updates and reflect changes without page refresh
- The heists page renders heist titles under each of the three section headings
- The hook cleans up its Firestore listener when the component unmounts or when inputs change
- The hook uses the existing `heistConverter`, `COLLECTIONS` constant, and `Heist` type

## Open Questions

- Should the hook expose loading and error states in addition to the heist array? yes
- Should expired heists be sorted in any particular order (e.g., most recently expired first)? most recent first, please.
- For active/assigned filters, should the deadline comparison happen server-side via Firestore query operators or client-side after fetching? client-side after fetching

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The heists page renders three section headings (active, assigned, expired)
- Each section displays heist titles returned by the hook
- Empty state: sections render without errors when no heists match
- The hook is called with the correct filter argument for each section
