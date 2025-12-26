// Import init functions from modules
import initApp from '/src/js/app.js';
import initHeader from '/src/js/header.js';
import initHero from '/src/js/hero.js';
import initObservers from '/src/js/observers.js';
import initFAQ from '/src/js/faq.js';
import initMobileMenu from '/src/js/mobile-menu.js';
import initModal from '/src/js/modal.js';
import initContact from '/src/js/contact.js';

// Initialize components after DOM is ready (app first to load translations)
document.addEventListener('DOMContentLoaded', () => {
	try { if (typeof initApp === 'function') initApp(); } catch (e) { console.error(e); }
	try { if (typeof initHeader === 'function') initHeader(); } catch (e) { console.error(e); }
	try { if (typeof initHero === 'function') initHero(); } catch (e) { console.error(e); }
	try { if (typeof initObservers === 'function') initObservers(); } catch (e) { console.error(e); }
	try { if (typeof initFAQ === 'function') initFAQ(); } catch (e) { console.error(e); }
	try { if (typeof initMobileMenu === 'function') initMobileMenu(); } catch (e) { console.error(e); }
	try { if (typeof initModal === 'function') initModal(); } catch (e) { console.error(e); }
	try { if (typeof initContact === 'function') initContact(); } catch (e) { console.error(e); }
});