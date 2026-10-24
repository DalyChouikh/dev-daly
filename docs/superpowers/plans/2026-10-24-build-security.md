# Portfolio build and security maintenance

**Goal:** Fix deployment of commit `2a58548`, update vulnerable dependencies, and close confirmed admin authorization gaps.

**Architecture:** Keep JSON content and the existing GitHub publishing flow. Bundle the current three font families with `next/font/local`. Share signed, expiring session validation between the Next.js proxy and every privileged route; validate section data with the same Zod schemas used during rendering.

**Stack:** Next.js App Router, React, TypeScript, Bun, Zod.

## Evidence before changes

- Pulled `main` to `2a585484fb1b49b59890f5f60d4fbc2bda6b0185`; that commit only adds TapNShow to `data/projects.json`.
- Retrieved actual build logs with `vercel inspect https://vercel.com/dalychouikhs-projects/dev-daly/C2CdZL8kVmhkDZd5fn7hjYeFPmdK --logs`.
- Vercel failed processing JetBrains Mono: `next/font/google queries have exactly one entry`, followed by unresolved `@vercel/turbopack-next/internal/font/google/font` imports. This matches https://github.com/vercel/next.js/issues/99114 and the upstream fix https://github.com/vercel/next.js/pull/100158.
- The unchanged commit builds locally with network access. This confirms the submitted JSON is buildable; it does not disprove the intermittent upstream font failure.
- Initial `bun audit`: 61 advisories (5 critical, 33 high, 22 moderate, 1 low). Advisory ranges do not establish that every issue is exploitable in this application.
- `middleware.ts` protects only `/admin/:path*`. Save, resume upload, data, GitHub draft and paid AI routes lack independent authorization. Save also accepts arbitrary sections and unvalidated content.
- Session cookies contain the base64-encoded admin password and a timestamp that the server does not check.
- Initial `bun run lint` passed.

## Execution checklist

- [x] Add route regression tests that call handlers directly without a cookie and expect `401`, with no external writes or paid calls.
- [x] Add login/session regression tests for password secrecy, signatures, expiration, password rotation and production cookie flags.
- [x] Add save tests for section allowlisting and rejection of content that fails the rendering schemas, before committing.
- [x] Implement a shared `lib/auth.ts`; use HMAC-SHA256 signatures, random nonces, server-enforced 24-hour expiry and timing-safe comparisons. Preserve `ADMIN_PASSWORD` configuration and invalidate legacy cookies.
- [x] Rename `middleware.ts` to `proxy.ts`; keep login accessible and use shared validation. Check every privileged handler before parsing or side effects.
- [x] Add a discriminated section/data schema to `lib/types.ts`; return validation failures as `400`, and commit only parsed data. Cover every current data file in tests.
- [x] Bundle Hanken Grotesk, Inter and JetBrains Mono variable fonts with their OFL licenses in `app/fonts/`; preserve CSS variables and weight ranges. Verify the production build and local font requests in Chromium.
- [x] Update runtime packages to registry stable versions and refresh the Bun lockfile. Update ESLint and Tailwind; keep TypeScript within typescript-eslint's declared `<6.1.0` support range and Node types aligned with Node 24.
- [x] Validate draft/AI requests and generated AI output before use; check upload PDF contents as well as filename.
- [x] Run Bun tests, lint, TypeScript, frozen install, dependency audit and a production build. Exercise the homepage and authenticated editor in a real browser without publishing changes to GitHub.
- [x] Document final versions, results, residual issues and deployment instructions in README. Leave changes local for review.

## Additional confirmed findings and fixes

