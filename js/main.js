/* ============================================================
   GOLAM MORSHED — PORTFOLIO  JS  v2.0
   Particles · Typed · Counters · Scroll Reveal · Nav
   ============================================================ */

'use strict';

/* ── PARTICLES ─────────────────────────────────────────────
   Lightweight canvas particle system for the hero background
   ─────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.r  = rand(1, 2.5);
      this.vx = rand(-0.18, 0.18);
      this.vy = rand(-0.18, 0.18);
      this.a  = rand(0.1, 0.55);
      // colour: mix red and amber
      const mix = Math.random();
      this.color = mix > 0.5
        ? `rgba(248,113,113,${this.a})`
        : `rgba(253,186,116,${this.a})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    const limit = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < limit) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(220,38,38,${0.08 * (1 - d / limit)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
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


/* ── SCROLL PROGRESS BAR ────────────────────────────────── */
const scrollBar = document.getElementById('scrollBar');
function updateScrollBar() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
}
window.addEventListener('scroll', updateScrollBar, { passive: true });


/* ── NAV: scroll state ──────────────────────────────────── */
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();


/* ── NAV: mobile burger ─────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open  = navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = open ? '0' : '1';
  spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    document.body.style.overflow = '';
  });
});


/* ── NAV: active link on scroll ─────────────────────────── */
const sections     = document.querySelectorAll('section[id]');
const allNavLinks  = document.querySelectorAll('.nl:not(.nl--cta)');
function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  allNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', updateActiveLink, { passive: true });


/* ── TYPED TEXT EFFECT ──────────────────────────────────── */
const phrases = [
  'build modern web apps.',
  'automate businesses with AI.',
  'create intelligent workflows.',
  'ship products that scale.',
  'help you grow faster.',
];
const typedEl = document.getElementById('typed');
let pIdx = 0, cIdx = 0, deleting = false;

function type() {
  if (!typedEl) return;
  const phrase = phrases[pIdx];
  typedEl.textContent = deleting ? phrase.slice(0, cIdx - 1) : phrase.slice(0, cIdx + 1);
  if (!deleting) {
    cIdx++;
    if (cIdx === phrase.length + 1) { deleting = true; setTimeout(type, 2200); return; }
  } else {
    cIdx--;
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 42 : 78);
}
setTimeout(type, 800);


/* ── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 65);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '-40px 0px' });
revealEls.forEach(el => revealObs.observe(el));


/* ── COUNTER ANIMATION (hero stats) ────────────────────── */
const counterEls = document.querySelectorAll('.hs__n[data-target]');
let countersStarted = false;

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1600;
  const start    = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObs.observe(heroStats);


/* ── BACK TO TOP ────────────────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ── CONTACT FORM (mailto) ──────────────────────────────── */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    const sub  = encodeURIComponent(`Portfolio enquiry${subject ? ' — ' + subject : ''} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${subject || 'Not specified'}\n\n${message}`);

    window.location.href = `mailto:golamdotmorshed@gmail.com?subject=${sub}&body=${body}`;
    formNote.textContent = '✓ Opening your email client. You can also reach me directly at golamdotmorshed@gmail.com';
    formNote.style.color = '#f87171';
  });
}


/* ── MAGNETIC HOVER on primary buttons ─────────────────── */
document.querySelectorAll('.btn.bp').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
