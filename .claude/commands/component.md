---
description: Create a UI component using TDD (test-driven development)
allowed-tools: Read, Write, Edit, Glob, Bash (npm test:*), Bash (npx vitest:*)
argument-hint: "[Brief component description]"
---

## User Input

The user has provided information about the component to make: **$ARGUMENTS**

## Do This First:

From the component information above, determine a PascalCase component name (e.g., "a card showing user stats" → `UserStatsCard`).

### Step 1. Create Component (stub, do implementation after tests)

- 'components/ [ComponentName]/[ComponentName].tsx'
- 'components/[ComponentName]/[ComponentName].module.css'
- 'components/[ComponentName]/index.ts' → "export { default } from './[ComponentName]'"

Conventions: no semicolons, CSS Modules, theme colors from globals. css when needed.


### Step 2. Write Tests First

Create `tests/components/[ComponentName].test.tsx` with 2-3 simple tests:
- Test that the component renders
- Test key elements are present (roles, text)

Pattern:
```tsx
import { render, screen } from "@testing-library/react" import { describe, it, expect } from "vitest" import ComponentName from "@/components/ComponentName"

describe("ComponentName", () => {
    it ("renders successfully", () => {
        render (<ComponentName />)

        // assertions
    })
})
```


### Step 3. Run Tests (expect failure)

```bash
npm test tests/components/[ComponentName].test.tsx
```

### Step 4. Implement component

Revisit the component created in step 1 and implement it fully now.


### Step 5. Run Tests (expect pass)
```bash
npm test tests/components/[ComponentName].test.tsx
```

Iterate on component development until all tests pass.

### Step 5. Add to Preview Page
Update `app/(public)/preview/page.tsx` with a labeled section showing the component.

## Rules
- Keep tests minimal
- Only proceed when current step passes