// ฟังก์ชันสลับการแสดงผลระหว่าง Login และ Register
function toggleForms() {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    // สลับคลาส hidden (ถ้ามีอยู่ก็เอาออก ถ้าไม่มีก็ใส่เพิ่ม)
    loginBox.classList.toggle('hidden');
    registerBox.classList.toggle('hidden');
}

// ==========================================
// ฟังก์ชันสำหรับ "สมัครสมาชิก" (Register)
// ==========================================
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช

    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    // 1. ตรวจสอบรหัสผ่านว่าตรงกันไหม
    if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน กรุณาลองใหม่");
        return;
    }

    // 2. ดึงข้อมูล User เก่าจาก localStorage (ถ้าไม่มีให้เป็น Array ว่าง [])
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // 3. ตรวจสอบว่ามีชื่อผู้ใช้นี้หรือยัง
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        alert("ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น");
        return;
    }

    // 4. สร้าง Object ข้อมูลลูกค้าใหม่
    const newUser = {
        username: username,
        password: password // หมายเหตุ: ในงานจริงควรเข้ารหัส (Hash) รหัสผ่านก่อนเก็บ
    };

    // 5. เพิ่มลง Array และบันทึกกลับเข้า localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
    
    // เคลียร์ค่าในฟอร์มและสลับกลับไปหน้า Login
    document.getElementById('registerForm').reset();
    toggleForms();
});

// ==========================================
// ฟังก์ชันสำหรับ "เข้าสู่ระบบ" (Login)
// ==========================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชและส่ง form แบบปกติ

    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value;

    // 1. ดึงข้อมูล User ทั้งหมดจาก localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // 2. ค้นหา User ที่ชื่อและรหัสผ่านตรงกัน
    const foundUser = users.find(user => user.username === usernameInput && user.password === passwordInput);

    if (foundUser) {
        alert("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ " + foundUser.username);
        // บันทึก Session ว่าใครล็อกอินอยู่ (เผื่อใช้ในหน้าถัดไป)
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        
        // ย้ายไปหน้า index.html
        window.location.href = 'index.html';
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
});

// ฟังก์ชันสำหรับกดปุ่มลูกตา เปิด/ปิด รหัสผ่าน
function togglePassword(inputId, icon) {
    const inputField = document.getElementById(inputId);
    
    // เช็คว่าตอนนี้เป็นแบบ password (จุดๆๆ) หรือ text (เห็นตัวเลข)
    if (inputField.type === "password") {
        inputField.type = "text"; // เปลี่ยนให้มองเห็น
        icon.classList.remove("fa-eye"); // เอารูปลูกตาปกติออก
        icon.classList.add("fa-eye-slash"); // ใส่รูปลูกตาที่มีขีดฆ่า
    } else {
        inputField.type = "password"; // เปลี่ยนกลับเป็นจุดๆๆ
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}