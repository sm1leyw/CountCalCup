// ====== 🔸 ตัวแปรหลัก ======
// ดึง element ต่าง ๆ จาก HTML มาใช้งาน
const cartIcon = document.getElementById("cartIcon"); // ไอคอนตะกร้า
const cartSidebar = document.getElementById("cartSidebar"); // Sidebar ตะกร้า
const backBtn = document.getElementById("backBtn"); // ปุ่มย้อนกลับ
const clearBtn = document.getElementById("clearBtn"); // ปุ่มเคลียร์ตะกร้า
const checkoutBtn = document.getElementById("checkoutBtn"); // ปุ่มสั่งซื้อ
const checkStatusBtn = document.getElementById("checkStatusBtn"); // ปุ่มเช็คสถานะ (ซ่อนตอนเริ่มต้น)
const cartItems = document.getElementById("cartItems"); // รายการสินค้าในตะกร้า
const totalPriceEl = document.getElementById("totalPrice"); // รวมราคา
const totalCalEl = document.getElementById("totalCal"); // รวมแคล
const totalProteinEl = document.getElementById("totalProtein"); // รวมโปรตีน
const totalCarbEl = document.getElementById("totalCarb"); // รวมคาร์บ
const cartCount = document.getElementById("cartCount"); // ตัวเลขแสดงจำนวนสินค้า
const successMsg = document.getElementById("successMsg"); // ข้อความยืนยัน
const dingSound = document.getElementById("dingSound"); // เสียง ding

const statusPopup = document.getElementById("statusPopup"); // popup แสดงสถานะ
const orderStatus = document.getElementById("orderStatus"); // ข้อความสถานะออเดอร์
const closeStatus = document.getElementById("closeStatus"); // ปุ่มปิด popup

const backToStores = document.getElementById("backToStores"); // ปุ่มกลับไปร้าน
const menuPage = document.getElementById("menuPage"); // หน้าเมนู
const restaurantList = document.getElementById("restaurantList"); // หน้า list ร้าน

let cart = []; // เก็บรายการสินค้าในตะกร้า

// ====== 🔸 ฟังก์ชันเปิด/ปิด Sidebar ======
cartIcon.addEventListener("click", () => cartSidebar.classList.add("active")); // เปิด sidebar
backBtn.addEventListener("click", () => cartSidebar.classList.remove("active")); // ปิด sidebar

// ====== 🔸 เพิ่มในตะกร้า ======
const addButtons = document.querySelectorAll(".enter-btn"); // ปุ่ม "เพิ่มในตะกร้า"

addButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const item = e.target.closest(".menu-item"); // หาเมนูที่ถูกคลิก
    const name = item.querySelector("h3").innerText; // ชื่อเมนู
    const price = parseFloat(item.querySelector("p:nth-of-type(2)").innerText); // ราคา
    const info = item.querySelector("p:nth-of-type(1)").innerText; // ข้อมูลโภชนาการ

    // ดึงค่าตัวเลขโภชนาการจาก text
    const cal = parseInt(info.match(/แคล (\d+)/)[1]);
    const protein = parseInt(info.match(/โปรตีน (\d+)/)[1]);
    const carb = parseInt(info.match(/คาร์บ (\d+)/)[1]);

    // ตรวจสอบว่ามีสินค้าในตะกร้าแล้วหรือยัง
    const existing = cart.find(c => c.name === name);
    if (existing) {
      existing.qty += 1; // เพิ่มจำนวน
    } else {
      cart.push({ name, price, cal, protein, carb, qty: 1 }); // เพิ่มสินค้าใหม่
    }

    updateCart(); // อัปเดตตะกร้า

    // เล่นเสียง ding
    if (dingSound) {
      dingSound.currentTime = 0;
      dingSound.play();
    }

    // แอนิเมชันเด้งตัวเลขข้างตะกร้า
    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 200);
  });
});

// ====== 🔸 อัปเดตตะกร้า ======
function updateCart() {
  cartItems.innerHTML = ""; // ลบ element เก่า
  let totalPrice = 0, totalCal = 0, totalProtein = 0, totalCarb = 0, count = 0;

  // loop แต่ละสินค้าในตะกร้า
  cart.forEach ((item, index) => {
    totalPrice += item.price * item.qty;
    totalCal += item.cal * item.qty;
    totalProtein += item.protein * item.qty;
    totalCarb += item.carb * item.qty;
    count += item.qty;

    // สร้าง div ของแต่ละสินค้า
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <p><strong>${item.name}</strong> x${item.qty}</p>
      <p>${item.price * item.qty}฿</p>
      <button class="remove-btn" data-index="${index}">ลบ 1</button>
    `;
    cartItems.appendChild(div);
  });

  // อัปเดตตัวเลขข้างตะกร้า
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? "block" : "none";

  // อัปเดตราคาและโภชนาการรวม
  totalPriceEl.textContent = totalPrice.toFixed(2);
  totalCalEl.textContent = totalCal;
  totalProteinEl.textContent = totalProtein;
  totalCarbEl.textContent = totalCarb;

  // ปุ่มลบทีละ 1
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (cart[index].qty > 1) {
        cart[index].qty -= 1; // ลดจำนวน 1
      } else {
        cart.splice(index, 1); // ลบสินค้าออก
      }
      updateCart(); // อัปเดตใหม่
    });
  });
}

// ====== 🔸 เคลียร์ตะกร้า ======
clearBtn.addEventListener("click", () => {
  cart = []; // ลบทั้งหมด
  updateCart(); // อัปเดตตะกร้า
});

// ====== 🔸 ปุ่ม "สั่งซื้อ" ======
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("ยังไม่มีสินค้าในตะกร้า!");
    return;
  }

  showSuccessPopup(); // แสดง popup สั่งซื้อสำเร็จ

  if (dingSound) dingSound.play(); // เล่นเสียง

  cart = []; // ลบตะกร้า
  updateCart(); // อัปเดต

  checkStatusBtn.classList.remove("hidden"); // ✅ แสดงปุ่มเช็คสถานะหลังสั่งซื้อ
});

// ====== 🔸 แสดง Popup สั่งซื้อสำเร็จ ======
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

  // ปุ่มปิด popup
  document.getElementById("okBtn").addEventListener("click", () => popup.remove());
}

// ====== 🔸 ปุ่มเช็คสถานะ ======
checkStatusBtn.addEventListener("click", () => {
  statusPopup.classList.remove("hidden"); // แสดง popup
  orderStatus.textContent = "กำลังทำอาหาร 🍳"; // แสดงสถานะเริ่มต้น

  setTimeout(() => {
    orderStatus.textContent = "จัดส่งแล้ว 🚚"; // เปลี่ยนสถานะหลัง 5 วินาที
  }, 5000);

  setTimeout(() => {
    statusPopup.classList.add("hidden"); // ปิด popup หลัง 8 วินาที
  }, 8000);
});

// ปุ่มปิด popup สถานะ
closeStatus.addEventListener("click", () => {
  statusPopup.classList.add("hidden");
});

// ====== 🔸 ปุ่มกลับไปร้าน ======
if (backToStores) {
  backToStores.addEventListener("click", () => {
    menuPage.classList.add("hidden"); // ซ่อนหน้ารายการเมนู
    restaurantList.classList.remove("hidden"); // แสดงหน้า list ร้าน
  });
}