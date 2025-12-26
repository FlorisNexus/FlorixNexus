/* --- Mobile Menu --- */
export function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    document.body.classList.toggle("no-scroll");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });
}

export default initMobileMenu;
