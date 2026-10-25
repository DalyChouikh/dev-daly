# Olive admin and email implementation plan

> **For agentic workers:** Execute the independent email and editor tasks in parallel with the shell, then review and verify the integrated result. Steps use checkboxes for tracking.

**Goal:** Apply the approved Olive identity to all administration screens and received contact notifications, while preserving secure publishing and provider delivery.

**Architecture:** Scoped admin styling and shared navigation metadata; client controls for authenticated current content and publishing. Existing mail builders retain their public entry points with a tested, email-compatible identity. No additional UI or email rendering dependency.

**Tech Stack:** Next.js 16.4.3, React 19.3.1, Bun 1.4.4, TypeScript, Zod, existing Nodemailer/Resend, Playwright.

## Task 1 — Baseline and regressions

- [x] Fetch and inspect the current feature branch, read installed Next.js guides and relevant design instructions.
- [x] Capture current login/dashboard/editor/email specimens using the existing build and a test admin session.
- [x] Add failing browser tests for the observed dashboard counts and login shell, plus newly exercised editing/upload paths. Add email tests before template changes.

## Task 2 — Admin shell and dashboard

- [x] Update `app/admin/layout.tsx` with the selected logo, labelled desktop navigation, close-on-route/Escape phone navigation, accessible logout state, and a separate login composition.
- [x] Add scoped `app/admin/admin.css` for the shared UI contract and keep public layout styling independent.
- [x] Update `app/admin/page.tsx` and shared admin metadata so content rows use current authenticated API counts with explicit pending/unavailable states, retry, and real résumé actions.
- [x] Update `app/admin/login/page.tsx` to the same identity while retaining the safe return path and full navigation after successful login.

## Task 3 — Editors and résumé (independent)

- [x] Restyle `app/admin/[section]/page.tsx`, `app/admin/projects/draft/page.tsx`, and `components/admin/ResumeUploader.tsx` against the shared UI contract.
- [x] Preserve file revision updates and retained edits on conflicts; label controls, expose errors/status, and disable conflicting operations while requests are pending.
- [x] Verify empty/add/remove behavior and correct concrete defects discovered while reading these paths. Add focused helper tests where behavior changes.
- [x] Replace browser-incompatible file encoding and fix upload input positioning/object-URL cleanup if confirmed; test selection and upload with an intercepted endpoint.

## Task 4 — Received email (independent)

- [x] Replace `lib/email-template.ts` with an inline, table-based Olive layout plus clear plain-text version. Escape submitted content and safely normalize the configured production URL.
- [x] Align sender, timestamp, reply action/instructions, and provider payloads in `lib/mail.ts` without dropping any provider.
- [x] Test malicious text, multiline and unbroken text, URLs, plaintext, Reply-To, HTML/text parity, provider errors, and deterministic receipt times.
- [x] Generate an explicitly labelled sample email for local and hosted preview; it contains fictional submission content only.

## Task 5 — Integration and preview

- [x] Run types, lint, formatting, all unit/security tests, production build, full browser suite, and dependency audit.
- [x] Inspect login/dashboard/editor/draft/upload and email at desktop/tablet/phone widths, plus pending/error states. Use the app-screen inspector and fix concrete failures.
- [x] Perform an independent read-only review and resolve findings.
- [x] Commit and push the verified feature branch; deploy a working application preview and verify protected admin redirects and the sample email. Record evidence and limitations without sending external email or promoting production.
