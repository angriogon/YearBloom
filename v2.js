(() => {
  'use strict';

  const BLUE = '#2b16f2';
  const TODAY = new Date().toISOString().slice(0, 10);
  let expandedDate = null;
  let enhancing = false;

  function hash(input) {
    let h = 2166136261;
    for (const ch of input) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  const doodles = [
    c => `<path d="M22 35V18M22 18c-7 0-10-9-3-11 4-1 6 2 6 6 1-4 4-6 7-4 5 3 2 10-5 10"/><path d="M18 27c-4-1-6-4-5-7M26 26c5-1 7-5 5-8"/>`,
    c => `<path d="M22 35V20"/><circle cx="22" cy="14" r="6"/><path d="M22 7v14M15 14h14M17 9l10 10M27 9 17 19"/>`,
    c => `<path d="M22 35V21"/><path d="M15 21c-5-2-4-9 2-10 4-1 6 2 6 5 2-5 6-7 10-4 4 4 0 10-6 10"/>`,
    c => `<path d="M14 32c0-7 5-12 11-12 6 0 10 5 10 11"/><path d="M17 20c-2-7 8-11 12-5 1 2 1 4 0 6M18 27h14M20 27v5M27 27v5"/>`,
    c => `<path d="M22 35V18"/><path d="M18 18c-6-4-2-11 3-9 2 1 2 3 1 5 1-5 6-7 9-3 3 4-2 8-7 8"/><path d="M16 26c-4-4-2-8 2-9M28 26c4-4 2-8-2-9"/>`,
    c => `<path d="M22 35V17M22 17c0-6 4-9 10-9M32 8c-5 0-8 3-10 9"/><path d="M18 25c-7-1-8-8-3-10 5-2 7 3 5 7-1 2-1 2-2 3Z"/>`,
    c => `<path d="M22 35c-7-5-10-9-7-14 3-6 10-5 11 0 2-6 9-6 11-1 2 6-7 12-15 15Z"/><path d="M19 12c2-4 7-5 10-1"/>`,
    c => `<path d="M10 27c2-7 8-11 15-11 7 0 11 4 12 11M14 27v5M21 27v5M28 27v5M34 27v5"/><path d="M19 16c-1-5 2-8 7-8 5 1 6 5 4 8"/>`,
    c => `<path d="M22 35V22"/><path d="M22 22c-9-3-8-13 0-13s9 10 0 13Z"/><path d="M22 16c-3-2-4-4-3-7"/>`,
    c => `<circle cx="16" cy="16" r="6"/><circle cx="28" cy="16" r="6"/><path d="M22 20v15M22 16c-2-4-5-6-8-7"/>`,
    c => `<path d="M14 29c0-6 5-10 10-10 6 0 10 4 10 9 0 4-3 6-7 6H19c-3 0-5-2-5-5Z"/><path d="M18 21c-2-5 1-9 6-9 5 0 8 4 7 9"/>`,
    c => `<path d="M11 24c2-8 10-13 18-11 6 1 9 7 6 12-4 7-14 8-21 5"/><path d="M29 13c2-3 5-4 8-3"/>`,
    c => `<path d="M22 35V19M14 19h16M18 19c-2-4-1-8 3-11M26 19c2-4 1-8-3-11"/><path d="M14 27c3-4 6-6 8-6 3 0 6 2 9 6"/>`,
    c => `<path d="M13 20c-2-6 3-10 8-8 2-6 11-5 12 2 6 1 6 9 0 10-3 5-11 7-17 3-4 1-6-3-3-7Z"/>`,
    c => `<path d="M22 35V20"/><path d="M14 20c0-6 4-10 8-10 5 0 9 4 8 10"/><path d="M13 30c3-4 6-6 9-6s7 2 10 6"/>`,
    c => `<path d="M22 35V19"/><path d="M22 19c-8 0-10-9-3-11 4-1 6 2 5 6 2-5 6-7 10-3 4 5-2 9-8 8"/><circle cx="19" cy="12" r="1" fill="${BLUE}"/><circle cx="31" cy="13" r="1" fill="${BLUE}"/>`
  ];

  function doodleSvg(seed, size = 30, faint = false) {
    const inner = doodles[hash(seed) % doodles.length](BLUE);
    return `<svg viewBox="0 0 44 44" width="${size}" height="${size}" aria-hidden="true" style="opacity:${faint ? .35 : 1}"><g fill="none" stroke="${BLUE}" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }

  function dot() {
    return '<i class="v2-day-dot"></i>';
  }

  function enhanceNav(root) {
    const nav = root.querySelector('.nav');
    if (!nav || nav.dataset.v2) return;
    nav.dataset.v2 = '1';
    const buttons = [...nav.querySelectorAll('button')];
    buttons.forEach((button, index) => {
      if (index > 1) button.classList.add('v2-hidden-nav');
      button.querySelector('b')?.replaceChildren();
      const icon = button.querySelector('b');
      if (icon) {
        icon.innerHTML = index === 0
          ? `<span class="v2-garden-nav">${doodleSvg('nav-a', 27)}${doodleSvg('nav-b', 26)}${doodleSvg('nav-c', 25)}</span>`
          : doodleSvg('nav-plant', 32);
      }
    });
  }

  function addTopActions(screen) {
    if (screen.querySelector('.v2-corner-memory')) return;
    const left = document.createElement('button');
    left.className = 'v2-corner v2-corner-memory';
    left.dataset.a = 'tab';
    left.dataset.v = 'memories';
    left.innerHTML = doodleSvg('memory-top', 24);
    left.setAttribute('aria-label', 'Memories');

    const right = document.createElement('button');
    right.className = 'v2-corner v2-corner-settings';
    right.dataset.a = 'tab';
    right.dataset.v = 'settings';
    right.innerHTML = doodleSvg('settings-top', 24);
    right.setAttribute('aria-label', 'Settings');

    screen.append(left, right);
  }

  function enhanceGarden(root) {
    const garden = root.querySelector('.garden');
    if (!garden) return;
    const screen = garden.closest('.screen');
    screen.classList.add('v2-garden-screen');
    addTopActions(screen);

    const year = screen.querySelector('.year');
    if (year) year.classList.add('v2-year-pill');
    screen.querySelector('.head')?.classList.add('v2-head');
    screen.querySelector('.today')?.classList.add('v2-hide');
    screen.querySelector('.stats')?.classList.add('v2-hide');
    screen.querySelector('.progress')?.classList.add('v2-hide');
    screen.querySelector('.months')?.classList.add('v2-hide');

    garden.classList.add('v2-garden');
    garden.querySelectorAll('.plant').forEach((button, index) => {
      const date = button.dataset.v || String(index);
      const isFuture = button.disabled;
      button.classList.add('v2-garden-cell');
      button.innerHTML = isFuture ? dot() : doodleSvg(`${date}-${index}`, index % 11 === 0 ? 31 : 27 + (index % 3));
      if (date === TODAY) button.classList.add('v2-today-cell');
    });

    if (!screen.querySelector('.v2-garden-note')) {
      const note = document.createElement('button');
      note.className = 'v2-garden-note';
      note.dataset.a = 'open';
      note.dataset.v = TODAY;
      note.textContent = 'Plant today';
      garden.insertAdjacentElement('afterend', note);
    }
  }

  function selectedDate(screen) {
    return screen.querySelector('.pill.active')?.dataset.v || TODAY;
  }

  function enhanceJournal(root) {
    const journal = root.querySelector('.journal');
    if (!journal) return;
    const screen = journal.closest('.screen');
    screen.classList.add('v2-today-screen');
    addTopActions(screen);

    const editor = screen.querySelector('.editor');
    editor?.classList.add('v2-editor-head');
    screen.querySelector('.feature')?.classList.add('v2-hide');
    screen.querySelector('.strip')?.classList.add('v2-strip');
    journal.classList.add('v2-journal-sheet');

    const current = selectedDate(screen);
    journal.classList.toggle('v2-collapsed', expandedDate !== current);

    if (!screen.querySelector('.v2-plant-cta')) {
      const cta = document.createElement('button');
      cta.className = 'v2-plant-cta';
      cta.dataset.v2Toggle = '1';
      cta.innerHTML = `<span class="v2-plus">＋</span><span>Plant memory</span>`;
      journal.insertAdjacentElement('beforebegin', cta);
    }

    const cta = screen.querySelector('.v2-plant-cta');
    if (cta) cta.classList.toggle('v2-hide', expandedDate === current);

    screen.querySelectorAll('.pill').forEach((pill) => {
      const day = pill.dataset.v;
      const active = pill.classList.contains('active');
      pill.innerHTML = active ? doodleSvg(day, 42) : doodleSvg(day, 30, !active);
      if (active) pill.classList.add('v2-active-day');
    });
  }

  function enhanceSecondary(root) {
    const screen = root.querySelector('.screen');
    if (!screen) return;
    if (root.querySelector('.memory-list')) screen.classList.add('v2-memories-screen');
    if (root.querySelector('.settings')) screen.classList.add('v2-settings-screen');
  }

  function maybeWelcome() {
    if (localStorage.getItem('yearbloomV2Welcome') === 'done') return;
    if (document.querySelector('.v2-welcome')) return;
    const overlay = document.createElement('div');
    overlay.className = 'v2-welcome';
    overlay.innerHTML = `
      <section class="v2-welcome-sheet">
        <div class="v2-handle"></div>
        <h2>Start ${doodleSvg('welcome-fruit', 52)} planting<br>your memories</h2>
        <div class="v2-free-card">
          <div class="v2-plan-name">YearBloom</div>
          <ul>
            <li>${doodleSvg('benefit-a', 31)}<span>Daily journaling & mood tracking</span></li>
            <li>${doodleSvg('benefit-b', 31)}<span>Add images</span></li>
            <li>${doodleSvg('benefit-c', 31)}<span>All features unlocked</span></li>
            <li>${doodleSvg('benefit-d', 31)}<span>Free for your personal use</span></li>
          </ul>
          <button data-v2-dismiss="1">Start planting</button>
        </div>
      </section>`;
    document.body.appendChild(overlay);
  }

  function enhance() {
    if (enhancing) return;
    enhancing = true;
    try {
      const root = document.querySelector('#app .shell');
      if (!root) return;
      document.body.classList.add('yearbloom-v2');
      enhanceNav(root);
      enhanceGarden(root);
      enhanceJournal(root);
      enhanceSecondary(root);
      maybeWelcome();
    } finally {
      enhancing = false;
    }
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-v2-toggle]');
    if (toggle) {
      const screen = toggle.closest('.screen');
      expandedDate = selectedDate(screen);
      screen.querySelector('.v2-journal-sheet')?.classList.remove('v2-collapsed');
      toggle.classList.add('v2-hide');
      setTimeout(() => screen.querySelector('.v2-journal-sheet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
      return;
    }
    const dismiss = event.target.closest('[data-v2-dismiss]');
    if (dismiss) {
      localStorage.setItem('yearbloomV2Welcome', 'done');
      document.querySelector('.v2-welcome')?.remove();
    }
  }, true);

  const observer = new MutationObserver(() => requestAnimationFrame(enhance));
  observer.observe(document.getElementById('app'), { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', () => setTimeout(enhance, 50));
})();
