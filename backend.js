// =====================
// 🔹 จัดการปุ่มโปรไฟล์ (Slide Panel)
// =====================
const profileBtn = document.getElementById("profileBtn");     // ปุ่มเปิดแถบโปรไฟล์
const profilePanel = document.getElementById("profilePanel"); // แถบโปรไฟล์
const closeProfile = document.getElementById("closeProfile"); // ปุ่มปิดแถบ
const overlay = document.getElementById("profileOverlay");    // พื้นหลังมืดเมื่อเปิดแถบ

// เมื่อกดปุ่มโปรไฟล์ → แถบข้างเลื่อนออกมา
profileBtn.addEventListener("click", () => {
  profilePanel.classList.add("active");  // เพิ่ม class "active" เพื่อเลื่อน panel ออกมา
  overlay.classList.add("active");       // แสดงพื้นหลังมืด
});

// เมื่อกดปุ่มปิดหรือคลิกพื้นหลัง → แถบเลื่อนกลับ
closeProfile.addEventListener("click", closeProfilePanel);
overlay.addEventListener("click", closeProfilePanel);

function closeProfilePanel() {
  profilePanel.classList.remove("active"); // ซ่อน panel
  overlay.classList.remove("active");      // ซ่อน overlay
}

// ปุ่มยืนยันสถานะ (แต่ละรายการออเดอร์)
const submitButtons = document.querySelectorAll(".submit-btn"); // เลือกปุ่มยืนยันทั้งหมด

submitButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const orderBox = e.target.closest(".order-box"); // หา container ของออเดอร์ที่กดปุ่ม
    const select = orderBox.querySelector("select"); // ดึง select ของออเดอร์นั้น
    const foodName = orderBox.querySelector("h3").innerText; // ชื่ออาหาร
    const status = select.value; // สถานะที่เลือก

    // แสดงแจ้งเตือนแบบ popup กลางจอ (พร้อมติ๊กถูก)
    showStatusPopup(`${foodName} ${status}`);
  });
});


//  ฟังก์ชันแสดง popup กลางจอ
function showStatusPopup(message) {
  // สร้าง overlay + popup
  const popupOverlay = document.createElement("div");
  popupOverlay.className = "popup-overlay"; // ใช้ class สำหรับ styling overlay

  const popupBox = document.createElement("div");
  popupBox.className = "popup-box";         // ใช้ class สำหรับกล่อง popup

  // ใส่เนื้อหาภายใน popup
  popupBox.innerHTML = `
    <div class="checkmark-container">
      <div class="checkmark"></div> <!-- แอนิเมชันติ๊กถูก -->
    </div>
    <p>${message}</p>               <!-- ข้อความแจ้งเตือน -->
    <button class="ok-btn">ตกลง</button> <!-- ปุ่มปิด popup -->
  `;

  popupOverlay.appendChild(popupBox);     // ใส่ popup ลงใน overlay
  document.body.appendChild(popupOverlay); // ใส่ overlay ลงใน body

  // แสดงแอนิเมชันแบบ delay เล็กน้อย
  setTimeout(() => {
    popupOverlay.classList.add("show"); // เพิ่ม class show → opacity 1
    popupBox.classList.add("show");     // เพิ่ม class show → scale 1
  }, 50);

  // ปิด popup เมื่อกดปุ่ม OK
  popupBox.querySelector(".ok-btn").addEventListener("click", () => {
    popupOverlay.classList.remove("show"); // เริ่ม animation ปิด
    setTimeout(() => popupOverlay.remove(), 300); // ลบ element หลัง animation เสร็จ
  });
}