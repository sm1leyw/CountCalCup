/* ===== จับ element ของโปรไฟล์ panel ===== */
const profileBtn = document.getElementById("profileBtn"); // ปุ่มเปิด panel
const profilePanel = document.getElementById("profilePanel"); // แถบ panel ของโปรไฟล์
const closeProfile = document.getElementById("closeProfile"); // ปุ่มปิด panel
const overlay = document.getElementById("profileOverlay"); // Overlay ด้านหลัง panel

/* ===== เปิด panel เมื่อกดปุ่มโปรไฟล์ ===== */
profileBtn.addEventListener("click", () => {
  profilePanel.classList.add("active"); // เพิ่ม class .active ให้ panel
  overlay.classList.add("active");      // เพิ่ม class .active ให้ overlay
});

/* ===== ปิด panel เมื่อกดปุ่มปิดหรือ overlay ===== */
closeProfile.addEventListener("click", closeProfilePanel); // ปุ่ม ←
overlay.addEventListener("click", closeProfilePanel);      // คลิกที่ overlay ก็ปิดได้

/* ===== ฟังก์ชันปิด panel ===== */
function closeProfilePanel() {
  profilePanel.classList.remove("active"); // เอา class .active ออก
  overlay.classList.remove("active");      // ซ่อน overlay
}

/* ===== จับปุ่มยืนยันสถานะออเดอร์ทั้งหมด ===== */
const submitButtons = document.querySelectorAll(".submit-btn");

/* ===== เพิ่ม event ให้แต่ละปุ่ม ===== */
submitButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const orderBox = e.target.closest(".order-box"); // หา order-box ที่ปุ่มนี้อยู่
    const select = orderBox.querySelector("select"); // หา select ของออเดอร์
    const foodName = orderBox.querySelector("h3").innerText; // ชื่ออาหาร
    const status = select.value; // ค่าที่เลือกจาก select

    showStatusPopup(`${foodName} ${status}`); // แสดง popup แจ้งสถานะ
  });
});

/* ===== ฟังก์ชันสร้าง popup ===== */
function showStatusPopup(message) {
  const popupOverlay = document.createElement("div"); // สร้าง overlay ใหม่
  popupOverlay.className = "popup-overlay";

  const popupBox = document.createElement("div"); // สร้างกล่อง popup
  popupBox.className = "popup-box";

  /* ===== ใส่ HTML ของ popup ===== */
  popupBox.innerHTML = `
    <div class="checkmark-container">
      <div class="checkmark"></div> <!-- แอนิเมชันติ๊กถูก -->
    </div>
    <p>${message}</p>               <!-- ข้อความแจ้งเตือน -->
    <button class="ok-btn">ตกลง</button> <!-- ปุ่มปิด popup -->
  `;

  popupOverlay.appendChild(popupBox); // ใส่กล่อง popup ลง overlay
  document.body.appendChild(popupOverlay); // ใส่ overlay ลงใน body

  /* ===== แสดง popup ด้วย animation ===== */
  setTimeout(() => {
    popupOverlay.classList.add("show"); // overlay fade in
    popupBox.classList.add("show");     // popup scale in
  }, 50); // ดีเลย์เล็กน้อยเพื่อให้ transition ทำงาน

  /* ===== ปิด popup เมื่อกดปุ่มตกลง ===== */
  popupBox.querySelector(".ok-btn").addEventListener("click", () => {
    popupOverlay.classList.remove("show"); // ซ่อน overlay และ popup
    setTimeout(() => popupOverlay.remove(), 300); // ลบ element หลัง animation
  });
}
