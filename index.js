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
          <p>QTD: ${item.qtd}</p>
          <p class="font-medium mt-2">R$ ${(item.price * item.qtd).toFixed(
            2
          )}</p>
        </div>

        <button class="remove-btn" data-name="${item.name}">
          Remover
        </button>
      </div>

      
      
    `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toFixed(2);
  counter.textContent = `(${cart.length})`;
}

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

checkout.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "ops o restaurante esta fechado",
      duration: 3000,

      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (address.value === "") {
    addressWarn.classList.remove("hidden");
    address.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.qtd}) Preço: ${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "86995064931";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${address.value}`,
    "_blank"
  );

  cart.length = 0;
  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 15 && hora < 20;
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
