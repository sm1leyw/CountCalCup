/* backend.js */

// จับ element ที่ต้องใช้
const orderList = document.getElementById("orderList");
const historyList = document.getElementById("historyList");

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
});

// ==============================================
// 1. ฟังก์ชันแสดงรายการออเดอร์ (Active Orders)
// ==============================================
function renderOrders() {
    const shopOrders = JSON.parse(localStorage.getItem("shopOrders")) || [];
    orderList.innerHTML = "";

    if (shopOrders.length === 0) {
        orderList.innerHTML = "<p style='color:#888;'>ไม่มีออเดอร์ที่รอดำเนินการ</p>";
        return;
    }

    // วนลูปสร้าง (กลับลำดับให้ของใหม่ขึ้นก่อน)
    shopOrders.slice().reverse().forEach((order, index) => {
        // คำนวณ index จริงใน array ต้นฉบับ
        const realIndex = shopOrders.length - 1 - index;

        // สร้าง Box
        const box = document.createElement("div");
        box.className = "order-box";

        // รายการอาหาร
        let itemsHtml = "";
        order.items.forEach(i => itemsHtml += `<li>${i.name} x${i.qty}</li>`);

        // HTML ภายในกล่อง
        // สังเกต: ผมเอา onchange ออกจาก select แล้ว เพื่อให้รอการกดปุ่มบันทึก
        box.innerHTML = `
            <img src="image/smoothie.png" alt="img">
            <div class="order-info">
                <h3>${order.id}</h3>
                <ul style="text-align:left; padding-left:20px; margin:5px 0; font-size:0.9rem; color:#555;">
                    ${itemsHtml}
                </ul>
                <p style="font-weight:bold;">ยอดรวม: ${order.totalPrice} ฿</p>
                
                <select id="select-${realIndex}" class="status-select">
                    <option value="รอรับออเดอร์" ${order.status === 'รอรับออเดอร์' ? 'selected' : ''}>รอรับออเดอร์</option>
                    <option value="กำลังทำอาหาร" ${order.status === 'กำลังทำอาหาร' ? 'selected' : ''}>กำลังทำอาหาร</option>
                    <option value="เสร็จแล้ว" ${order.status === 'เสร็จแล้ว' ? 'selected' : ''}>เสร็จแล้ว</option>
                    <option value="จัดส่งแล้ว" ${order.status === 'จัดส่งแล้ว' ? 'selected' : ''}>จัดส่งแล้ว</option>
                    <option value="ยกเลิกออเดอร์" ${order.status === 'ยกเลิกออเดอร์' ? 'selected' : ''}>ยกเลิกออเดอร์</option>
                </select>

                <button class="submit-btn" onclick="handleSave(${realIndex})">บันทึก</button>
            </div>
        `;
        orderList.appendChild(box);
    });
}

