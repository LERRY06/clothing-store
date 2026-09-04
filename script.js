// =========================================
// ДАННИ ЗА ПРОДУКТИТЕ
// =========================================

const products = {

    1: {
        name: "Минималистична рокля",
        category: "Дамски",
        price: "89.90 лв.",
        image: "images/product-1.jpg",
        sizes: ["XS", "S", "M", "L"],
        new: true,
        description:
            "Елегантна и минималистична рокля, създадена за модерен ежедневен стил."
    },

    2: {
        name: "Oversized сако",
        category: "Дамски",
        price: "129.90 лв.",
        image: "images/product-2.jpg",
        sizes: ["S", "M", "L", "XL"],
        new: false,
        description:
            "Модерно oversized сако с изчистена линия и универсален силует."
    },

    3: {
        name: "Класическа риза",
        category: "Мъжки",
        price: "69.90 лв.",
        image: "images/product-3.jpg",
        sizes: ["S", "M", "L", "XL"],
        new: true,
        description:
            "Класическа риза с минималистичен дизайн, подходяща както за офиса, така и за свободното време."
    },

    4: {
        name: "Premium тениска",
        category: "Мъжки",
        price: "49.90 лв.",
        image: "images/product-4.jpg",
        sizes: ["S", "M", "L", "XL"],
        new: false,
        description:
            "Premium тениска с изчистена визия и комфортна кройка за всекидневно носене."
    },

    5: {
        name: "Минималистична рокля 5",
        category: "Дамски",
        price: "89.90 лв.",
        image: "images/product-1.jpg",
        sizes: ["XS", "S", "M", "L"],
        new: true,
        description:
            "Елегантна и минималистична рокля, създадена за модерен ежедневен стил."
    }

};


// =========================================
// ЛЮБИМИ
// =========================================

let favorites =
    JSON.parse(
        localStorage.getItem("leviaFavorites")
    ) || [];


// =========================================
// ПОМОЩНИ ФУНКЦИИ
// =========================================

function saveFavorites() {

    localStorage.setItem(
        "leviaFavorites",
        JSON.stringify(favorites)
    );

}


function getProductId(card) {

    const href =
        card.getAttribute("href");

    if (!href) {
        return null;
    }

    const query =
        href.split("?")[1];

    if (!query) {
        return null;
    }

    const params =
        new URLSearchParams(query);

    return params.get("id");

}


function getCurrentPage() {

    const path =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    return path || "index.html";

}


// =========================================
// СЪЗДАВАНЕ НА ПРОДУКТОВА КАРТА
// =========================================

function createProductCard(id, product) {

    const card =
        document.createElement("a");

    card.href =
        `product.html?id=${id}`;

    card.className =
        "product-card";


    card.dataset.category =
        product.category === "Дамски"
            ? "women"
            : "men";


    // -----------------------------------------
    // IMAGE
    // -----------------------------------------

    const image =
        document.createElement("div");

    image.className =
        "product-image";


    if (id !== "1") {

        image.classList.add(
            `product-${id}`
        );

    }


    // -----------------------------------------
    // NEW LABEL
    // -----------------------------------------

    if (product.new === true) {

        const label =
            document.createElement("span");

        label.className =
            "product-label";

        label.textContent =
            "NEW";

        image.appendChild(label);

    }


    // -----------------------------------------
    // FAVORITE
    // -----------------------------------------

    const favoriteButton =
        document.createElement("button");

    favoriteButton.className =
        "favorite-button";

    favoriteButton.type =
        "button";


    updateFavoriteButton(
        favoriteButton,
        id
    );


    favoriteButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();


            if (favorites.includes(id)) {

                favorites =
                    favorites.filter(
                        favoriteId =>
                            favoriteId !== id
                    );

            } else {

                favorites.push(id);

            }


            saveFavorites();


            updateFavoriteButton(
                favoriteButton,
                id
            );


            // Ако сме на favorites.html,
            // премахваме картата веднага.

            if (
                getCurrentPage() ===
                "favorites.html" &&
                !favorites.includes(id)
            ) {

                const card =
                    favoriteButton.closest(
                        ".product-card"
                    );

                if (card) {
                    card.remove();
                }


                if (
                    favorites.length === 0
                ) {

                    renderEmptyFavorites();

                }

            }

        }
    );


    image.appendChild(
        favoriteButton
    );


    // -----------------------------------------
    // INFO
    // -----------------------------------------

    const info =
        document.createElement("div");

    info.className =
        "product-info";


    const category =
        document.createElement("p");

    category.className =
        "product-category";

    category.textContent =
        product.category;


    const name =
        document.createElement("h3");

    name.textContent =
        product.name;


    const price =
        document.createElement("p");

    price.className =
        "product-price";

    price.textContent =
        product.price;


    info.appendChild(category);
    info.appendChild(name);
    info.appendChild(price);


    card.appendChild(image);
    card.appendChild(info);


    return card;

}


