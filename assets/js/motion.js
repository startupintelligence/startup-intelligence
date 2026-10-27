/* Progressive enhancement: content stays visible if JS/observers are unavailable. */
(() => {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('main .section-head, main .service-card, main .step-card, main .band, main .faq-list, main .trust-item, main .hero > .wrap > div');
    targets.forEach((el) => {
      if (el.closest('header, footer')) return;
      el.setAttribute('data-si-reveal', '');
      const parent = el.parentElement;
      if (parent && (parent.classList.contains('card-grid') || parent.classList.contains('process-grid'))) parent.classList.add('si-stagger');
    });
    if (targets.length) {
      document.documentElement.classList.add('si-reveal-ready');
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
      targets.forEach((el) => { if (el.hasAttribute('data-si-reveal')) observer.observe(el); });
    }
  }
  /* Press feedback only; no fake loading or success states. */
  document.addEventListener('pointerdown', (event) => {
    const control = event.target.closest('a.button, button.button');
    if (control) control.classList.add('si-pressed');
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => {
    document.addEventListener(name, (event) => {
      const control = event.target.closest && event.target.closest('a.button, button.button');
      if (control) control.classList.remove('si-pressed');
    }, true);
  });
})();
