const products = {
  manteau: {
    name: "Manteau Veillée",
    category: "Veste · coton lourd",
    price: 189,
    image: "image-one",
  },
  robe: {
    name: "Robe Minuit",
    category: "Robe · maille fluide",
    price: 129,
    image: "image-two",
  },
  pantalon: {
    name: "Pantalon Cendre",
    category: "Pantalon · coupe droite",
    price: 98,
    image: "image-three",
  },
  haut: {
    name: "Haut Ombre",
    category: "Haut · jersey bio",
    price: 64,
    image: "image-four",
  },
  trench: {
    name: "Trench Nuit Blanche",
    category: "Trench · gabardine",
    price: 218,
    image: "image-five",
  },
  "robe-velours": {
    name: "Robe Veuve Noire",
    category: "Robe · velours",
    price: 156,
    image: "image-six",
  },
  corset: {
    name: "Corset Reliquaire",
    category: "Corset · satin mat",
    price: 112,
    image: "image-seven",
  },
  jupe: {
    name: "Jupe Culte",
    category: "Jupe · plis profonds",
    price: 86,
    image: "image-eight",
  },
};

const cart = new Map();
const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const cartTotal = document.querySelector("#cart-total");
const cartNotice = document.querySelector("#cart-notice");
const openCartButton = document.querySelector("#open-cart");
const toast = document.querySelector("#toast");
let toastTimeout;

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function renderCart() {
  const totalItems = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
  const totalPrice = [...cart.entries()].reduce(
    (total, [id, quantity]) => total + products[id].price * quantity,
    0,
  );

  cartCount.textContent = String(totalItems);
  openCartButton.setAttribute(
    "aria-label",
    `Ouvrir le panier, ${totalItems} ${totalItems === 1 ? "article" : "articles"}`,
  );
  cartEmpty.hidden = totalItems > 0;
  cartFooter.hidden = totalItems === 0;
  cartTotal.textContent = formatPrice(totalPrice);

  cartItems.replaceChildren();
  for (const [id, quantity] of cart) {
    const product = products[id];
    const item = document.createElement("article");
    item.className = "cart-item";
    item.innerHTML = `
      <div class="cart-thumb ${product.image}" aria-hidden="true"></div>
      <div>
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <div class="quantity-control" aria-label="Quantité de ${product.name}">
          <button type="button" data-quantity="-1" data-product="${id}" aria-label="Retirer un ${product.name}"><svg class="icon" aria-hidden="true"><use href="#icon-minus"/></svg></button>
          <span>${quantity}</span>
          <button type="button" data-quantity="1" data-product="${id}" aria-label="Ajouter un ${product.name}"><svg class="icon" aria-hidden="true"><use href="#icon-plus"/></svg></button>
        </div>
      </div>
      <strong class="cart-item-price">${formatPrice(product.price * quantity)}</strong>
    `;
    cartItems.append(item);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.product;
    if (!id || !products[id]) {
      return;
    }

    cart.set(id, (cart.get(id) ?? 0) + 1);
    renderCart();
    showToast(`${products[id].name} ajouté au panier.`);
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-quantity]");
  if (!button) {
    return;
  }

  const id = button.dataset.product;
  const quantityChange = Number(button.dataset.quantity);
  if (!id || !Number.isInteger(quantityChange) || !cart.has(id)) {
    return;
  }

  const nextQuantity = cart.get(id) + quantityChange;
  if (nextQuantity > 0) {
    cart.set(id, nextQuantity);
  } else {
    cart.delete(id);
  }
  renderCart();
});

openCartButton.addEventListener("click", () => cartDialog.showModal());
document.querySelector("#close-cart").addEventListener("click", () => cartDialog.close());
document.querySelector("#continue-shopping").addEventListener("click", () => cartDialog.close());

cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) {
    cartDialog.close();
  }
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  cartNotice.textContent = "Cette boutique est une maquette : le paiement et les commandes ne sont pas encore activés.";
});

const filterButtons = document.querySelectorAll(".filter-button");
const productCards = document.querySelectorAll(".product-card");
const productCount = document.querySelector("#product-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    if (!category) {
      return;
    }

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    let visibleProducts = 0;
    productCards.forEach((card) => {
      const isVisible = category === "all" || card.dataset.category === category;
      card.hidden = !isVisible;
      if (isVisible) {
        visibleProducts += 1;
      }
    });
    productCount.textContent = String(visibleProducts).padStart(2, "0");
  });
});

const revealElements = document.querySelectorAll(
  ".section-topline, .section-heading, .collection-filters, .product-card, .collection-note",
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

renderCart();