- Production data reads previously used the deployed filesystem while writes targeted current GitHub main. A regression test supplied newer GitHub content and reproduced the stale read. Reads now fetch main without caching; saves include the file SHA, reject missing production revisions, and report conflicts as HTTP 409.
- The generic editor loaded data inside a `useState` initializer. Loading now runs in an effect keyed to the section, with cancellation. A browser test navigates from projects to skills and verifies the corresponding data.
- Login used an untrusted `from` parameter as a navigation destination. The browser test reproduced an external redirect. The fix permits only admin paths; external, protocol-relative and `javascript:` destinations are tested.
- Fields remained editable while a save was pending, then the response cleared the unsaved flag. A delayed-save browser test reproduced that state. A disabled fieldset now prevents overlapping edits until the request completes.
- An independent review caught Node/Bun request-body differences during implementation. Cookie parsing uses only URL and headers so it cannot transfer the POST body. The actual Node production server is covered by authenticated POST validation tests.
- Client-only login navigation reused redirects prefetched before authentication. Request traces confirmed the session cookie was present while cached login redirects were reused. Login/logout use full navigation to a validated same-origin URL, clearing the client cache.

## Final versions

| Dependency | Before | After |
| --- | --- | --- |
| Next.js / eslint-config-next | 16.2.7 | 16.4.3 |
| React / React DOM | 19.2.4 | 19.3.1 |
| Framer Motion | 12.40.0 | 14.6.0 |
| Lucide React | 1.17.0 | 1.61.0 |
| Nodemailer | 8.0.10 | 10.2.1 |
| OpenAI SDK | 6.41.0 | 7.43.0 |
| Resend | 6.12.4 | 6.34.1 |
| Zod | 4.4.3 | 4.6.7 |
| Tailwind CSS / PostCSS plugin | 4.3.0 | 4.3.3 |
| ESLint | 9.39.4 | 10.13.0 |
| TypeScript | 5.9.3 | 6.0.3 |

`date-fns` was already current at 4.4.0. All direct runtime dependencies match registry stable versions at verification time. `bun outdated` lists only intentional development-tool exceptions: Node types stay on 24.19.2 for Node 24, and TypeScript stays on 6.0.3 because the installed typescript-eslint parser declares support below 6.1.0. Bun 1.4.4 was already installed and was used for verification, as requested. The older Bun compatibility check was set aside at the user's direction.

## Verification results

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | Pass; no lockfile changes |
| `bun run build` | Pass; Next.js 16.4.3 production build and static generation |
| `bun run typecheck` | Pass |
| `bun run lint` | Pass; no warnings |
| `bun run test` | 39 passed, 0 failed |
| `bun run test:e2e` | 6 passed against the actual Node production server |
| `bun audit` | No known vulnerabilities across 428 packages; initially 61 advisories |
| `git diff --check` | Pass |

Browser checks cover TapNShow rendering, all three font requests served locally, animations reaching full opacity, desktop/mobile layout with no horizontal overflow, login/logout, route authorization, authenticated request-body parsing, repeated save revisions, section navigation, disabled fields during saves, and unsafe return destinations. Chromium used the locally available executable via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. The source repository has no format script, so whitespace checking and ESLint were used without introducing a repository-wide reformat.

The initial sandbox build failed to download Google Fonts; the unchanged original commit succeeded outside the sandbox. Updated Turbopack builds were verified outside the sandbox after a sandbox worker stalled. These environment failures were kept separate from the actual Vercel font-parser error.

## Deployment and practical limits

Changes were prepared on `maintenance/build-security-2026-10-24`, based on the pulled main commit `2a58548`. After reviewing the findings, the user authorized pushing and deploying the changes. Production deployments use the repository's main branch and Vercel Git integration. Existing session cookies are intentionally rejected after deployment; the configured admin password remains valid.

The suite uses fake publishing credentials and mocks successful writes at the external boundary. No live GitHub content changes, contact emails, or paid AI calls were made. Production credentials and third-party service delivery were not verified through real sends. A clean dependency audit describes known registry advisories at verification time; it is not a penetration test or evidence that previous deployments were never exploited.

The added TapNShow content is valid against the rendering schema. Its README-derived second bullet contains literal Markdown and is truncated by the existing draft generator; it was preserved as supplied and is unrelated to the deployment failure.

Primary references: [matching Next.js font issue](https://github.com/vercel/next.js/issues/99114), [upstream font parsing fix](https://github.com/vercel/next.js/pull/100158), [October 14 security update](https://nextjs.org/blog/nextjs-security-update-october-14-2026), and [Vercel package-manager documentation](https://vercel.com/docs/package-managers).
