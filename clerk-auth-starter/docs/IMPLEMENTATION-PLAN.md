# Clerk authentication implementation plan

## Access rules
- Customers sign in with email/password and Google after those methods are enabled in Clerk.
- Office sign-in is for existing staff; users can request access but do not become admins automatically.
- `startupintelligence1@gmail.com` is the designated approver. Approval must happen in an authenticated, server-verified owner session; an email link alone must never grant privileges.
- Only a server-controlled role such as Clerk private metadata may authorize privileged actions. Never trust browser-provided role fields.

## Before deployment
1. Create a Clerk application and configure email/password and Google OAuth.
2. Configure allowed origins and redirect URLs for `https://startupintelligence.github.io` and the `/startup-intelligence/` project path.
3. Set only the Clerk publishable key in the public config.
4. Deploy a Cloudflare Worker with KV for pending requests and configure `CLERK_SECRET_KEY`, `RESEND_API_KEY`, and `RESEND_FROM` as server-side secrets.
5. Verify the sender/domain with Resend and send request notifications to `startupintelligence1@gmail.com`.
6. Set the Worker app origin/base path and owner email in server-side configuration.
7. Review the full diff and merge only after checks pass. Do not replace the existing `/login/` pages until the routes are tested.

## Required tests
Test customer sign-up, email verification, Google sign-in, sign-out, staff request email, duplicate requests, non-owner denial, owner approval/rejection, mobile layout, keyboard navigation, and reduced-motion behavior. Confirm unauthorized users cannot call any privileged API directly.

## Limits and security
This starter does not grant GitHub access or provide a website CMS. GitHub Pages is static and cannot safely hold secrets. Any future website editor must authorize each server-side write, keep GitHub credentials server-only, validate changes, and log admin actions. No deployment, email delivery, authentication, or security audit is claimed until actually tested. Review third-party script hosting (including ClerkJS CDN usage) and privacy/legal requirements before production.