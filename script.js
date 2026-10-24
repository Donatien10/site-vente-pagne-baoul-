
/* =========================================
   BONHEUR PARFAITE - SCRIPT COMPLET
   ========================================= */

const PRICE = 18500;
const WHATSAPP = "225566015174";

// Photos disponibles dans le dossier images-premier pagnes
const IMAGE_FOLDER = "./images-premier%20pagnes/";

const photos = [
  "me%20ni%20ti%20koun.jpg",
  "images%202.jpeg",
  "images%203.jpeg",
  "images%204.jpeg",
  "image%205.jpg",
  "images6.jpeg",
  "images7.jpeg",
  "images8.jpeg",
  "images9.jpeg",
  "images10.jpeg",
  "images11.jpeg",
  "images12.jpeg",
  "images13.jpeg",
  "images14.jpeg",
  "images15.jpeg",
  "images16.jpeg",
  "images17.jpeg",
  "images18.jpeg",
  "images19.jpeg",
  "images20.jpeg",
  "images21.jpeg",
  "images22.jpeg",
  "images23.jpeg"
];

// Données des collections
const data = photos.map((photo, index) => [
  `Collection ${index + 1}`,
  "Pagne Baoulé traditionnel",
  ["#923d2e", "#285d55", "#c69b47", "#302725"][index % 4],
  ["#c69b47", "#f1dfbc", "#923d2e", "#d2a64d"][index % 4],
  photo
]);

const money = amount =>
  new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";

/* =========================================
   DIAPORAMA AUTOMATIQUE DE LA BANNIÈRE
   ========================================= */

function startSlideshow() {
  const slides = document.querySelectorAll(".cloth .slide");

  if (slides.length < 2) return;

  let currentSlide = 0;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === 0);
  });

  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 3000);
}

/* =========================================
   INITIALISATION DES COLLECTIONS
   ========================================= */

const grid = document.getElementById("grid");
const sel = document.getElementById("collection");
const cart = {};

function renderCollections() {
  if (!grid || !sel) {
    console.error("Élément #grid ou #collection introuvable.");
    return;
  }

  // Évite de créer les collections plusieurs fois
  grid.innerHTML = "";

  // Supprime les options déjà présentes, sauf la première
  while (sel.options.length > 1) {
    sel.remove(1);
  }

  data.forEach((item, index) => {
    const number = index + 1;

    const option = document.createElement("option");
    option.value = item[0];
    option.textContent = item[0];
    sel.appendChild(option);

    const card = document.createElement("article");
    card.className = "card";

    const photoBox = document.createElement("div");
    photoBox.className = "pagne-photo";

    const front = document.createElement("img");
    front.className = "pagne-face face-avant";
    front.src = IMAGE_FOLDER + item[4];
    front.alt = item[0] + " - face avant";
    front.loading = "lazy";

    const placeholder = document.createElement("div");
    placeholder.className = "pagne-placeholder";
    placeholder.style.display = "none";
    placeholder.style.background =
      `linear-gradient(120deg, ${item[2]} 0 50%, ${item[3]} 50%)`;

    const placeholderText = document.createElement("span");
    placeholderText.textContent = item[0];
    placeholder.appendChild(placeholderText);

    front.addEventListener("error", () => {
      front.style.display = "none";
      placeholder.style.display = "grid";
    });

    photoBox.appendChild(front);
    photoBox.appendChild(placeholder);

    const content = document.createElement("div");
    content.className = "card-content";

    const label = document.createElement("small");
    label.textContent = "COLLECTION " + String(number).padStart(2, "0");

    const title = document.createElement("h3");
    title.textContent = item[0];

    const description = document.createElement("p");
    description.textContent =
      item[1] + " · Couleurs et motifs à découvrir";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = money(PRICE);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn";
    addButton.dataset.add = index;
    addButton.textContent = "Ajouter au panier";

    content.append(label, title, description, price, addButton);
    card.append(photoBox, content);
    grid.appendChild(card);
  });
}

/* =========================================
   GESTION DU PANIER
   ========================================= */

