---
name: lucide-react icon accessibility pattern
description: Icons from lucide-react are never aria-hidden by default — all instances in the diff must be audited for decorative vs. informative use
type: project
---

Every lucide-react icon rendered in this codebase (`CircleCheck`, `CircleX`, `Calendar`, `UserRound`, etc.) needs explicit `aria-hidden="true"` when it is decorative (i.e., meaning is already conveyed by adjacent text). Lucide does not add `aria-hidden` automatically.

**Why:** Screen readers will encounter unlabeled SVG graphics and either announce them with an SVG title string (inconsistent across lucide versions) or as empty unnamed graphics — both degrade the AT experience.

**How to apply:** On every diff, check each lucide icon import and usage:

- If adjacent text conveys the same meaning → `aria-hidden="true"`
- If the icon is the sole label for an interactive element (e.g., icon-only button) → require `aria-label` or visually hidden text on the button instead
