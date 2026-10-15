/* Progressive enhancement only. All menu entries and navigation remain visible without JS. */
(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-navigation');

  if (menuToggle && primaryNav) {
    // Only collapse navigation after its controls are successfully attached.
    document.documentElement.classList.add('js');
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
      const link = event.target.closest('a');
      if (link) {
        closeNavigation();
        // Keep keyboard focus out of the newly collapsed navigation.
        const destination = document.querySelector(link.hash);
        if (destination) {
          destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
        }
      }
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
      });
    });
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
