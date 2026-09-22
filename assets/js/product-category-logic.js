document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");
    const categoryList = document.getElementById("product-category-list");
    const searchInput = document.getElementById("product-search");
    const searchButton = document.getElementById("product-search-button");

    if (!productGrid || !categoryList || !searchInput) return;
    productGrid.innerHTML = "";

    fetch("products.json")
        .then((response) => {
            if (!response.ok) throw new Error("Unable to load products");
            return response.json();
        })
        .then((productsData) => {
            const products = Object.values(productsData).filter((product) => product.id === "it-infrastructure");
            const categories = ["All products", ...new Set(products.map((product) => product.category))];
            let selectedCategory = "All products";

            const renderCategories = () => {
                categoryList.innerHTML = "";
                categories.forEach((category, index) => {
                    const list = document.createElement("ul");
                    list.className = "single-categories";
                    const item = document.createElement("li");
                    const link = document.createElement("a");
                    const icon = document.createElement("i");

                    link.href = "#product-grid";
                    link.textContent = category;
                    link.className = index === 0 ? "active" : "";
                    link.setAttribute("aria-pressed", String(index === 0));
                    icon.className = "far fa-long-arrow-right";
                    link.appendChild(icon);

                    link.addEventListener("click", (event) => {
                        event.preventDefault();
                        selectedCategory = category;
                        categoryList.querySelectorAll("a").forEach((categoryLink) => {
                            categoryLink.classList.remove("active");
                            categoryLink.setAttribute("aria-pressed", "false");
                        });
                        link.classList.add("active");
                        link.setAttribute("aria-pressed", "true");
                        renderProducts();
                    });

                    item.appendChild(link);
                    list.appendChild(item);
                    categoryList.appendChild(list);
                });
            };

            const renderProducts = () => {
                const query = searchInput.value.trim().toLowerCase();
                const visibleProducts = products.filter((product) => {
                    const matchesCategory = selectedCategory === "All products" || product.category === selectedCategory;
                    const matchesSearch = product.title.toLowerCase().includes(query);
                    return matchesCategory && matchesSearch;
                });

                productGrid.innerHTML = "";
                if (!visibleProducts.length) {
                    const message = document.createElement("p");
                    message.className = "product-filter-message";
                    message.textContent = "No products found.";
                    productGrid.appendChild(message);
                    return;
                }

                visibleProducts.forEach((product, index) => {
                    const column = document.createElement("div");
                    column.className = "col-lg-6 col-md-6 col-sm-6 col-12";
                    const card = document.createElement("div");
                    card.className = "project-one-wrapper";

                    const shape = document.createElement("div");
                    shape.className = "shape";
                    shape.innerHTML = '<img src="assets/images/project/shape/01.png" alt="shape">';

                    const thumbnail = document.createElement("a");
                    thumbnail.className = "thumbnail";
                    thumbnail.href = `product-detail.html?product=${encodeURIComponent(product.id)}`;
                    const image = document.createElement("img");
                    image.src = `assets/images/project/${String((index % 4) + 1).padStart(2, "0")}.jpg`;
                    image.alt = product.title;
                    thumbnail.appendChild(image);

                    const content = document.createElement("div");
                    content.className = "content";
                    const category = document.createElement("span");
                    category.className = "pre";
                    category.textContent = product.category;
                    const titleLink = document.createElement("a");
                    titleLink.href = thumbnail.href;
                    const title = document.createElement("h5");
                    title.className = "title";
                    title.textContent = product.title;
                    titleLink.appendChild(title);
                    const contentShape = document.createElement("img");
                    contentShape.src = "assets/images/project/shape/02.png";
                    contentShape.alt = "shape";
                    content.append(category, titleLink, contentShape);
                    card.append(shape, thumbnail, content);
                    column.appendChild(card);
                    productGrid.appendChild(column);
                });
            };

            searchInput.addEventListener("input", renderProducts);
            searchButton?.addEventListener("click", () => {
                searchInput.focus();
                renderProducts();
            });
            renderCategories();
            renderProducts();
        })
        .catch((error) => {
            console.error("Product catalog loading error:", error);
            productGrid.innerHTML = "<p class=\"product-filter-message\">Products are currently unavailable.</p>";
        });
});