// =========================================
// FAVORITE BUTTON
// =========================================

function updateFavoriteButton(
    button,
    id
) {

    if (favorites.includes(id)) {

        button.textContent = "♥";

        button.style.color =
            "#8a6a52";

        button.classList.add(
            "active"
        );

    } else {

        button.textContent = "♡";

        button.style.color =
            "#171717";

        button.classList.remove(
            "active"
        );

    }

}


// =========================================
// ОБНОВЯВАНЕ НА FAVORITE BUTTONS
// =========================================

function updateFavoriteButtons() {

    document
        .querySelectorAll(
            ".favorite-button"
        )
        .forEach(button => {

            const card =
                button.closest(
                    ".product-card"
                );

            if (!card) {
                return;
            }


            const productId =
                getProductId(card);


            updateFavoriteButton(
                button,
                productId
            );

        });

}


// =========================================
// PRODUCT GRID
// =========================================

const productGrid =
    document.querySelector(
        "#productGrid"
    );


// =========================================
// ПОКАЗВАНЕ НА ПРОДУКТИ
// =========================================

function renderProducts(
    filter = "all"
) {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = "";


    Object.entries(products)
        .forEach(
            ([id, product]) => {

                const category =
                    product.category === "Дамски"
                        ? "women"
                        : "men";


                if (
                    filter === "women" &&
                    category !== "women"
                ) {
                    return;
                }


                if (
                    filter === "men" &&
                    category !== "men"
                ) {
                    return;
                }


                if (
                    filter === "new" &&
                    product.new !== true
                ) {
                    return;
                }


                const card =
                    createProductCard(
                        id,
                        product
                    );


                productGrid.appendChild(
                    card
                );

            }
        );


    updateFavoriteButtons();

    animateProducts();

}


// =========================================
// ТЕКУЩА СТРАНИЦА
// =========================================

function renderCurrentPage() {

    if (!productGrid) {
        return;
    }


    const page =
        getCurrentPage();


    if (page === "women.html") {

        renderProducts("women");

        return;

    }


    if (page === "men.html") {

        renderProducts("men");

        return;

    }


    if (
        page ===
        "new-collection.html"
    ) {

        renderProducts("new");

        return;

    }


    if (page === "favorites.html") {

        renderFavorites();

        return;

    }


    if (page === "search.html") {

        renderSearchResults();

        return;

    }


    renderProducts("all");

}


// =========================================
// SEARCH RESULTS
// =========================================

function renderSearchResults() {

    if (!productGrid) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const query =
        params.get("q")
            ?.toLowerCase()
            .trim() || "";


    const searchTitle =
        document.querySelector(
            "#searchTitle"
        );


    if (!query) {

        if (searchTitle) {

            searchTitle.textContent =
                "Резултати от търсене";

        }


        productGrid.innerHTML = `

            <div class="empty-favorites">

                <div class="empty-favorites-icon">
                    ⌕
                </div>

                <h3>
                    Търси продукт
                </h3>

                <p>
                    Въведи име или категория на продукт.
                </p>

            </div>

        `;

        return;

    }


    if (searchTitle) {

        searchTitle.textContent =
            `Резултати за „${query}“`;

    }


    productGrid.innerHTML = "";


    Object.entries(products)
        .forEach(
            ([id, product]) => {

                const name =
                    product.name
                        .toLowerCase();


                const category =
                    product.category
                        .toLowerCase();


                if (
                    name.includes(query) ||
                    category.includes(query)
                ) {

                    const card =
                        createProductCard(
                            id,
                            product
                        );


                    productGrid.appendChild(
                        card
                    );

                }

            }
        );


    if (
        productGrid.children.length === 0
    ) {

        productGrid.innerHTML = `

            <div class="empty-favorites">

                <div class="empty-favorites-icon">
                    ⌕
                </div>

                <h3>
                    Няма резултати
                </h3>

                <p>
                    Не открихме продукти, които съвпадат с твоето търсене.
                </p>

            </div>

        `;

        return;

    }


    updateFavoriteButtons();

    animateProducts();

}


// =========================================
// FAVORITES PAGE
// =========================================

function renderFavorites() {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = "";


    const favoriteProducts =
        Object.entries(products)
            .filter(
                ([id]) =>
                    favorites.includes(id)
            );


    if (
        favoriteProducts.length === 0
    ) {

        renderEmptyFavorites();

        return;

    }


    favoriteProducts.forEach(
        ([id, product]) => {

            const card =
                createProductCard(
                    id,
                    product
                );


            productGrid.appendChild(
                card
            );

        }
    );


    updateFavoriteButtons();

    animateProducts();

}


