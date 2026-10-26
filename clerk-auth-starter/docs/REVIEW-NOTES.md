# Review notes and remaining production blockers

## Added in this branch
- Customer and office UI pages, shared styles and a Clerk sign-in loader, isolated under `clerk-auth-starter/`.
- Cloudflare Worker API scaffold for authenticated access requests, owner-only request listing and owner-only approve/reject endpoints.
- Server-side owner identity check against Clerk's user API and private metadata role assignment on approval.
- Session JWT verification uses `@clerk/backend`'s `verifyToken` with an authorized-party allowlist, following Clerk's documented verification approach.

## Critical blockers before production
1. Install dependencies and run `npm run typecheck`; compile status is not yet verified in this branch.
2. Verify the exact installed `@clerk/backend` version and Cloudflare Workers compatibility. Pin a reviewed version and commit the lockfile.
3. **No admin review UI yet.** The request listing API exists, but the browser page is intentionally a placeholder; approve/reject calls need a protected UI.
4. **Approval state and role update are not atomic.** Add rollback/reconciliation and audit logging for partial failures.
5. Authorization must check the `siOfficeAccess` private metadata role on every protected office API. This scaffold does not yet provide those protected APIs or enforce that role on the office page.
6. Add rate limiting, abuse controls, strict request validation, email retry/observability, and tests for forged/expired tokens, non-owner denial, duplicate requests and approval failures.
7. Pin the ClerkJS CDN version; review third-party script hosting and Content Security Policy.
8. Confirm Clerk domain/origins and GitHub Pages project base path. No live routes are changed by this branch.
9. Create KV namespace and replace the placeholder ID. Set Cloudflare secrets with Wrangler commands; never commit secret keys.
10. Review privacy disclosure, retention, DPDP Act applicability and vendor terms. Do not claim legal compliance without appropriate review.

This is an implementation scaffold for review, not a security audit, tested deployment, or active authentication service.