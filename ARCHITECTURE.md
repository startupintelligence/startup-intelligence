# Startup Intelligence website platform: phased architecture

## Current baseline

The production repository is a static GitHub Pages site. This phase adds a shared CSS/JS design system and public-facing agency pages without introducing a fake checkout, non-persistent forms, invented prices, fake customer stories, or client-side-only authentication.

## Phase 1: public customer journey (this branch)

- Shared design tokens, accessible controls, responsive navigation, theme preference, and reduced-motion support in `assets/css/site.css` and `assets/js/site.js`.
- Homepage, searchable/filterable website collection, plan overview, custom-development overview, and clearly labelled concept portfolio.
- All prices remain quote-based until the business configures real prices and terms.
- Collection cards are illustrative CSS layout studies, not live demos or completed client work.
- The custom inquiry page explicitly says its secure form is not connected. No personal data is collected by this phase.

## Phase 2: validated business content and operations

- Confirm actual contact channels, service scope, availability, price rules, taxes, cancellation/refund terms, maintenance commitments, and ownership/licensing terms.
- Replace concept studies with actual preview environments that match the offered deliverables.
- Add a permissioned portfolio and genuine testimonials only when evidence and consent exist.
- Add an admin-managed content model for logos, banners, collections, plans, promotions, and publish/schedule workflows.

## Phase 3: backend foundation

Recommended production stack: Next.js + TypeScript, PostgreSQL, a managed authentication provider, object storage for uploads, transactional email, and managed hosting. Select vendors only after confirming region, budget, data retention, backups, security features, and applicable law.

Core entities: users, roles, sessions, website_designs, categories, plans, price_rules, offers, inquiries, inquiry_files, quotes, quote_items, projects, project_events, support_tickets, notifications, invoices/payment references, and admin_audit_events.

Security boundaries:

- All authorization and role checks happen server-side on every protected operation.
- Admin actions use least privilege, MFA where supported, session revocation, and audit records.
- Uploads use size/type limits, generated object names, private storage by default, malware scanning where practical, and expiring authorized download links.
- Payment state is verified server-side using the payment provider's signed webhooks; raw card data is never stored.
- Secrets are stored in hosting secrets, never in frontend bundles or Git history.
- Inquiry forms need server-side validation, abuse/rate limiting, spam protection, privacy notice, retention policy, and team notifications.
- Do not add non-essential analytics/session replay by default. If later introduced, review consent requirements and disable keystroke/sensitive-field capture.

## Phase 4: customer and admin workflows

- Customer accounts, verification/recovery, saved designs, inquiry and quote history, project status, support, notifications and deliverables.
- Admin content management, pricing and promotion rules, inquiry triage, quote preparation, customer/project operations, role permissions, audit log and destructive-action confirmations.
- Quote calculation is an estimate only until reviewed; no automatic charge without clear itemized terms and explicit confirmation.

## Phase 5: quality and production launch

- Automated unit/integration tests for quote rules, form validation, permissions and state transitions.
- End-to-end tests for catalog filtering, inquiry submission, quote approval, account recovery, admin permissions, uploads and payment sandbox flows.
- Browser/device QA, accessibility checks, security review, performance/Core Web Vitals, broken-link scan, SEO and sitemap verification.
- Verify backup restoration, incident response, privacy/retention processes, email delivery and deployment rollback.

## Deployment constraint

GitHub Pages can host the static public pages in Phase 1. It cannot securely implement server-side account creation, protected customer/admin dashboards, database-backed inquiries, private uploads, price-rule administration, or payment verification on its own. Those features must wait for the backend architecture above or an equivalent trusted service.