// =========================================
// ПРАЗНИ ЛЮБИМИ
// =========================================

function renderEmptyFavorites() {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = `

        <div class="empty-favorites">

            <div class="empty-favorites-icon">
                ♡
            </div>

            <h3>
                Твоите любими
            </h3>

            <p>
                Все още нямаш добавени любими продукти.
            </p>

            <a
                href="index.html#collection"
                class="empty-favorites-button"
            >
                Разгледай колекцията
            </a>

        </div>

    `;

}


// =========================================
// SEARCH PANEL
// =========================================

const searchButton =
    document.querySelector(
        ".search-button"
    );

const searchPanel =
    document.querySelector(
        "#searchPanel"
    );

const searchInput =
    document.querySelector(
        "#searchInput"
    );

const closeSearch =
    document.querySelector(
        "#closeSearch"
    );


// =========================================
// SEARCH BUTTON
// =========================================

if (
    searchButton &&
    searchPanel
) {

    searchButton.addEventListener(
        "click",
        () => {

            searchPanel.classList.add(
                "active"
            );


            if (searchInput) {

                searchInput.focus();

            }

        }
    );

}


// =========================================
// SEARCH → SEARCH.HTML
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const query =
                searchInput.value
                    .trim();


            if (!query) {
                return;
            }


            window.location.href =
                `search.html?q=${encodeURIComponent(query)}`;

        }
    );

}


// =========================================
// CLOSE SEARCH
// =========================================

if (closeSearch) {

    closeSearch.addEventListener(
        "click",
        () => {

            if (searchPanel) {

                searchPanel.classList.remove(
                    "active"
                );

            }


            if (searchInput) {

                searchInput.value = "";

            }

        }
    );

}


// =========================================
// ESC
// =========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        if (searchPanel) {

            searchPanel.classList.remove(
                "active"
            );

        }


        if (searchInput) {

            searchInput.value = "";

        }

    }
);


// =========================================
// NAVBAR — FAVORITES
// =========================================

const navActions =
    document.querySelector(
        ".nav-actions"
    );


if (navActions) {

    const actionButtons =
        navActions.querySelectorAll(
            "button"
        );


    // Вторият бутон = Любими
    const favoritesButton =
        actionButtons[1];


    if (favoritesButton) {

        favoritesButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "favorites.html";

            }
        );

    }

}


// =========================================
// MOBILE MENU
// =========================================

const menuToggle =
    document.querySelector(
        ".menu-toggle"
    );

const navLinks =
    document.querySelector(
        ".nav-links"
    );


function closeMobileMenu() {

    if (
        !menuToggle ||
        !navLinks
    ) {
        return;
    }


    navLinks.classList.remove(
        "mobile-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    menuToggle.textContent =
        "☰";

}


if (
    menuToggle &&
    navLinks
) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "mobile-open"
            );


            const isOpen =
                navLinks.classList.contains(
                    "mobile-open"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );


            menuToggle.textContent =
                isOpen
                    ? "✕"
                    : "☰";

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();

                    }
                );

            }
        );

}


// =========================================
// PRODUCT PAGE
// =========================================

const productImage =
    document.querySelector(
        "#productImage"
    );

const productName =
    document.querySelector(
        "#productName"
    );

const productPrice =
    document.querySelector(
        "#productPrice"
    );

const productCategory =
    document.querySelector(
        "#productCategory"
    );

const productDescription =
    document.querySelector(
        "#productDescription"
    );


if (
    productImage &&
    productName
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    const product =
        products[productId];


    if (product) {

        productImage.src =
            product.image;


        productImage.alt =
            product.name;


        productName.textContent =
            product.name;


        productPrice.textContent =
            product.price;


        productCategory.textContent =
            product.category;


        productDescription.textContent =
            product.description;


        document.title =
            `${product.name} — LÉVIA`;

    }

}


// =========================================
// SIZE SELECTION
// =========================================

const sizeButtons =
    document.querySelectorAll(
        ".sizes button"
    );


sizeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                sizeButtons.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );

            }
        );

    }
);


// =========================================
// PRODUCT ANIMATION
// =========================================

function animateProducts() {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    if (
        productCards.length === 0
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    productCards.forEach(
        card => {

            observer.observe(card);

        }
    );

}


// =========================================
// НАЧАЛНО ЗАРЕЖДАНЕ
// =========================================

renderCurrentPage();

updateFavoriteButtons();