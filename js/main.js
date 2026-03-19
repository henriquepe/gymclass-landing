(() => {
  'use strict';

  // ── Mobile menu toggle ──
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('navbar__links--open');
    toggle.classList.toggle('navbar__toggle--active', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('navbar__links--open');
      toggle.classList.remove('navbar__toggle--active');
    });
  });

  // ── Sticky navbar with blur ──
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('navbar--scrolled', y > 40);
    lastScroll = y;
  }, { passive: true });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Fade-in on scroll (IntersectionObserver) ──
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('fade-in--visible'));
  }

  // ── Animated counters ──
  const counters = document.querySelectorAll('.counter');
  const formatNum = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',') + 'k' : String(n);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const numEl = el.querySelector('.counter__number');
    const duration = 2000;
    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(eased * target);
      numEl.textContent = formatNum(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('faq__item--open');

      // Close all
      document.querySelectorAll('.faq__item--open').forEach(openItem => {
        openItem.classList.remove('faq__item--open');
        openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('faq__item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
