// cart.script.js - Logic cho trang Giỏ hàng

// --- NGƯỜI GÁC CỔNG ---
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "auth.html";
}

// --- HÀM TIỆN ÍCH ---
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Lấy các yếu tố
    const cartItemsContainer = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("summary-subtotal");
    const totalEl = document.getElementById("summary-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const shippingEl = document.getElementById("summary-shipping");
    
    // (MỚI) Yếu tố Mã giảm giá
    const couponForm = document.getElementById("coupon-form");
    const couponInput = document.getElementById("coupon-input");
    const couponMessage = document.getElementById("coupon-message");
    const discountRow = document.getElementById("discount-row");
    const discountEl = document.getElementById("summary-discount");

    const shippingFee = 30000; 
    let currentSubtotal = 0; // (MỚI)
    let currentDiscount = 0; // (MỚI)

    // (MỚI) Cơ sở dữ liệu Mã giảm giá (Mô phỏng)
    const coupons = {
        "GYM10": { type: "percent", value: 0.1 }, // Giảm 10%
        "FREESHIP": { type: "fixed", value: shippingFee }, // Giảm đúng bằng phí ship
        "SALE100K": { type: "fixed", value: 100000 } // Giảm 100k
    };
    
    // (MỚI) Biến lưu mã đã áp dụng
    let appliedCoupon = null;

    // === HÀM LẤY/LƯU GIỎ HÀNG ===
    function getCart() {
        return JSON.parse(localStorage.getItem("gymCart")) || [];
    }
    function saveCart(cart) {
        localStorage.setItem("gymCart", JSON.stringify(cart));
    }

    // === HÀM VẼ GIỎ HÀNG (CẬP NHẬT) ===
    function renderCart() {
        cartItemsContainer.innerHTML = ""; 
        let cart = getCart();
        let validCart = []; 
        let subtotal = 0;

        cart.forEach(item => {
            const product = productData.find(p => p.id === item.id);
            if (product) { 
                validCart.push(item); 
                const itemTotalPrice = product.price * item.quantity;
                subtotal += itemTotalPrice;

                const itemElement = document.createElement("div");
                itemElement.className = "cart-item";
                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-info">
                        <h3>${product.name}</h3>
                        <span class="price">${formatCurrency(product.price)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="quantity-change" data-id="${product.id}" data-change="-1">-</button>
                            <input type="number" value="${item.quantity}" min="1" data-id="${product.id}" class="quantity-input">
                            <button class="quantity-change" data-id="${product.id}" data-change="1">+</button>
                        </div>
                        <button class="remove-item-btn" data-id="${product.id}">Xóa</button>
                    </div>
                    <div class="cart-item-total">
                        <strong>${formatCurrency(itemTotalPrice)}</strong>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            }
        });

        saveCart(validCart);

        if (validCart.length === 0) {
            cartItemsContainer.innerHTML = "<p id='empty-cart-message'>Giỏ hàng của bạn đang trống.</p>";
            updateSummary(0);
            return;
        }

        currentSubtotal = subtotal; // (MỚI) Cập nhật Tạm tính
        updateSummary(); // (MỚI) Gọi updateSummary không cần tham số
        addCartEventListeners();
    }

    // === HÀM CẬP NHẬT TỔNG TIỀN (CẬP NHẬT) ===
    function updateSummary() {
        if (currentSubtotal === 0) {
            subtotalEl.textContent = formatCurrency(0);
            shippingEl.textContent = formatCurrency(0);
            discountRow.classList.add("hidden");
            totalEl.textContent = formatCurrency(0);
            return;
        }

        // Tính toán giảm giá
        if (appliedCoupon) {
            if (appliedCoupon.type === "percent") {
                currentDiscount = currentSubtotal * appliedCoupon.value;
            } else { // type === "fixed"
                currentDiscount = appliedCoupon.value;
            }
            
            // Đảm bảo không giảm giá nhiều hơn tạm tính
            if (currentDiscount > currentSubtotal) {
                currentDiscount = currentSubtotal;
            }

            discountEl.textContent = "- " + formatCurrency(currentDiscount);
            discountRow.classList.remove("hidden");
        } else {
            currentDiscount = 0;
            discountRow.classList.add("hidden");
        }

        const total = (currentSubtotal - currentDiscount) + shippingFee;
        
        subtotalEl.textContent = formatCurrency(currentSubtotal);
        shippingEl.textContent = formatCurrency(shippingFee);
        totalEl.textContent = formatCurrency(total < 0 ? 0 : total); // Đảm bảo tổng không bị âm
    }

    // === HÀM THAY ĐỔI SỐ LƯỢNG / XÓA ===
    function addCartEventListeners() {
        cartItemsContainer.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (!id) return;
            
            let cart = getCart();
            
            if (e.target.classList.contains("quantity-change")) {
                const change = parseInt(e.target.dataset.change);
                let item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity += change;
                    if (item.quantity <= 0) {
                        item.quantity = 1;
                    }
                    saveCart(cart);
                    renderCart(); // (CẬP NHẬT) Gọi lại renderCart để tính lại subtotal
                }
            }
            
            if (e.target.classList.contains("remove-item-btn")) {
                cart = cart.filter(i => i.id !== id); 
                saveCart(cart);
                renderCart(); // (CẬP NHẬT) Gọi lại renderCart
            }
        });

        cartItemsContainer.addEventListener("change", (e) => {
            if (e.target.classList.contains("quantity-input")) {
                const id = e.target.dataset.id;
                let newQuantity = parseInt(e.target.value);
                if (newQuantity <= 0) newQuantity = 1;
                
                let cart = getCart();
                let item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity = newQuantity;
                    saveCart(cart);
                    renderCart(); // (CẬP NHẬT) Gọi lại renderCart
                }
            }
        });
    }

    // === (MỚI) HÀM XỬ LÝ MÃ GIẢM GIÁ ===
    couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = couponInput.value.toUpperCase(); // Chuyển sang chữ hoa

        if (appliedCoupon) {
            // Xử lý nếu muốn xóa mã
            appliedCoupon = null;
            couponInput.value = "";
            couponInput.disabled = false;
            couponBtn.textContent = "Áp dụng";
            couponMessage.textContent = "Đã xóa mã giảm giá.";
            couponMessage.className = "";
        }
        else if (coupons[code]) {
            // Áp dụng mã thành công
            appliedCoupon = coupons[code];
            couponInput.disabled = true; // Khóa ô input
            couponBtn.textContent = "Xóa mã"; // Đổi nút thành "Xóa"
            couponMessage.textContent = "Áp dụng mã thành công!";
            couponMessage.className = "success";
        } else {
            // Áp dụng thất bại
            couponMessage.textContent = "Mã giảm giá không hợp lệ!";
            couponMessage.className = "error";
        }
        
        updateSummary(); // Cập nhật lại tổng tiền
    });


    // === CÁC SỰ KIỆN KHÁC ===
    checkoutBtn.addEventListener("click", () => {
        let cart = getCart();
        if(cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        
        // (MỚI) Lưu tổng tiền cuối cùng vào localStorage để trang checkout lấy
        localStorage.setItem("gymCheckoutSummary", JSON.stringify({
            subtotal: currentSubtotal,
            discount: currentDiscount,
            shipping: shippingFee,
            total: (currentSubtotal - currentDiscount) + shippingFee
        }));
        
        window.location.href = "checkout.html";
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("gymCart"); 
        localStorage.removeItem("gymWishlist");
        localStorage.removeItem("gymProfile");
        localStorage.removeItem("gymCheckoutSummary"); // (MỚI)
        window.location.href = "auth.html";
    });

    // === KHỞI CHẠY ===
    renderCart();
});