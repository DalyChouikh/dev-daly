# Olive administration and contact notification

The user approved the working Olive portfolio and explicitly requested the same design for the admin panel and received email. This extends the chosen identity; no alternative visual direction is needed.

## Design

Use bone `#ecebe7`, olive `#38450f`, the selected A logo, and local Hanken Grotesk. Administration keeps compact 16px body text, bold 28–32px page titles, quiet surfaces, square controls, a labelled sidebar, and a folded phone navigation. Login has its own focused composition without the authenticated sidebar. The dashboard leads with publishing actions, then the real content inventory and résumé. Counts must come from authenticated current-content reads, not hardcoded or stale build totals.

The email uses the same bone/olive identity and a clear hierarchy: Daly signature, new contact heading, sender, received time, full message, reply action, portfolio footer. Use inline table layout, explicit colours, system font fallback, and a plain-text alternative. Essential content remains readable with images blocked. All submitted content and configurable URLs must be safely rendered. The Reply-To header and reply instructions must agree.

## Scope and boundaries

- Root owns admin shell/layout, login, dashboard, shared admin CSS/navigation metadata, browser tests, integration, and preview deployment.
- The editor task owns section editing, GitHub draft, résumé upload, and focused editor helpers/tests. Keep the existing API and revision workflow. Improve field labels, selection/pending/error feedback, and concrete browser defects found in these screens.
- The email task owns the existing template and mail service plus template/delivery tests. Preserve MailHog, Gmail, and Resend behavior. Verify delivery with local interception or a local SMTP sink; no real external email is sent.
- Authentication, signed cookies, redirect restrictions, server-side payload validation, and optimistic revision checks remain enforced.
- No production promotion in this increment; publish the complete working preview and email specimen for review.

## Shared UI contract

All admin content is inside `.admin-shell`, scoped in `app/admin/admin.css`. Reusable classes: `admin-page`, `admin-page-header`, `admin-page-copy`, `admin-breadcrumb`, `admin-actions`, `admin-button` (optional `admin-button--primary`, `admin-button--danger`, `admin-button--quiet`), `admin-panel`, `admin-panel-header`, `admin-field`, `admin-field-label`, `admin-input`, `admin-textarea`, `admin-feedback` (optional `admin-feedback--error`, `admin-feedback--success`), `admin-muted`, `admin-empty`, `admin-json`, `admin-form-grid`, `admin-editor-field`, `admin-array`, `admin-array-item`, `admin-array-item-header`, `admin-icon-button`, `admin-dropzone`, `admin-file-preview`. Form control styling also applies to native inputs/selects/textareas within the shell. Use associated labels and stable accessible button names. Icons are plain, small, and secondary to words.

## Verification

Add browser regressions before implementation for dashboard inventory, standalone login, mobile navigation, editor error/conflict/retry and add/remove, GitHub draft/enhancement/save, and résumé selection/upload. Retain all public and admin security tests. Add template tests for escaping, multiline/long content, URLs, plaintext, reply links, and provider payload parity. Inspect admin and email desktop/phone specimens; run types, lint, formatting, unit tests, production build, browser tests, and audit before committing and publishing the preview.
