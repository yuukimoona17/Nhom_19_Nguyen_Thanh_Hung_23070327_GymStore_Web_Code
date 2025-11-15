// auth.script.js - Logic cho trang Auth

document.addEventListener("DOMContentLoaded", () => {
    // Lấy các yếu tố
    const authContainer = document.querySelector(".auth-container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegisterLink = document.getElementById("show-register-link");
    const showLoginLink = document.getElementById("show-login-link");

    // --- Xử lý chuyển đổi Form ---
    showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        authContainer.classList.add("show-register");
    });

    showLoginLink.addEventListener("click", (e) => {
        e.preventDefault(); 
        authContainer.classList.remove("show-register");
    });

    // --- Xử lý logic Đăng ký ---
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password 
        };

        localStorage.setItem("aniDexUser", JSON.stringify(newUser));
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        
        authContainer.classList.remove("show-register");
    });

    // --- Xử lý logic Đăng nhập ---
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const storedUserJSON = localStorage.getItem("aniDexUser");

        if (!storedUserJSON) {
            alert("Email này chưa được đăng ký!");
            return;
        }

        const storedUser = JSON.parse(storedUserJSON);

        if (email === storedUser.email && password === storedUser.password) {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "index.html";
        } else {
            alert("Sai email hoặc mật khẩu!");
        }
    });
});