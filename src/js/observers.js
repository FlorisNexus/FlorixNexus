/* --- Scroll Reveal & Workflow Observers --- */
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
