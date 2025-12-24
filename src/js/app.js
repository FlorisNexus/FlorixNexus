document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = "fr";
  const supportedLangs = ["en", "fr", "nl"];
  const langKey = "florisnexus_lang";

  let currentLang = localStorage.getItem(langKey) || defaultLang;
  if (!supportedLangs.includes(currentLang)) {
    currentLang = defaultLang;
  }

  const switchers = document.querySelectorAll(".language-switcher");

  switchers.forEach((switcher) => {
    switcher.value = currentLang;
    switcher.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  });

  // Initialize global translations object
  window.translations = {};

  setLanguage(currentLang);

  async function setLanguage(lang) {
    try {
      currentLang = lang;
      localStorage.setItem(langKey, lang);

      switchers.forEach((switcher) => {
        if (switcher.value !== lang) {
          switcher.value = lang;
        }
      });

      const response = await fetch(`/assets/lang/${lang}.json`);
      if (!response.ok) throw new Error(`Could not load ${lang} translations`);
      const translations = await response.json();
      
      // Expose globally
      window.translations = translations;

      applyTranslations(translations);

      document.documentElement.lang = lang;
      
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
      
    } catch (error) {
      console.error("Language loading failed:", error);
    }
  }

  function applyTranslations(translations) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      let raw = el.getAttribute("data-i18n") || "";

      // Support directive syntax like "[placeholder]contact.form.name_placeholder"
      let directive = null;
      let key = raw;
      const dirMatch = raw.match(/^\[(\w+)\](.*)$/);
      if (dirMatch) {
        directive = dirMatch[1];
        key = dirMatch[2];
      }

      const value = translations[key];
      if (!value) return;

      // Handle known directives
      if (directive === "placeholder") {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.placeholder = value;
        else el.setAttribute("placeholder", value);
        return;
      }

      // data-i18n-html takes priority when present
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
        return;
      }

      // Default behavior: set textContent
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        // If no directive and element is input/textarea, set placeholder
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });
  }

  window.setLanguage = setLanguage;
  window.getCurrentLanguage = () => currentLang;
});