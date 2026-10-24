
const PRICE = 18500;
const WHATSAPP = "225566015174";

const data = [
  ['Collection 1', 'Rouge & or', '#923d2e', '#c69b47'],
  ['Collection 2', 'Bleu & ivoire', '#174e67', '#e8ddc5'],
  ['Collection 3', 'Vert & bronze', '#315b45', '#b68a43'],
  ['Collection 4', 'Violet & rose', '#6d3f68', '#d7a1ae'],
  ['Collection 5', 'Jaune & noir', '#d8a92e', '#292323'],
  ['Collection 6', 'Turquoise & sable', '#168c8b', '#e5c9a2'],
  ['Collection 7', 'Orange & indigo', '#d56c32', '#35366d'],
  ['Collection 8', 'Blanc & chocolat', '#f1e7d8', '#5b332a'],
  ['Collection 9', 'Multicolore', '#b83e47', '#2e7771']
];

const grid = document.getElementById('grid');
const sel = document.getElementById('collection');
const cart = {};

const money = amount =>
  new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

// Création des collections et des options du formulaire
data.forEach((item, index) => {
  const number = index + 1;

  const option = document.createElement('option');
  option.value = item[0];
  option.textContent = item[0];
  sel.appendChild(option);

  const card = document.createElement('article');
  card.className = 'card';

  card.innerHTML = `
    <div class="pagne-photo">
      <img
        class="pagne-face face-avant"
        src="images/pagne-baoule-${number}.jpg"
        alt="${item[0]} - face avant"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
      >

      <div class="pagne-placeholder"
           style="display:none;background:linear-gradient(120deg,${item[2]} 0 50%,${item[3]} 50%)">
        <span>${item[0]}</span>
      </div>

      <img
        class="pagne-face face-dos"
        src="images/pagne-baoule-${number}-dos.jpg"
        alt="${item[0]} - face arrière"
        loading="lazy"
        onerror="this.style.display='none';"
      >
    </div>

    <div class="card-content">
      <small>COLLECTION ${String(number).padStart(2, '0')}</small>
      <h3>${item[0]}</h3>
      <p>${item[1]} · Couleurs et motifs à découvrir</p>
      <span class="price">${money(PRICE)}</span>
      <button class="btn" type="button" data-add="${index}">
        Ajouter au panier
      </button>
    </div>
  `;

  grid.appendChild(card);
});

// Panier
function renderCart() {
  const root = document.getElementById('cart-items');
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  const count = ids.reduce((sum, id) => sum + cart[id], 0);

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = money(count * PRICE);

  if (ids.length === 0) {
    root.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
    return;
  }

  root.innerHTML = '';

  ids.forEach(id => {
    const item = data[Number(id)];
    const row = document.createElement('div');
    row.className = 'cart-row';

    row.innerHTML = `
      <div>
        <h3>${item[0]}</h3>
        <small>${money(PRICE)} par pagne</small>
      </div>

      <div class="quantity">
        <button type="button" data-minus="${id}" aria-label="Diminuer">−</button>
        <strong>${cart[id]}</strong>
        <button type="button" data-plus="${id}" aria-label="Augmenter">+</button>
      </div>

      <strong>${money(cart[id] * PRICE)}</strong>

      <button class="remove-btn" type="button" data-remove="${id}">
        Retirer
      </button>
    `;

    root.appendChild(row);
  });
}

// Ajouter au panier
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;

  const id = button.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
});

// Modifier ou retirer un article
document.getElementById('cart-items').addEventListener('click', event => {
  const button = event.target.closest('button');
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

// Commander le panier sur WhatsApp
document.getElementById('checkout').addEventListener('click', () => {
  const ids = Object.keys(cart).filter(id => cart[id] > 0);

  if (!ids.length) {
    alert('Votre panier est vide. Ajoutez un pagne avant de commander.');
    return;
  }

  const lines = ids.map(id =>
    `${data[Number(id)][0]} : ${cart[id]} x ${PRICE} FCFA = ${cart[id] * PRICE} FCFA`
  );

  const count = ids.reduce((sum, id) => sum + cart[id], 0);
  const total = count * PRICE;

  const message = [
    'Bonjour Bonheur Parfaite, voici ma commande :',
    ...lines,
    `Quantité totale : ${count} pagne(s)`,
    `Total estimé : ${money(total)}`,
    'Merci de me confirmer la disponibilité et la livraison.'
  ].join('\n');

  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
});

// Formulaire de commande
document.getElementById('form').addEventListener('submit', event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const quantity = Math.max(
    1,
    parseInt(form.get('quantite'), 10) || 1
  );

  const message = [
    'Bonjour Bonheur Parfaite, je souhaite commander.',
    `Nom : ${form.get('nom')}`,
    `Téléphone : ${form.get('tel')}`,
    `Collection : ${form.get('collection')}`,
    `Couleur : ${form.get('couleur') || 'Non précisée'}`,
    `Quantité : ${quantity}`,
    `Prix unitaire : ${money(PRICE)}`,
    `Total estimé : ${money(quantity * PRICE)}`,
    `Message : ${form.get('message') || 'Aucun'}`
  ].join('\n');

  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
});

// Année du pied de page
document.getElementById('year').textContent = new Date().getFullYear();

renderCart();
