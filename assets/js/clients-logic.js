document.addEventListener("DOMContentLoaded", () => {
    const categoryList = document.getElementById("client-category-list");
    const brandGrid = document.getElementById("client-brand-grid");

    if (!categoryList || !brandGrid) return;

    fetch("brands.json")
        .then((response) => {
            if (!response.ok) throw new Error("Unable to load client brands");
            return response.json();
        })
        .then((brandsByCategory) => {
            const categories = Object.keys(brandsByCategory);
            renderCategories(categories, brandsByCategory, categoryList, brandGrid);
            renderBrands(categories[0], brandsByCategory[categories[0]], brandGrid);
        })
        .catch((error) => {
            console.error("Client brands loading error:", error);
            brandGrid.innerHTML = "<p class=\"client-brands-message\">Client logos are currently unavailable.</p>";
        });
});

function renderCategories(categories, brandsByCategory, categoryList, brandGrid) {
    categoryList.innerHTML = "";

    categories.forEach((category, index) => {
        const list = document.createElement("ul");
        list.className = "single-categories";

        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#client-brand-grid";
        link.textContent = category;
        link.setAttribute("aria-pressed", index === 0 ? "true" : "false");
        if (index === 0) link.classList.add("active");

        const icon = document.createElement("i");
        icon.className = "far fa-long-arrow-right";
        link.appendChild(icon);

        link.addEventListener("click", (event) => {
            event.preventDefault();
            categoryList.querySelectorAll("a").forEach((categoryLink) => {
                categoryLink.classList.remove("active");
                categoryLink.setAttribute("aria-pressed", "false");
            });
            link.classList.add("active");
            link.setAttribute("aria-pressed", "true");
            renderBrands(category, brandsByCategory[category], brandGrid);
        });

        item.appendChild(link);
        list.appendChild(item);
        categoryList.appendChild(list);
    });
}

function renderBrands(category, brands, brandGrid) {
    brandGrid.innerHTML = "";

    if (!Array.isArray(brands) || brands.length === 0) {
        brandGrid.innerHTML = "<p class=\"client-brands-message\">No client logos are available for this category.</p>";
        return;
    }

    brands.forEach((brand) => {
        const column = document.createElement("div");
        column.className = "col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6";

        const card = document.createElement("div");
        card.className = "client-brand-card";
        card.title = `${brand.name} - ${category}`;

        const image = document.createElement("img");
        image.src = brand.image;
        image.alt = brand.name;
        image.loading = "lazy";

        card.appendChild(image);
        column.appendChild(card);
        brandGrid.appendChild(column);
    });
}
