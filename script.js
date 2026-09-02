/* ============================================================
   PORTFOLIO — MAIN SCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ── LOADER ──────────────────────────────────────────────────
  const loader = document.getElementById('loader');

  function hideLoader() {
    // Start hero animations before loader fades so there's no visible empty gap
    triggerHeroAnimations();
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
  }

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 900);
  });

  // Fallback in case load is slow
  setTimeout(hideLoader, 3000);

  // ── HERO ANIMATIONS (on load) ────────────────────────────────
  function triggerHeroAnimations() {
    document.querySelectorAll('.hero-section .animate-up, .hero-section .hl-inner').forEach(el => {
      el.classList.add('visible');
    });
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
    bar.id = 'scroll-prog';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      z-index: 9999;
      width: 0%;
      transition: width 0.1s linear;
      pointer-events: none;
      background: linear-gradient(90deg, rgba(74,222,128,0.7) 0%, rgba(242,242,242,0.55) 100%);
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (scrollTop / docH) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── CUSTOM CURSOR ────────────────────────────────────────────
  function initCustomCursor() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch');
      return;
    }
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafRing;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    }, { passive: true });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      rafRing = requestAnimationFrame(animateRing);
    }
    rafRing = requestAnimationFrame(animateRing);

    const interactEls = 'a, button, [data-magnetic], .project-card, .cert-item, .nav-pill, .skill-item, canvas';
    document.querySelectorAll(interactEls).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      });
    });
  }

  // ── MAGNETIC HOVER ───────────────────────────────────────────
  function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const str = parseFloat(el.dataset.magneticStrength || '0.3');
      let tX = 0, tY = 0, cX = 0, cY = 0;
      let active = false, raf;

      function tick() {
        cX += (tX - cX) * 0.12;
        cY += (tY - cY) * 0.12;
        el.style.transform = `translate(${cX}px, ${cY}px)`;
        if (active || Math.abs(tX - cX) > 0.05 || Math.abs(tY - cY) > 0.05) {
          raf = requestAnimationFrame(tick);
        } else {
          el.style.transform = '';
        }
      }

      el.addEventListener('mouseenter', () => { active = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); });
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        tX = (e.clientX - (r.left + r.width / 2)) * str;
        tY = (e.clientY - (r.top  + r.height / 2)) * str;
      });
      el.addEventListener('mouseleave', () => { active = false; tX = 0; tY = 0; });
    });
  }

  // ── SCROLL SECTION DOTS ──────────────────────────────────────
  function initScrollDotsNav() {
    const nav = document.getElementById('scrollDotsNav');
    if (!nav) return;

    const sections = [
      { id: 'hero',       label: 'Home' },
      { id: 'work',       label: 'Work' },
      { id: 'experience', label: 'Exp' },
      { id: 'info',       label: 'About' },
      { id: 'contact',    label: 'Contact' },
    ];

    const dots = sections.map(s => {
      const d = document.createElement('div');
      d.className = 'scroll-dot';
      d.dataset.label = s.label;
      d.title = s.label;
      d.addEventListener('click', () => {
        const el = document.getElementById(s.id);
        if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      });
      nav.appendChild(d);
      return d;
    });

    function updateDots() {
      const y = window.scrollY;
      let activeIdx = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && y >= el.offsetTop - 220) activeIdx = i;
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
      nav.classList.toggle('visible', y > 100);
    }

    window.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  }

  // ── TIMELINE DRAW ANIMATION ──────────────────────────────────
  function initTimelineDraw() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('tl-drawn');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.exp-timeline').forEach(t => obs.observe(t));
  }

  // ── HERO AMBIENT GLOW ────────────────────────────────────────
  function initHeroAmbient() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const glow = document.createElement('div');
    glow.className = 'hero-ambient';
    hero.appendChild(glow);
  }

  // ── SOLAR SYSTEM ─────────────────────────────────────────────
  function initStarField() { /* merged into initMissionControl */ }

  function initMissionControl() {
    const canvas = document.getElementById('solar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const MISSIONS = [
      { title:'Helmsmen', subtitle:'DevOps Automation Agent', status:'active', year:2025, color:'#f59e0b', tech:['Claude Sonnet 4.6','Python','GitHub API','Slack API','OSV.dev'], shortDesc:'Autonomous DevOps agent monitoring repos and taking action.', fullDesc:'Autonomous DevOps agent that monitors GitHub repos, detects failing CI, dependency CVEs, and stale PRs, then opens issues and posts Slack digests — all autonomously using a ReAct loop.', features:['ReAct agent loop with Claude Sonnet 4.6','6 pluggable tools (GitHub API, OSV CVE, Slack)','Scheduled monitoring with autonomous issue creation','Production-pattern agentic AI system'], github:'https://github.com/TheRahulKolla/Helmsmen-DevOps_Automation_Agent', badge:null },
      { title:'Smart Document Intelligence', subtitle:null, status:'active', year:2025, color:'#60a5fa', tech:['FastAPI','LangChain','Ollama','SQLite'], shortDesc:'Local LLM platform for PDF querying with RAG workflows.', fullDesc:'End-to-end local platform for intelligent PDF querying and document summarization using LLMs and RAG workflows. Fully local inference with Ollama — no cloud required.', features:['Local LLM inference with Ollama','Vector embeddings for semantic search','FastAPI backend with SQLite vector store','PDF parsing and document chunking'], github:null, badge:null },
      { title:'FERRET Research Agent', subtitle:null, status:'active', year:2024, color:'#34d399', tech:['Python','LLMs','Web Search','FastAPI'], shortDesc:'Autonomous AI research agent with live progress tracking.', fullDesc:'Autonomous AI research agent that searches the web, synthesizes information, and produces structured reports — with a full web UI featuring live progress tracking, batch processing, and error recovery.', features:['Batch processing with queue management','Live progress UI with status updates','Multi-format export (PDF, Markdown, JSON)','Automatic retry on failures'], github:'https://github.com/TheRahulKolla/Ferret-Research-Agent', badge:null },
      { title:'Automated Security Pipeline', subtitle:null, status:'completed', year:2024, color:'#f97316', tech:['Ansible','Wazuh SIEM','Suricata IDS','Linux'], shortDesc:'Automated monitoring pipeline for real-time threat detection.', fullDesc:'Automated monitoring pipeline connecting Wazuh SIEM/XDR and Suricata IDS for real-time threat detection and alerting. Infrastructure provisioned as code with Ansible.', features:['Infrastructure as Code with Ansible','Real-time threat detection dashboard','Custom detection rules and log forwarding','Integrated SIEM and IDS monitoring'], github:null, badge:null },
      { title:'AI Tumor Heterogeneity Detection', subtitle:'Patented Research', status:'completed', year:2022, color:'#a78bfa', tech:['Deep Learning','Computer Vision','Python','PyTorch'], shortDesc:'Patented AI approach for cancer diagnosis using image biomarkers.', fullDesc:'Patented AI-driven approach for quantifying intra-tumor heterogeneity using image-based biomarkers for cancer diagnosis. Novel deep learning classification for clinical research.', features:['Novel image biomarker extraction pipeline','Deep learning classification models','Patent granted — novel AI methodology','Clinical research application'], github:null, badge:'⭐ PATENTED' },
    ];

    const ACTIVITY = [
      { text:'Deployed Helmsmen v1.0 — autonomous DevOps agent live', time:'2 days ago' },
      { text:'FERRET Research Agent — batch processing module shipped', time:'5 days ago' },
      { text:'Smart Document Intelligence — Ollama integration complete', time:'1 week ago' },
      { text:'Security Pipeline — Suricata IDS rules updated', time:'2 weeks ago' },
      { text:'Mission Control interface deployed', time:'Today' },
    ];

    // ── STATE ───────────────────────────────────────────────────
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, cx, cy, sc;
    let selected = null;
    let panelOpen = false;
    let mx = 0, my = 0;
    let raf;

    const BASE_ORBITS = [88, 142, 196, 250, 300];
    const BASE_RADII  = [13, 11,  12,  10,  9  ];
    const SPEEDS      = [0.009, 0.006, 0.004, 0.0028, 0.002];

    // Each planet: angle starts at different offset
    const planets = MISSIONS.map((m, i) => ({
      angle: (i / MISSIONS.length) * Math.PI * 2,
      mission: m,
      orbitR: BASE_ORBITS[i],
      r: BASE_RADII[i],
      speed: SPEEDS[i],
    }));

    // Stars
    const STARS = Array.from({ length: 180 }, () => ({
      xf: Math.random(), yf: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      base: Math.random() * 0.5 + 0.08,
      speed: Math.random() * 0.012 + 0.003,
      phase: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.7 + 0.15,
    }));

    // ── RESIZE ──────────────────────────────────────────────────
    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
      cx = W * 0.5;
      cy = H * 0.5;
      sc = Math.min(W, H) / 620;
    }
    resize();
    window.addEventListener('resize', () => { resize(); }, { passive: true });

    // ── MOUSE ───────────────────────────────────────────────────
    window.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / W - 0.5) * 2;
      my = ((e.clientY - r.top)  / H - 0.5) * 2;
    }, { passive: true });

    // ── HELPERS ─────────────────────────────────────────────────
    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return `${r},${g},${b}`;
    }

    // ── DRAW STARS ──────────────────────────────────────────────
    function drawStars(t) {
      STARS.forEach(s => {
        const px = (s.xf + mx * 0.014 * s.depth) * W;
        const py = (s.yf + my * 0.014 * s.depth) * H;
        const alpha = s.base * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,242,242,${alpha.toFixed(2)})`;
        ctx.fill();
      });
    }

    // ── DRAW SUN ────────────────────────────────────────────────
    function drawSun(t) {
      const pulse = 1 + Math.sin(t * 0.8) * 0.06;
      const sunR  = 26 * sc * pulse;

      // Outer corona
      const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 4.5);
      corona.addColorStop(0,   'rgba(255,210,80,0.18)');
      corona.addColorStop(0.4, 'rgba(255,160,30,0.07)');
      corona.addColorStop(1,   'rgba(255,100,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      // Inner glow
      const inner = ctx.createRadialGradient(cx - sunR*0.25, cy - sunR*0.25, 0, cx, cy, sunR);
      inner.addColorStop(0,   '#fffce8');
      inner.addColorStop(0.35,'#ffd060');
      inner.addColorStop(0.7, '#ff9020');
      inner.addColorStop(1,   'rgba(255,80,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fillStyle = inner;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = '#fffef0';
      ctx.fill();
    }

    // ── DRAW ORBIT ──────────────────────────────────────────────
    function drawOrbit(r, isSelected) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? 'rgba(242,242,242,0.1)' : 'rgba(242,242,242,0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── DRAW PLANET ─────────────────────────────────────────────
    function drawPlanet(p, isHovered, isSel, t) {
      const orb = p.orbitR * sc;
      const r   = p.r * sc;
      const px  = cx + Math.cos(p.angle) * orb;
      const py  = cy + Math.sin(p.angle) * orb;
      const rgb = hexToRgb(p.mission.color);

      // Glow
      ctx.shadowColor = p.mission.color;
      ctx.shadowBlur  = isSel ? 28 : isHovered ? 18 : 8;

      // Planet gradient
      const gr = ctx.createRadialGradient(px - r*0.3, py - r*0.35, 0, px, py, r);
      gr.addColorStop(0, `rgba(${rgb},1)`);
      gr.addColorStop(0.6, p.mission.color);
      gr.addColorStop(1, `rgba(${rgb},0.55)`);

      const drawR = r * (isSel ? 1.2 : isHovered ? 1.08 : 1);
      ctx.beginPath();
      ctx.arc(px, py, drawR, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      const labelY = py + drawR + 14 * sc;
      const name   = p.mission.title.length > 22
        ? p.mission.title.slice(0, 20) + '…'
        : p.mission.title;
      ctx.font = `${Math.max(9, 10 * sc)}px JetBrains Mono, monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = isHovered || isSel
        ? `rgba(242,242,242,0.85)`
        : `rgba(242,242,242,0.38)`;
      ctx.fillText(name, px, labelY);

      return { px, py, r: drawR };
    }

    // ── HIT TEST ────────────────────────────────────────────────
    function hitTest(ex, ey) {
      for (let i = 0; i < planets.length; i++) {
        const p   = planets[i];
        const orb = p.orbitR * sc;
        const px  = cx + Math.cos(p.angle) * orb;
        const py  = cy + Math.sin(p.angle) * orb;
        const r   = p.r * sc * 1.6;
        if (Math.hypot(ex - px, ey - py) < r) return i;
      }
      return -1;
    }

    // ── PANEL ───────────────────────────────────────────────────
    const panel   = document.getElementById('planet-panel');
    const content = document.getElementById('planet-panel-content');
    const closeBtn = document.getElementById('planet-panel-close');
    const hint     = document.querySelector('.universe-hint');

    let hoveredIdx = -1;
    let closeTimer = null;

    function cancelClose() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function scheduleClose() {
      cancelClose();
      closeTimer = setTimeout(() => {
        hoveredIdx = -1;
        closePanel();
      }, 200);
    }

    // ── CANVAS HOVER ────────────────────────────────────────────
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const ex   = e.clientX - rect.left;
      const ey   = e.clientY - rect.top;
      const hit  = hitTest(ex, ey);
      canvas.style.cursor = hit >= 0 ? 'pointer' : 'default';

      if (hit >= 0) {
        cancelClose();
        if (hit !== hoveredIdx) {
          hoveredIdx = hit;
          openPanel(hit);
        }
      } else if (hoveredIdx >= 0) {
        scheduleClose();
      }
    });

    canvas.addEventListener('mouseleave', () => {
      if (hoveredIdx >= 0) scheduleClose();
    });

    // Keep the panel open while the cursor is over it (it visually sits
    // on top of the canvas, so moving into it counts as leaving the canvas).
    panel.addEventListener('mouseenter', cancelClose);
    panel.addEventListener('mouseleave', () => {
      if (hoveredIdx >= 0) scheduleClose();
    });

    // Touch fallback: tap a planet to open/close its panel.
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const ex   = e.clientX - rect.left;
      const ey   = e.clientY - rect.top;
      const hit  = hitTest(ex, ey);
      if (hit >= 0) {
        cancelClose();
        hoveredIdx = hit;
        openPanel(hit);
      } else if (panelOpen) {
        hoveredIdx = -1;
        closePanel();
      }
    });

    function openPanel(idx) {
      selected = idx;
      panelOpen = true;
      const m = MISSIONS[idx];
      const sLabel = m.status === 'active' ? 'ACTIVE' : 'COMPLETED';
      const feats = m.features.map(f => `<li>${f}</li>`).join('');
      const tags  = m.tech.map(t => `<span class="pp-tag">${t}</span>`).join('');
      const link  = m.github
        ? `<a class="pp-link" href="${m.github}" target="_blank" rel="noopener">GitHub Repo ↗</a>`
        : `<span class="pp-private">Private repository</span>`;
      const badge = m.badge ? `<div class="pp-badge">${m.badge}</div>` : '';
      const sub   = m.subtitle ? `<div class="pp-subtitle">${m.subtitle}</div>` : '';

      content.innerHTML = `
        <div class="pp-label">
          <span class="pp-dot ${m.status}"></span>
          <span>${sLabel} · ${m.year}</span>
        </div>
        <div class="pp-title">${m.title}</div>
        ${sub}${badge}
        <div class="pp-desc">${m.fullDesc}</div>
        <div class="pp-section">Key Features</div>
        <ul class="pp-features">${feats}</ul>
        <div class="pp-section">Tech Stack</div>
        <div class="pp-tags">${tags}</div>
        ${link}`;

      panel.classList.add('open');
      if (hint) hint.classList.add('hidden');
    }

    function closePanel() {
      selected = null;
      panelOpen = false;
      panel.classList.remove('open');
      if (hint) hint.classList.remove('hidden');
    }

    closeBtn?.addEventListener('click', () => {
      cancelClose();
      hoveredIdx = -1;
      closePanel();
    });

    // ── RENDER LOOP ─────────────────────────────────────────────
    let last = 0;
    function draw(ts) {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      const slow = panelOpen ? 0.15 : 1;

      ctx.clearRect(0, 0, W, H);

      // Stars
      drawStars(ts * 0.001);

      // Update angles
      planets.forEach(p => { p.angle += p.speed * slow; });

      // Orbits
      planets.forEach((p, i) => drawOrbit(p.orbitR * sc, i === selected));

      // Sun
      drawSun(ts * 0.001);

      // Planets (check hover each frame)
      const rect = canvas.getBoundingClientRect();
      const hovX = mx * W * 0.5 + rect.left;
      const hovY = my * H * 0.5 + rect.top;

      planets.forEach((p, i) => {
        const orb = p.orbitR * sc;
        const px  = cx + Math.cos(p.angle) * orb;
        const py  = cy + Math.sin(p.angle) * orb;
        const hover = Math.hypot(hovX - rect.left - px, hovY - rect.top - py) < p.r * sc * 1.8;
        drawPlanet(p, hover, i === selected, ts * 0.001);
      });

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    // ── ACTIVITY FEED ───────────────────────────────────────────
    const list = document.getElementById('mc-activity-list');
    if (list) {
      ACTIVITY.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'mc-activity-item';
        li.innerHTML = `<span class="mc-activity-prompt">›</span><span class="mc-activity-text">${item.text}</span><span class="mc-activity-time">${item.time}</span>`;
        list.appendChild(li);
        setTimeout(() => li.classList.add('mc-visible'), 900 + i * 350);
      });
    }
  }

  // ── PDF VIEWER URL HELPER ─────────────────────────────────────
  function pdfViewerUrl(relativePath) {
    const loc = window.location;
    const base = loc.origin + loc.pathname.replace(/\/[^/]*$/, '/');
    const full = encodeURIComponent(base + relativePath);
    return `https://docs.google.com/viewer?url=${full}&embedded=true`;
  }

  // ── RESUME MODAL ─────────────────────────────────────────────
  function initResumeModal() {
    const modal    = document.getElementById('resume-modal');
    const frame    = document.getElementById('resumeFrame');
    const closeBtn = document.getElementById('resumeClose');
    const backdrop = document.getElementById('resumeBackdrop');
    const triggers = document.querySelectorAll('[data-resume-trigger]');

    function openResume() {
      frame.src = pdfViewerUrl('assests/Rahul-Resume.pdf');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeResume() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { frame.src = ''; }, 260);
    }

    triggers.forEach(t => t.addEventListener('click', openResume));
    closeBtn.addEventListener('click', closeResume);
    backdrop.addEventListener('click', closeResume);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeResume();
    });
  }

  // ── CERTIFICATE MODAL ────────────────────────────────────────
  function initCertModal() {
    const modal   = document.getElementById('cert-modal');
    const backdrop = modal.querySelector('.cert-modal-backdrop');
    const closeBtn = modal.querySelector('.cert-modal-close');
    const content  = modal.querySelector('.cert-modal-content');

    function openModal(src, type) {
      const viewSrc = type === 'image' ? src : pdfViewerUrl(src);
      content.innerHTML = type === 'image'
        ? `<img src="${viewSrc}" alt="Certificate" />`
        : `<iframe src="${viewSrc}" title="Certificate"></iframe>`;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { content.innerHTML = ''; }, 260);
    }

    document.querySelectorAll('.cert-item[data-cert]').forEach(item => {
      item.addEventListener('click', () => {
        openModal(item.dataset.cert, item.dataset.certType);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── INIT ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initObservers();
    initSmoothScroll();
    initMobileMenu();
    initProjectCards();
    initParallax();
    initCardStagger();
    initScrollProgress();
    initMissionControl();
    initResumeModal();
    initCertModal();
    updateNav();
    // v2 enhancements
    initCustomCursor();
    initMagnetic();
    initScrollDotsNav();
    initTimelineDraw();
    initHeroAmbient();
  });

})();
