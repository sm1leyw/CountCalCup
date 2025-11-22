/* ===================== เก็บ element ===================== */
const cartIcon = document.getElementById("cartIcon");           // ไอคอนตะกร้า
const cartSidebar = document.getElementById("cartSidebar");     // sidebar ตะกร้า
const backBtn = document.getElementById("backBtn");             // ปุ่มกลับ sidebar
const clearBtn = document.getElementById("clearBtn");           // ปุ่มเคลียร์ตะกร้า
const checkoutBtn = document.getElementById("checkoutBtn");     // ปุ่มสั่งซื้อ
const checkStatusBtn = document.getElementById("checkStatusBtn"); // ปุ่มตรวจสอบสถานะ
const cartItems = document.getElementById("cartItems");         // container รายการสินค้าในตะกร้า
const totalPriceEl = document.getElementById("totalPrice");     // element แสดงราคารวม
const totalCalEl = document.getElementById("totalCal");         // element แสดงแคลอรี่รวม
const totalProteinEl = document.getElementById("totalProtein"); // element แสดงโปรตีนรวม
const totalCarbEl = document.getElementById("totalCarb");       // element แสดงคาร์บรวม
const cartCount = document.getElementById("cartCount");         // element แสดงจำนวนสินค้าในตะกร้า
const dingSound = document.getElementById("dingSound");         // เสียงเพิ่มสินค้า

// popup สถานะ
const statusPopup = document.getElementById("statusPopup");     // overlay popup
const orderStatus = document.getElementById("orderStatus");     // ข้อความสถานะ
const closeStatus = document.getElementById("closeStatus");     // ปุ่มปิด popup

/* ===================== ตัวแปรเก็บสินค้า ===================== */
let cart = []; // array เก็บสินค้า {name, price, cal, protein, carb, qty}

/* ===================== เปิด/ปิด Sidebar ===================== */
cartIcon.addEventListener("click", () => cartSidebar.classList.add("active")); // เปิด sidebar
backBtn.addEventListener("click", () => cartSidebar.classList.remove("active")); // ปิด sidebar

/* ===================== เพิ่มสินค้าเข้าสู่ตะกร้า ===================== */
const addButtons = document.querySelectorAll(".enter-btn"); // ปุ่ม "เพิ่มในตะกร้า"

addButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const item = e.target.closest(".menu-item"); // หา container menu-item
    const name = item.querySelector("h3").innerText; // ชื่อสินค้า
    const price = parseFloat(item.querySelector("p:nth-of-type(2)").innerText.replace(" บาท","")); // ราคา
    const info = item.querySelector("p:nth-of-type(1)").innerText; // ข้อมูล nutrition

    // แปลงข้อมูล nutrition เป็นตัวเลข
    const cal = parseInt(info.match(/แคล (\d+)/)[1]);
    const protein = parseInt(info.match(/โปรตีน (\d+)/)[1]);
    const carb = parseInt(info.match(/คาร์บ (\d+)/)[1]);

    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
    const existing = cart.find(c => c.name === name);
    if (existing) {
      existing.qty += 1; // เพิ่มจำนวน
    } else {
      cart.push({ name, price, cal, protein, carb, qty: 1 }); // เพิ่มใหม่
    }

    updateCart(); // อัปเดตตะกร้า

    // เล่นเสียง ding
    if (dingSound && dingSound.src) {
      dingSound.currentTime = 0;
      dingSound.play();
    }

    // แสดงเอฟเฟกต์ pop ที่จำนวนสินค้า
    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 200);
  });
});

/* ===================== ฟังก์ชันอัปเดตตะกร้า ===================== */
function updateCart() {
  cartItems.innerHTML = ""; // ล้างรายการก่อน
  let totalPrice = 0, totalCal = 0, totalProtein = 0, totalCarb = 0, count = 0;

  cart.forEach((item, index) => {
    // คำนวณผลรวม
    totalPrice += item.price * item.qty;
    totalCal += item.cal * item.qty;
    totalProtein += item.protein * item.qty;
    totalCarb += item.carb * item.qty;
    count += item.qty;

    // สร้าง div แสดงสินค้าแต่ละชิ้น
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <p><strong>${item.name}</strong> x${item.qty}</p>
      <p>${item.price * item.qty}฿</p>
      <button class="remove-btn" data-index="${index}">ลบ 1</button>
    `;
    cartItems.appendChild(div);
  });

  // อัปเดตจำนวนสินค้า
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? "block" : "none";

  // อัปเดตรายละเอียดรวม
  totalPriceEl.textContent = totalPrice.toFixed(2);
  totalCalEl.textContent = totalCal;
  totalProteinEl.textContent = totalProtein;
  totalCarbEl.textContent = totalCarb;
}

/* ===================== ลบสินค้า 1 ชิ้น ===================== */
cartItems.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-btn")) return; // ตรวจสอบปุ่มลบ
  const index = e.target.dataset.index;
  if (cart[index].qty > 1) {
    cart[index].qty -= 1; // ลดจำนวน
  } else {
    cart.splice(index, 1); // ลบออกจาก array
  }
  updateCart();
});

/* ===================== เคลียร์ตะกร้า ===================== */
clearBtn.addEventListener("click", () => {
  cart = [];        // ลบสินค้าใน array
  updateCart();     // อัปเดตตะกร้า
});

/* ===================== สั่งซื้อ (แก้ไขใน shopF1.js) ===================== */
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("ยังไม่มีสินค้าในตะกร้า!");
    return;
  }

  // 1. สุ่มเลข Order ID
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const orderId = "#ORD-" + randomId;

  // 2. เตรียมข้อมูลออเดอร์
  const orderData = {
    id: orderId,
    customerName: "User " + randomId, // สมมติชื่อลูกค้า
    items: cart, // รายการอาหาร
    totalPrice: document.getElementById("totalPrice").textContent,
    status: "รอรับออเดอร์", // สถานะเริ่มต้น
    timestamp: new Date().toLocaleString() // เวลาที่สั่ง
  };

  // 3. บันทึก "Current Order" (สำหรับให้ลูกค้าดูสถานะตัวเอง)
  localStorage.setItem("currentOrder", JSON.stringify(orderData));

  // ★★★ 4. บันทึกลง "รายการออเดอร์รวมของร้าน" (สำหรับ Backend) ★★★
  let shopOrders = JSON.parse(localStorage.getItem("shopOrders")) || []; // ดึงรายการเก่ามา
  shopOrders.push(orderData); // เพิ่มออเดอร์ใหม่เข้าไป
  localStorage.setItem("shopOrders", JSON.stringify(shopOrders)); // บันทึกกลับ

  // 5. แสดง Popup และย้ายหน้า
  showSuccessPopup(); 
  if (dingSound && dingSound.src) dingSound.play();

  setTimeout(() => {
      window.location.href = "status.html"; 
  }, 1500);

  cart = [];
  updateCart();
});

/* ===================== ฟังก์ชัน popup สั่งซื้อสำเร็จ ===================== */
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
      <h2>สั่งซื้อสำเร็จ</h2>
      <button id="okBtn">ตกลง</button>
    </div>
  `;
  document.body.appendChild(popup);

  // ปุ่มตกลงปิด popup
  document.getElementById("okBtn").addEventListener("click", () => popup.remove());
}
