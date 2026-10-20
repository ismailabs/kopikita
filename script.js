/* Progressive enhancement only. All menu entries and navigation remain visible without JS. */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const filterButtons = [...document.querySelectorAll('.filter-btn[data-filter]')];
  const menuGroups = [...document.querySelectorAll('[data-menu-group]')];
  const filterStatus = document.querySelector('#filter-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (filterButtons.length && menuGroups.length && filterStatus) {
    const applyFilter = (button, updateUrl = true) => {
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
              group.animate([{ transform: 'translateY(10px)' }, { transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
            }
          }
        });
        const label = button.textContent.replace(/\d+/g, '').trim().toLowerCase();
        filterStatus.textContent = chosen === 'all'
          ? `Showing all ${count} selections`
          : `Showing ${count} selections in ${label}`;
        if (updateUrl) {
          const url = new URL(location.href);
          if (chosen === 'all') url.searchParams.delete('category');
          else url.searchParams.set('category', chosen);
          history.replaceState(null, '', url);
        }
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
    const initialCategory = new URL(location.href).searchParams.get('category');
    const initialButton = filterButtons.find(button => button.dataset.filter === initialCategory);
    if (initialButton) applyFilter(initialButton, false);
    revealHash();
    window.addEventListener('popstate', () => {
      const category = new URL(location.href).searchParams.get('category') || 'all';
      const button = filterButtons.find(option => option.dataset.filter === category) || filterButtons[0];
      applyFilter(button, false);
      revealHash();
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

  class MotionDirector {
    constructor() {
      this.animations = new Map();
      this.abort = new AbortController();
      this.signal = this.abort.signal;
      this.toggle = document.querySelector('.motion-toggle');
      this.paused = this.toggle?.getAttribute('aria-pressed') === 'true';
    }
    animate(element, frames, options) {
      if (!element?.animate || reducedMotion.matches || this.paused) return;
      const animation = element.animate(frames, {duration: 950, easing: 'cubic-bezier(.22,1,.36,1)', ...options});
      this.animations.set(animation, element);
      animation.finished.catch(() => {}).finally(() => this.animations.delete(animation));
      return animation;
    }
    sync() {
      document.documentElement.classList.toggle('motion-paused', this.paused);
      for (const [animation, element] of this.animations) {
        const scene = element.closest('.motion-scene');
        if (this.paused || document.hidden || scene?.dataset.offscreen === 'true') animation.pause();
        else animation.play();
      }
    }
    settle() {
      for (const animation of this.animations.keys()) animation.cancel();
      this.animations.clear();
    }
    init() {
      if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
      this.toggle.hidden = false;
      this.toggle.addEventListener('click', () => {
        this.paused = !this.paused;
        this.toggle.setAttribute('aria-pressed', String(this.paused));
        this.toggle.textContent = this.paused ? 'Resume motion' : 'Pause motion';
        this.sync();
      }, {signal:this.signal});
      document.addEventListener('visibilitychange', () => this.sync(), {signal:this.signal});
      reducedMotion.addEventListener('change', () => {if (reducedMotion.matches) this.settle();}, {signal:this.signal});
      this.observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const element = entry.target;
          if (element.matches('.motion-scene')) element.dataset.offscreen = String(!entry.isIntersecting);
          if (!entry.isIntersecting || element.dataset.directed) continue;
          element.dataset.directed = 'true';
          if (element.matches('.studio-note')) {
            element.querySelectorAll('.studio-word').forEach((word,index) => this.animate(word, [{transform:`translateX(${index ? 80 : -80}px) rotate(${index ? 2 : -2}deg)`},{transform:'translateX(0) rotate(0deg)'}],{duration:1500,delay:index*100}));
          } else if (element.matches('.product-image')) {
            this.animate(element.querySelector('img'),[{transform:'scale(1.07) translateY(8px)'},{transform:'scale(1) translateY(0)'}],{duration:1100});
          } else if (!element.matches('.motion-scene')) {
            this.animate(element,[{transform:'translateY(24px)'},{transform:'translateY(0)'}]);
          }
        }
        this.sync();
      },{threshold:.12});
      document.querySelectorAll('.motion-scene,.story-heading,.story-copy,.section-heading,.ritual-link,.menu-top,.category-heading,.product-image,.print-image,.print-copy').forEach(element=>this.observer.observe(element));
      this.animate(document.querySelector('.hero-picture img'),[{transform:'scale(1.10) translateY(-12px)'},{transform:'scale(1) translateY(0)'}],{duration:3200});
      document.querySelectorAll('.hero-word').forEach((word,index)=>this.animate(word,[{transform:`translateX(${index ? 48 : -48}px)`},{transform:'translateX(0)'}],{duration:1600,delay:180+index*180}));
      this.animate(document.querySelector('.pour-line'),[{transform:'scaleY(.05) translateY(-60px)'},{transform:'scaleY(1) translateY(0)'}],{duration:2400});
      window.addEventListener('pagehide', () => this.destroy(),{signal:this.signal});
    }
    destroy() { this.settle(); this.observer?.disconnect(); this.abort.abort(); }
  }
  new MotionDirector().init();
  window.addEventListener('pageshow', event => {
    if (event.persisted) new MotionDirector().init();
  });
})();
