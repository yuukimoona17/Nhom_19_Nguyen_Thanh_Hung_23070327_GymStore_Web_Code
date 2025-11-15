// checkout.script.js

// --- NGƯỜI GÁC CỔNG ---
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "auth.html";
}

// --- HÀM TIỆN ÍCH (Copy) ---
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = "✅ " + message; 
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add("show"); }, 100); 
    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener('transitionend', () => { toast.remove(); });
    }, 3000);
}

// --- LOGIC CHÍNH ---
document.addEventListener("DOMContentLoaded", () => {
    
    // Lấy các yếu tố
    const summaryItemsContainer = document.getElementById("summary-items");
    const subtotalEl = document.getElementById("summary-subtotal");
    const shippingEl = document.getElementById("summary-shipping");
    const totalEl = document.getElementById("summary-total-final");
    const checkoutForm = document.getElementById("checkout-form");
    const logoutBtn = document.getElementById("logout-btn");
    
    const nameInput = document.getElementById("checkout-name");
    const emailInput = document.getElementById("checkout-email");
    const user = JSON.parse(localStorage.getItem("aniDexUser"));
    const profile = JSON.parse(localStorage.getItem("gymProfile"));
    if (user) {
        nameInput.value = user.name || "";
        emailInput.value = user.email || "";
    }

    // (CẬP NHẬT) Lấy thông tin tổng tiền từ trang giỏ hàng
    const summary = JSON.parse(localStorage.getItem("gymCheckoutSummary"));
    let currentCart = []; 

    // === HÀM LẤY/LƯU GIỎ HÀNG ===
    function getCart() {
        return JSON.parse(localStorage.getItem("gymCart")) || [];
    }

    // === HÀM VẼ TÓM TẮT ĐƠN HÀNG (CẬP NHẬT) ===
    function renderSummary() {
        summaryItemsContainer.innerHTML = ""; 
        currentCart = getCart();

        if (currentCart.length === 0 || !summary) { // Kiểm tra cả summary
            alert("Giỏ hàng của bạn trống hoặc đã xảy ra lỗi!");
            window.location.href = "index.html";
            return;
        }

        currentCart.forEach(item => {
            const product = productData.find(p => p.id === item.id);
            if (product) { 
                const itemTotalPrice = product.price * item.quantity;
                const itemElement = document.createElement("div");
                itemElement.className = "summary-item";
                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="summary-item-info">
                        <h4>${product.name}</h4>
                        <span>Số lượng: ${item.quantity}</span>
                    </div>
                    <span class="summary-item-price">${formatCurrency(itemTotalPrice)}</span>
                `;
                summaryItemsContainer.appendChild(itemElement);
            }
        });
        
        // (CẬP NHẬT) Hiển thị tổng tiền từ summary đã lưu
        subtotalEl.textContent = formatCurrency(summary.subtotal);
        shippingEl.textContent = formatCurrency(summary.shipping);
        totalEl.textContent = formatCurrency(summary.total);

        // (CẬP NHẬT) Hiển thị dòng giảm giá nếu có
        if (summary.discount > 0) {
            const discountRow = document.createElement("div");
            discountRow.className = "summary-row discount"; // Dùng chung class với cart.style.css
            discountRow.innerHTML = `
                <span>Giảm giá:</span>
                <span id="summary-discount">- ${formatCurrency(summary.discount)}</span>
            `;
            // Chèn vào trước dòng Phí vận chuyển
            shippingEl.parentElement.before(discountRow);
        }
    }

    // === XỬ LÝ ĐẶT HÀNG ===
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newOrder = {
            id: 'GS' + new Date().getTime(),
            date: new Date().toLocaleDateString('vi-VN'),
            items: currentCart,
            subtotal: summary.subtotal, // (SỬA) Lấy từ summary
            discount: summary.discount, // (MỚI)
            shipping: summary.shipping, // (SỬA)
            total: summary.total,       // (SỬA)
            customerInfo: {
                name: nameInput.value,
                email: emailInput.value,
                phone: document.getElementById("checkout-phone").value,
                address: document.getElementById("checkout-address").value
            }
        };

        const orderHistory = JSON.parse(localStorage.getItem("gymOrderHistory")) || [];
        orderHistory.push(newOrder); 
        localStorage.setItem("gymOrderHistory", JSON.stringify(orderHistory));

        showToast("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
        
        localStorage.removeItem("gymCart");
        localStorage.removeItem("gymCheckoutSummary"); // (MỚI) Xóa summary
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    });

    // === ĐĂNG XUẤT ===
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("gymCart"); 
        localStorage.removeItem("gymWishlist");
        localStorage.removeItem("gymProfile");
        localStorage.removeItem("gymCheckoutSummary"); // (MỚI)
        window.location.href = "auth.html";
    });

    // === KHỞI CHẠY ===
    renderSummary();
});