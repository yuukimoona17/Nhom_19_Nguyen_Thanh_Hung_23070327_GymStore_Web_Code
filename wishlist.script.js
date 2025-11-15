// wishlist.script.js

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

// === LOGIC GIỎ HÀNG ===
function getCart() {
    return JSON.parse(localStorage.getItem("gymCart")) || [];
}
function saveCart(cart) {
    localStorage.setItem("gymCart", JSON.stringify(cart));
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
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    
    if (isWishlisted(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast("Đã xóa khỏi Yêu thích");
        if (productCard) {
            productCard.style.animation = "toastFadeOut 0.5s ease";
            setTimeout(() => {
                productCard.remove();
                checkIfEmpty(); 
            }, 500);
        }
    } else {
        wishlist.push(productId);
        showToast("Đã thêm vào Yêu thích");
    }
    saveWishlist(wishlist);
}

// === LOGIC MODAL ===
const modalContainer = document.getElementById("modal-container");
const modalContent = document.getElementById("modal-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

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

    const isLiked = isWishlisted(product.id); // Sẽ luôn là true ở trang này

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
    modalContent.querySelector(".modal-buy-now-btn").addEventListener("click", (e) => { // (MỚI)
        addToCart(e.target.dataset.id);
        window.location.href = 'cart.html';
    });
    modalContent.querySelector(".modal-wishlist-btn").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        toggleWishlist(id); 
        closeModal();
    });
    const tabButtons = modalContent.querySelectorAll(".modal-tab-btn");
    const tabContents = modalContent.querySelectorAll(".modal-tab-content");
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
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
function closeModal() { modalContainer.classList.add("modal-hidden"); }
modalCloseBtn.addEventListener("click", closeModal);
modalContainer.addEventListener("click", (e) => { if (e.target === modalContainer) closeModal(); });

// === HÀM KHỞI CHẠY CHÍNH ===
document.addEventListener("DOMContentLoaded", () => {
    const wishlistGrid = document.getElementById("wishlist-grid");
    const emptyMsg = document.getElementById("empty-wishlist-message");
    const logoutBtn = document.getElementById("logout-btn");

    function renderWishlist() {
        const wishlist = getWishlist();
        wishlistGrid.innerHTML = ""; 

        if (wishlist.length === 0) {
            emptyMsg.classList.remove("hidden");
            return;
        }

        emptyMsg.classList.add("hidden");
        const wishlistedProducts = productData.filter(p => wishlist.includes(p.id));

        wishlistedProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.dataset.id = product.id; 

            card.innerHTML = `
                <button class="wishlist-btn active" data-id="${product.id}">❤️</button>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p>${product.description_short}</p>
                    <div class="product-meta">
                        <span class="product-rating">⭐ ${product.rating} <span>(${product.reviewCount})</span></span>
                        <span class="product-sold">Đã bán ${product.soldCount}+</span>
                    </div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
                <div class="card-buttons">
                    <button class="add-to-cart-btn" data-id="${product.id}">Thêm vào giỏ</button>
                    <button class="buy-now-btn" data-id="${product.id}">Mua ngay</button>
                </div>
            `;

            card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => { e.stopPropagation(); addToCart(e.target.dataset.id); });
            card.querySelector(".buy-now-btn").addEventListener("click", (e) => { // (MỚI)
                e.stopPropagation();
                addToCart(e.target.dataset.id);
                window.location.href = 'cart.html';
            });
            card.querySelector(".wishlist-btn").addEventListener("click", (e) => { e.stopPropagation(); toggleWishlist(e.target.dataset.id); });
            card.querySelector(".product-image").addEventListener("click", () => openModal(product));
            card.querySelector(".product-name").addEventListener("click", () => openModal(product));
            
            wishlistGrid.appendChild(card);
        });
    }

    function checkIfEmpty() {
        if (getWishlist().length === 0) {
            emptyMsg.classList.remove("hidden");
        }
    }

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("gymCart"); 
        localStorage.removeItem("gymWishlist"); 
        window.location.href = "auth.html";
    });

    renderWishlist();
});