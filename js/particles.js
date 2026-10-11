/* ==========================================================
   Ambient particle background
   ========================================================== */

const canvas = document.getElementById('particle-bg');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId = null;
let lastTime = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  const x = Math.random() * canvas.width;
  const y = canvas.height + Math.random() * 100;
  const size = Math.random() * 2 + 0.5;
  const speed = Math.random() * 0.3 + 0.1;
  const opacity = Math.random() * 0.4 + 0.1;
  const hue = Math.random() > 0.6 ? 45 : (Math.random() > 0.5 ? 260 : 300); // amber, violet, indigo

  return { x, y, size, speed, opacity, hue, drift: Math.random() * 0.5 - 0.25 };
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
  for (let i = 0; i < count; i++) {
    particles.push(createParticle());
  }
}

function animate(time) {
  if (!lastTime) lastTime = time;
  const dt = Math.min(time - lastTime, 50);
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.y -= p.speed * dt;
    p.x += p.drift * dt;

    if (p.y < -10) {
      p.y = canvas.height + 10;
      p.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 60%, 65%, ${p.opacity})`;
    ctx.fill();
  }

  animationId = requestAnimationFrame(animate);
}

function start() {
  resize();
  initParticles();
  animationId = requestAnimationFrame(animate);
}

function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resize();
    initParticles();
  }, 150);
});

// Reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Don't start particles if reduced motion
} else {
  start();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { start, stop };
}