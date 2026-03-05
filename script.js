/* ============================================================
   PORTFOLIO — MAIN SCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ── LOADER ──────────────────────────────────────────────────
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Trigger hero animations after loader hides
    setTimeout(triggerHeroAnimations, 100);
  }

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 900);
  });

  // Fallback in case load is slow
  setTimeout(hideLoader, 3000);

  // ── HERO ANIMATIONS (on load) ────────────────────────────────
  function triggerHeroAnimations() {
    const heroEls = document.querySelectorAll('.hero-section .animate-up');
    heroEls.forEach(el => el.classList.add('visible'));
  }

  // ── SCROLL OBSERVER (all other sections) ────────────────────
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animate-up elements NOT in hero (hero is triggered by loader)
  function initObservers() {
    document.querySelectorAll('.animate-up:not(.hero-section .animate-up)').forEach(el => {
      observer.observe(el);
    });
  }

  // ── NAV SCROLL BEHAVIOR ──────────────────────────────────────
  const nav = document.getElementById('nav');
  const navPills = document.querySelectorAll('.nav-pill');

  function updateNav() {
    const scrollY = window.scrollY;

    // Active nav pill based on current section
    const sections = ['hero', 'work', 'experience', 'info', 'contact'];
    let current = 'hero';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) {
        current = id;
      }
    });

    // If near the bottom of the page, force contact active
    const nearBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 80;
    if (nearBottom) current = 'contact';

    // Map section IDs to nav pill scroll-to targets
    const sectionToNav = {
      hero: '',
      work: 'work',
      experience: 'work',
      info: 'info',
      contact: 'contact',
    };

    navPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.scrollTo === sectionToNav[current]);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  // ── SMOOTH SCROLL NAV LINKS ──────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('[data-scroll-to]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.scrollTo);
        if (target) {
          const offset = target.offsetTop - 72;
          window.scrollTo({ top: offset, behavior: 'smooth' });
          // Close mobile menu if open
          closeMobileMenu();
        }
      });
    });

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ── MOBILE MENU ──────────────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  function openMobileMenu() {
    menuOpen = true;
    menuToggle.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuOpen = false;
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    if (!menuToggle) return;
    menuToggle.addEventListener('click', () => {
      menuOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) closeMobileMenu();
    });
  }


  // ── PROJECT CARD INTERACTIONS ────────────────────────────────
  function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        // Placeholder — replace href with actual project link
        const link = card.dataset.href;
        if (link) {
          card.style.opacity = '0.6';
          card.style.transform = 'scale(0.98)';
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          setTimeout(() => {
            window.open(link, '_blank', 'noopener');
            card.style.opacity = '';
            card.style.transform = '';
          }, 300);
        }
      });
    });
  }

  // ── PARALLAX DECO CIRCLES ────────────────────────────────────
  function initParallax() {
    const deco1 = document.querySelector('.deco-1');
    const deco2 = document.querySelector('.deco-2');
    if (!deco1 || !deco2) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      deco1.style.transform = `translateY(calc(-50% + ${y * 0.06}px))`;
      deco2.style.transform = `translateY(calc(-50% + ${y * 0.1}px))`;
    }, { passive: true });
  }

  // ── STAGGER CARD DELAYS ──────────────────────────────────────
  function initCardStagger() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
      card.style.transitionDelay = (i * 0.08) + 's';
    });
  }

  // ── TYPING EFFECT (optional hero sub-text) ───────────────────
  function initTypingCursor() {
    // Subtle blinking cursor after hero headline
    const headline = document.querySelector('.hero-headline');
    if (!headline) return;
    const blink = document.createElement('span');
    blink.style.cssText = `
      display: inline-block;
      width: 3px;
      height: 0.85em;
      background: currentColor;
      margin-left: 6px;
      vertical-align: middle;
      opacity: 0.6;
      animation: blinkCursor 1.1s step-end infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes blinkCursor { 0%,100%{opacity:0.6} 50%{opacity:0} }`;
    document.head.appendChild(style);
    headline.appendChild(blink);

    // Remove blink after a while
    setTimeout(() => blink.remove(), 4000);
  }

  // ── SCROLL PROGRESS BAR ──────────────────────────────────────
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: rgba(242,242,242,0.5);
      z-index: 9999;
      width: 0%;
      transition: width 0.1s linear;
      pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (scrollTop / docH) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── INIT ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initObservers();
    initSmoothScroll();
    initMobileMenu();
    initProjectCards();
    initParallax();
    initCardStagger();
    initTypingCursor();
    initScrollProgress();
    updateNav();
  });

})();