function renderCart() {
  const root = document.getElementById("cart-items");
  const countElement = document.getElementById("cart-count");
  const totalElement = document.getElementById("cart-total");

  if (!root || !countElement || !totalElement) return;

  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  const count = ids.reduce((sum, id) => sum + cart[id], 0);

  countElement.textContent = count;
  totalElement.textContent = money(count * PRICE);

  if (ids.length === 0) {
    root.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
    return;
  }

  root.innerHTML = "";

  ids.forEach(id => {
    const item = data[Number(id)];
    if (!item) return;

    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = item[0];

    const unitPrice = document.createElement("small");
    unitPrice.textContent = money(PRICE) + " par pagne";

    details.append(title, unitPrice);

    const quantity = document.createElement("div");
    quantity.className = "quantity";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.dataset.minus = id;
    minus.setAttribute("aria-label", "Diminuer la quantité");
    minus.textContent = "−";

    const quantityValue = document.createElement("strong");
    quantityValue.textContent = cart[id];

    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.plus = id;
    plus.setAttribute("aria-label", "Augmenter la quantité");
    plus.textContent = "+";

    quantity.append(minus, quantityValue, plus);

    const subtotal = document.createElement("strong");
    subtotal.textContent = money(cart[id] * PRICE);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.dataset.remove = id;
    remove.textContent = "Retirer";

    row.append(details, quantity, subtotal, remove);
    root.appendChild(row);
  });
}

/* =========================================
   AJOUT AU PANIER
   ========================================= */

if (grid) {
  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    const id = button.dataset.add;

    cart[id] = (cart[id] || 0) + 1;
    renderCart();
  });
}

/* =========================================
   MODIFICATION DU PANIER
   ========================================= */

const cartRoot = document.getElementById("cart-items");

if (cartRoot) {
  cartRoot.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.plus !== undefined) {
      const id = button.dataset.plus;
      cart[id] = (cart[id] || 0) + 1;
    }

    if (button.dataset.minus !== undefined) {
      const id = button.dataset.minus;
      cart[id] = Math.max(0, (cart[id] || 0) - 1);
    }

    if (button.dataset.remove !== undefined) {
      delete cart[button.dataset.remove];
    }

    renderCart();
  });
}

/* =========================================
   COMMANDE DU PANIER SUR WHATSAPP
   ========================================= */

const checkout = document.getElementById("checkout");

if (checkout) {
  checkout.addEventListener("click", () => {
    const ids = Object.keys(cart).filter(id => cart[id] > 0);

    if (ids.length === 0) {
      alert("Votre panier est vide. Ajoutez un pagne avant de commander.");
      return;
    }

    const lines = ids.map(id => {
      const item = data[Number(id)];

      return `${item[0]} : ${cart[id]} x ${PRICE} FCFA = ${money(cart[id] * PRICE)}`;
    });

    const count = ids.reduce((sum, id) => sum + cart[id], 0);
    const total = count * PRICE;

    const message = [
      "Bonjour Bonheur Parfaite, voici ma commande :",
      "",
      ...lines,
      "",
      `Quantité totale : ${count} pagne(s)`,
      `Total estimé : ${money(total)}`,
      "Merci de me confirmer la disponibilité et la livraison."
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}

/* =========================================
   FORMULAIRE DE COMMANDE
   ========================================= */

const orderForm = document.getElementById("form");

if (orderForm) {
  orderForm.addEventListener("submit", event => {
    event.preventDefault();

    const form = new FormData(orderForm);
    const quantity = Math.max(
      1,
      parseInt(form.get("quantite"), 10) || 1
    );

    const message = [
      "Bonjour Bonheur Parfaite, je souhaite commander.",
      `Nom : ${form.get("nom") || ""}`,
      `Téléphone : ${form.get("tel") || ""}`,
      `Collection : ${form.get("collection") || ""}`,
      `Couleur : ${form.get("couleur") || "Non précisée"}`,
      `Quantité : ${quantity}`,
      `Prix unitaire : ${money(PRICE)}`,
      `Total estimé : ${money(quantity * PRICE)}`,
      `Message : ${form.get("message") || "Aucun"}`
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}

/* =========================================
   ANNÉE DU PIED DE PAGE
   ========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   DÉMARRAGE
   ========================================= */

renderCollections();
renderCart();
startSlideshow();
