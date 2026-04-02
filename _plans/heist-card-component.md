# Implementation Plan: Heist Card Component

## Context

The /heists page currently renders heists as plain text `<li>` items. This plan creates a styled HeistCard component (matching the Figma design) and displays active/assigned heists in a 3-column grid with skeleton loading states. Expired heists remain in the existing list format.

**Branch:** `claude/feature/heist-card-component`
**Spec:** `_specs/heist-card-component.md`

## Files to Create

### 1. `components/HeistCard/HeistCard.tsx`

- Presentational component accepting `heist: Heist` prop
- Layout: `<article>` with column flex, matching Figma specs
- **Title row:** `<Link>` to `/heists/${heist.id}`, white, 16px
- **Deadline row:** `Clock` icon (16px) + formatted deadline. Show "Overdue" text in primary color when `deadline < now && finalStatus === null`
- **To row:** `UserRound` icon (12px) + "To" label (body color) + `assignedToCodename` (primary purple)
- **By row:** `UserRound` icon (12px) + "By" label (body color) + `createdByCodename` (secondary pink)
- **Date row:** `Calendar` icon (12px) + formatted `createdAt`
- Helper: `isOverdue(heist)` — `deadline < new Date() && finalStatus === null`
- Fallback "Unknown" for missing codenames

### 2. `components/HeistCard/HeistCardSkeleton.tsx`

- Matches HeistCard dimensions using same `.card` CSS class
- Uses `Skeleton` primitive from `@/components/Skeleton` for line placeholders
- 4 skeleton lines of varying widths mimicking title, deadline, to/by, date rows

### 3. `components/HeistCard/HeistCard.module.css`

- `@reference "../../app/globals.css"` at top
- `.card` — flex col, rounded-[10px], p-[21px], gap-3, bg-lighter + border: 0.83px solid #1E2939
- `.title` — text-base text-heading font-normal (link with no underline, hover underline)
- `.row` — flex items-center gap-2
- `.label` — text-sm text-body
- `.primaryValue` — text-sm text-primary
- `.secondaryValue` — text-sm text-secondary
- `.overdue` — text-primary font-medium
- `.icon` — text-body shrink-0

### 4. `components/HeistCard/index.ts`

- Barrel exports: `HeistCard`, `HeistCardSkeleton`

## Files to Modify

### 5. `app/(dashboard)/heists/page.tsx`

- Add `variant: "card" | "list"` to the sections config
- Active and assigned sections → `variant: "card"`, expired → `variant: "list"`
- When `variant === "card"`:
  - Loading: render 3 `HeistCardSkeleton` in grid
  - Loaded: render `HeistCard` components in grid
- When `variant === "list"`: keep existing `<li>` rendering

### 6. `app/(dashboard)/heists/page.module.css`

- Add `.grid` class: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3`

## Files to Create (Tests)

### 7. `tests/components/HeistCard.test.tsx`

- Mock `next/link` as `<a>` tag
- Test fixture with known heist data
- Tests:
  - Renders title as a link with correct href
  - Renders assignedToCodename and createdByCodename
  - Shows overdue indicator when deadline is past + finalStatus null
  - No overdue indicator when finalStatus is set
  - HeistCardSkeleton renders without errors

## Reusable Existing Code

- `Skeleton` component from `@/components/Skeleton` — reuse for skeleton lines
- Theme tokens from `globals.css` — `--color-primary`, `--color-secondary`, `--color-lighter`, `--color-body`
- `Heist` type from `@/types/firestore`
- `lucide-react` icons: `Clock`, `UserRound`, `Calendar`

## Verification

1. `npx vitest run tests/components/HeistCard.test.tsx` — all tests pass
2. `npm run lint` — no lint errors
3. `npm run build` — builds successfully
4. Visual check: `npm run dev` → navigate to /heists, verify cards render in grid with correct styling
