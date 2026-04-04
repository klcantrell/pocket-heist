---
name: list semantics for card collections
description: Collections of cards should use ul/li, not div, to preserve item-count and group semantics for screen readers
type: project
---

In this codebase, collections of heist cards should be wrapped in `<ul>` with each card in a `<li>`. Using a plain `<div>` container removes the implicit list announcement (e.g., "list, 5 items") that screen reader users rely on to understand the scope of a collection.

**Why:** The heists page previously used `<ul>`/`<li>` and that was changed to `<div>` when ExpiredHeistCard was introduced — a regression caught in the first a11y review.

**How to apply:** When reviewing any diff that renders a mapped collection of cards, check that the container element is `<ul>` (or `<ol>` if ordered) and each item is `<li>`. `<article>` inside `<li>` is correct and valid.
