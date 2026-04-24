// ── Typing animation ──
const lines = [
  'PROGRAMMER / AI DEVELOPER',
  'VOCATIONAL STUDENT',
  'CUSTOM PC BUILDER',
  'DISCORD BOT CREATOR',
  'TOKYO BASED // JAPAN',
];
let lineIdx = 0, charIdx = 0, deleting = false;
const el = document.getElementById('typingText');

function type() {
  const current = lines[lineIdx];
  if (!deleting) {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      lineIdx = (lineIdx + 1) % lines.length;
    }
  }
  setTimeout(type, deleting ? 40 : 70);
}
type();

// ── BGM Player ──
const audio = document.getElementById('bgm');
const toggle = document.getElementById('bgmToggle');
const bars = document.getElementById('soundBars');
let playing = false;

toggle.addEventListener('click', () => {
  if (playing) {
    audio.pause();
    bars.classList.add('paused');
  } else {
    audio.play().catch(() => {});
    bars.classList.remove('paused');
  }
  playing = !playing;
});

// Auto-play on first interaction
document.addEventListener('click', () => {
  if (!playing) {
    audio.play().then(() => {
      playing = true;
      bars.classList.remove('paused');
    }).catch(() => {});
  }
}, { once: true });

// ── Particle canvas ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 60;
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  r: Math.random() * 1.5 + 0.5,
  alpha: Math.random() * 0.5 + 0.1,
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(155, 48, 255, ${p.alpha})`;
    ctx.fill();
  }

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(123, 0, 255, ${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Scroll-activated nav highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--purple-light)'
          : '';
      });
    }
  }
}, { threshold: 0.5 });

sections.forEach(s => observer.observe(s));

// ── Glitch random trigger ──
const glitchEls = document.querySelectorAll('.glitch');
setInterval(() => {
  const el = glitchEls[Math.floor(Math.random() * glitchEls.length)];
  el.style.animation = 'none';
  requestAnimationFrame(() => { el.style.animation = ''; });
}, 4000);
