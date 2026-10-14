/* Progressive enhancement only. All menu entries and navigation remain visible without JS. */
(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-navigation');

  if (menuToggle && primaryNav) {
    const closeNavigation = (restoreFocus = false) => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      primaryNav.classList.remove('is-open');
      if (restoreFocus) menuToggle.focus();
    };

    menuToggle.addEventListener('click', () => {
      const opened = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!opened));
      menuToggle.setAttribute('aria-label', opened ? 'Open navigation menu' : 'Close navigation menu');
      primaryNav.classList.toggle('is-open', !opened);
      if (!opened) primaryNav.querySelector('a')?.focus();
    });

    primaryNav.addEventListener('click', event => {
      if (event.target.closest('a')) closeNavigation();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeNavigation(true);
      }
    });

    document.addEventListener('click', event => {
      if (!menuToggle.contains(event.target) && !primaryNav.contains(event.target)) closeNavigation();
    });

    const desktopWidth = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => {
      if (desktopWidth.matches) closeNavigation();
    };
    if (desktopWidth.addEventListener) desktopWidth.addEventListener('change', closeOnDesktop);
    else desktopWidth.addListener(closeOnDesktop);
  }

  const filterButtons = [...document.querySelectorAll('.filter-btn[data-filter]')];
  const menuGroups = [...document.querySelectorAll('[data-menu-group]')];
  const filterStatus = document.querySelector('#filter-status');

  if (filterButtons.length && menuGroups.length && filterStatus) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
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
          if (visible) count += group.querySelectorAll('.menu-item').length;
        });
        const label = button.textContent.replace(/\d+/g, '').trim().toLowerCase();
        filterStatus.textContent = chosen === 'all'
          ? `Showing all ${count} selections`
          : `Showing ${count} selections in ${label}`;
      });
    });
  }
})();
