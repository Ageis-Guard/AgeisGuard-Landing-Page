'use strict';

(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mx = -200, my = -200;
  let tx = -200, ty = -200;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.13;
    ty += (my - ty) * 0.13;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale up on interactive elements
  document.querySelectorAll('a, button, .feature-card, .price-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });
})();

(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;
  const PRIMARY = [59, 126, 255];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.4 + 0.4;
      this.a  = Math.random() * 0.5 + 0.05;
      this.da = (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if (this.a <= 0.03 || this.a >= 0.55) this.da *= -1;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PRIMARY[0]},${PRIMARY[1]},${PRIMARY[2]},${Math.max(0, this.a)})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${PRIMARY[0]},${PRIMARY[1]},${PRIMARY[2]},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    btn.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    btn.querySelectorAll('span')[1].style.opacity   = isOpen ? '0' : '';
    btn.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
})();


(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


(function initTypewriter() {
  const target = document.getElementById('typewriter-target');
  const cursor = document.getElementById('typewriter-cursor');
  if (!target || !cursor) return;

  const words = ['Player Intent', 'Movement Entropy', 'Behavioral Patterns', 'Cheat Signatures', 'Player Intent'];
  let wIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function tick() {
    const word = words[wIdx];

    if (paused) {
      paused = false;
      return setTimeout(tick, 3600);
    }

    if (!deleting) {
      charIdx++;
      target.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        paused = true;
        deleting = true;
        return setTimeout(tick, 80);
      }
      setTimeout(tick, 65 + Math.random() * 50);
    } else {
      charIdx--;
      target.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        setTimeout(tick, 420);
      } else {
        setTimeout(tick, 35 + Math.random() * 20);
      }
    }
  }

  setTimeout(tick, 1800);
})();


(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || (target % 1 !== 0 ? 1 : 0));
      const duration = 1600;
      const start    = performance.now();

      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        const val = (eased * target).toFixed(decimals);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


(function initTerminal() {
  const body = document.getElementById('terminal-body');
  const discord = document.getElementById('discord-card');
  if (!body) return;

  const lines = [
    { cls: 't-comment', text: '# Behavioral Analysis Stream - live' },
    { cls: 't-val',     text: '› Connecting to ageis-cloud...', delay: 400 },
    { cls: 't-ok',      text: '✓ Session loaded: Player_XYZ', delay: 900 },
    { cls: 't-warn',    text: '⚡ Movement entropy: anomalous', delay: 1400 },
    { cls: 't-val',     text: '› CPS variance: 18.3  (threshold: 12)', delay: 1800 },
    { cls: 't-val',     text: '› Interpolation: non-linear detected', delay: 2200 },
    { cls: 't-err',     text: '⚠ INCIDENT #4922 - HIGH CONFIDENCE', delay: 2800, bold: true },
    { cls: 't-alert-body', text: 'Flagged for staff review. Alert dispatched.', delay: 3100 },
    { cls: 't-key',     text: 'confidence_score: ', value: '98.4%  ✓', delay: 3500 },
  ];

  const heroObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    heroObserver.disconnect();
    startTerminal();
  }, { threshold: 0.3 });

  const heroCard = document.querySelector('.hero-card');
  if (heroCard) heroObserver.observe(heroCard);

  function startTerminal() {
    lines.forEach(({ cls, text, value, delay, bold }) => {
      setTimeout(() => {
        if (cls === 't-err') {
          const box = document.createElement('div');
          box.className = 't-alert t-line';
          const title = document.createElement('span');
          title.className = 't-err';
          title.style.fontWeight = '700';
          title.textContent = text;
          box.appendChild(title);
          body.appendChild(box);
        } else {
          const span = document.createElement('span');
          span.className = cls + ' t-line';
          if (bold) span.style.fontWeight = '600';
          if (value) {
            span.innerHTML = `<span class="t-key">${text}</span><span class="t-ok">${value}</span>`;
          } else {
            span.textContent = text;
          }
          body.appendChild(span);
        }
        body.scrollTop = body.scrollHeight;
      }, delay);
    });

    if (discord) {
      setTimeout(() => discord.classList.add('visible'), 4200);
    }
  }
})();


(function initBarChart() {
  const chart = document.getElementById('bar-chart');
  if (!chart) return;

  const bars = chart.querySelectorAll('.bar');
  bars.forEach(bar => {
    const h = bar.dataset.h || 50;
    bar.style.height = h + '%';
  });

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    bars.forEach((bar, i) => {
      setTimeout(() => bar.classList.add('animated'), i * 80);
    });
    observer.disconnect();
  }, { threshold: 0.5 });

  observer.observe(chart);
})();


(function initPipeline() {
  const line = document.getElementById('pipeline-line');
  if (!line) return;
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    line.classList.add('animated');
    observer.disconnect();
  }, { threshold: 0.5 });
  observer.observe(line);
})();


(function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      btn.style.setProperty('--mx', x + '%');
      btn.style.setProperty('--my', y + '%');
    });
  });
})();


(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => {
        l.style.color = l.getAttribute('href') === '#' + id
          ? 'var(--primary-light)'
          : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


(function initTilt() {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 4).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


(function initPricingSpotlight() {
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--surface-3) 0%, var(--surface) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


(function initTerminalLoop() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const extraEvents = [
    ['t-comment', '# ─────────────────────────────'],
    ['t-ok',      '✓ New session: CrafterPro99'],
    ['t-val',     '› Analyzing 847 movement samples...'],
    ['t-ok',      '✓ Behavior within normal range'],
    ['t-comment', '# ─────────────────────────────'],
    ['t-ok',      '✓ New session: xX_Dragon_Xx'],
    ['t-warn',    '⚡ KillAura pattern detected'],
    ['t-err',     '⚠ INCIDENT #4923 - FLAGGED'],
  ];

  let loopIdx = 0;
  function addLine() {
    const [cls, text] = extraEvents[loopIdx % extraEvents.length];
    const span = document.createElement('span');
    span.className = cls + ' t-line';
    span.textContent = text;
    body.appendChild(span);
    while (body.children.length > 14) body.removeChild(body.firstChild);
    body.scrollTop = body.scrollHeight;
    loopIdx++;
  }

  setTimeout(() => {
    setInterval(addLine, 2200);
  }, 8000);
})();

// WELP YOU REACHED THE END, YES THIS LANDING PAGE WAS MADE USING AI...