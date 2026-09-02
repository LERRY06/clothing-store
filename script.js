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
    },

};


// =========================================
// ПРОДУКТОВА СТРАНИЦА
// =========================================

const productImage =
    document.querySelector("#productImage");

const productName =
    document.querySelector("#productName");

const productPrice =
    document.querySelector("#productPrice");

const productCategory =
    document.querySelector("#productCategory");

const productDescription =
    document.querySelector("#productDescription");


if (productImage && productName) {

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("id");

    const product =
        products[productId];

    if (product) {

        productImage.src = product.image;
        productImage.alt = product.name;

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
// ПРОДУКТОВ GRID
// =========================================

const productGrid =
    document.querySelector("#productGrid");

// =========================================
// ГЕНЕРИРАНЕ НА ПРОДУКТИ
// =========================================

function renderProducts(filter = "all") {

    if (!productGrid) {
        return;
    }


    productGrid.innerHTML = "";


    Object.entries(products).forEach(
        ([id, product]) => {

            const category =
                product.category === "Дамски"
                    ? "women"
                    : "men";


            // ---------------------------------
            // ФИЛТЪР
            // ---------------------------------

            if (
                filter !== "all" &&
                filter !== "new" &&
                category !== filter
            ) {
                return;
            }


            // ---------------------------------
            // НОВА КОЛЕКЦИЯ
            // ---------------------------------

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


            productGrid.appendChild(card);

        }
    );

}

// =========================================
// ОБНОВЯВАНЕ НА ПРОДУКТИТЕ
// =========================================

function refreshProducts() {

    if (favoritesMode) {

        renderFavorites();

        return;
    }


    const searchInput =
        document.querySelector("#searchInput");

    const searchTerm =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    // Ако няма търсене,
    // показваме нормалната колекция
    if (!searchTerm) {

        renderProducts(
            document.body.dataset.category || "all"
        );

        animateProducts();

        return;
    }


    // -----------------------------------------
    // ТЪРСЕНЕ
    // -----------------------------------------

    productGrid.innerHTML = "";


    Object.entries(products).forEach(
        ([id, product]) => {

            const name =
                product.name.toLowerCase();

            const category =
                product.category.toLowerCase();


            if (
                name.includes(searchTerm) ||
                category.includes(searchTerm)
            ) {

                const card =
                    createProductCard(
                        id,
                        product
                    );

                productGrid.appendChild(card);

            }

        }
    );


    updateFavoriteButtons();

    animateProducts();

}

// =========================================
// ПОКАЗВАНЕ НА ЛЮБИМИТЕ
// =========================================

function renderFavorites() {

    if (!productGrid) {
        return;
    }


    // ---------------------------------
    // НЯМА ЛЮБИМИ
    // ---------------------------------

    if (favorites.length === 0) {

        renderEmptyFavorites();

        return;

    }


    // ---------------------------------
    // ИМА ЛЮБИМИ
    // ---------------------------------

    productGrid.innerHTML = "";


    Object.entries(products).forEach(
        ([id, product]) => {

            if (!favorites.includes(id)) {
                return;
            }


            const card =
                createProductCard(
                    id,
                    product
                );


            productGrid.appendChild(card);

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

            <h3>Твоите любими</h3>

            <p>
                Все още нямаш добавени любими продукти.
            </p>

            <button
                type="button"
                class="empty-favorites-button"
            >
                Разгледай колекцията
            </button>

        </div>

    `;


    const button =
        productGrid.querySelector(
            ".empty-favorites-button"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                favoritesMode = false;

                showAllProducts();

                scrollToCollection();

            }
        );

    }

}

// =========================================
// ФИЛТРИ
// =========================================

// null = всички продукти
let activeCategory = null;

// false = всички продукти
let showFavoritesOnly = false;

// В момента показваме ли само любими?
let favoritesMode = false;

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

// Взима ID на продукта от href-а
function getProductId(card) {

    const href =
        card.getAttribute("href");

    if (!href) {
        return null;
    }

    const params =
        new URLSearchParams(
            href.split("?")[1]
        );

    return params.get("id");
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
    // PRODUCT IMAGE
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
    // FAVORITE BUTTON
    // -----------------------------------------

    const favoriteButton =
        document.createElement("button");

    favoriteButton.className =
        "favorite-button";

    favoriteButton.type =
        "button";

    favoriteButton.textContent =
        favorites.includes(id)
            ? "♥"
            : "♡";


    favoriteButton.style.color =
        favorites.includes(id)
            ? "#8a6a52"
            : "#171717";


    favoriteButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();


            if (favorites.includes(id)) {

                favorites =
                    favorites.filter(
                        (favoriteId) =>
                            favoriteId !== id
                    );

            } else {

                favorites.push(id);

            }


            saveFavorites();


            // Ако в момента сме в „Любими“
            if (favoritesMode) {

    renderFavorites();

} else {

    updateFavoriteButtons();

}

        }
    );


    image.appendChild(
        favoriteButton
    );


    // -----------------------------------------
    // PRODUCT INFO
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


    // -----------------------------------------
    // СГЛОБЯВАМЕ КАРТАТА
    // -----------------------------------------

    card.appendChild(image);
    card.appendChild(info);


    return card;
}

// Запазва любимите
function saveFavorites() {

    localStorage.setItem(
        "leviaFavorites",
        JSON.stringify(favorites)
    );

}


// Обновява визуално бутоните за любими
function updateFavoriteButtons() {

    document
        .querySelectorAll(".favorite-button")
        .forEach((button) => {

            const card =
                button.closest(".product-card");

            if (!card) {
                return;
            }

            const productId =
                getProductId(card);

            if (
                favorites.includes(productId)
            ) {

                button.textContent = "♥";
                button.style.color = "#8a6a52";
                button.classList.add("active");

            } else {

                button.textContent = "♡";
                button.style.color = "#171717";
                button.classList.remove("active");

            }

        });

}



// =========================================
// SCROLL ДО КОЛЕКЦИЯТА
// =========================================

function scrollToCollection() {

    const collection =
        document.querySelector("#collection");

    if (collection) {

        collection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =========================================
// ФИЛТЪР ПО КАТЕГОРИЯ
// =========================================

function filterByCategory(category) {

    activeCategory = category;

    showFavoritesOnly = false;

    favoritesMode = false;

    document.body.dataset.category = category;

    refreshProducts();

    scrollToCollection();

}


// =========================================
// ПОКАЗВАНЕ НА ВСИЧКИ ПРОДУКТИ
// =========================================

function showAllProducts() {

    activeCategory = null;

    showFavoritesOnly = false;

    favoritesMode = false;

    document.body.dataset.category = "all";

    refreshProducts();
}


// =========================================
// NAVBAR КАТЕГОРИИ
// =========================================

const categoryLinks =
    document.querySelectorAll(
        ".nav-links [data-category]"
    );


categoryLinks.forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            const category =
                link.dataset.category;

            filterByCategory(category);

            // Затваряне на mobile менюто
            closeMobileMenu();

        }
    );

});


// =========================================
// ГОЛЕМИТЕ КАРТИ „ДАМСКИ / МЪЖКИ“
// =========================================

// В HTML добави data-category към картите.
// JavaScript работи както с navbar-а,
// така и с тези карти.

const categoryCards =
    document.querySelectorAll(
        ".category-card[data-category]"
    );


categoryCards.forEach((card) => {

    card.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            const category =
                card.dataset.category;

            filterByCategory(category);

        }
    );

});


// =========================================
// НОВА КОЛЕКЦИЯ
// =========================================

const showAllLink =
    document.querySelector(".show-all-products");


if (showAllLink) {

    showAllLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showAllProducts();

            scrollToCollection();

            closeMobileMenu();

        }
    );

}


// =========================================
// „ВИЖ ВСИЧКИ“
// =========================================

const viewAll =
    document.querySelector(".view-all");


if (viewAll) {

    viewAll.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showAllProducts();

            scrollToCollection();

        }
    );

}

// =========================================
// ТЪРСЕНЕ
// =========================================

const searchButton =
    document.querySelector(".search-button");

const searchPanel =
    document.querySelector("#searchPanel");

const searchInput =
    document.querySelector("#searchInput");

const closeSearch =
    document.querySelector("#closeSearch");

// =========================================
// SEARCH STATE
// =========================================

let searchTimeout = null;

// =========================================
// ОТВАРЯНЕ
// =========================================

if (searchButton && searchPanel) {

    searchButton.addEventListener("click", () => {

        searchPanel.classList.add("active");

        if (searchInput) {
            searchInput.focus();
        }

    });

}


// =========================================
// ТЪРСЕНЕ НА ПРОДУКТИ
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();

            const cards =
                document.querySelectorAll(
                    ".product-card"
                );

            cards.forEach((card) => {

                const name =
                    card.querySelector("h3")
                        ?.textContent
                        .toLowerCase() || "";

                const category =
                    card.querySelector(".product-category")
                        ?.textContent
                        .toLowerCase() || "";

                const matches =
                    !searchTerm ||
                    name.includes(searchTerm) ||
                    category.includes(searchTerm);

                if (matches) {

                    card.classList.remove(
                        "search-hidden"
                    );

                } else {

                    card.classList.add(
                        "search-hidden"
                    );

                }

            });

        }
    );

}

// =========================================
// ЗАТВАРЯНЕ
// =========================================

if (closeSearch) {

    closeSearch.addEventListener("click", () => {


        if (searchPanel) {
            searchPanel.classList.remove("active");
        }


        if (searchInput) {
            searchInput.value = "";
        }


        showAllProducts();

    });

}


// =========================================
// ESC
// =========================================

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
        return;
    }

    if (searchPanel) {
        searchPanel.classList.remove("active");
    }


    if (searchInput) {
        searchInput.value = "";
    }


    showAllProducts();

});

// =========================================
// NAVBAR — ЛЮБИМИ
// =========================================

const navActionButtons =
    document.querySelectorAll(
        ".nav-actions > button"
    );


// Любими е вторият бутон
const favoritesNavButton =
    navActionButtons[1];


if (favoritesNavButton) {

    favoritesNavButton.addEventListener(
        "click",
        () => {

            favoritesMode = true;

            renderFavorites();

            scrollToCollection();

            closeMobileMenu();

        }
    );

}

// =========================================
// ИЗБОР НА РАЗМЕР
// =========================================

const sizeButtons =
    document.querySelectorAll(
        ".sizes button"
    );


sizeButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            sizeButtons.forEach((item) => {
                item.classList.remove(
                    "selected"
                );
            });

            button.classList.add(
                "selected"
            );

        }
    );

});


// =========================================
// АНИМАЦИЯ НА ПРОДУКТИТЕ
// =========================================

function animateProducts() {

    const productCards =
        document.querySelectorAll(".product-card");


    if (productCards.length === 0) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

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

                });

            },
            {
                threshold: 0.15
            }
        );


    productCards.forEach((card) => {
        observer.observe(card);
    });

}

// =========================================
// MOBILE MENU
// =========================================

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");


function closeMobileMenu() {

    if (!menuToggle || !navLinks) {
        return;
    }

    navLinks.classList.remove(
        "mobile-open"
    );

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.textContent = "☰";

}


if (menuToggle && navLinks) {

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
                isOpen ? "✕" : "☰";

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    closeMobileMenu();

                }
            );

        });

}


// =========================================
// НАЧАЛНО СЪСТОЯНИЕ
// =========================================

renderProducts(
    document.body.dataset.category || "all"
);

updateFavoriteButtons();

animateProducts();