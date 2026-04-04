# Spec for Expired Heist Cards

branch: claude/feature/expired-heist-cards
figma_component: Expired Heist Card

## Summary

- Create an `ExpiredHeistCard` component to visually represent heists that have expired
- Replace the plain text list items in the "All Expired Heists" section of the heists page with styled card components
- The card has a distinct dimmed/glassy appearance to differentiate it from active heist cards

## Functional Requirements

- Display heist title with an error/expired icon (e.g. `CircleX` from lucide-react)
- Show the expiration date with a calendar icon
- Display a "FAILED" status badge in error-red styling
- Show assignee metadata: "To" (in primary purple) and "By" (in secondary pink) usernames with user icons
- The card should be full-width in a single-column list layout (not a grid like active heist cards)
- Integrate into the existing `HeistSection` component's `"list"` variant on `app/(dashboard)/heists/page.tsx`

## Figma Design Reference

- File: https://www.figma.com/design/oCr1E4CF7QPO3QuLo81lDb/Claude-Code-Masterclass?node-id=34-13&m=dev
- Component name: Expired Heist Card
- Key visual constraints:
  - Card: full width, ~86px tall, 10px border radius, 17px padding, semi-transparent dark background `rgba(16, 24, 40, 0.3)` with subtle border `0.833px solid rgba(30, 41, 57, 0.3)`
  - Title row: 16px CircleX icon + heist title (Inter Medium 16px, white) + calendar icon with date + "FAILED" badge on the right
  - "FAILED" badge: error-red text `#FF6467`, very low-opacity red background and border, 12px uppercase text, 4px border radius
  - Metadata row: "To:" label in muted gray `#99A1AF` with username in primary purple `#C27AFF`, "By:" label in muted gray with username in secondary pink `#FB64B6`
  - New theme token needed: error red `#FF6467` (with corresponding low-opacity fill and border variants)

## Possible Edge Cases

- Heist with no assignee ("To" field) — show fallback text like "Unassigned"
- Heist with no creator ("By" field) — show fallback text like "Unknown"
- Very long heist titles — truncate with ellipsis to keep single-row layout
- Missing expiration date — hide the date section gracefully

## Acceptance Criteria

- Expired heists on the heists page render as styled cards matching the Figma design
- The "FAILED" badge is visible with correct error-red color treatment
- Assignee and creator metadata display correctly with appropriate color coding
- Card has the dimmed/glassy appearance distinct from active heist cards
- Component is responsive and handles missing data gracefully
- Error red color token is added to the project theme in globals.css

## Open Questions

- Should the expired heist card be clickable/link to a heist detail page? yes.
- Are there other expired statuses besides "FAILED" (e.g. "CANCELLED", "TIMED OUT")? no.
- Should there be a limit on how many expired heists are shown before requiring pagination or "show more"? not right now.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders heist title, date, and "FAILED" badge
- Displays assignee ("To") and creator ("By") with correct text
- Handles missing assignee gracefully (shows fallback)
- Handles missing creator gracefully (shows fallback)
- Truncates long titles with ellipsis
