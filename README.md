# Daly’s portfolio

The public site uses the approved Olive editorial identity, custom `daly.` wordmark, and Hanken Grotesk. The authenticated admin publishes validated JSON through GitHub. See the [architecture and content guide](docs/portfolio-architecture.md) for the public sections, featured projects, media, and motion tooling.

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- GitHub account with this repo pushed
- Environment variables configured

## GitHub Token Setup

A GitHub token is **required** for the admin panel to save changes and upload resumes.

### Generate a Personal Access Token

1. Open [fine-grained personal access tokens](https://github.com/settings/personal-access-tokens/new).
2. Select the repository owner and limit repository access to this portfolio repository.
3. Grant **Contents: Read and write**; Metadata read access is included automatically.
4. Set an expiration, generate the token, and copy it into your environment configuration.

The portfolio uses GitHub's [repository contents API](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents); it does not require write access to your other repositories.

### Add Token to Environment

```bash
# In .env.local (local development)
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=your-repo-name
```

For production, add these to your Vercel dashboard under **Project Settings → Environment Variables**.

---

## Environment Variables

Create `.env.local` using the variables below. Keep its credentials out of Git.

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for `/admin` panel access |
| `GITHUB_TOKEN` | For production admin | Token for reading current content and committing updates |
| `GITHUB_REPO_OWNER` | For production admin | Your GitHub username |
| `GITHUB_REPO_NAME` | For production admin | This repo name |
| `OPENROUTER_API_KEY` | No | For AI-enhanced project drafts |
| `OPENROUTER_MODEL` | No | e.g. `openai/gpt-4o` |
| `EMAIL_PROVIDER` | No | `mailhog` (dev) / `resend` / `gmail` |
| `CONTACT_EMAIL` | No | Where contact form submissions go |
| `RESEND_API_KEY` | No | Required if `EMAIL_PROVIDER=resend` |
| `GMAIL_USER` | No | Required if `EMAIL_PROVIDER=gmail` |
| `GMAIL_APP_PASSWORD` | No | Required if `EMAIL_PROVIDER=gmail` |

## Local Email Testing (MailHog)

For local development, use MailHog to test the contact form without sending real emails.

### Start MailHog

```bash
# Start the container
docker compose up -d

# Access the web UI to view captured emails
open http://localhost:8025
```

MailHog runs:
- **SMTP Server**: `localhost:1025` (no authentication required)
- **Web UI**: `http://localhost:8025`

Set `EMAIL_PROVIDER=mailhog` in your `.env.local`.

To stop: `docker compose down`

---

## Deploy to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables from above
4. Deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 3: Git Integration

Push to `main` branch. Vercel auto-deploys on every push.

## Post-Deploy Setup

1. **Update site URL**: After first deploy, update `NEXT_PUBLIC_APP_URL` env var with your Vercel domain
2. **Update portfolio link**: Edit `data/profile.json` and set `socialLinks.portfolio` to your new URL
3. **Custom domain** (optional): Add custom domain in Vercel project settings

## Admin Panel

Access `/admin` on your deployed site. Login with the `ADMIN_PASSWORD` you set.

The admin workspace uses the same Olive identity as the public portfolio. Its inventory reads current repository content through authenticated APIs, so counts remain current while deployments are pending. Editors retain local changes on failed saves and conflicts, and GitHub drafts update an existing project by ID while preserving its display and media settings.

Contact notifications use the Olive email template with both HTML and plain-text alternatives. Run `bun run preview:email` to regenerate the clearly labelled, fictional specimen at `/preview/contact-email.html`. This command writes preview files only; it does not send email. The real template uses the configured HTTPS `NEXT_PUBLIC_APP_URL` for the portfolio and PNG logo; if that value is missing or unsafe, the notification keeps its text identity and omits those links.

## Updating Content

1. **Via Admin Panel**: Go to `/admin`, edit sections, save changes
2. **Via Git**: Edit JSON files in `data/` folder and push — auto-deploys

Featured work uses the ordered `featuredProjectIds` in `data/site.json`. All remaining projects appear in the expandable archive. Project presentation fields, screenshots, and video paths are documented in the [content guide](docs/portfolio-architecture.md#content-and-media).

## Troubleshooting

- **Admin login fails**: Check `ADMIN_PASSWORD` env var is set
- **GitHub draft fails**: Check token expiration and repository access.
- **Contact form fails**: Check email provider config and API keys.
- **Save returns 409**: Another edit changed the file. Copy any pending edits, reload the editor, and apply them to the latest content.

## Development and verification

Maintenance was verified with Node 24 and Bun 1.4.4.

```bash
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run lint
bun run build
bun run test:e2e
bun audit
```

The browser suite starts the production server on port 3100, so run the build first. Install its Chromium browser with `bunx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an existing Chromium executable. It uses a test admin password and fake GitHub credentials; successful editor reads and saves are mocked so tests do not publish content. Node API authentication and validation run against the actual server.

## October 2026 maintenance

The failed deployment at `2a58548` hit a Next.js Google Fonts parsing bug while processing JetBrains Mono. The existing font families now load from bundled WOFF2 files in `app/fonts/`, with their OFL licenses included. No build-time Google Fonts download is required.

All runtime dependencies were updated to the registry's stable releases as of October 24, 2026. Next.js and eslint-config-next are `16.4.3`, React is `19.3.1`, and the lockfile includes patched transitive dependencies. TypeScript remains at `6.0.3` because the ESLint parser declares support below `6.1`; Node types match Node 24. Vercel installs with a frozen lockfile.

Admin endpoints now verify signed sessions independently, enforce a 24-hour expiry, and validate content before publishing. Production editors read the current GitHub file and carry its revision through saves, preventing failed deployments or simultaneous edits from silently overwriting newer content. Existing sessions are invalidated by this update; log in again after deployment using the same `ADMIN_PASSWORD`.

See the [maintenance evidence and verification record](docs/superpowers/plans/2026-10-24-build-security.md) for the deployment logs, changes, and test results. Changes become live after this branch is merged and Vercel successfully deploys the resulting commit.
