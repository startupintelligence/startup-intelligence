# Website quality-fix and launch checklist

Updated: 27 October 2026. This is a working checklist, not a legal compliance certificate.

## Verified in the 27 October audit

- [x] The repository-wide static checker passed in GitHub Actions after the mobile-menu fix; it checks the HTML files tracked in the repository, required metadata, empty anchor destinations, image `alt` attributes, and local links/assets.
- [x] Firecrawl discovered 15 site routes plus `sitemap.xml`; all 15 HTML routes and the sitemap returned HTTP 200 in this crawl. This does not prove every external destination works.
- [x] Public-page titles and descriptions were present in the live crawl. Source checks confirmed canonical URLs on the main public pages reviewed, and the public sitemap lists 10 content pages while omitting noindex login previews.
- [x] Shared CSS and JavaScript use system fonts; no Google Fonts or third-party analytics, session-replay, or advertising scripts were found in the inspected source. The theme preference is stored in browser local storage and is now disclosed in the Privacy Policy.
- [x] Mobile-menu Escape handling and focus restoration are implemented on the Privacy Policy and Terms pages. Manual device/keyboard testing is still required.

## Implemented in this pass

- [x] Added a repeatable Python static-site checker at `scripts/check_site.py` for page titles, descriptions, viewport metadata, empty links, image alt attributes, and local links/assets.
- [x] Added GitHub Actions workflow `.github/workflows/site-checks.yml` to run the static checker on pushes and pull requests targeting `main`.
- [x] Marked the Clerk authentication starter-template routes `noindex,nofollow` and replaced them with clear development-only notices; they do not claim to authenticate users or process access requests.
- [x] Kept existing responsive overflow safeguards, mobile menu keyboard handling, favicon assets, branded 404, sitemap, robots policy, and shared theme/menu scripts.

## Must still be tested or completed before public launch

- [x] Run the repository-wide checker in GitHub Actions and fix any findings it reports; the latest run passed.
- [ ] Test every page at 320, 360, 375, 390, 768, 1024, and desktop widths; confirm no horizontal scrolling, clipping, or overlapping header/footer.
- [ ] Test mobile menu by touch and keyboard, including Enter/Space, Escape, resize, and orientation change. Confirm focus and `aria-expanded` behavior.
- [ ] Crawl live internal and external links, verify HTTP statuses and redirect destinations, and repair any remote broken links. Static checks cannot confirm a server responds correctly.
- [ ] Review all header/footer links on every page and remove only links whose destinations are confirmed obsolete.
- [x] Review live titles/descriptions and inspect canonical URLs and Open Graph metadata on the main public pages.
- [ ] Finish a page-by-page manual SEO review of headings and robots directives. The project-site `robots.txt` is served under `/startup-intelligence/robots.txt`, not the host-root `/robots.txt`; submit the sitemap directly in Search Console and verify indexing rather than assuming the project-path robots file is read by every crawler.
- [ ] Verify favicon variants, manifest URLs, and icon paths on root and nested GitHub Pages routes.
- [ ] Review placeholder copy, dead buttons, unused navigation, and browser-console errors manually. Only show form success when a real endpoint confirms success.
- [ ] No public contact submission backend is configured; contact routes currently use direct contact links. Do not imply a message was submitted to a server.
- [ ] Images are present in the homepage and contact page as brand-mark SVGs; other public pages use CSS-created artwork. The SVG brand marks have empty alt text because adjacent brand text provides the accessible name. Recheck any future content images for meaningful alt text, dimensions, responsive sizing, and compression.
- [ ] GitHub Pages supports a custom `404.html`; server-side 500/502/503 pages are controlled by the hosting platform. Test the custom 404 route live.
- [ ] Run Lighthouse and accessibility checks at mobile and desktop sizes; inspect contrast, zoom, reduced motion, Core Web Vitals, mixed content, network errors, and keyboard navigation.
- [ ] Verify Google Search Console ownership, submit the sitemap, and inspect index coverage once ownership is confirmed. Sitemap submission does not guarantee indexing.
- [ ] Have the Privacy Policy and Terms reviewed against actual practices and applicable law; the policy now discloses the browser local-storage theme preference, but this checklist is not legal advice or a compliance certification.

## Existing project constraints

- Hosting: `https://startupintelligence.github.io/startup-intelligence/`; no custom domain.
- Login and office/customer/admin routes are previews, not production authentication. Static HTML and `noindex` do not provide access control.
- Keep third-party tracking disabled unless there is a real need and a suitable privacy review. Prefer system/local fonts where practical. Theme preference is stored locally in the browser (`si-theme`).
- GitHub Pages is static hosting; API keys and secrets must never be placed in client-side code.
