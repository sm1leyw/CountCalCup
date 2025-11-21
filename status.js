// ดึง element จากหน้า HTML
const orderIdEl = document.getElementById("displayOrderId");
const statusEl = document.getElementById("displayStatus");
const totalPriceEl = document.getElementById("displayTotalPrice");
const orderListEl = document.getElementById("orderList");
const containerEl = document.querySelector(".status-container");

// 1. ดึงข้อมูลจาก Local Storage
const currentOrder = JSON.parse(localStorage.getItem("currentOrder"));

// 2. ตรวจสอบว่ามีข้อมูลออเดอร์หรือไม่
if (currentOrder) {
    // --- แสดงข้อมูลบนหน้าจอ ---
    orderIdEl.innerText = "Order ID: " + currentOrder.id;
    statusEl.innerText = currentOrder.status; // ค่าเริ่มต้น: "รอพ่อครัวรับออเดอร์"
    totalPriceEl.innerText = currentOrder.totalPrice;

    // --- วนลูปสร้างรายการอาหาร ---
    orderListEl.innerHTML = ""; // ล้างค่าเก่า (ถ้ามี)
    
    currentOrder.items.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("item-row");
        
        // จัดรูปแบบ HTML ของแต่ละบรรทัด
        row.innerHTML = `
            <span>${item.name} <span style="color:#888; font-size:0.9em;">(x${item.qty})</span></span>
            <span>${(item.price * item.qty).toFixed(2)} ฿</span>
        `;
        
        orderListEl.appendChild(row);
    });

    // ============================================
    // ฟังก์ชันจำลองการเปลี่ยนสถานะ (Simulation)
    // ============================================
    
    // หลังจาก 5 วินาที -> เปลี่ยนเป็น "กำลังปรุงอาหาร"
    setTimeout(() => {
        statusEl.innerText = "กำลังปรุงอาหาร 🍳";
        statusEl.style.backgroundColor = "#00a86b"; // สีเขียว
        statusEl.style.boxShadow = "0 4px 15px rgba(0, 168, 107, 0.4)";
        // เปลี่ยน animation color (ทำผ่าน JS อาจจะยากหน่อย แต่เปลี่ยนสีพื้นหลังพอช่วยได้)
    }, 5000);

    // หลังจาก 10 วินาที -> เปลี่ยนเป็น "อาหารเสร็จแล้ว"
    setTimeout(() => {
        statusEl.innerText = "อาหารเสร็จแล้ว พร้อมเสิร์ฟ! 🍽️";
        statusEl.style.backgroundColor = "#2196F3"; // สีฟ้า
        statusEl.style.boxShadow = "0 4px 15px rgba(33, 150, 243, 0.4)";
    }, 10000);

} else {
    // กรณีไม่มีข้อมูล (เช่น เปิดไฟล์นี้ขึ้นมาตรงๆ ไม่ได้กดสั่ง)
    containerEl.innerHTML = `
        <h2 style="color: red;">ไม่พบข้อมูลคำสั่งซื้อ</h2>
        <p>กรุณากลับไปเลือกเมนูอาหารก่อนครับ</p>
        <br>
        <a href="index.html" class="back-home-btn">ไปหน้าสั่งอาหาร</a>
    `;
}

/* status.js (เพิ่มต่อท้าย) */

// ฟังก์ชันตรวจสอบสถานะอัปเดตอัตโนมัติ (Real-time Simulation)
setInterval(() => {
    // 1. อ่านข้อมูลล่าสุดจาก LocalStorage
    const updatedOrder = JSON.parse(localStorage.getItem("currentOrder"));

    if (updatedOrder) {
        const displayStatus = document.getElementById("displayStatus");
        
        // 2. เช็คว่าสถานะเปลี่ยนไปจากที่โชว์อยู่ไหม
        if (displayStatus.innerText !== updatedOrder.status) {
            
            // ถ้าเปลี่ยน ให้แก้ไขข้อความและสี
            displayStatus.innerText = updatedOrder.status;
            
            // เปลี่ยนสีตามสถานะ (Optional)
            if (updatedOrder.status === "กำลังทำอาหาร") {
                displayStatus.style.backgroundColor = "#00a86b"; // เขียว
            } else if (updatedOrder.status === "เสร็จแล้ว") {
                displayStatus.style.backgroundColor = "#2196F3"; // ฟ้า
            } else if (updatedOrder.status === "จัดส่งแล้ว") {
                displayStatus.style.backgroundColor = "#FF5722"; // ส้มแดง
                displayStatus.innerText = "จัดส่งแล้ว 🛵";
            }
            
            // เล่น animation แจ้งเตือนนิดหน่อย
            displayStatus.classList.add("pop"); 
            setTimeout(() => displayStatus.classList.remove("pop"), 300);
        }
    }
}, 2000); // ทำงานทุกๆ 2000 มิลลิวินาที (2 วินาที)