# Website quality-fix and launch checklist

Updated: 27 October 2026. This is a working checklist, not a legal compliance certificate.

## Implemented in this pass

- [x] Added a repeatable Python static-site checker at `scripts/check_site.py` for page titles, descriptions, viewport metadata, empty links, image alt attributes, and local links/assets.
- [x] Added GitHub Actions workflow `.github/workflows/site-checks.yml` to run the static checker on pushes and pull requests targeting `main`.
- [x] Marked the Clerk authentication starter-template routes `noindex,nofollow` and replaced them with clear development-only notices; they do not claim to authenticate users or process access requests.
- [x] Added Escape-to-close and keyboard-focus restoration for the mobile menus on the Privacy Policy and Terms pages.
- [x] Kept existing responsive overflow safeguards, mobile menu keyboard handling, favicon assets, branded 404, sitemap, robots policy, and shared theme/menu scripts.

## Must still be tested or completed before public launch

- [ ] Run the new checker successfully against the full repository and fix any findings it reports.
- [ ] Test every page at 320, 360, 375, 390, 768, 1024, and desktop widths; confirm no horizontal scrolling, clipping, or overlapping header/footer.
- [ ] Test mobile menu by touch and keyboard, including Enter/Space, Escape, resize, and orientation change. Confirm focus and `aria-expanded` behavior.
- [ ] Crawl live internal and external links, verify HTTP statuses and redirect destinations, and repair any remote broken links. Static checks cannot confirm a server responds correctly.
- [ ] Review all header/footer links on every page and remove only links whose destinations are confirmed obsolete.
- [ ] Audit page titles, unique meta descriptions, canonical URLs, Open Graph tags, headings, and robots directives on the deployed site.
- [ ] Verify favicon variants, manifest URLs, and icon paths on root and nested GitHub Pages routes.
- [ ] Review placeholder copy, dead buttons, unused navigation, and browser-console errors manually. Only show form success when a real endpoint confirms success.
- [ ] No public contact submission backend is configured; contact routes currently use direct contact links. Do not imply a message was submitted to a server.
- [ ] Images are present in the homepage and contact page as brand-mark SVGs; other public pages use CSS-created artwork. The SVG brand marks have empty alt text because adjacent brand text provides the accessible name. Recheck any future content images for meaningful alt text, dimensions, responsive sizing, and compression.
- [ ] GitHub Pages supports a custom `404.html`; server-side 500/502/503 pages are controlled by the hosting platform. Test the custom 404 route live.
- [ ] Run Lighthouse and accessibility checks at mobile and desktop sizes; inspect contrast, zoom, reduced motion, Core Web Vitals, mixed content, network errors, and keyboard navigation.
- [ ] Verify Google Search Console ownership, submit the sitemap, and inspect index coverage once ownership is confirmed. Sitemap submission does not guarantee indexing.
- [ ] Review legal/privacy text against actual practices and applicable law; this checklist is not legal advice or a compliance certification.

## Existing project constraints

- Hosting: `https://startupintelligence.github.io/startup-intelligence/`; no custom domain.
- Login and office/customer/admin routes are previews, not production authentication. Static HTML and `noindex` do not provide access control.
- Keep third-party tracking disabled unless there is a real need and a suitable privacy review. Prefer system/local fonts where practical.
- GitHub Pages is static hosting; API keys and secrets must never be placed in client-side code.
