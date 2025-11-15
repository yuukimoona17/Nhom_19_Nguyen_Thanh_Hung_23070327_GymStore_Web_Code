// script.js - Bộ não NÂNG CẤP của GymStore

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
    setTimeout(() => {
        toast.classList.add("show");
    }, 100); 
    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000); 
}


document.addEventListener("DOMContentLoaded", () => {

    // === 1. LẤY YẾU TỐ HTML ===
    const contentGrid = document.getElementById("content-grid");
    const featuredGrid = document.getElementById("featured-grid"); 
    const searchInput = document.getElementById("search-input");
    const suggestionsContainer = document.getElementById("search-suggestions"); 
    const filterNav = document.getElementById("filter-nav");
    const sortSelect = document.getElementById("sort-select");
    const cartLink = document.getElementById("cart-link");
    const themeToggle = document.getElementById("theme-toggle");
    const logoutBtn = document.getElementById("logout-btn");
    
    const mobileFilterBtn = document.getElementById("mobile-filter-btn");
    const sidebar = document.getElementById("sidebar");
    const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
    const overlay = document.getElementById("overlay");
    
    const filterPriceMin = document.getElementById("filter-price-min");
    const filterPriceMax = document.getElementById("filter-price-max");
    const filterRatingGroup = document.querySelector(".filter-group-rating");
    
    const paginationContainer = document.getElementById("pagination-container"); // (MỚI)

    const modalContainer = document.getElementById("modal-container");
    const modalContent = document.getElementById("modal-content");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    // (CẬP NHẬT) Thêm biến Phân trang
    let currentFilter = "all";
    let currentSearchTerm = "";
    let currentSort = "default";
    let currentPriceMin = 0;
    let currentPriceMax = Infinity;
    let currentMinRating = 0;
    let currentPage = 1; // (MỚI)
    const productsPerPage = 8; // (MỚI) Hiển thị 8 sản phẩm 1 trang


    // === 2. LOGIC GIỎ HÀNG & WISHLIST (Giữ nguyên) ===
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
        const wishlistBtnCard = document.querySelector(`.product-card[data-id="${productId}"] .wishlist-btn`);
        const wishlistBtnModal = document.querySelector(`.modal-wishlist-btn[data-id="${productId}"]`);
        if (isWishlisted(productId)) {
            wishlist = wishlist.filter(id => id !== productId);
            if (wishlistBtnCard) wishlistBtnCard.classList.remove("active");
            if (wishlistBtnModal) {
                wishlistBtnModal.classList.remove("active");
                wishlistBtnModal.innerHTML = "♡ Thêm vào Yêu thích";
            }
            showToast("Đã xóa khỏi Yêu thích");
        } else {
            wishlist.push(productId);
            if (wishlistBtnCard) wishlistBtnCard.classList.add("active");
            if (wishlistBtnModal) {
                wishlistBtnModal.classList.add("active");
                wishlistBtnModal.innerHTML = "❤️ Đã thích";
            }
            showToast("Đã thêm vào Yêu thích");
        }
        saveWishlist(wishlist);
    }

    // === 3. HÀM HIỂN THỊ SẢN PHẨM (Cập nhật) ===
    function displayData(productArray) {
        contentGrid.innerHTML = "";
        
        // (MỚI) Kiểm tra nếu mảng rỗng
        if (productArray.length === 0) {
            contentGrid.innerHTML = "<p>Không tìm thấy sản phẩm nào phù hợp.</p>";
            return;
        }
        
        productArray.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.dataset.id = product.id; 
            const isLiked = isWishlisted(product.id); 

            card.innerHTML = `
                <button class="wishlist-btn ${isLiked ? 'active' : ''}" data-id="${product.id}">❤️</button>
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
            card.querySelector(".buy-now-btn").addEventListener("click", (e) => { 
                e.stopPropagation();
                addToCart(e.target.dataset.id);
                window.location.href = 'cart.html';
            });
            card.querySelector(".wishlist-btn").addEventListener("click", (e) => { e.stopPropagation(); toggleWishlist(e.target.dataset.id); });
            card.querySelector(".product-image").addEventListener("click", () => openModal(product));
            card.querySelector(".product-name").addEventListener("click", () => openModal(product));
            contentGrid.appendChild(card);
        });
    }

    // HÀM HIỂN THỊ SẢN PHẨM NỔI BẬT (Giữ nguyên)
    function renderFeaturedProducts() {
        if (!featuredGrid) return; 
        const featuredProducts = [...productData].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4);
        featuredGrid.innerHTML = ""; 
        featuredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.dataset.id = product.id; 
            const isLiked = isWishlisted(product.id); 
            card.innerHTML = `
                <button class="wishlist-btn ${isLiked ? 'active' : ''}" data-id="${product.id}">❤️</button>
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
            card.querySelector(".buy-now-btn").addEventListener("click", (e) => { 
                e.stopPropagation();
                addToCart(e.target.dataset.id);
                window.location.href = 'cart.html';
            });
            card.querySelector(".wishlist-btn").addEventListener("click", (e) => { e.stopPropagation(); toggleWishlist(e.target.dataset.id); });
            card.querySelector(".product-image").addEventListener("click", () => openModal(product));
            card.querySelector(".product-name").addEventListener("click", () => openModal(product));
            featuredGrid.appendChild(card);
        });
    }


    // === 4. HÀM XỬ LÝ MODAL (POPUP) (Giữ nguyên) ===
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
    function closeModal() {
        modalContainer.classList.add("modal-hidden");
    }
    modalCloseBtn.addEventListener("click", closeModal);
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) closeModal();
    });

    // === 5. HÀM LỌC & SẮP XẾP (ĐÃ VIẾT LẠI HOÀN TOÀN) ===
    function updateDisplay() {
        // 1. Lọc
        let filteredData = [...productData];
        if (currentFilter !== "all") {
            filteredData = filteredData.filter(p => p.category_slug === currentFilter);
        }
        if (currentSearchTerm !== "") {
            filteredData = filteredData.filter(p => 
                p.name.toLowerCase().includes(currentSearchTerm)
            );
        }
        filteredData = filteredData.filter(p => 
            p.price >= currentPriceMin && p.price <= currentPriceMax
        );
        if (currentMinRating > 0) {
            filteredData = filteredData.filter(p => p.rating >= currentMinRating);
        }

        // 2. Sắp xếp
        switch (currentSort) {
            case "price-asc":
                filteredData.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                filteredData.sort((a, b) => b.price - a.price);
                break;
            case "a-z":
                filteredData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "z-a":
                filteredData.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        
        // 3. (MỚI) Phân trang
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / productsPerPage);
        
        // Đảm bảo trang hiện tại không vượt quá tổng số trang sau khi lọc
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = currentPage * productsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        // 4. Hiển thị
        displayData(paginatedData);
        renderPagination(totalPages);
    }
    
    // === (MỚI) HÀM VẼ PHÂN TRANG ===
    function renderPagination(totalPages) {
        paginationContainer.innerHTML = ""; // Xóa sạch

        if (totalPages <= 1) return; // Không cần nếu chỉ có 1 trang

        // Nút "Trang trước"
        const prevBtn = document.createElement("button");
        prevBtn.className = "page-btn";
        prevBtn.textContent = "<<";
        if (currentPage === 1) prevBtn.disabled = true;
        prevBtn.addEventListener("click", () => {
            currentPage--;
            updateDisplay();
        });
        paginationContainer.appendChild(prevBtn);

        // Hiển thị các nút trang (logic đơn giản)
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = "page-btn";
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.classList.add("active");
            
            pageBtn.addEventListener("click", () => {
                currentPage = i;
                updateDisplay();
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Nút "Trang sau"
        const nextBtn = document.createElement("button");
        nextBtn.className = "page-btn";
        nextBtn.textContent = ">>";
        if (currentPage === totalPages) nextBtn.disabled = true;
        nextBtn.addEventListener("click", () => {
            currentPage++;
            updateDisplay();
        });
        paginationContainer.appendChild(nextBtn);
    }


    // === 6. LẮNG NGHE SỰ KIỆN (Đã Cập nhật) ===
    
    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    }
    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    }
    mobileFilterBtn.addEventListener("click", openSidebar);
    sidebarCloseBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);
    
    // (CẬP NHẬT) Khi lọc, reset về trang 1
    filterNav.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-btn")) {
            currentFilter = e.target.dataset.filter;
            document.querySelectorAll("#filter-nav .filter-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
            currentPage = 1; // Reset trang
            updateDisplay();
            closeSidebar(); 
        }
    });

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        suggestionsContainer.innerHTML = ""; 
        if (searchTerm.length < 2) { 
            suggestionsContainer.classList.remove("active");
            return;
        }
        const filteredProducts = productData.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        ).slice(0, 5); 
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="suggestion-item-info">
                        <h4>${product.name}</h4>
                        <span>${formatCurrency(product.price)}</span>
                    </div>
                `;
                item.addEventListener("click", () => {
                    openModal(product);
                    suggestionsContainer.classList.remove("active");
                    suggestionsContainer.innerHTML = "";
                    searchInput.value = ""; 
                });
                suggestionsContainer.appendChild(item);
            });
            suggestionsContainer.classList.add("active");
        } else {
            suggestionsContainer.classList.remove("active");
        }
    });

    // (CẬP NHẬT) Khi lọc, reset về trang 1
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === 'Enter') {
            currentSearchTerm = e.target.value.toLowerCase();
            currentPage = 1; // Reset trang
            updateDisplay(); 
            suggestionsContainer.classList.remove("active");
            suggestionsContainer.innerHTML = "";
            closeSidebar(); 
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) {
            suggestionsContainer.classList.remove("active");
            suggestionsContainer.innerHTML = "";
        }
    });

    // (CẬP NHẬT) Khi lọc, reset về trang 1
    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        currentPage = 1; // Reset trang
        updateDisplay();
        closeSidebar(); 
    });

    // (CẬP NHẬT) Khi lọc, reset về trang 1
    filterPriceMin.addEventListener("input", () => {
        currentPriceMin = parseInt(filterPriceMin.value) || 0;
        currentPage = 1; // Reset trang
        updateDisplay();
    });
    filterPriceMax.addEventListener("input", () => {
        currentPriceMax = parseInt(filterPriceMax.value) || Infinity;
        currentPage = 1; // Reset trang
        updateDisplay();
    });

    // (CẬP NHẬT) Khi lọc, reset về trang 1
    filterRatingGroup.addEventListener("change", (e) => {
        if (e.target.name === "rating-filter") {
            currentMinRating = parseInt(e.target.value);
            currentPage = 1; // Reset trang
            updateDisplay();
            closeSidebar(); 
        }
    });

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
    });
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("gymCart"); 
        localStorage.removeItem("gymWishlist");
        window.location.href = "auth.html";
    });

    // === 7. KHỞI CHẠY ===
    updateDisplay();
    updateCartIcon();
    renderFeaturedProducts(); 
});