// รอให้โหลดหน้าเว็บเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', () => {
    
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    // ฟังก์ชันเปิด-ปิดเมนูเมื่อคลิกปุ่ม Hamburger
    hamburger.addEventListener('click', () => {
        // สลับ class 'active' เพื่อแสดงหรือซ่อนเมนู
        navMenu.classList.toggle('active');
        
        // เปลี่ยนไอคอนจาก ขีด 3 เส้น (Bars) เป็น กากบาท (X)
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // ปิดเมนูเมื่อคลิกที่ลิงก์ (เพื่อ UX ที่ดี เวลากดแล้วเมนูควรหุบ)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

});

// เปิด pop-up ทันทีเมื่อโหลดเว็บ
window.addEventListener("load", () => {
    document.getElementById("tributePopup").classList.remove("hidden");
});

// ปิด pop-up
document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("tributePopup").classList.add("hidden");
});
