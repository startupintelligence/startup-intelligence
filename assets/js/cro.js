(() => {
  const selector = document.querySelector('#theme-select');
  if (!selector) return;
  const allowed = new Set(['light', 'dark', 'midnight', 'forest']);
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const colors = { light: '#f5f5f0', dark: '#080e16', midnight: '#111318', forest: '#f5efe3' };
  let saved = '';
  try { saved = localStorage.getItem('si-theme') || ''; } catch {}
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(theme, save = false) {
    if (!allowed.has(theme)) theme = 'light';
    root.dataset.theme = theme;
    selector.value = theme;
    if (metaThemeColor) metaThemeColor.setAttribute('content', colors[theme]);
    if (save) { try { localStorage.setItem('si-theme', theme); } catch {} }
  }
  applyTheme(allowed.has(saved) ? saved : (systemDark ? 'dark' : 'light'));
  selector.addEventListener('change', () => applyTheme(selector.value, true));
})();

(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const budgetRange = document.querySelector('#budget-range');
  const budgetValue = document.querySelector('#budget-value');
  const budgetOptions = ['₹5,000–₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000+'];
  if (budgetRange && budgetValue) {
    const updateBudget = () => { budgetValue.textContent = budgetOptions[Number(budgetRange.value)]; };
    budgetRange.addEventListener('input', updateBudget);
    updateBudget();
  }

  const budgetSelect = document.querySelector('#budget-select');
  const customBudgetWrap = document.querySelector('#custom-budget-wrap');
  const customBudgetInput = document.querySelector('#custom-budget');
  function syncCustomBudget() {
    if (!budgetSelect || !customBudgetWrap || !customBudgetInput) return;
    const isCustom = budgetSelect.value === 'custom';
    customBudgetWrap.hidden = !isCustom;
    customBudgetInput.required = isCustom;
    if (!isCustom) customBudgetInput.setCustomValidity('');
  }
  if (budgetSelect) {
    budgetSelect.addEventListener('change', syncCustomBudget);
    syncCustomBudget();
  }

  const form = document.querySelector('#discovery-form');
  if (!form) return;
  const steps = [...form.querySelectorAll('.wizard-step')];
  const fill = form.querySelector('#progress-fill');
  const stepLabel = form.querySelector('#step-label');
  const back = form.querySelector('#back-button');
  const next = form.querySelector('#next-button');
  const submit = form.querySelector('#submit-button');
  const error = form.querySelector('#form-error');
  const result = form.querySelector('#form-result');
  let current = 1;

  function showStep(n, moveFocus = false) {
    current = n;
    steps.forEach(el => { el.hidden = Number(el.dataset.step) !== n; });
    fill.style.width = `${(n / steps.length) * 100}%`;
    form.querySelector('.progress')?.setAttribute('aria-valuenow', String(n));
    stepLabel.textContent = `STEP ${n} OF ${steps.length}`;
    const legend = steps.find(el => Number(el.dataset.step) === n)?.querySelector('legend');
    if (moveFocus && legend) { legend.tabIndex = -1; legend.focus({ preventScroll: true }); }
    back.hidden = n === 1;
    next.hidden = n === steps.length;
    submit.hidden = n !== steps.length;
    error.hidden = true;
    error.textContent = '';
  }
  function showError(message) { error.textContent = message; error.hidden = false; }
  function selectedGoal() { return form.querySelector('input[name="goal"]:checked'); }

  form.querySelectorAll('[data-select-goal]').forEach(button => button.addEventListener('click', () => {
    const goal = button.dataset.selectGoal;
    const radio = [...form.querySelectorAll('input[name="goal"]')].find(input => input.value === goal);
    if (radio) radio.checked = true;
    showStep(1, true);
    document.querySelector('#discovery').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));

  next.addEventListener('click', () => {
    if (current === 1 && !selectedGoal()) { showError('Choose the goal that matters most, or select “I’m not sure yet”.'); return; }
    if (current === 2) {
      if (budgetSelect && budgetSelect.value === 'custom') {
        const amount = Number(customBudgetInput?.value);
        if (!customBudgetInput?.value || !Number.isFinite(amount) || amount < 5000) {
          showError('Enter a custom budget of at least ₹5,000.');
          customBudgetInput?.focus();
          return;
        }
      }
      const website = form.querySelector('#website').value.trim();
      if (website) {
        try {
          const parsed = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
          if (!parsed.hostname.includes('.')) throw new Error('Invalid URL');
        } catch { showError('Enter a valid website URL, or leave it blank.'); return; }
      }
    }
    showStep(Math.min(steps.length, current + 1), true);
  });
  back.addEventListener('click', () => showStep(Math.max(1, current - 1), true));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.querySelector('#lead-name');
    const email = form.querySelector('#lead-email');
    if (!name.value.trim()) { showError('Enter your name to continue.'); name.focus(); return; }
    if (!email.validity.valid || !email.value.trim()) { showError('Enter a valid email address.'); email.focus(); return; }
    const data = {
      goal: selectedGoal()?.value || 'Not selected',
      website: form.querySelector('#website').value.trim() || 'Not provided',
      budget: budgetSelect?.value === 'custom' ? `₹${Number(customBudgetInput.value).toLocaleString('en-IN')} (custom)` : (budgetSelect?.value || 'Not selected'),
      name: name.value.trim(),
      email: email.value.trim()
    };
    const subject = 'Discovery call request — Startup Intelligence';
    const body = [
      'Hello Startup Intelligence,',
      '',
      'I would like to request a discovery call. Please contact me to arrange a suitable time.',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Primary goal: ${data.goal}`,
      `Website: ${data.website}`,
      `Indicative budget: ${data.budget}`,
      '',
      'I understand this email does not book a calendar slot; the time will be confirmed separately.'
    ].join(String.fromCharCode(10));
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:startupintelligence1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailLink.textContent = 'Open email draft';
    result.replaceChildren();
    const message = document.createElement('p');
    message.textContent = `Your email draft is ready, ${data.name}. Review it and choose Send in your email app. This does not reserve a time, and this website has not sent or stored your details.`;
    result.append(message, emailLink);
    result.hidden = false;
    result.tabIndex = -1;
    result.focus();
  });
  showStep(1);
})();
