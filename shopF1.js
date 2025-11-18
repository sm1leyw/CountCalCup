const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const backBtn = document.getElementById("backBtn");
const clearBtn = document.getElementById("clearBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkStatusBtn = document.getElementById("checkStatusBtn");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const totalCalEl = document.getElementById("totalCal");
const totalProteinEl = document.getElementById("totalProtein");
const totalCarbEl = document.getElementById("totalCarb");
const cartCount = document.getElementById("cartCount");
const successMsg = document.getElementById("successMsg");
const dingSound = document.getElementById("dingSound");

const statusPopup = document.getElementById("statusPopup");
const orderStatus = document.getElementById("orderStatus");
const closeStatus = document.getElementById("closeStatus");

const backToStores = document.getElementById("backToStores");
const menuPage = document.getElementById("menuPage");
const restaurantList = document.getElementById("restaurantList");

let cart = [];

cartIcon.addEventListener("click", () => cartSidebar.classList.add("active"));
backBtn.addEventListener("click", () => cartSidebar.classList.remove("active"));

const addButtons = document.querySelectorAll(".enter-btn");

addButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const item = e.target.closest(".menu-item");
    const name = item.querySelector("h3").innerText;
    const price = parseFloat(item.querySelector("p:nth-of-type(2)").innerText);
    const info = item.querySelector("p:nth-of-type(1)").innerText;

    const cal = parseInt(info.match(/แคล (\d+)/)[1]);
    const protein = parseInt(info.match(/โปรตีน (\d+)/)[1]);
    const carb = parseInt(info.match(/คาร์บ (\d+)/)[1]);

    const existing = cart.find(c => c.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, cal, protein, carb, qty: 1 });
    }

    updateCart();

    if (dingSound) {
      dingSound.currentTime = 0;
      dingSound.play();
    }

    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 200);
  });
});

function updateCart() {
  cartItems.innerHTML = "";
  let totalPrice = 0, totalCal = 0, totalProtein = 0, totalCarb = 0, count = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.qty;
    totalCal += item.cal * item.qty;
    totalProtein += item.protein * item.qty;
    totalCarb += item.carb * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <p><strong>${item.name}</strong> x${item.qty}</p>
      <p>${item.price * item.qty}฿</p>
      <button class="remove-btn" data-index="${index}">ลบ 1</button>
    `;
    cartItems.appendChild(div);
  });

  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? "block" : "none";

  totalPriceEl.textContent = totalPrice.toFixed(2);
  totalCalEl.textContent = totalCal;
  totalProteinEl.textContent = totalProtein;
  totalCarbEl.textContent = totalCarb;

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });
  });
}

clearBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("ยังไม่มีสินค้าในตะกร้า!");
    return;
  }

  showSuccessPopup();

  if (dingSound) dingSound.play();

  cart = [];
  updateCart();

  checkStatusBtn.classList.remove("hidden");
});

function showSuccessPopup() {
  const popup = document.createElement("div");
  popup.className = "success-popup";
  popup.innerHTML = `
    <div class="popup-box">
      <div class="checkmark">
        <svg viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="25" cy="25" r="23" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
        </svg>
      </div>
      <h2>สั่งซื้อสำเร็จ!</h2>
      <button id="okBtn">ตกลง</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("okBtn").addEventListener("click", () => popup.remove());
}

checkStatusBtn.addEventListener("click", () => {
  statusPopup.classList.remove("hidden");
  orderStatus.textContent = "กำลังทำอาหาร 🍳";

  setTimeout(() => {
    orderStatus.textContent = "จัดส่งแล้ว 🚚";
  }, 5000);

  setTimeout(() => {
    statusPopup.classList.add("hidden");
  }, 8000);
});

closeStatus.addEventListener("click", () => {
  statusPopup.classList.add("hidden");
});

if (backToStores) {
  backToStores.addEventListener("click", () => {
    menuPage.classList.add("hidden");
    restaurantList.classList.remove("hidden");
  });
}