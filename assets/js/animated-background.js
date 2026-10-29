/* AnimatedBackground: dependency-free vanilla JS implementation.
   Add data-animated-background to a group and unique data-id values to its direct children.
   data-enable-hover enables pointer hover; data-default-value selects an initial item.
   Listen for animatedbackgroundchange on the group to observe selection changes. */
(() => {
  'use strict';
  const groups = document.querySelectorAll('[data-animated-background]');
  if (!groups.length) return;
  groups.forEach((group) => {
    const items = Array.from(group.querySelectorAll(':scope > [data-id]'));
    if (!items.length) return;
    const seen = new Set();
    const validItems = items.filter((item) => {
      const id = item.getAttribute('data-id');
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    if (!validItems.length) return;
    const indicator = document.createElement('span');
    indicator.className = 'animated-background__indicator';
    indicator.setAttribute('aria-hidden', 'true');
    group.prepend(indicator);
    const hoverEnabled = group.hasAttribute('data-enable-hover');
    let activeId = null;
    let focusedId = null;
    let frame = 0;
    const getItem = (id) => validItems.find((item) => item.getAttribute('data-id') === id) || null;
    const placeIndicator = (item) => {
      if (!item) { indicator.classList.remove('is-visible'); return; }
      const groupRect = group.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const left = itemRect.left - groupRect.left - group.clientLeft + group.scrollLeft;
      const top = itemRect.top - groupRect.top - group.clientTop + group.scrollTop;
      indicator.style.width = itemRect.width + 'px';
      indicator.style.height = itemRect.height + 'px';
      indicator.style.transform = 'translate3d(' + left + 'px,' + top + 'px,0)';
      indicator.classList.add('is-visible');
    };
    const schedulePlacement = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; placeIndicator(getItem(activeId)); });
    };
    const setActive = (id, notify = true) => {
      if (id !== null && !getItem(id)) return;
      const changed = activeId !== id;
      activeId = id;
      validItems.forEach((item) => { item.dataset.checked = String(item.getAttribute('data-id') === activeId); });
      placeIndicator(getItem(activeId));
      if (notify && changed) group.dispatchEvent(new CustomEvent('animatedbackgroundchange', {
        bubbles: true, detail: { value: activeId }
      }));
    };
    validItems.forEach((item) => {
      item.addEventListener('click', () => setActive(item.getAttribute('data-id')));
      item.addEventListener('focus', () => { focusedId = item.getAttribute('data-id'); setActive(focusedId); });
      item.addEventListener('blur', () => {
        focusedId = null;
        if (hoverEnabled && !group.matches(':hover')) setActive(null);
      });
      if (hoverEnabled) item.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') setActive(item.getAttribute('data-id'));
      });
    });
    if (hoverEnabled) {
      group.addEventListener('pointerleave', () => { if (!focusedId) setActive(null); });
      group.addEventListener('focusout', () => requestAnimationFrame(() => {
        if (!group.contains(document.activeElement) && !group.matches(':hover')) {
          focusedId = null;
          setActive(null);
        }
      }));
    }
    const defaultId = group.getAttribute('data-default-value');
    if (defaultId && getItem(defaultId)) setActive(defaultId, false);
    else validItems.forEach((item) => { item.dataset.checked = 'false'; });
    window.addEventListener('resize', schedulePlacement, { passive: true });
    window.addEventListener('scroll', schedulePlacement, { passive: true, capture: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(schedulePlacement);
      observer.observe(group);
      validItems.forEach((item) => observer.observe(item));
    }
  });
})();