// ==============================================
// 2. ฟังก์ชันจัดการเมื่อกดปุ่ม "บันทึก"
// ==============================================
window.handleSave = function(index) {
    // 1. ดึงข้อมูลออเดอร์ทั้งหมด
    let shopOrders = JSON.parse(localStorage.getItem("shopOrders")) || [];
    
    // 2. ดึงค่าสถานะที่เลือกจาก Dropdown
    const selectEl = document.getElementById(`select-${index}`);
    const newStatus = selectEl.value;
    const currentOrderData = shopOrders[index]; // ข้อมูลออเดอร์ตัวที่กำลังแก้

    // 3. เช็คว่าเป็นสถานะจบงานไหม? (เสร็จ / จัดส่ง / ยกเลิก)
    const isFinished = ["เสร็จแล้ว", "จัดส่งแล้ว", "ยกเลิกออเดอร์"].includes(newStatus);

    if (isFinished) {
        // === กรณีจบงาน: ย้ายไป History ===
        
        // 3.1 อัปเดตสถานะครั้งสุดท้าย
        currentOrderData.status = newStatus;
        
        // 3.2 เก็บลง History Array
        let historyLog = JSON.parse(localStorage.getItem("orderHistory")) || [];
        historyLog.push(currentOrderData);
        localStorage.setItem("orderHistory", JSON.stringify(historyLog));

        // 3.3 ลบออกจากรายการปัจจุบัน
        shopOrders.splice(index, 1);
        localStorage.setItem("shopOrders", JSON.stringify(shopOrders));

        // 3.4 แจ้งเตือนและรีเฟรชหน้า
        showStatusPopup(`ออเดอร์ ${currentOrderData.id} ย้ายไปประวัติแล้ว (${newStatus})`);
        renderOrders();  // รีโหลดรายการ Active ใหม่
        renderHistory(); // รีโหลดรายการ History ใหม่

    } else {
        // === กรณีงานยังไม่จบ (เช่น แค่รับออเดอร์, กำลังทำ) ===
        
        // แค่อัปเดตสถานะใน Active List
        shopOrders[index].status = newStatus;
        localStorage.setItem("shopOrders", JSON.stringify(shopOrders));
        
        showStatusPopup(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อย`);
    }

    // ★ อัปเดตฝั่งลูกค้า (status.html) ให้เห็นสถานะล่าสุดด้วย ★
    const userViewOrder = JSON.parse(localStorage.getItem("currentOrder"));
    if (userViewOrder && userViewOrder.id === currentOrderData.id) {
        userViewOrder.status = newStatus;
        localStorage.setItem("currentOrder", JSON.stringify(userViewOrder));
    }
};

// ==============================================
// 3. ฟังก์ชันแสดง History Log ใน Sidebar
// ==============================================
function renderHistory() {
    const historyLog = JSON.parse(localStorage.getItem("orderHistory")) || [];
    historyList.innerHTML = "";

    if (historyLog.length === 0) {
        historyList.innerHTML = "<p style='text-align:center; color:#999;'>ยังไม่มีประวัติ</p>";
        return;
    }

    // เรียงจากใหม่ไปเก่า
    historyLog.slice().reverse().forEach(order => {
        const item = document.createElement("div");
        
        // กำหนดสีแถบข้างตามสถานะ
        let statusClass = "";
        if (order.status === "เสร็จแล้ว") statusClass = "status-done";
        else if (order.status === "จัดส่งแล้ว") statusClass = "status-sent";
        else if (order.status === "ยกเลิกออเดอร์") statusClass = "status-cancel";

        item.className = `history-item ${statusClass}`;
        
        // สร้างรายการอาหารแบบย่อ
        let foodText = order.items.map(i => `${i.name}(${i.qty})`).join(", ");

        item.innerHTML = `
            <h4>${order.id}</h4>
            <p>${foodText}</p>
            <p>ยอด: ${order.totalPrice} ฿</p>
            <span class="status-text" style="color:#555;">สถานะ: ${order.status}</span>
            <br><small style="color:#aaa;">${order.timestamp}</small>
        `;
        historyList.appendChild(item);
    });
}

// ฟังก์ชันล้างประวัติ
window.clearHistory = function() {
    if(confirm("ต้องการลบประวัติทั้งหมดใช่หรือไม่?")) {
        localStorage.removeItem("orderHistory");
        renderHistory();
    }
};

// ==============================================
// 4. จัดการ Sidebar (เปิด/ปิด History และ Profile)
// ==============================================
const overlay = document.getElementById("overlay");

// --- History Panel ---
const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const closeHistory = document.getElementById("closeHistory");

historyBtn.addEventListener("click", () => {
    renderHistory(); // โหลดข้อมูลใหม่ทุกครั้งที่เปิด
    historyPanel.classList.add("active");
    overlay.classList.add("active");
});

closeHistory.addEventListener("click", () => {
    historyPanel.classList.remove("active");
    overlay.classList.remove("active");
});

// --- Profile Panel (ของเดิม) ---
const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");
const closeProfile = document.getElementById("closeProfile");

profileBtn.addEventListener("click", () => {
    profilePanel.classList.add("active");
    overlay.classList.add("active");
});

closeProfile.addEventListener("click", () => {
    profilePanel.classList.remove("active");
    overlay.classList.remove("active");
});

// ปิดเมื่อกด Overlay
overlay.addEventListener("click", () => {
    historyPanel.classList.remove("active");
    profilePanel.classList.remove("active");
    overlay.classList.remove("active");
});

// ==============================================
// 5. Popup Notification (Animation)
// ==============================================
window.showStatusPopup = function(message) {
    // สร้าง Element Popup ชั่วคราว
    const div = document.createElement("div");
    div.className = "popup-overlay show"; // ใช้ class show เลยเพื่อความไว
    div.innerHTML = `
        <div class="popup-box show" style="transform:scale(1); opacity:1;">
            <div class="checkmark-container"><div class="checkmark"></div></div>
            <p>${message}</p>
            <button id="tempOkBtn" class="ok-btn">ตกลง</button>
        </div>
    `;
    document.body.appendChild(div);

    // ปุ่มตกลง
    div.querySelector("#tempOkBtn").addEventListener("click", () => {
        div.remove();
    });

    // Auto Close 2 วิ
    setTimeout(() => {
        if(document.body.contains(div)) div.remove();
    }, 2000);
};