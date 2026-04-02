# Spec for Heist Card Component

branch: claude/feature/heist-card-component
figma_component: HeistCard

## Summary

- Create a HeistCard component that displays heist details (title, assigned to, created by, deadline) in a styled card
- Create a HeistCardSkeleton component for loading states
- Update the /heists page to show HeistCard components in a 3-column grid for active and assigned sections only (not expired)
- Heist titles should link to the detail page (`/heists/:id`) but no content changes to the detail page

## Functional Requirements

- HeistCard accepts a `Heist` object and renders:
  - Title as a link to `/heists/${heist.id}`
  - Deadline displayed with a clock icon
  - "To" row showing `assignedToCodename` with a person icon, value in primary purple
  - "By" row showing `createdByCodename` with a person icon, value in secondary pink
  - Overdue indicator when `deadline < now` and `finalStatus === null`, shown in primary purple
- HeistCardSkeleton renders a placeholder card matching the HeistCard dimensions with animated pulse styling
- The /heists page displays active and assigned heists using HeistCard in a responsive 3-column grid
- The /heists page continues to show expired heists in the existing list format (no cards)
- While loading, the grid shows HeistCardSkeleton placeholders (3 per section — one row's worth)
- When a card section has no heists (after loading), display the section's empty message (e.g. "No active heists right now." or "You haven't been assigned any heists yet.")

## Figma Design Reference

- File: https://www.figma.com/design/oCr1E4CF7QPO3QuLo81lDb/Claude-Code-Masterclass?node-id=54-60
- Component name: HeistCard
- Key visual constraints:
  - Card: ~378px wide, column flex layout, 12px gap, 21px padding, 10px border-radius, thin border (~0.83px)
  - Background: #101828, border: #1E2939
  - Title: Inter Regular 16px, white
  - Metadata labels: Inter Regular 14px, #99A1AF (muted gray)
  - "To" value: #C27AFF (primary purple)
  - "By" value: #FB64B6 (secondary pink)
  - Overdue status: #C27AFF (primary purple)
  - Icons: Clock (~16px) for deadline, UserRound (~12px) for To/By rows, Calendar (~12px) for date — all from lucide-react

## Possible Edge Cases

- Heist has no assignedToCodename or createdByCodename (show fallback like "Unknown")
- Deadline is in the past but finalStatus is set (not overdue — heist is complete)
- Very long heist titles may need truncation or wrapping
- Sections with zero heists should still show the existing empty message, not an empty grid
- Loading state should display skeleton cards in the same grid layout

## Acceptance Criteria

- HeistCard renders all heist fields with correct icons and color coding
- HeistCard title links navigate to `/heists/:id`
- HeistCardSkeleton matches card dimensions and shows animated loading state
- Active and assigned sections display cards in a 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Expired section remains unchanged (list format, no cards)
- Overdue indicator appears only when deadline has passed and finalStatus is null
- Loading state shows 3 skeleton cards (one row) in the grid layout
- Empty state shows the section's empty message text when no heists exist after loading
- Cards follow the Figma design reference for colors, spacing, and typography

## Open Questions

- Should the grid collapse to fewer columns on smaller screens (e.g. 1 column on mobile, 2 on tablet)? Yes.
- Should there be a max number of skeleton cards shown while loading? Show 1 row's worth.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- HeistCard renders heist title, codenames, and deadline correctly
- HeistCard title links to the correct detail page URL
- HeistCard shows overdue indicator when deadline is past and finalStatus is null
- HeistCard does not show overdue indicator when finalStatus is set
- HeistCardSkeleton renders without errors
- Heists page renders HeistCard components for active and assigned sections
