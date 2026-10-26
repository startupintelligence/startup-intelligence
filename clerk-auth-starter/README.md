# Startup Intelligence — Clerk auth starter

This is a **starter implementation**, not production-ready authentication. It is kept separate from the existing `/login/` pages so it cannot replace the live site accidentally.

## Routes in this starter
- `clerk-auth-starter/site/login/index.html` — customer/office route choice.
- `clerk-auth-starter/site/login/config.js` — public Clerk publishable key and Worker URL placeholders only.
- `clerk-auth-starter/docs/IMPLEMENTATION-PLAN.md` — required configuration and test plan.

## Not live yet
No Clerk application, Google OAuth credentials, Cloudflare Worker, KV namespace, or email sender is configured. Do not deploy until the checklist is complete. Never commit Clerk secret keys, Resend keys, or GitHub tokens. Admin approval in the app does not grant GitHub repository permissions or create a CMS.

## Site path note
This repository is published as a GitHub Pages project site at `/startup-intelligence/`. Review and map the starter routes to the project base path before installing into the existing `login/` directory.