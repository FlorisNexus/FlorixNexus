/* --- Contact Form Handler (module) --- */
export function initContact() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

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

  function showFormStatus(message, type = "error") {
    if (!status) return;
    status.textContent = message;
    status.classList.remove("hidden");
    status.className = "text-center text-sm mt-4 ";
    if (type === "error") status.classList.add("text-red-400");
    else if (type === "success") status.classList.add("text-green-400");
    else status.classList.add("text-gray-300");
    try {
      if (type === 'error') status.style.color = '#fb7185';
      else if (type === 'success') status.style.color = '#4ade80';
      else status.style.color = '';
    } catch (err) {}
    try { status.animate([{ opacity: 0.95 }, { opacity: 1 }], { duration: 250 }); } catch (e) {}
    try { status.classList.add('status-appear'); } catch (e) {}
  }

  function clearFieldError(el) {
    if (!el) return;
    el.classList.remove("border-red-400", "ring-2", "ring-red-400");
    try {
      const errId = `${el.id}-error`;
      const errEl = document.getElementById(errId);
      if (errEl) errEl.remove();
      if (el.getAttribute('aria-describedby') === errId) el.removeAttribute('aria-describedby');
      if (el.getAttribute('aria-invalid') === 'true') el.removeAttribute('aria-invalid');
    } catch (err) {}
  }

  function markFieldError(el) {
    if (!el) return;
    el.classList.add("border-red-400", "ring-2", "ring-red-400");
    try { el.setAttribute('aria-invalid', 'true'); } catch (err) {}
  }

  function setFieldError(el, message) {
    if (!el) return;
    markFieldError(el);

    // small attention animation
    try {
      el.classList.remove('shake');
      // trigger reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth;
      el.classList.add('shake');
      el.addEventListener('animationend', function _end() { el.classList.remove('shake'); el.removeEventListener('animationend', _end); });
    } catch (err) {}

    const errId = `${el.id}-error`;

    let errEl = document.getElementById(errId);
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = errId;
      errEl.className = 'field-error text-sm text-red-400 mt-2 text-center w-full';
      errEl.style.display = 'block';
      try {
        el.insertAdjacentElement('afterend', errEl);
      } catch (e) {
        if (el.parentElement) el.parentElement.appendChild(errEl);
      }
    }
    errEl.textContent = message;
    try { errEl.style.color = '#fb7185'; } catch (err) {}
    try {
      el.setAttribute('aria-describedby', errId);
      if (el.getAttribute('aria-invalid') !== 'true') el.setAttribute('aria-invalid', 'true');
    } catch (err) {}
  }

  function setRecaptchaError(message) {
    const captchaEl = document.querySelector('.g-recaptcha');
    if (!captchaEl) {
      showFormStatus(message, 'error');
      return;
    }
    if (!captchaEl.id) captchaEl.id = 'g-recaptcha';
    setFieldError(captchaEl, message);
    try {
      const errNode = document.getElementById(`${captchaEl.id}-error`);
      if (errNode) {
        errNode.setAttribute('role', 'alert');
        errNode.setAttribute('aria-live', 'polite');
      }
    } catch (err) {}
  }

  function attachRecaptchaHandler() {
    const captchaEl = document.querySelector('.g-recaptcha');
    if (!captchaEl) return;

    const tryRender = () => {
      if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
        try {
          if (!captchaEl.querySelector('iframe')) {
            grecaptcha.render(captchaEl, {
              sitekey: captchaEl.getAttribute('data-sitekey') || '',
              theme: captchaEl.getAttribute('data-theme') || 'light',
              callback: function () {
                clearFieldError(captchaEl);
              }
            });
          } else {
            monitorRecaptcha();
          }
        } catch (err) {
          monitorRecaptcha();
        }
      } else {
        setTimeout(tryRender, 300);
      }
    };

    tryRender();
  }

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
      } catch (err) {}
      if (attempts > 60) {
        clearInterval(interval);
      }
    }, 300);
  }

  attachRecaptchaHandler();

  // Add subtle focus glow to inputs/selects/textareas
  try {
    const focusables = contactForm.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    focusables.forEach((el) => el.classList.add('input-glow'));
  } catch (e) {}

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
      el.addEventListener("input", function onInput() {
        if (el.checkValidity()) clearFieldError(el);
        el.removeEventListener("input", onInput);
      });
    },
    true
  );

  const submitBtn = btn;
  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      Array.from(contactForm.elements).forEach((el) => clearFieldError(el));
      if (status) status.classList.add("hidden");

      if (!contactForm.checkValidity()) {
        const invalidEl = Array.from(contactForm.elements).find((el) => !el.checkValidity());
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
          setFieldError(invalidEl, friendlyMsg);
          try { invalidEl.focus(); } catch (err) {}
        } else {
          showFormStatus(friendlyMsg, "error");
        }

        Array.from(contactForm.elements).forEach((el) => {
          el.addEventListener("input", function onInput() {
            if (el.checkValidity()) {
              clearFieldError(el);
            }
            el.removeEventListener("input", onInput);
          });
        });

        return;
      }

      contactForm.requestSubmit();
    });
  }

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const t = (key) => {
      return (window.translations && window.translations[key]) ? window.translations[key] : key;
    };

    const btnText = btn ? btn.querySelector("span") : null;

    let captchaResponse = "";
    try {
      captchaResponse = (typeof grecaptcha !== 'undefined') ? grecaptcha.getResponse() : '';
    } catch (err) {
      captchaResponse = '';
    }
    if (!captchaResponse) {
      setRecaptchaError(t("contact.form.status.recaptcha"));
      return;
    }

    if (btn) {
      btn.disabled = true;
      try { btn.setAttribute('aria-busy', 'true'); } catch (e) {}
      btn.classList.add('opacity-70', 'cursor-wait');
    }
    const originalText = btnText ? btnText.textContent : '';
    if (btnText) btnText.textContent = t("contact.form.status.sending");
    if (status) status.classList.add("hidden");

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showFormStatus(t("contact.form.status.success"), "success");
        // success animation on the panel
        try {
          const panel = contactForm.closest('.glass-panel');
          if (panel) {
            panel.classList.add('form-success');
            // add check badge if not present
            let badge = panel.querySelector('.check-badge');
            if (!badge) {
              badge = document.createElement('div');
              badge.className = 'check-badge';
              badge.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
              panel.appendChild(badge);
            }
            // animate pulse and badge
            setTimeout(() => panel.classList.add('pulse', 'show-badge'), 60);
            // remove pulse after a short period
            setTimeout(() => panel.classList.remove('pulse'), 2200);
            // keep badge visible briefly then hide
            setTimeout(() => panel.classList.remove('show-badge', 'form-success'), 4000);
          }
        } catch (e) {}

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
      if (btn) {
        btn.disabled = false;
        try { btn.removeAttribute('aria-busy'); } catch (e) {}
        btn.classList.remove('opacity-70', 'cursor-wait');
      }
      if (btnText) btnText.textContent = originalText;
    }
  });
}

export default initContact;
