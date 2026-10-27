(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-site-nav]');
  let saved = null;
  try { saved = localStorage.getItem('si-theme'); } catch (_) {}
  const initial = saved === 'light' || saved === 'dark' ? saved : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const setTheme = theme => {
    root.dataset.theme = theme;
    if (themeButton) { themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); themeButton.querySelector('.theme-label')?.replaceChildren(document.createTextNode(theme === 'dark' ? 'Light' : 'Dark')); }
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = theme === 'dark' ? '#070b11' : '#f5f8fc';
  };
  setTheme(initial);
  themeButton?.addEventListener('click', () => { const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(next); try { localStorage.setItem('si-theme', next); } catch (_) {} });
  const closeMenu = () => { menu?.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Open navigation menu'); };
  menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu'); menu?.classList.toggle('is-open', open); });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) {
      closeMenu();
      menuButton?.focus();
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
  const search = document.querySelector('[data-catalog-search]');
  const category = document.querySelector('[data-catalog-category]');
  const sort = document.querySelector('[data-catalog-sort]');
  const cards = [...document.querySelectorAll('[data-catalog-card]')];
  const count = document.querySelector('[data-catalog-count]');
  const empty = document.querySelector('[data-catalog-empty]');
  let activeCategory = 'all';
  const renderCatalog = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const selected = category?.value || activeCategory;
    let visible = 0;
    const ordered = [...cards].sort((a,b) => (sort?.value === 'name' ? a.dataset.name.localeCompare(b.dataset.name) : sort?.value === 'category' ? a.dataset.category.localeCompare(b.dataset.category) || a.dataset.name.localeCompare(b.dataset.name) : Number(b.dataset.featured) - Number(a.dataset.featured)));
    ordered.forEach(card => {
      const matches = (selected === 'all' || card.dataset.category === selected) && (card.dataset.name + ' ' + card.dataset.category + ' ' + card.dataset.keywords).toLowerCase().includes(query);
      card.hidden = !matches; if (matches) visible++;
      card.parentElement.appendChild(card);
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'design direction' : 'design directions'}`;
    if (empty) empty.hidden = visible !== 0;
  };
  search?.addEventListener('input', renderCatalog); category?.addEventListener('change', renderCatalog); sort?.addEventListener('change', renderCatalog);
  document.querySelectorAll('[data-category-filter]').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.categoryFilter; if (category) category.value = activeCategory; document.querySelectorAll('[data-category-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); renderCatalog(); }));
  if (cards.length) renderCatalog();
})();
