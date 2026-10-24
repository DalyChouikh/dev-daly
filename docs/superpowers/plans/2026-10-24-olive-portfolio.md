# Olive portfolio implementation plan

> **For agentic workers:** Use the approved design and execute the independent asset/motion tasks in parallel, then verify the application integration. Steps use checkboxes for tracking.

**Goal:** Turn the approved Olive page and logo A into a maintainable, accessible portfolio with the existing secure publishing flow.

**Architecture:** Server-composed public sections receive validated JSON data. Small client components own mobile navigation, contact submission, and motion; the admin/API foundation stays intact. Public tokens and logo/media assets have one authoritative source.

**Tech Stack:** Next.js 16.4.3, React 19.3.1, Bun 1.4.4, TypeScript, Zod, native CSS/WAAPI, Playwright; isolated Hyperframes/Remotion motion studies.

## Task 1 — Isolate and preserve the approved work

- [x] Commit the known discovery/specification/content changes, then create ignored `.worktrees/olive-editorial` on `feat/olive-editorial`.
- [x] Install from the Bun lockfile and verify the existing 39 security tests before application edits.

## Task 2 — Final logo assets (independent)

- [x] Produce `public/brand/daly-wordmark.svg`, `daly-symbol.svg`, black/reversed/olive assets, a small-size source, raster exports, and `daly-logo-kit.zip` from selected A's path geometry.
- [x] Add static `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`; replace `app/icon.tsx` so there are no conflicting icon routes.
- [x] Create `components/brand/BrandLogo.tsx` with `variant?: "wordmark" | "symbol"`, `className?: string`, `label?: string`; no client directive, text-font dependency, unsafe HTML, or extra dependencies.
- [x] Render/inspect SVGs at 16/32/64px and reversed; verify ICO frame sizes and PNG dimensions. Record usage guidance with exact web colors and clear space.

## Task 3 — Content contracts and behavior tests

- [x] Add failing tests for newest-first career sorting, stable undated entries, future/current role handling, configured featured selection, preserving archive entries, and safe optional project media.
- [x] Extend `ProjectSchema` with optional `displayTitle`, `featured`, and a discriminated image/video media object; local asset URLs must be rooted public paths without traversal, protocol-relative URLs, or script schemes. Optional fields preserve draft/save compatibility.
- [x] Implement `lib/portfolio.ts` helpers and update `data/site.json` to the approved order and supported navigation. Add project presentation data to the existing selected entries; do not fork the project source into constants.
- [x] Run `bun test tests` and confirm old security contracts plus the new presentation behavior pass.

## Task 4 — Server sections and public styling

- [x] Convert the existing `components/sections/` public components to typed server-prop composition; add focused SelectedWork/About components where necessary.
- [x] Make `app/page.tsx` read all data once and use configured section order. Pass navigation data from the server into `components/layout/Navbar.tsx` and a small `MobileNav.tsx`.
- [x] Add scoped `app/portfolio.css` from the approved Olive geometry and shared tokens. Preserve the admin theme. Add `ExternalLink`, section-heading/list helpers only where they remove repeated behavior.
- [x] Reuse the selected logo component, real screenshots, original film, native disclosure details, and local font. Update metadata origin/theme/brand image consistently.

## Task 5 — Interactive islands and motion studies

- [x] Extract `ContactForm.tsx`: browser-native constraints, typed API result validation, prevent duplicate submits, report success/errors accessibly, preserve failed inputs, use the existing `/api/contact` service.
- [x] Add `PortfolioMotion.tsx` with a once-only observer and bounded native animations; default content remains visible, reduced motion cancels/skips travel, cleanup disconnects observers/cancels animations.
- [ ] Build isolated, seekable Hyperframes and Remotion studies using logo A, the approved hero, and actual project media. Keep tooling/dependencies outside the main application bundle and report actual CLI validation outcomes.

## Task 6 — Verification and preview

- [x] Add public Playwright coverage for required sections, all content counts, responsive menu, disclosure interactions, contact pending/success/failure via intercepted API responses, video no-autoplay/play/seek, and reduced-motion/no-JS readability. Keep existing admin tests.
- [x] Run `bun run typecheck`, `bun run lint`, `bun test tests`, `bun run build`, and `bun run test:e2e` with the installed Chromium.
- [x] Inspect desktop/tablet/phone screenshots and fix actual visual/accessibility defects. Review security boundaries and the final diff independently.
- [ ] Commit the reviewed implementation and publish an application preview. Report the working URL, logo kit, verification results, and any actual limitations. Preserve production until the next integration step.
