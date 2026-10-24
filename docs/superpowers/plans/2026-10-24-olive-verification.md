# Olive application verification — 24 October 2026

Implemented the approved full Olive editorial portfolio and selected A identity on `feat/olive-editorial` in an isolated worktree. The implementation commit is `a759937`.

## Application checks

- `bun run typecheck`: passed.
- `bun run lint`: passed.
- `bun test tests`: 74 passed, 0 failed; includes the original 39 security contracts.
- `bun run build`: passed using Next.js 16.4.3 / React 19.3.1. All static pages and API routes compiled.
- `bun run test:e2e`: 15 passed, 0 failed against the production server with Chromium. Covers admin authorization/revisions, unsafe login redirects, all published content, complete archive stacks, mobile menu, contact pending/success/failure/retry, video playback/seeking, and no-JavaScript rendering.
- `bun audit`: no vulnerabilities in the application lockfile (425 packages checked).
- `git diff --check`: passed.
- Formatting check: all 20 public application TSX/CSS sources match cached Prettier 3.9.10; no new formatter dependency was added.
- Independent read-only code review: no unresolved findings. The identified archive stack truncation was corrected and covered by the browser suite.

The public content browser test was first run against the previous application and failed on the old hero; it passed after the redesign. Screenshots at 1440, 768, and 390px were inspected. The final visual captures use reduced motion to avoid documenting an intermediate animation frame. Inspection caught Tailwind’s reset removing list markers and default link underlines; both are now explicitly restored within the scoped public styles.

The initial local build was blocked by the sandbox denying Turbopack’s worker port. Its cache was moved aside and the production build rerun outside the sandbox. The clean build exposed two empty selectors introduced by migrating prototype-only motion controls; those were removed before the successful builds. No application workaround or compiler suppression was added.

Email success/failure responses are intercepted in browser tests. These tests do not send a real email or certify provider delivery.

## Hosted preview

- URL: https://dev-daly-4845ma9kn-dalychouikhs-projects.vercel.app
- Deployment: `dpl_ErYHnSf1FBvyho7H1Yc6wGGiF47o`
- Vercel build: READY; frozen Bun install, production build, and deployment completed successfully.
- Homepage: HTTP 200; server HTML contains all seven downstream public sections, twelve project entries, four career entries, and two education entries.
- Canonical metadata uses the configured production origin `https://dev-daly.tn`; sharing metadata includes the new brand image.
- Logo kit: HTTP 200, 393,268 bytes; downloaded SHA-256 matches the committed ZIP.
- Film range request: HTTP 206, 1,024 bytes; downloaded bytes match the original MP4 prefix.
- Film SHA-256: `170f2c50c7bfef20db85197de586756d3df87a2c5d4e35d9befa84eae1030fba`, identical to the supplied Windows file.

The preview retains the project’s existing Vercel authentication protection. Reviewers must sign into an account with access. The production aliases still point to maintenance deployment `dpl_FEXomQBFhsRdso8a6Ps5U1nsfwqE`; the redesign has not been promoted to production.

## Separate motion tooling

Hyperframes and Remotion sources, stills, seek verification, dependency audits, and remaining authoring warnings are recorded under [docs/motion/olive](../../motion/olive/README.md). These packages are excluded from the Next.js build, application lint, and deployment upload. No new MP4 was rendered.
