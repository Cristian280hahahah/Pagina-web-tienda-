const carousel = document.querySelector("#promo-carousel");

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
  const previousButton = carousel.querySelector(".hero-arrow--prev");
  const nextButton = carousel.querySelector(".hero-arrow--next");
  const toggleButton = carousel.querySelector(".hero-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let activeIndex = 0;
  let timer = null;
  let manuallyPaused = reducedMotion.matches;
  let pointerInside = false;
  let focusInside = false;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    resetTimer();
  }

  function stopTimer() {
    window.clearInterval(timer);
    timer = null;
  }

  function syncTimer() {
    const shouldPause =
      manuallyPaused ||
      pointerInside ||
      focusInside ||
      document.hidden ||
      reducedMotion.matches;

    if (shouldPause) {
      stopTimer();
      return;
    }

    if (!timer) {
      timer = window.setInterval(() => showSlide(activeIndex + 1), 4500);
    }
  }

  function resetTimer() {
    stopTimer();
    syncTimer();
  }

  function updateToggleButton() {
    const isPaused = manuallyPaused || reducedMotion.matches;
    toggleButton.setAttribute("aria-pressed", String(isPaused));
    toggleButton.setAttribute(
      "aria-label",
      reducedMotion.matches
        ? "El cambio automático está desactivado por la preferencia de movimiento reducido"
        : isPaused
          ? "Reanudar cambio automático"
          : "Pausar cambio automático",
    );
    toggleButton.disabled = reducedMotion.matches;
    toggleButton.querySelector("span").textContent = isPaused ? "▶" : "Ⅱ";
  }

  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  toggleButton.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    if (!manuallyPaused) focusInside = false;
    updateToggleButton();
    syncTimer();
  });

  carousel.addEventListener("pointerenter", () => {
    pointerInside = true;
    syncTimer();
  });

  carousel.addEventListener("pointerleave", () => {
    pointerInside = false;
    syncTimer();
  });

  carousel.addEventListener("focusin", () => {
    focusInside = true;
    syncTimer();
  });

  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focusInside = false;
      syncTimer();
    }
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  });

  document.addEventListener("visibilitychange", syncTimer);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) manuallyPaused = true;
    updateToggleButton();
    syncTimer();
  });

  updateToggleButton();
  syncTimer();
}

document.querySelectorAll(".category-photo").forEach((image) => {
  const removeUnavailableImage = () => image.remove();

  if (image.complete && image.naturalWidth === 0) {
    removeUnavailableImage();
  } else {
    image.addEventListener("error", removeUnavailableImage, { once: true });
  }
});

