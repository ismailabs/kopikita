/* Progressive enhancement only. All menu entries and navigation remain visible without JS. */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const filterButtons = [...document.querySelectorAll('.filter-btn[data-filter]')];
  const menuGroups = [...document.querySelectorAll('[data-menu-group]')];
  const filterStatus = document.querySelector('#filter-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (filterButtons.length && menuGroups.length && filterStatus) {
    const applyFilter = button => {
        const chosen = button.dataset.filter;
        filterButtons.forEach(option => {
          const active = option === button;
          option.setAttribute('aria-pressed', String(active));
          option.classList.toggle('is-active', active);
        });
        let count = 0;
        menuGroups.forEach(group => {
          const visible = chosen === 'all' || group.dataset.menuGroup === chosen;
          group.hidden = !visible;
          group.getAnimations().forEach(animation => animation.cancel());
          if (visible) {
            count += group.querySelectorAll('.menu-item').length;
            if (!reducedMotion.matches && group.animate) {
              group.animate([{ opacity: .5, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
            }
          }
        });
        const label = button.textContent.replace(/\d+/g, '').trim().toLowerCase();
        filterStatus.textContent = chosen === 'all'
          ? `Showing all ${count} selections`
          : `Showing ${count} selections in ${label}`;
    };
    filterButtons.forEach(button => {
      button.addEventListener('click', () => applyFilter(button));
    });
    // A featured link reveals the correct category before following its real anchor.
    document.querySelectorAll('[data-menu-target]').forEach(link => {
      link.addEventListener('click', () => {
        const button = filterButtons.find(option => option.dataset.filter === link.dataset.category);
        if (button) applyFilter(button);
        const destination = document.getElementById(link.dataset.menuTarget);
        if (destination) {
          destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
        }
      });
    });
    const revealHash = () => {
      const destination = document.getElementById(location.hash.slice(1));
      const group = destination?.closest('[data-menu-group]');
      if (group?.hidden) {
        const button = filterButtons.find(option => option.dataset.filter === group.dataset.menuGroup);
        if (button) applyFilter(button);
        destination.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    };
    window.addEventListener('hashchange', revealHash);
    revealHash();
  }

  const ticker = document.querySelector('.ticker');
  const tickerToggle = document.querySelector('.ticker-toggle');
  if (ticker && tickerToggle) {
    tickerToggle.hidden = false;
    tickerToggle.addEventListener('click', () => {
      const paused = tickerToggle.getAttribute('aria-pressed') !== 'true';
      tickerToggle.setAttribute('aria-pressed', String(paused));
      tickerToggle.setAttribute('aria-label', paused ? 'Resume moving text' : 'Pause moving text');
      tickerToggle.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
      ticker.classList.toggle('is-paused', paused);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        ticker.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(ticker);
    }
  }

  // Content starts visible. Entrance animations run once when it comes into view;
  // a missing script or observer never leaves a section hidden.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches) entry.target.classList.add('has-entered');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.story-copy, .story-photo-wrap, .section-title-row, .signature-card, .menu-top, .atmosphere-text, .atmosphere-photos, .studio-note-inner').forEach(element => observer.observe(element));
  }
  document.addEventListener('visibilitychange', () => {
    ticker?.classList.toggle('is-document-hidden', document.hidden);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      document.querySelectorAll('[data-menu-group]').forEach(group => group.getAnimations().forEach(animation => animation.cancel()));
    }
  });
})();
