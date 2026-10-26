# Startup Intelligence: pre-launch checklist

Last reviewed: 26 October 2026. This is an implementation checklist, not a legal compliance certificate.

## Current code findings

- Privacy Policy: `privacy/index.html` exists. Re-check it whenever collection, accounts, analytics, forms, payments, or third-party services are added.
- Terms: `terms/index.html` exists. Have the final wording reviewed for the actual service and applicable jurisdictions.
- Secrets scan: the tracked HTML and README were scanned for common AWS, Google API, Stripe secret, GitHub token, private-key, and analytics patterns. No matches were found. This is a pattern scan, not proof that no secret exists. Review the full Git history and repository settings too. If a real secret was ever committed, revoke/rotate it; deleting the visible line is not enough.
- HTTPS: GitHub Pages currently reports `https_enforced: true`. Verify the live `https://startupintelligence.github.io/startup-intelligence/` URL and ensure there are no HTTP mixed-content resources.
- Forms and images: current public HTML has no `<form>` or `<img>` elements. Image alt text and form validation are therefore not currently applicable to the public pages. Re-audit when media/forms are introduced.
- Analytics: no analytics/session replay tags were found. None were added. Keep tracking off unless there is a clear need and the privacy notice is updated.
- Cookies: the theme switch stores a visual preference in `localStorage`, not a cookie. No consent banner was added because no non-essential cookie/tracker is currently configured. Reassess consent requirements before adding analytics, ad pixels, embedded media, or other tracking.
- Login: the new office/admin pages are non-functional previews with disabled fields. Do not activate them until a trusted authentication provider and server-side authorization are configured. Static GitHub Pages cannot protect private data or admin routes.

## 1. Login and role separation

- Public entry: `/login/`; role-specific previews: `/login/office/` and `/login/admin/`.
- Before launch, integrate a reputable identity provider (OIDC/OAuth or managed auth), use server-side or provider-enforced role checks for every protected API/data request, and deny access by default.
- Admin accounts should use MFA, least privilege, rate limiting, secure session cookies (`HttpOnly`, `Secure`, suitable `SameSite`), CSRF protection where applicable, audit logs that avoid secrets, recovery controls, and account lockout/risk controls.
- Never store passwords in localStorage/sessionStorage, never hardcode credentials or role flags in JavaScript, and never rely on hiding a page link as authorization.

## 2. SEO titles and descriptions

Each public page should have one descriptive `<title>`, one useful `meta name="description"`, one canonical URL, and matching Open Graph title/description/url. Existing pages already contain titles/descriptions and canonical/OG basics. Keep descriptions unique, human-readable, and accurate; avoid keyword stuffing. Login and role pages are `noindex,nofollow`.

Suggested titles/descriptions:

| Page | Title | Description |
|---|---|---|
| Home | Startup Intelligence | Clear Thinking for Startups | Explore startup trends, business models, emerging technology and the decisions shaping new ventures. |
| About | About Startup Intelligence | Independent Startup Research | Learn about the purpose, scope and principles of the Startup Intelligence project. |
| Explore | Explore Startup Topics | Startup Intelligence | Explore startup ecosystems, technology, AI and business strategy through structured topic guides. |
| Research | Research and Analysis | Startup Intelligence | Learn how Startup Intelligence approaches sources, uncertainty and evidence-based startup analysis. |
| Contact | Contact Startup Intelligence | Report a correction, broken link, accessibility issue or website concern through the project repository. |
| Privacy | Privacy Policy | Startup Intelligence | Read how this informational website currently handles data, hosting and external services. |
| Terms | Terms and Conditions | Startup Intelligence | Review the terms for using Startup Intelligence content and external links. |

## 3. Social preview image / Open Graph

Create a branded 1200×630 PNG or JPG, ideally compressed and under about 300 KB. Keep text/logo away from edges and check it at small preview size. Upload it as `assets/social-preview.png`, then add this to every public page's `<head>` using the correct absolute URL:

```html
<meta property="og:image" content="https://startupintelligence.github.io/startup-intelligence/assets/social-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://startupintelligence.github.io/startup-intelligence/assets/social-preview.png">
```

