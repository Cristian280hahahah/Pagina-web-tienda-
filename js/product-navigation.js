document.querySelectorAll(".product-card__button").forEach((button) => {
  button.addEventListener("click", () => {
    const productCard = button.closest(".product-card");

    if (!productCard?.id) return;

    const query = new URLSearchParams({ producto: productCard.id });
    window.location.assign(`producto.html?${query.toString()}`);
  });
});
