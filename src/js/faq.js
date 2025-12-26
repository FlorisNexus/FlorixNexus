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
