/* Progressive enhancement: content stays visible if JS/observers are unavailable. */
(() => {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('main > section, main .section-head, main .service-card, main .step-card, main .band, main .faq-list, main .trust-item, main .hero > .wrap > div, .trust-strip');
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

  /* Desktop pointer tilt gives the main page a consistent, restrained 3D feel. */
  if (!reduced && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltTargets = document.querySelectorAll('.hero-art, .service-card, .step-card, .design-preview, .three-d-stage, .band, .trust-item');
    tiltTargets.forEach((el) => {
      el.classList.add('si-3d-tilt');
      el.setAttribute('data-si-depth', '');
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const max = el.classList.contains('three-d-stage') ? 5 : 3.5;
        el.style.setProperty('--si-tilt-x', `${(0.5 - y) * max}deg`);
        el.style.setProperty('--si-tilt-y', `${(x - 0.5) * max}deg`);
        el.classList.add('si-tilt-active');
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--si-tilt-x', '0deg');
        el.style.setProperty('--si-tilt-y', '0deg');
        el.classList.remove('si-tilt-active');
      });
    });
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