Do not add these image tags until the image exists at that exact URL. Test shares with the platform's current preview debugger.

## 4. Favicon

Favicon files already exist in `assets/icons/`: SVG, ICO, 16/32/48/64 PNG, Apple 180, PWA 192/512 and manifest. Test the root page and nested pages in a private browser window. Ensure the SVG is valid and does not contain unnecessary metadata. Keep the manifest paths correct for the GitHub Pages project subpath.

## 5. Sitemap and robots

`sitemap.xml` lists the seven public canonical pages. `robots.txt` allows crawling, while login pages use `noindex,nofollow` so crawlers can see the directive. Login URLs are not listed in the sitemap. After publishing, open `/startup-intelligence/sitemap.xml` and `/startup-intelligence/robots.txt` to confirm they return 200. Submit the sitemap to Search Console only if you choose to use it.

## 6. Image alt text

Current public pages have no `<img>` tags. When adding images:
- Informative image: describe the key information, not every visual detail.
- Decorative image: use `alt=""`.
- Functional image/link: describe the action or destination.
- Charts/infographics: provide a concise alt plus the full data/explanation in nearby text.
- Avoid filenames, keyword stuffing, and phrases like "image of" unless meaningful.
- Use width/height (or CSS aspect-ratio) to prevent layout shifts; add `loading="lazy"` only to below-the-fold images, not the main hero/LCP image.

## 7. Image optimization

- Prefer AVIF or WebP for photographs and illustrations; use SVG for simple logos/icons and PNG when transparency or exact pixels are needed.
- Resize to the largest rendered dimensions needed; export 2× for high-density screens when sensible.
- Compress before committing. Inspect at desktop/mobile sizes for visible artifacts. Use responsive `srcset`/`sizes` for large images and specify `width` and `height`.
- Do not add third-party font requests by default. The site currently uses system/Arial font stacks on its subpages; keep fonts local/system unless there is a clear reason otherwise.

## 8. Performance checklist

- Run Lighthouse in Chrome DevTools on home, explore, research, contact, privacy and terms at mobile and desktop sizes.
- Aim for Core Web Vitals field targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile when field data is available.
- Remove unused CSS/JS; avoid blocking third-party scripts; compress images; reserve image dimensions; use `defer` for non-critical external scripts; test on a throttled mobile connection.
- Re-test after each major visual change and check console/network errors.

## 9. Accessibility and contrast

- Target WCAG 2.2 AA: normal text contrast at least 4.5:1; large text at least 3:1; meaningful UI boundaries/focus indicators generally at least 3:1.
- Test both dark and light themes with a contrast checker. Do not rely on color alone to communicate status. Test keyboard-only navigation, visible focus, headings, link purpose, zoom at 200%, and screen-reader labels.
- Use axe DevTools or Lighthouse as a starting point, then manually test key flows. Automated checks cannot prove full accessibility.

## 10. Mobile and navigation

- Test widths around 320, 375, 768, 1024 and desktop; check no horizontal overflow, clipped controls, or tiny tap targets.
- Verify hamburger `aria-expanded`, keyboard operation, Escape-to-close if added, focus order, theme persistence, and menu behavior after rotation/resizing.
- Test each clean URL directly, not only through homepage links. Ensure internal links use the correct relative path from nested folders.

## 11. HTTPS and security

- GitHub Pages HTTPS enforcement is enabled in the repository settings.
- Keep all assets HTTPS and avoid mixed content. Static HTML cannot safely hold private API keys. Put secrets only in a backend secret manager/environment; use least-privilege public keys only where the provider explicitly designs them for browser exposure.
- Review GitHub secret scanning/push protection availability for the repository. Search tracked files and history; rotate any exposed key immediately.
- Add a Content Security Policy and other security headers through hosting configuration only after checking compatibility. GitHub Pages does not support arbitrary server headers from a simple `_headers` file on legacy branch publishing.

## 12. Cookie consent snippet (optional, do not install unless needed)

