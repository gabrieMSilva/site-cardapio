const menu = document.getElementById("menu");
const cartBtn = document.querySelector("#add-cart");
const modal = document.querySelector("#modal");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const closeModalBtn = document.querySelector("#close-modal-btn");
const address = document.querySelector("#address");
const addressWarn = document.querySelector("#address-warn");
const checkout = document.querySelector("#checkout-btn");
const counter = document.querySelector("#cart-count");
const personName = document.querySelector("#personName")
const retiradaBtn = document.querySelector("#retirada-btn")
const bombinhaCheckbox = document.querySelector("#bombinha")
const coxinhaCheckbox = document.querySelector("#coxinha")
const pastelCheckbox = document.querySelector("#pastel")
const canudoCheckbox = document.querySelector("#canudo")

let cart = [];

cartBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

menu.addEventListener("click", (e) => {
  let parentButton = e.target.closest(".btn-add");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.qtd++;
  } else {
    cart.push({
      name,
      price,
      qtd: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qtd;

    const cartItemElement = document.createElement("div");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div>
          <p>${item.name}</p>
          <div class="flex items-center justify-between">
            <button class="qty-btn minus text-2xl" data-name="${item.name}">-</button>
            <p class="mx-2 text-2xl">${item.qtd}</p>
            <button class="qty-btn plus text-2xl " data-name="${item.name}">+</button>
          </div>
          <p class="font-medium mt-2">R$ ${(item.price * item.qtd).toFixed(2)}</p>
        </div>

        <button class="remove-btn" data-name="${item.name}">Remover</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toFixed(2);
  counter.textContent = `(${cart.length})`;
}

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  } else if (e.target.classList.contains("plus")) {
    const name = e.target.getAttribute("data-name");
    addToCart(name, cart.find(item => item.name === name).price);
  } else if (e.target.classList.contains("minus")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  }
});


// checkout.addEventListener("click", () => {
//   if (address.value.trim() === "") {
//     addressWarn.style.display = "block";
//   } else {
//     addressWarn.style.display = "none";
//     // Process checkout
//     console.log("Finalizando pedido", cart, address.value);
//   }
// });

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const name = e.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.qtd > 1) {
      item.qtd -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

address.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    address.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});
personName.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    personName.classList.remove("border-red-500");
    
  }
});

checkout.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante está fechado",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  // Verifica se a opção de retirada não está selecionada
  if (!retiradaBtn.checked && address.value === "") {
    addressWarn.classList.remove("hidden");
    address.classList.add("border-red-500");
    return;
  }

  // Verifica os checkboxes e captura os valores
  const saboresSelecionados = [];
  if (bombinhaCheckbox.checked) {
    saboresSelecionados.push(bombinhaCheckbox.value);
  }
  if (coxinhaCheckbox.checked) {
    saboresSelecionados.push(coxinhaCheckbox.value);
  }
  if (pastelCheckbox.checked) {
    saboresSelecionados.push(pastelCheckbox.value);
  }
  if (canudoCheckbox.checked) {
    saboresSelecionados.push(canudoCheckbox.value);
  }
  

  const withdrawalOption = retiradaBtn.checked ? "Retirada" : "Entrega";
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: 
       (${item.qtd}) Preço: ${item.price} |`;
    })
    .join("");

  // Incluindo os sabores selecionados na mensagem
  const saboresMensagem = saboresSelecionados.length > 0 
  ? ` Sabores selecionados: ${saboresSelecionados.join(", ")} \n` 
  : "\n";

const message = encodeURIComponent(
  `${cartItems} \n` +
  `Endereço: ${address.value} \n` +
  `Nome: ${personName.value} \n` +
  `Opção: ${withdrawalOption} \n` +
  `Total: ${cartTotal.textContent} \n` +
  `${saboresMensagem} \n`
  
);
const phone = "86994384189";


  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );

  cart.length = 0;
  updateCartModal();
});

function checkRestaurantOpen() {
  const today = new Date();
  const diaHj = today.getUTCDay()
  const data = new Date();
  const hora = data.getHours();
  // return hora >= 15 && hora < 20 && diaHj ;

  if (diaHj === 0 || hora < 12 || hora >= 20) {
    return false; // Fechado
  }

  return true; // Aberto
}

const span = document.querySelector("#data-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  span.classList.remove("bg-red-500");
  span.classList.add("bg-green-600");
} else {
  span.classList.remove("bg-green-600");
  span.classList.add("bg-red-500");
}

