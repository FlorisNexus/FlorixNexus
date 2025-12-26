/* --- Hero Video & Canvas Handler --- */
window.addEventListener("load", () => {
  const videoWrapper = document.getElementById("hero-video-wrapper");
  setTimeout(() => {
    if (videoWrapper) {
      videoWrapper.classList.add("fade-out");
      setTimeout(() => videoWrapper.remove(), 2000);
    }
  }, 3000);
});

/* --- Hero Canvas Animation --- */
const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.color =
        Math.random() > 0.5
          ? "rgba(168, 85, 247, 0.5)"
          : "rgba(6, 182, 212, 0.5)";
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(100, (width * height) / 10000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, index) => {
      p.update();
      p.draw();
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1500})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animateCanvas);
  }

  window.addEventListener("resize", resize);
  resize();
  animateCanvas();
}
