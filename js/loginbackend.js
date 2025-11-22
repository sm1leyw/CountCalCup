    // ==========================================
    // CONFIG: แยก Database Key
    // ==========================================
    const DB_KEY = 'chefs'; // ใช้ Key นี้แยกจาก 'users' ของลูกค้าโดยสิ้นเชิง
    const SESSION_KEY = 'currentChef'; // ใช้ Key นี้เช็คว่าใครล็อกอินอยู่

    // ฟังก์ชันสลับหน้า
    function toggleForms() {
        const loginBox = document.getElementById('login-box');
        const registerBox = document.getElementById('register-box');
        loginBox.classList.toggle('hidden');
        registerBox.classList.toggle('hidden');
    }

    // ฟังก์ชันดูรหัสผ่าน
    function togglePassword(inputId, icon) {
        const input = document.getElementById(inputId);
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }

    // ==========================================
    // REGISTER SYSTEM (สำหรับพ่อครัว/Backend)
    // ==========================================
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน!");
            return;
        }

        // ดึงข้อมูลจาก key 'chefs' เท่านั้น (ไม่ยุ่งกับ users)
        let chefs = JSON.parse(localStorage.getItem(DB_KEY)) || [];

        // เช็คซ้ำในกลุ่มพ่อครัว
        const existingChef = chefs.find(chef => chef.username === username);
        if (existingChef) {
            alert("ชื่อผู้ใช้ (Backend) นี้มีคนใช้แล้ว!");
            return;
        }

        // บันทึก
        chefs.push({ username, password, role: 'admin' }); // เพิ่ม role ให้รู้ว่าเป็น admin/chef
        localStorage.setItem(DB_KEY, JSON.stringify(chefs));

        alert("ลงทะเบียนพ่อครัวสำเร็จ!");
        document.getElementById('registerForm').reset();
        toggleForms();
    });

    // ==========================================
    // LOGIN SYSTEM (สำหรับพ่อครัว/Backend)
    // ==========================================
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameInput = document.getElementById('login-username').value.trim();
        const passwordInput = document.getElementById('login-password').value;

        // ดึงข้อมูลจาก key 'chefs'
        let chefs = JSON.parse(localStorage.getItem(DB_KEY)) || [];

        // ตรวจสอบ
        const foundChef = chefs.find(c => c.username === usernameInput && c.password === passwordInput);

        if (foundChef) {
            alert("เข้าสู่ระบบหลังร้านสำเร็จ! ยินดีต้อนรับเชฟ " + foundChef.username);
            
            // บันทึก Session แยก
            localStorage.setItem(SESSION_KEY, JSON.stringify(foundChef));
            
            // **สำคัญ** เปลี่ยนไปหน้า Dashboard ของพ่อครัว
            // เช่น backend.html หรือ kitchen.html
            window.location.href = 'backend.html'; 
        } else {
            alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (เฉพาะบัญชีพ่อครัวเท่านั้น)");
        }
    });