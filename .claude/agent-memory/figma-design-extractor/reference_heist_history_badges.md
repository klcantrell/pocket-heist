---
name: Heist History Badge States (Success / Failed)
description: Figma design tokens for the SUCCESS and FAILED status badges in HeistHistory cards (node 14:251 / 14:327 / 34:13, file oCr1E4CF7QPO3QuLo81lDb)
type: reference
---

Figma nodes examined:

- 14:251 — HeistCard SUCCESS state (Heist History section)
- 14:327 — HeistCard FAILED state (Heist History section)
- 34:13 — ExpiredHeistCard (FAILED badge, slightly lower opacity card shell)

## SUCCESS badge (node 14:270)

- Background: rgba(5, 223, 114, 0.05) → `rgba(var(--color-success), 0.05)` — no token, raw alpha
- Border: 0.833px solid rgba(5, 223, 114, 0.2)
- Text color: #05df72 → `--color-success`
- Text: "SUCCESS", uppercase, Inter Regular 12px, line-height 16px, letter-spacing 0.6px
- Padding-left: 8px
- Border-radius: 4px
- Badge dimensions: ~78px × 21.66px

## FAILED badge (node 14:347 / 14:462)

- Background: rgba(255, 100, 103, 0.05) → `rgba(var(--color-error), 0.05)` — no token, raw alpha
- Border: 0.833px solid rgba(255, 100, 103, 0.2)
- Text color: #ff6467 → `--color-error`
- Text: "FAILED", uppercase, Inter Regular 12px, line-height 16px, letter-spacing 0.6px
- Padding-left: 8px
- Border-radius: 4px
- Badge dimensions: ~62px × 21.66px (narrower because "FAILED" is shorter than "SUCCESS")

## Card shell differences between states

- SUCCESS card: bg rgba(16,24,40,0.5), border rgba(30,41,57,0.5) — standard opacity
- FAILED card: bg rgba(16,24,40,0.3), border rgba(30,41,57,0.3) — slightly more transparent/faded

## Icon differences

- SUCCESS icon (title row): checkmark-circle style (two vectors, path + circle) — lucide CircleCheck
- FAILED icon (title row): X-circle style (three vectors) — lucide CircleX

## Existing theme tokens that apply

- `--color-success` (#05df72) — badge text and border/bg alpha base
- `--color-error` (#ff6467) — badge text and border/bg alpha base
- `--color-body` (#99a1af) — date label text
- `--color-primary` (#c27aff) — "To:" username
- `--color-secondary` (#fb64b6) — "By:" username
- `--color-lighter` (#101828) — card background base
