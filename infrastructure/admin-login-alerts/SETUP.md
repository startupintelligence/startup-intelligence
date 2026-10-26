# Startup Intelligence — Admin login email alerts

This starter package uses Cloudflare Workers as a server-side endpoint and Resend for email. It does not enable authentication or grant admin access.

## What it currently alerts on

It sends an email to `startupintelligence1@gmail.com` when the admin login page reports that it was opened. The current admin form is disabled, so this is a **page-open alert, not proof of an actual login attempt**. For accurate failed/successful login alerts, emit events from the real identity provider/backend once authentication is configured.

The endpoint restricts CORS to `https://startupintelligence.github.io`, applies a Cloudflare rate-limit binding, and does not email the visitor's IP address or any password. Public endpoints can still be spoofed; origin checks and rate limits are abuse controls, not authentication.

## 1. Configure Resend

1. Create a Resend account.
2. Verify a sending domain you control.
3. Create an API key with only the permissions needed to send email.
4. Never put the API key in GitHub, HTML, browser JavaScript, or this package.

## 2. Deploy the Worker

1. Install Wrangler and authenticate to Cloudflare using its official instructions.
2. Deploy from the `worker` folder.
3. In Cloudflare, set Worker secret `RESEND_API_KEY` to your Resend key.
4. Set Worker variable `ALERT_FROM` to a sender address on your verified domain, such as `Startup Intelligence Alerts <alerts@your-domain.example>`.
5. Configure a valid unique rate-limit namespace ID in `wrangler.toml` if needed by the current Cloudflare interface, and verify the binding works.
6. Note the deployed Worker URL and test email delivery.

Use `wrangler secret put RESEND_API_KEY` or Cloudflare's secret settings. Do not add secrets to `wrangler.toml`.

## 3. Connect the static page

1. Replace the placeholder URL in `integration/admin-page-alert.js` with your deployed Worker URL plus `/admin-login-alert`.
2. Add the script to `login/admin/index.html` before `</body>`, or include it as a local script with the correct relative path.
3. Deploy GitHub Pages and test from the live admin page.

## 4. Before real admin login goes live

- Integrate a trusted identity provider.
- Send alerts from backend/provider authentication events, distinguishing failed attempts from successful sign-ins.
- Enforce admin permissions server-side for every protected operation.
- Require MFA, rate-limit authentication, and maintain an audit log.
- Keep all secrets in server-side secret storage.
- Update the privacy notice to explain event metadata and retention.
- Never email passwords, session tokens, access tokens, or other credentials.

## Files

- `worker/index.js` — Worker endpoint.
- `worker/wrangler.toml` — Worker configuration and rate limit.
- `integration/admin-page-alert.js` — browser integration snippet.

This package is starter code only. It must be deployed and tested with your Cloudflare and Resend accounts before email alerts will work.
