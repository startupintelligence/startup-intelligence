# Review notes and remaining production blockers

## Added in this branch
- Customer and office UI pages, shared styles and a Clerk sign-in loader, all isolated under `clerk-auth-starter/`.
- Cloudflare Worker API scaffold for authenticated access requests, owner-only request listing and owner-only approve/reject endpoints.
- Server-side owner identity check against Clerk's user API and private metadata role assignment on approval.

## Critical blockers before production
1. **Review the Clerk API contract.** Verify session-token verification endpoint and response fields against the current Clerk backend API version. This scaffold must not be treated as audited or production-ready until verified.
2. **Approval state and role update are not atomic.** Add rollback/reconciliation and audit logging for partial failures.
3. **No admin review UI yet.** The request listing API exists, but the browser page is intentionally a placeholder; approve/reject calls need a protected UI.
4. **Authorization still needs enforcement on every protected backend route.** A private metadata flag is not itself protection; verify the role server-side for each privileged action.
5. **CORS is not authorization.** Keep bearer/session validation and owner checks regardless of origin.
6. Add rate limiting, request abuse controls, strict schema validation, email delivery retry/observability, and tests for forged tokens, expired tokens, non-owner denial, duplicate requests and approval failures.
7. Review ClerkJS CDN policy/version pinning, privacy disclosure, data retention, consent needs, DPDP Act applicability, and vendor terms. Do not claim compliance without legal review.
8. Confirm Clerk domain/origins and GitHub Pages project base path. No live routes are changed by this branch.
9. Set Cloudflare secrets via Wrangler secret commands. Never commit secret keys or production tokens.
10. `wrangler.toml` uses a placeholder KV namespace ID; deploy must fail until configured.

This is an implementation scaffold for review, not a security audit, tested deployment, or active authentication service.