/* --- Header Scroll Effect --- */
const header = document.getElementById("main-header");
if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* --- Hero Video Handler --- */
window.addEventListener("load", () => {
  const videoWrapper = document.getElementById("hero-video-wrapper");
  setTimeout(() => {
    if (videoWrapper) {
      videoWrapper.classList.add("fade-out");
      setTimeout(() => videoWrapper.remove(), 2000);
    }
  }, 3000);
});

/* --- Scroll Reveal Animations --- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".reveal-on-scroll")
  .forEach((el) => revealObserver.observe(el));

/* --- Workflow Animation --- */
const workflowObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = document.getElementById("workflow-container");
        if (container) container.classList.add("workflow-active");
      }
    });
  },
  { threshold: 0.3 }
);

const workflowContainer = document.getElementById("workflow-container");
if (workflowContainer) workflowObserver.observe(workflowContainer);

/* --- FAQ Logic --- */
document.querySelectorAll(".faq-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.parentElement;
    const isActive = item.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((i) => {
      i.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
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

/* --- Mobile Menu --- */
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });
}

/* --- Modal Logic --- */
function openModal(type) {
  const modal = document.getElementById("legal-modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-body");

  if (!modal || !title || !body) return;

  // Set proper translation keys
  title.setAttribute("data-i18n", `${type}.title`);
  body.setAttribute("data-i18n", `${type}.body`);

  // Re-trigger translation for the modal content
  if (window.setLanguage && window.getCurrentLanguage) {
    window.setLanguage(window.getCurrentLanguage());
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeModal() {
  const modal = document.getElementById("legal-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Close on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* --- Contact Form Handler --- */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Helper to get translation
    const t = (key) => {
      return (window.translations && window.translations[key]) ? window.translations[key] : key;
    };

    const status = document.getElementById("form-status");
    const btn = document.getElementById("submit-btn");
    const btnText = btn.querySelector("span");
    
    // Check reCaptcha
    const captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
      status.textContent = t("contact.form.status.recaptcha");
      status.className = "text-center text-sm text-red-400 mt-4";
      status.classList.remove("hidden");
      return;
    }

    // Prepare UI
    btn.disabled = true;
    const originalText = btnText.textContent;
    btnText.textContent = t("contact.form.status.sending");
    status.classList.add("hidden");

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.textContent = t("contact.form.status.success");
        status.className = "text-center text-sm text-green-400 mt-4";
        contactForm.reset();
        grecaptcha.reset();
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          status.textContent = data["errors"].map(error => error["message"]).join(", ");
        } else {
          status.textContent = t("contact.form.status.error");
        }
        status.className = "text-center text-sm text-red-400 mt-4";
      }
    } catch (error) {
      status.textContent = t("contact.form.status.generic_error");
      status.className = "text-center text-sm text-red-400 mt-4";
    } finally {
      status.classList.remove("hidden");
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  });
}