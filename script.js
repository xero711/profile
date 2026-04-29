// Typing animation
const typingLines = [
  'PROGRAMMER / AI DEVELOPER',
  'DISCORD BOT CREATOR',
  'CUSTOM PC BUILDER',
  'TOKYO BASED // JAPAN',
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingEl = document.getElementById('typingText');
let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = typingLines[lineIndex];

  if (!deleting) {
    typingEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % typingLines.length;
    }
  }

  setTimeout(typeLoop, deleting ? 34 : 58);
}

if (typingEl) {
  if (prefersReducedMotion) {
    typingEl.textContent = typingLines[0];
  } else {
    typeLoop();
  }
}

// BGM player
const audio = document.getElementById('bgm');
const bgmToggle = document.getElementById('bgmToggle');
let playing = false;

if (audio && bgmToggle) {
  audio.volume = 0.05;
  bgmToggle.classList.add('paused');

  const playBgm = () => {
    audio.play().then(() => {
      playing = true;
      bgmToggle.classList.remove('paused');
    }).catch(() => {});
  };

  bgmToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (playing) {
      audio.pause();
      playing = false;
      bgmToggle.classList.add('paused');
    } else {
      playBgm();
    }
  });

  document.addEventListener('click', () => {
    if (!playing) playBgm();
  }, { once: true });
}

// Particle canvas
const canvas = document.getElementById('particles');
const ctx = canvas?.getContext('2d');
let particles = [];
let sparks = [];
let dpr = 1;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const small = window.innerWidth < 720;
  const count = prefersReducedMotion ? 20 : (small ? 54 : 105);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * (small ? 0.32 : 0.48),
    vy: (Math.random() - 0.5) * (small ? 0.32 : 0.48),
    size: Math.random() * 1.8 + 0.45,
    alpha: Math.random() * 0.5 + 0.12,
    hue: Math.random() > 0.74 ? 'cyan' : 'purple',
    phase: Math.random() * Math.PI * 2,
  }));

  sparks = Array.from({ length: small ? 3 : 6 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    speed: Math.random() * 1.8 + 1.2,
    delay: Math.random() * 500,
  }));
}

function drawParticles(time = 0) {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalCompositeOperation = 'lighter';

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -10) p.x = window.innerWidth + 10;
    if (p.x > window.innerWidth + 10) p.x = -10;
    if (p.y < -10) p.y = window.innerHeight + 10;
    if (p.y > window.innerHeight + 10) p.y = -10;

    const pulse = Math.sin(time * 0.002 + p.phase) * 0.24;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size + pulse, 0, Math.PI * 2);
    ctx.fillStyle = p.hue === 'cyan'
      ? `rgba(0, 231, 255, ${p.alpha})`
      : `rgba(193, 102, 255, ${p.alpha})`;
    ctx.fill();
  }

  const linkDistance = window.innerWidth < 720 ? 92 : 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < linkDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139, 23, 255, ${0.13 * (1 - dist / linkDistance)})`;
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }
    }
  }

  for (const spark of sparks) {
    spark.x += spark.speed;
    spark.y += spark.speed * 0.22;
    if (spark.x > window.innerWidth + 120 || spark.y > window.innerHeight + 60) {
      spark.x = -140 - spark.delay * 0.12;
      spark.y = Math.random() * window.innerHeight * 0.72;
    }

    const grad = ctx.createLinearGradient(spark.x - 90, spark.y, spark.x, spark.y);
    grad.addColorStop(0, 'rgba(139, 23, 255, 0)');
    grad.addColorStop(0.75, 'rgba(193, 102, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 231, 255, 0.95)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(spark.x - 90, spark.y - 14);
    ctx.lineTo(spark.x, spark.y);
    ctx.stroke();
  }

  if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener('resize', resizeCanvas, { passive: true });

// Scroll reveal
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.14, rootMargin: '0px 0px -48px 0px' });

revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index % 6, 5) * 60}ms`);
  revealObserver.observe(item);
});

// Navigation highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  }
}, { threshold: 0.42 });

sections.forEach((section) => navObserver.observe(section));

// Hero parallax
const hero = document.querySelector('.hero');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (hero && finePointer && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    hero.style.setProperty('--mx', x.toFixed(3));
    hero.style.setProperty('--my', y.toFixed(3));
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    hero.style.setProperty('--mx', '0');
    hero.style.setProperty('--my', '0');
  });
}
