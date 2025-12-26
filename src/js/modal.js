/* --- Modal Logic --- */
export function initModal() {
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

  // expose helpers to global scope so inline onclick handlers keep working
  window.openModal = openModal;
  window.closeModal = closeModal;
}

export default initModal;
