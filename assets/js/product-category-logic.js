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

    // 1. Read URL query param ?category=... (with fallback to "All products")
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    let selectedCategory = "All products";
    if (categoryParam) {
        // Case-insensitive match against extracted categories
        const matched = categories.find(
            (c) => c.toLowerCase() === categoryParam.toLowerCase().trim()
        );
        if (matched) {
            selectedCategory = matched;
        }
    }

    // 2. Filter cards based on search input and active category
    const filterProducts = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        let visibleCount = 0;

        cards.forEach((card) => {
            const categoryElem = card.querySelector(".content .pre");
            const titleElem = card.querySelector(".content .title");

            const cardCategory = categoryElem ? categoryElem.textContent.trim() : "";
            const cardTitle = titleElem ? titleElem.textContent.trim().toLowerCase() : "";

            const matchesCategory =
                selectedCategory === "All products" || cardCategory === selectedCategory;
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

    // 3. Render Category Sidebar Tabs
    if (categoryList) {
        categoryList.innerHTML = "";
        categories.forEach((category) => {
            const isInitialActive = category === selectedCategory;

            const list = document.createElement("ul");
            list.className = "single-categories";
            const item = document.createElement("li");
            const link = document.createElement("a");

            link.href = "#";
            link.innerHTML = `${category} <i class="far fa-long-arrow-right"></i>`;
            link.className = isInitialActive ? "active" : "";
            link.setAttribute("aria-pressed", String(isInitialActive));

            link.addEventListener("click", (event) => {
                event.preventDefault();
                selectedCategory = category;

                // Sync URL without triggering a full page reload
                const newUrl = new URL(window.location);
                if (category === "All products") {
                    newUrl.searchParams.delete("category");
                } else {
                    newUrl.searchParams.set("category", category);
                }
                window.history.replaceState({}, "", newUrl);

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

    // 4. Attach search events
    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }
    if (searchButton && searchInput) {
        searchButton.addEventListener("click", () => {
            searchInput.focus();
            filterProducts();
        });
    }

    // 5. Initial filter run matching URL category selection
    filterProducts();
});