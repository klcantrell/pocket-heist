# Plan: Expired Heist Cards

## Context

The "All Expired Heists" section on the heists page currently renders plain text list items showing only the heist title. This spec replaces them with styled `ExpiredHeistCard` components matching the Figma design — a dimmed/glassy card with title, deadline, "FAILED" badge, and assignee metadata.

## Step 1: Extract shared `formatDate` utility

- **Create** `lib/format.ts` with the `formatDate` function (currently duplicated in HeistCard)
- **Modify** `components/HeistCard/HeistCard.tsx` — remove local `formatDate`, import from `@/lib/format`

## Step 2: Create `ExpiredHeistCard` component

- **Create** `components/ExpiredHeistCard/ExpiredHeistCard.tsx`
  - Props: `{ heist: Heist }`
  - Row 1: `CircleX` icon + title (as `Link` to `/heists/{id}`) + `Calendar` icon + formatted deadline + "FAILED" badge
  - Row 2: `UserRound` icon + "To:" label + assignee codename (purple) | `UserRound` icon + "By:" label + creator codename (pink)
  - Fallbacks: "Unassigned" / "Unknown" for missing codenames
  - Title truncation via CSS `truncate` + `flex: 1; min-width: 0`
- **Create** `components/ExpiredHeistCard/ExpiredHeistCard.module.css`
  - Dimmed card: `background: rgba(16, 24, 40, 0.3)`, `border: 0.833px solid rgba(30, 41, 57, 0.3)`, `rounded-[10px]`, `17px` padding
  - Badge: error-red text `#FF6467`, low-opacity red bg/border, 12px uppercase, 4px radius
  - Reuse existing theme tokens: `--color-error`, `--color-primary`, `--color-secondary`, `--color-body`
- **Create** `components/ExpiredHeistCard/index.ts` — barrel export

## Step 3: Integrate into heists page

- **Modify** `app/(dashboard)/heists/page.tsx` — import `ExpiredHeistCard`, replace `<ul>/<li>` in list variant with `<div>` containing `<ExpiredHeistCard>` components
- **Modify** `app/(dashboard)/heists/page.module.css` — remove unused `.listItem` class

## Step 4: Tests

- **Create** `tests/components/ExpiredHeistCard.test.tsx` — following existing HeistCard test patterns:
  - Renders title as link with correct href
  - Renders "FAILED" badge
  - Displays assignee and creator codenames
  - Shows "Unassigned" when assignedToCodename is empty
  - Shows "Unknown" when createdByCodename is empty
  - Renders formatted deadline date
- **Create** `tests/lib/format.test.ts` — basic `formatDate` tests

## Step 5: Verify

- Run `npx vitest run` — all existing + new tests pass
- Run `npm run lint` — no lint errors
- Run `npm run build` — builds successfully

## Key files

- `components/HeistCard/HeistCard.tsx` — extract `formatDate`, pattern reference
- `app/(dashboard)/heists/page.tsx` — integrate ExpiredHeistCard
- `app/globals.css` — theme tokens (no changes needed, `--color-error` already exists)
- `tests/components/HeistCard.test.tsx` — test pattern reference
