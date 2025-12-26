/* --- Header Scroll Effect --- */
export function initHeader() {
  const header = document.getElementById("main-header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };

  window.addEventListener("scroll", onScroll);
  // run once to set initial state
  onScroll();
}

export default initHeader;