No consent banner is installed because the current site does not configure analytics/ad cookies. If non-essential cookies or tracking are introduced, determine the applicable consent rules first, then use a consent manager that blocks those scripts until consent and offers a real reject option. A generic banner alone is not sufficient.

Minimal UI-only example (wire this to a real consent-management policy before use):

```html
<div id="cookie-notice" role="dialog" aria-label="Cookie preferences" hidden>
  <p>This site uses optional analytics only if you allow it.</p>
  <button type="button" id="cookie-reject">Reject optional</button>
  <button type="button" id="cookie-accept">Allow optional</button>
</div>
<script>
  // Do not load optional analytics before a valid consent choice.
  const notice = document.getElementById('cookie-notice');
  const saved = localStorage.getItem('optional-consent');
  if (!saved) notice.hidden = false;
  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('optional-consent', 'accepted');
    notice.hidden = true;
    // Load optional analytics here only after consent.
  });
  document.getElementById('cookie-reject').addEventListener('click', () => {
    localStorage.setItem('optional-consent', 'rejected');
    notice.hidden = true;
  });
</script>
```

Use a consent manager for production: the example is not a complete compliance implementation, and storage/consent requirements vary by jurisdiction.

## 13. Forms: validation and spam protection

There are currently no public forms. For any future form, validate in the browser for usability and validate again on the server for security. Never trust client-side checks alone. Normalize inputs, enforce length/type limits, encode output, rate-limit submissions, and use CSRF protection where relevant.

Example client-side pattern:

```html
<form id="feedback-form">
  <label for="message">Message</label>
  <textarea id="message" name="message" required minlength="10" maxlength="3000"></textarea>
  <p id="form-error" role="alert"></p>
  <button type="submit">Send feedback</button>
</form>
<script>
  const form = document.getElementById('feedback-form');
  const message = document.getElementById('message');
  const error = document.getElementById('form-error');
  form.addEventListener('submit', event => {
    error.textContent = '';
    if (!message.value.trim() || message.value.trim().length < 10) {
      event.preventDefault();
      error.textContent = 'Please enter at least 10 characters.';
      message.focus();
    }
  });
</script>
```

For a server-backed form, add a honeypot field that is hidden accessibly from real users, server-side submission rate limits, request-size limits and bot monitoring. CAPTCHA is a later option; disclose its third-party processing and provide an accessible alternative. Do not treat a honeypot or CAPTCHA as the only control.

## 14. Analytics

No analytics are configured or added. If analytics becomes necessary, choose a privacy-conscious provider, document what is collected, configure retention and IP handling appropriately, obtain consent where required, and test that tracking does not run before consent when consent is required. Never record passwords, form contents, keystrokes, private pages, or session replay of sensitive areas. Do not invent traffic metrics.

## 15. Clear CTA

The homepage's primary action currently directs visitors to Explore. Keep one visually dominant primary action per key page, make its label specific, and ensure it works on mobile. Secondary actions should be visually quieter. Do not add unsupported conversion claims, fake counters, testimonials, or invented contact details.

## 16. Broken links and launch verification

- Check all internal URLs, external URLs, canonical URLs, icons, manifest, sitemap, and the custom 404.
- Use a link checker (for example, Linkinator or a crawler you trust) and manually test important external links; automated tools may flag intentional redirects or blocked pages.
- Open every page directly in a fresh browser tab. Check desktop/mobile, light/dark theme, keyboard navigation, console errors, 404 behavior, and the network panel.
- Verify GitHub Pages has completed deployment before announcing launch. This checklist does not claim a live browser test has passed.

## Final status before launch

- [ ] Secure authentication backend/provider and office/admin role enforcement configured (required before accepting login credentials).
- [ ] Social preview image created, deployed, and tested.
- [ ] Live Lighthouse, accessibility, broken-link, mobile, and browser checks completed.
- [ ] Privacy/Terms reviewed against actual data practices and applicable law.
- [ ] Sitemap, robots, 404, favicon, and all direct page URLs return expected results.
- [ ] No secrets in current files or Git history; any previously exposed secrets rotated.
