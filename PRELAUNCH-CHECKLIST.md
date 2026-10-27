# Website quality-fix and launch checklist

Updated: 27 October 2026. This is a working checklist, not a legal compliance certificate.

## Implemented in the current quality pass

- [x] Add responsive overflow safeguards for long text, controls, media, cards, and narrow screens.
- [x] Keep the existing mobile navigation and make Escape close the menu with focus returned to its trigger.
- [x] Give the homepage navigation the ID referenced by its `aria-controls` attribute.
- [x] Remove the copyright symbol from the homepage footer because no formal copyright notice was requested; retain a dynamically updated year and the existing statement that the project is not a registered company.
- [x] Preserve the existing favicon assets and links, existing branded 404 page, sitemap, robots policy, and shared theme/menu scripts.

## Still requires live browser testing or follow-up work

- [ ] Test every page at 320, 360, 375, 390, 768, 1024, and desktop widths; confirm no horizontal scrolling, clipped content, or overlapping header/footer.
- [ ] Test the menu by touch, keyboard, Enter/Space, Escape, resize, and orientation change. Confirm `aria-expanded` and focus behavior.
- [ ] Crawl every internal and external link, verify HTTP status and redirect destinations, and repair broken links. Repository text inspection alone is not a live link check.
- [ ] Review all header and footer links on every page; remove links only after confirming the destination is obsolete or unavailable.
- [ ] Audit all public page titles, unique meta descriptions, canonical URLs, Open Graph tags, headings, and robots directives against the live site. Login/preview routes should remain noindex until their purpose and access model are settled.
- [ ] Verify all favicon variants, manifest URLs, and icons on root and nested GitHub Pages paths.
- [ ] Search all pages for placeholder copy, dead buttons, unused navigation, empty `href` values, and JavaScript console errors. Do not imply a form was sent unless a real endpoint confirms success.
- [ ] Add accessible success/error states only for actions that can return a truthful result; no public contact submission backend currently exists.
- [ ] The repository's public pages currently contain no `<img>` elements. If images are added, compress/rescale them, prefer WebP/AVIF when appropriate, add meaningful alt text, dimensions, responsive sources, and lazy loading only below the fold.
- [ ] GitHub Pages supports a custom `404.html`; other HTTP error pages (such as server-side 500/502/503) are controlled by the hosting platform and cannot be independently configured on this static host. Test the custom 404 route live.
- [ ] Re-run Lighthouse and accessibility checks at mobile and desktop sizes; inspect keyboard navigation, contrast, zoom, reduced motion, Core Web Vitals, mixed content, and network errors.
- [ ] Verify Google Search Console ownership, submit the sitemap, and inspect index coverage once verified. A sitemap submission does not guarantee indexing.

## Copyright wording

The homepage footer now shows the current year without asserting an official registered-company or formal copyright status. This does not determine who legally owns original work; legal rights and notice requirements depend on the facts and applicable law. Review all other page footers and legal pages before launch.

## Existing project constraints

- Hosting: GitHub Pages at `https://startupintelligence.github.io/startup-intelligence/`; no custom domain.
- Public HTML currently has no public form or image tags; inquiry/login previews are not production backend functionality.
- Keep third-party tracking disabled unless a real need and suitable privacy review exist. Prefer system/local fonts.
