// profile.script.js - Logic cho trang Tài khoản

// --- NGƯỜI GÁC CỔNG ---
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "auth.html";
}

// --- HÀM TIỆN ÍCH ---
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


document.addEventListener("DOMContentLoaded", () => {
    
    // Lấy các yếu tố
    const profileForm = document.getElementById("profile-form");
    const nameInput = document.getElementById("profile-name");
    const emailInput = document.getElementById("profile-email");
    const heightInput = document.getElementById("profile-height");
    const weightInput = document.getElementById("profile-weight");
    const goalSelect = document.getElementById("profile-goal");
    const logoutBtn = document.getElementById("logout-btn");
    const recommendationEngine = document.getElementById("recommendation-engine");
    const cartLink = document.getElementById("cart-link"); 

    const modalContainer = document.getElementById("modal-container");
    const modalContent = document.getElementById("modal-content");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    const tabButtons = document.querySelectorAll(".profile-tab-btn");
    const tabContents = document.querySelectorAll(".profile-tab-content");
    const orderHistoryList = document.getElementById("order-history-list");

    const userKey = "aniDexUser"; 
    const profileKey = "gymProfile";

    // === LOGIC GIỎ HÀNG ===
    function getCart() {
        return JSON.parse(localStorage.getItem("gymCart")) || [];
    }
    function saveCart(cart) {
        localStorage.setItem("gymCart", JSON.stringify(cart));
        updateCartIcon(); 
    }
    function addToCart(productId) {
        let cart = getCart();
        let existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        saveCart(cart);
        showToast("Đã thêm sản phẩm vào giỏ hàng!");
    }
    function updateCartIcon() {
        let cart = getCart();
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Giỏ hàng (${totalItems})`;
    }

    // === LOGIC WISHLIST ===
    function getWishlist() {
        return JSON.parse(localStorage.getItem("gymWishlist")) || [];
    }
    function saveWishlist(wishlist) {
        localStorage.setItem("gymWishlist", JSON.stringify(wishlist));
    }
    function isWishlisted(productId) {
        return getWishlist().includes(productId);
    }
    function toggleWishlist(productId) {
        let wishlist = getWishlist();
        const wishlistBtnModal = document.querySelector(`.modal-wishlist-btn[data-id="${productId}"]`);

        if (isWishlisted(productId)) {
            wishlist = wishlist.filter(id => id !== productId);
            if (wishlistBtnModal) {
                wishlistBtnModal.classList.remove("active");
                wishlistBtnModal.innerHTML = "♡ Thêm vào Yêu thích";
            }
            showToast("Đã xóa khỏi Yêu thích");
        } else {
            wishlist.push(productId);
            if (wishlistBtnModal) {
                wishlistBtnModal.classList.add("active");
                wishlistBtnModal.innerHTML = "❤️ Đã thích";
            }
            showToast("Đã thêm vào Yêu thích");
        }
        saveWishlist(wishlist);
    }

    // === LOGIC MODAL ===
    function openModal(product) {
        const specsHtml = product.specs.map(spec => `<li>${spec}</li>`).join("");
        let reviewsHtml = '';
        if (product.reviews && product.reviews.length > 0) {
            reviewsHtml = product.reviews.map(review => `
                <li class="review-item">
                    <div class="review-header">
                        <span class="review-user">${review.user}</span>
                        <span class="review-rating">⭐ ${review.rating}</span>
                    </div>
                    <p class="review-comment">${review.comment}</p>
                </li>
            `).join("");
        } else {
            reviewsHtml = "<p>Chưa có đánh giá nào cho sản phẩm này.</p>";
        }

        const relatedProducts = productData.filter(p => p.category_slug === product.category_slug && p.id !== product.id).slice(0, 4);
        let relatedHtml = '';
        if (relatedProducts.length > 0) {
            relatedHtml = `
                <div class="modal-related">
                    <h3>Có thể bạn cũng thích</h3>
                    <div class="related-products-list">
                        ${relatedProducts.map(relProduct => `
                            <div class="related-product" data-id="${relProduct.id}">
                                <img src="${relProduct.image}" alt="${relProduct.name}">
                                <div class="related-product-info">
                                    <h4>${relProduct.name}</h4>
                                    <span>${formatCurrency(relProduct.price)}</span>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        const isLiked = isWishlisted(product.id); 

        modalContent.innerHTML = `
            <button id="modal-close-btn-inner">&times;</button>
            <div class="modal-header">
                <img src="${product.image}" alt="${product.name}">
                <div class="modal-header-info">
                    <h2>${product.name}</h2>
                    <p><strong>Danh mục:</strong> ${product.category_name}</p>
                    <div class="modal-meta">
                        <span class="product-rating">⭐ ${product.rating} <span>(${product.reviewCount} đánh giá)</span></span>
                        <span class="product-sold">Đã bán ${product.soldCount}+</span>
                    </div>
                    <div class="modal-price">${formatCurrency(product.price)}</div>
                    <div class="btn-group">
                        <button class="modal-add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
                        <button class="modal-buy-now-btn" data-id="${product.id}">Mua ngay</button>
                        <button class="modal-wishlist-btn ${isLiked ? 'active' : ''}" data-id="${product.id}">
                            ${isLiked ? '❤️ Đã thích' : '♡ Thêm vào Yêu thích'}
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-tabs">
                    <button class="modal-tab-btn active" data-tab="tab-desc">Mô tả</button>
                    <button class="modal-tab-btn" data-tab="tab-specs">Thông số</button>
                    <button class="modal-tab-btn" data-tab="tab-reviews">Đánh giá (${product.reviewCount})</button>
                </div>
                <div id="tab-desc" class="modal-tab-content active"><p>${product.description_long}</p></div>
                <div id="tab-specs" class="modal-tab-content"><ul>${specsHtml}</ul></div>
                <div id="tab-reviews" class="modal-tab-content"><ul class="review-list">${reviewsHtml}</ul></div>
            </div>
            ${relatedHtml}
        `;
        
        modalContainer.classList.remove("modal-hidden");
        
        document.getElementById("modal-close-btn-inner").addEventListener("click", closeModal);
        modalContent.querySelector(".modal-add-to-cart").addEventListener("click", (e) => {
            addToCart(e.target.dataset.id);
            closeModal();
        });
        modalContent.querySelector(".modal-buy-now-btn").addEventListener("click", (e) => { 
            addToCart(e.target.dataset.id);
            window.location.href = 'cart.html';
        });
        modalContent.querySelector(".modal-wishlist-btn").addEventListener("click", (e) => {
            toggleWishlist(e.target.dataset.id);
        });

        const modalTabButtons = modalContent.querySelectorAll(".modal-tab-btn");
        const modalTabContents = modalContent.querySelectorAll(".modal-tab-content");
        modalTabButtons.forEach(button => {
            button.addEventListener("click", () => {
                modalTabButtons.forEach(btn => btn.classList.remove("active"));
                modalTabContents.forEach(content => content.classList.remove("active"));
                button.classList.add("active");
                document.getElementById(button.dataset.tab).classList.add("active");
            });
        });
        modalContent.querySelectorAll(".related-product").forEach(card => {
            card.addEventListener("click", () => {
                const newProduct = productData.find(p => p.id === card.dataset.id);
                if (newProduct) {
                    closeModal();
                    setTimeout(() => { openModal(newProduct); }, 300);
                }
            });
        });
    }
    
    function closeModal() {
        modalContainer.classList.add("modal-hidden");
    }
    modalCloseBtn.addEventListener("click", closeModal);
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) closeModal();
    });


    // === HÀM 1: Tải thông tin người dùng ===
    function loadUserData() {
        const user = JSON.parse(localStorage.getItem(userKey));
        if (user) {
            nameInput.value = user.name;
            emailInput.value = user.email;
        }
        const profile = JSON.parse(localStorage.getItem(profileKey));
        if (profile) {
            heightInput.value = profile.height || "";
            weightInput.value = profile.weight || "";
            goalSelect.value = profile.goal || "";
            if(profile.goal) {
                runRecommendation(profile.goal);
            }
        }
    }

    // === HÀM 2: Lưu thông tin Profile ===
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const profileData = {
            height: heightInput.value,
            weight: weightInput.value,
            goal: goalSelect.value
        };
        localStorage.setItem(profileKey, JSON.stringify(profileData));
        showToast("Đã lưu thông tin cá nhân!"); 
        runRecommendation(profileData.goal);
    });

    // === HÀM 3: Chạy máy đề xuất (Rule-based) ===
    function runRecommendation(goal) {
        if (!goal) {
            recommendationEngine.innerHTML = '<p class="recommend-placeholder">Vui lòng chọn mục tiêu và nhấn "Lưu" để nhận đề xuất sản phẩm.</p>';
            return;
        }
        let recommendedProducts = [];
        if (goal === 'tang-co') {
            recommendedProducts = productData.filter(p => 
                p.category_slug === 'ta' || p.id === 'p10' || p.id === 'p11' || p.id === 'p8'
            ).slice(0, 4); 
        } 
        else if (goal === 'giam-mo') {
            recommendedProducts = productData.filter(p => 
                p.id === 'p9' || p.id === 'p13' || p.id === 'p15'
            ).slice(0, 4);
        } 
        else if (goal === 'tai-nha') {
            recommendedProducts = productData.filter(p => 
                p.category_slug === 'phu-kien' || p.id === 'p3'
            ).slice(0, 4);
        }
        renderRecommendations(recommendedProducts);
    }

    // === HÀM 4: Hiển thị Đề xuất ra HTML ===
    function renderRecommendations(products) {
        if (products.length === 0) {
            recommendationEngine.innerHTML = '<p class="recommend-placeholder">Không tìm thấy sản phẩm đề xuất nào. Vui lòng thử lại.</p>';
            return;
        }
        recommendationEngine.innerHTML = ""; 
        products.forEach(product => {
            const productEl = document.createElement("div");
            productEl.className = "rec-product";
            productEl.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="rec-product-info">
                    <h4>${product.name}</h4>
                    <span>${formatCurrency(product.price)}</span>
                </div>
            `;
            productEl.addEventListener("click", () => {
                const fullProduct = productData.find(p => p.id === product.id);
                if (fullProduct) {
                    openModal(fullProduct);
                }
            });
            recommendationEngine.appendChild(productEl);
        });
    }

    // === HÀM 5: Tải Lịch sử Đơn hàng (CẬP NHẬT) ===
    function loadOrderHistory() {
        const orderHistory = JSON.parse(localStorage.getItem("gymOrderHistory")) || [];
        orderHistoryList.innerHTML = ""; 

        if (orderHistory.length === 0) {
            orderHistoryList.innerHTML = '<p class="placeholder">Bạn chưa có đơn hàng nào.</p>';
            return;
        }

        orderHistory.reverse().forEach(order => {
            let itemsHtml = '';
            if (order.items && order.items.length > 0) {
                itemsHtml = order.items.map(item => {
                    const product = productData.find(p => p.id === item.id);
                    if (!product) { 
                        return `
                        <div class="order-product">
                            <img src="images/hero-banner.jpg" alt="Sản phẩm không tồn tại">
                            <span class="order-product-name"><em>Sản phẩm không còn tồn tại (ID: ${item.id})</em></span>
                            <span class="order-product-qty">x ${item.quantity}</span>
                            <span class="order-product-price">---</span>
                        </div>
                        `;
                    }
                    return `
                        <div class="order-product">
                            <img src="${product.image}" alt="${product.name}">
                            <span class="order-product-name">${product.name}</span>
                            <span class="order-product-qty">x ${item.quantity}</span>
                            <span class="order-product-price">${formatCurrency(product.price * item.quantity)}</span>
                        </div>
                    `;
                }).join("");
            } else {
                itemsHtml = '<p class="placeholder">Đơn hàng này không có sản phẩm (có thể đã xảy ra lỗi).</p>';
            }
            
            // (MỚI) Thêm chi tiết giảm giá vào tổng tiền
            let priceDetailsHtml = '';
            if (order.discount > 0) {
                priceDetailsHtml = `
                    <span class="order-detail-line">Tạm tính: ${formatCurrency(order.subtotal)}</span>
                    <span class="order-detail-line discount">Giảm giá: -${formatCurrency(order.discount)}</span>
                `;
            }

            const orderEl = document.createElement("div");
            orderEl.className = "order-item";
            orderEl.innerHTML = `
                <div class="order-header">
                    <div class="order-header-info">
                        <h4>Mã đơn: ${order.id}</h4>
                        <span>Ngày đặt: ${order.date}</span>
                    </div>
                    <div class="order-total">
                        ${priceDetailsHtml}
                        <span class="order-total-final">Tổng: ${formatCurrency(order.total)}</span>
                    </div>
                </div>
                <div class="order-item-list">
                    ${itemsHtml}
                </div>
            `;
            orderHistoryList.appendChild(orderEl);
        });
    }

    // === HÀM 6: Xử lý chuyển Tab ===
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            
            button.classList.add("active");
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add("active");

            if (tabId === 'tab-history') {
                loadOrderHistory();
            }
        });
    });

    // === HÀM 7: ĐĂNG XUẤT ===
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("gymCart"); 
        localStorage.removeItem(profileKey); 
        localStorage.removeItem("gymWishlist");
        localStorage.removeItem("gymCheckoutSummary"); // (MỚI)
        window.location.href = "auth.html";
    });

    // === KHỞI CHẠY ===
    loadUserData();
    updateCartIcon();
});