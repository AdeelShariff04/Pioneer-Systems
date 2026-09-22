document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");
    const categoryList = document.getElementById("product-category-list");
    const searchInput = document.getElementById("product-search");
    const searchButton = document.getElementById("product-search-button");

    if (!productGrid) return;

    // Grab all HTML cards already written inside the grid
    const cards = Array.from(productGrid.children);
    if (!cards.length) return;

    // Extract unique categories directly from the HTML cards
    const rawCategories = cards.map((card) => {
        const catElem = card.querySelector(".content .pre");
        return catElem ? catElem.textContent.trim() : "";
    }).filter(Boolean);

    const categories = ["All products", ...new Set(rawCategories)];
    let selectedCategory = "All products";

    // Filter cards based on search input and active category
    const filterProducts = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        let visibleCount = 0;

        cards.forEach((card) => {
            const categoryElem = card.querySelector(".content .pre");
            const titleElem = card.querySelector(".content .title");

            const cardCategory = categoryElem ? categoryElem.textContent.trim() : "";
            const cardTitle = titleElem ? titleElem.textContent.trim().toLowerCase() : "";

            const matchesCategory = selectedCategory === "All products" || cardCategory === selectedCategory;
            const matchesSearch = !query || cardTitle.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Toggle "No products found" message
        let noResults = document.getElementById("no-products-msg");
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement("p");
                noResults.id = "no-products-msg";
                noResults.className = "product-filter-message";
                noResults.textContent = "No products found.";
                productGrid.appendChild(noResults);
            }
            noResults.style.display = "block";
        } else if (noResults) {
            noResults.style.display = "none";
        }
    };

    // Render Category Sidebar Tabs
    if (categoryList) {
        categoryList.innerHTML = "";
        categories.forEach((category, index) => {
            const list = document.createElement("ul");
            list.className = "single-categories";
            const item = document.createElement("li");
            const link = document.createElement("a");

            link.href = "#";
            link.innerHTML = `${category} <i class="far fa-long-arrow-right"></i>`;
            link.className = index === 0 ? "active" : "";
            link.setAttribute("aria-pressed", String(index === 0));

            link.addEventListener("click", (event) => {
                event.preventDefault();
                selectedCategory = category;

                categoryList.querySelectorAll("a").forEach((catLink) => {
                    catLink.classList.remove("active");
                    catLink.setAttribute("aria-pressed", "false");
                });

                link.classList.add("active");
                link.setAttribute("aria-pressed", "true");
                filterProducts();
            });

            item.appendChild(link);
            list.appendChild(item);
            categoryList.appendChild(list);
        });
    }

    // Attach search events
    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }
    if (searchButton && searchInput) {
        searchButton.addEventListener("click", () => {
            searchInput.focus();
            filterProducts();
        });
    }
});