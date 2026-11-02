const bookingForm = document.querySelector("#booking-form");
const bookingDate = document.querySelector("#date");
const feedback = document.querySelector("#form-feedback");

if (bookingDate instanceof HTMLInputElement) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  bookingDate.min = localToday;
}

if (bookingForm instanceof HTMLFormElement && feedback instanceof HTMLElement) {
  bookingForm.addEventListener("submit", (event) => {
    const formData = new FormData(bookingForm);
    const moment = formData.get("moment");

    if (moment !== "À la vida a la muerte") {
      event.preventDefault();
      feedback.classList.add("is-error");
      feedback.textContent = "Seule l’option « À la vida a la muerte » est acceptée. Choisissez-la pour continuer.";
      return;
    }

    feedback.classList.remove("is-error");
    feedback.textContent = "Envoi de votre demande en cours…";
  });
}

const revealElements = document.querySelectorAll(
  ".concept > *, .benefit-card, .booking-copy, .form-card, .site-footer",
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  for (const element of revealElements) {
    element.classList.add("reveal-on-scroll");
    revealObserver.observe(element);
  }
}
