# Olive contact email verification

Implemented in `lib/email-template.ts` and `lib/mail.ts`; regression coverage lives in `tests/email-template.test.ts` and `tests/mail-delivery.test.ts`.

- Bone `#ecebe7`, olive `#38450f`, the existing PNG wordmark, inline presentation tables, fluid content width, and system fonts. Labels use readable sentence case. Profile display name (falling back to full name) and title come from `data/profile.json` and are escaped in HTML.
- Full submitted text is retained. HTML escapes all submitted fields, preserves CRLF/CR/LF message breaks, wraps long unbroken fields, and encodes the reply address so mailto punctuation cannot introduce headers.
- A configured HTTPS domain is normalized to its origin for the logo and portfolio link. Malformed, credentialed, local, numeric, IP-literal, and non-HTTPS origins omit both remote links and images; the visible profile identity and full message remain. No localhost fallback is invented.
- `buildContactEmailHtml` and `buildContactEmailText` retain their entry points and accept optional `{ receivedAt, siteUrl }`. Delivery captures one receipt time for both alternatives and formats it with date-fns `formatISO`, including its timezone offset. All three providers retain their existing configuration, destinations, subjects, and Reply-To; MailHog uses a structured sender address.

The initial 42 targeted tests ran red (9 passed, 33 failed) before implementation. Three later profile/readability regressions also ran red before refinement. Final evidence: 45 targeted tests passed; the complete current unit suite passed 126 tests; `bun run typecheck`, focused ESLint, and `git diff --check` passed.

The real builder output was inspected locally at 900px and 320px, with a loaded logo, a blocked logo, and a long malicious-looking message. At 320px, document scroll width stayed 320px, script-element count remained zero, and the final message line stayed present. Desktop and phone screenshots are temporary artifacts under `/tmp/olive-email-review/`; the named browser session was closed and no preview server was started.

SMTP sends and Resend HTTP were intercepted locally. No real external email was sent, and provider inbox/client rendering is not claimed. Root owns the labelled hosted specimen and overall application build/browser verification. The exact production logo path remains `/brand/png/daly-wordmark-2040.png`.
