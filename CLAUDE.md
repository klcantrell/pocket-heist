# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Heist is a Next.js 16 starter project ("Tiny missions. Big office mischief.") built with React 19, TypeScript, and Tailwind CSS 4.

## Commands

- `npm run dev` — Start development server at http://localhost:3000
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, v9+)
- `npm test` — Run Vitest in watch mode
- `npx vitest run` — Run tests once (CI-style)
- `npx vitest run tests/components/Navbar.test.tsx` — Run a single test file

## Architecture

**Next.js App Router with route groups:**
- `app/(public)/` — Unauthenticated pages (home, login, signup, preview)
- `app/(dashboard)/` — Authenticated pages (heists list, create, details). Dashboard layout includes the Navbar.

**Component conventions:**
- Components live in `components/<Name>/` with barrel exports via `index.ts`
- Styling uses CSS Modules (`*.module.css`) alongside Tailwind utilities
- Icons from `lucide-react`

**Styling:**
- Tailwind CSS 4 via `@tailwindcss/postcss`
- Custom theme defined in `app/globals.css` (primary purple `#C27AFF`, secondary pink `#FB64B6`, dark backgrounds, Inter font)
- Shared layout utilities: `.page-content` (max-width container), `.center-content` (centered viewport), `.form-title`

**Testing:**
- Vitest with jsdom environment and global APIs enabled
- React Testing Library for component tests
- Tests live in `tests/` mirroring the source structure
- Setup file: `vitest.setup.ts` (imports `@testing-library/jest-dom/vitest`)

**Path alias:** `@/*` maps to the project root (e.g., `@/components/Navbar`).

## Additional Coding Preferences
- Do NOT use semicolons for JavaScript or TypeScript code.
- Do NOT apply tailwind classes directly in component templates unless essential or just 1 at most. If an element needs more than a single tailwind class, combine them into a custom class using the '@apply' directive.
- Use minimal project dependencies where possible.
- Use the 'git switch -c' command to switch to new branches, not 'git checkout.
