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
  // Disable browser native constraint validation UI to avoid native tooltips
  try { contactForm.noValidate = true; } catch (err) {}
  const status = document.getElementById("form-status");
  const btn = document.getElementById("submit-btn");

  // translation helpers (use existing loaded translations)
  const t = (key) => {
    return (window.translations && window.translations[key]) ? window.translations[key] : key;
  };

  const tF = (key, vars = {}) => {
    let str = t(key);
    Object.keys(vars).forEach((k) => {
      str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), vars[k]);
    });
    return str;
  };

  // small helper to display a friendly styled message in the existing #form-status
  function showFormStatus(message, type = "error") {
    status.textContent = message;
    status.classList.remove("hidden");
    status.className = "text-center text-sm mt-4 ";
    if (type === "error") status.classList.add("text-red-400");
    else if (type === "success") status.classList.add("text-green-400");
    else status.classList.add("text-gray-300");
    // subtle pulse to draw attention
    // Force color in case global styles override
    try {
      if (type === 'error') status.style.color = '#fb7185';
      else if (type === 'success') status.style.color = '#4ade80';
      else status.style.color = '';
    } catch (err) {}
    status.animate([{ opacity: 0.95 }, { opacity: 1 }], { duration: 250 });
  }

  function clearFieldError(el) {
    if (!el) return;
    el.classList.remove("border-red-400", "ring-2", "ring-red-400");
    // remove inline error message if present
    try {
      const errId = `${el.id}-error`;
      const errEl = document.getElementById(errId);
      if (errEl) errEl.remove();
      if (el.getAttribute('aria-describedby') === errId) el.removeAttribute('aria-describedby');
    } catch (err) {}
  }

  function markFieldError(el) {
    if (!el) return;
    el.classList.add("border-red-400", "ring-2", "ring-red-400");
  }

  // Create or update a per-field inline error message underneath the field
  function setFieldError(el, message) {
    if (!el) return;
    markFieldError(el);

    const errId = `${el.id}-error`;

    // If an existing error element exists, update it
    let errEl = document.getElementById(errId);
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = errId;
      // center the message under the component and ensure red color
      errEl.className = 'field-error text-sm text-red-400 mt-2 text-center w-full';
      errEl.style.display = 'block';
      // Insert after the input element
      try {
        el.insertAdjacentElement('afterend', errEl);
      } catch (e) {
        if (el.parentElement) el.parentElement.appendChild(errEl);
      }
    }
    errEl.textContent = message;

    // Force color in case global styles override text color
    try {
      errEl.style.color = '#fb7185'; // Tailwind red-400
    } catch (err) {}

    // Associate for accessibility
    try {
      el.setAttribute('aria-describedby', errId);
    } catch (err) {}
  }

  // Helper to show reCAPTCHA error centered under the widget
  function setRecaptchaError(message) {
    const captchaEl = document.querySelector('.g-recaptcha');
    if (!captchaEl) {
      // fallback to global banner
      showFormStatus(message, 'error');
      return;
    }
    if (!captchaEl.id) captchaEl.id = 'g-recaptcha';
    setFieldError(captchaEl, message);
  }

  // Try to attach a callback to the reCAPTCHA widget so we can clear errors when solved.
  function attachRecaptchaHandler() {
    const captchaEl = document.querySelector('.g-recaptcha');
    if (!captchaEl) return;

    // If grecaptcha.render is available, render with our callback if not already rendered
    const tryRender = () => {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
        try {
          // Only render if the element doesn't already contain an iframe
          if (!captchaEl.querySelector('iframe')) {
            grecaptcha.render(captchaEl, {
              sitekey: captchaEl.getAttribute('data-sitekey') || '',
              theme: captchaEl.getAttribute('data-theme') || 'light',
              callback: function () {
                clearFieldError(captchaEl);
              }
            });
          } else {
            // Already rendered by the page: start polling for response to clear error
            monitorRecaptcha();
          }
        } catch (err) {
          // If render fails, fallback to polling
          monitorRecaptcha();
        }
      } else {
        // retry after a short delay until grecaptcha is ready
        setTimeout(tryRender, 300);
      }
    };

    tryRender();
  }

  // Poll grecaptcha.getResponse() until a non-empty response appears then clear the error
  function monitorRecaptcha() {
    const captchaEl = document.querySelector('.g-recaptcha');
    if (!captchaEl) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      try {
        if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.getResponse === 'function') {
          const resp = grecaptcha.getResponse();
          if (resp && resp.length > 0) {
            clearFieldError(captchaEl);
            clearInterval(interval);
            return;
          }
        }
      } catch (err) {
        // ignore and retry
      }
      if (attempts > 60) {
        clearInterval(interval); // stop polling after ~18s
      }
    }, 300);
  }

  // Initialize reCAPTCHA handlers
  attachRecaptchaHandler();

  // Capture native 'invalid' events and replace browser tooltip with our custom UI
  contactForm.addEventListener(
    "invalid",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
  const el = e.target;
  const label = document.querySelector(`label[for="${el.id}"]`);
  const fieldName = label ? label.textContent.trim() : (el.name || "this field");
  let msg = tF("contact.form.validation.field_required", { field: fieldName });
  if (el.validity && el.validity.typeMismatch) msg = tF("contact.form.validation.invalid_type", { field: fieldName.toLowerCase() });
  setFieldError(el, msg);
  try { el.focus(); } catch (err) {}
      // remove highlight when user types
      el.addEventListener("input", function onInput() {
        if (el.checkValidity()) clearFieldError(el);
        el.removeEventListener("input", onInput);
      });
    },
    true
  );

  // Intercept the click on the submit button to show custom validation messages
  if (btn) {
    btn.addEventListener("click", function (e) {
      // Prevent native tooltip validation UI
      e.preventDefault();

      // Remove previous highlights
      Array.from(contactForm.elements).forEach((el) => clearFieldError(el));
      status.classList.add("hidden");

      // Run built-in validity checks
      if (!contactForm.checkValidity()) {
        // Find first invalid field
        const invalidEl = Array.from(contactForm.elements).find((el) => !el.checkValidity());
        // Build a friendly message using translations
        let friendlyMsg = t("contact.form.validation.correct_fields");
        if (invalidEl) {
          const label = document.querySelector(`label[for="${invalidEl.id}"]`);
          const fieldName = label ? label.textContent.trim() : (invalidEl.name || "this field");

          if (invalidEl.validity.valueMissing) {
            friendlyMsg = tF("contact.form.validation.field_required", { field: fieldName });
          } else if (invalidEl.validity.typeMismatch) {
            friendlyMsg = tF("contact.form.validation.invalid_type", { field: fieldName.toLowerCase() });
          } else if (invalidEl.validity.tooShort || invalidEl.validity.tooLong) {
            friendlyMsg = tF("contact.form.validation.invalid_length", { field: fieldName });
          }

          // Show inline error under the invalid field and focus it
          setFieldError(invalidEl, friendlyMsg);
          try { invalidEl.focus(); } catch (err) {}
        } else {
          // Fallback to a global message
          showFormStatus(friendlyMsg, "error");
        }

        // Remove highlight and inline message once user types
        Array.from(contactForm.elements).forEach((el) => {
          el.addEventListener("input", function onInput() {
            if (el.checkValidity()) {
              clearFieldError(el);
            }
            el.removeEventListener("input", onInput);
          });
        });

        return; // stop here, don't submit
      }

      // If form is valid, trigger the normal submit flow which will perform the fetch.
      // Use requestSubmit to ensure the submit event is triggered programmatically.
      contactForm.requestSubmit();
    });
  }

  // Main submit handler: performs reCaptcha check and AJAX submit
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Helper to get translation
    const t = (key) => {
      return (window.translations && window.translations[key]) ? window.translations[key] : key;
    };

    const btnText = btn.querySelector("span");

    // Check reCaptcha
    let captchaResponse = "";
    try {
      captchaResponse = (typeof grecaptcha !== 'undefined') ? grecaptcha.getResponse() : '';
    } catch (err) {
      captchaResponse = '';
    }
    if (!captchaResponse) {
      // show reCaptcha error directly under the widget for better context
      setRecaptchaError(t("contact.form.status.recaptcha"));
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
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showFormStatus(t("contact.form.status.success"), "success");
        contactForm.reset();
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        if (data && Object.hasOwn(data, 'errors')) {
          showFormStatus(data["errors"].map(error => error["message"]).join(", "), "error");
        } else {
          showFormStatus(t("contact.form.status.error"), "error");
        }
      }
    } catch (error) {
      showFormStatus(t("contact.form.status.generic_error"), "error");
    } finally {
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  });
}