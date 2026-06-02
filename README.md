# Portfolio Deployment Guide

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- GitHub account with this repo pushed
- Environment variables configured

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for `/admin` panel access |
| `GITHUB_TOKEN` | No | Personal access token for admin commits |
| `GITHUB_REPO_OWNER` | No | Your GitHub username |
| `GITHUB_REPO_NAME` | No | This repo name |
| `OPENROUTER_API_KEY` | No | For AI-enhanced project drafts |
| `OPENROUTER_MODEL` | No | e.g. `openai/gpt-4o` |
| `EMAIL_PROVIDER` | No | `mailhog` (dev) / `resend` / `gmail` |
| `CONTACT_EMAIL` | No | Where contact form submissions go |
| `RESEND_API_KEY` | No | Required if `EMAIL_PROVIDER=resend` |
| `GMAIL_USER` | No | Required if `EMAIL_PROVIDER=gmail` |
| `GMAIL_APP_PASSWORD` | No | Required if `EMAIL_PROVIDER=gmail` |

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

1. **Update site URL**: After first deploy, update `NEXT_PUBLIC_SITE_URL` env var with your Vercel domain
2. **Update portfolio link**: Edit `data/profile.json` and set `socialLinks.portfolio` to your new URL
3. **Custom domain** (optional): Add custom domain in Vercel project settings

## Admin Panel

Access `/admin` on your deployed site. Login with the `ADMIN_PASSWORD` you set.

## Updating Content

1. **Via Admin Panel**: Go to `/admin`, edit sections, save changes
2. **Via Git**: Edit JSON files in `data/` folder and push — auto-deploys

## Troubleshooting

- **Admin login fails**: Check `ADMIN_PASSWORD` env var is set
- **GitHub draft fails**: Ensure `GITHUB_TOKEN` has `repo` scope
- **Contact form fails**: Check email provider config and API keys