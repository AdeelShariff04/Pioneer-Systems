document.addEventListener("DOMContentLoaded", () => {
    // 1. Extract ?product=slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productKey = urlParams.get("product") || "ups-inverter";

    // 2. Fetch products data
    fetch("products.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to load product definitions");
            }
            return response.json();
        })
        .then((productsData) => {
            const product = productsData[productKey] || productsData["ups-inverter"];
            renderProductDetails(product);
        })
        .catch((error) => {
            console.error("Product loading error:", error);
        });
});

function renderProductDetails(product) {
    if (!product) return;

    // Update Browser Tab Title
    document.title = `${product.title} | Pioneer System`;

    // Map DOM elements
    const categoryEl = document.getElementById("product-category");
    const titleEl = document.getElementById("product-title");
    const descEl = document.getElementById("product-description");
    const quoteEl = document.getElementById("product-quote");
    const headingEl = document.getElementById("product-features-heading");
    const featuresContainer = document.getElementById("product-features-container");
    const specBtnEl = document.getElementById("product-spec-btn");
    const galleryRow = document.getElementById("product-gallery-row");

    // Populate Headings & Text
    if (categoryEl) categoryEl.textContent = product.category || "";
    if (titleEl) titleEl.textContent = product.title || "";
    if (descEl) descEl.textContent = product.description || "";
    if (quoteEl) quoteEl.textContent = product.quote ? `“${product.quote}”` : "";
    if (headingEl) headingEl.textContent = product.featureHeading || "Core Solution Offerings";

    // --- Dynamic Bottom Gallery Rendering ---
    if (galleryRow) {
        galleryRow.innerHTML = "";
        const imageList = Array.isArray(product.images) && product.images.length > 0 
            ? product.images.slice(0, 4) 
            : [];

        imageList.forEach((imgSrc) => {
            const col = document.createElement("div");
            col.className = "col-lg-3 col-md-6 col-sm-6 col-xs-12 image";

            col.innerHTML = `
                <div class="img-wrapper">
                    <a href="${imgSrc}" target="_blank" rel="noopener">
                        <img src="${imgSrc}" class="img-responsive img-fluid w-100" alt="${product.title}" style="object-fit: cover; display: block; border-radius: 10px;">
                    </a>
                </div>
            `;
            galleryRow.appendChild(col);
        });
    }

    // --- Render Feature Items ---
    if (featuresContainer && Array.isArray(product.features)) {
        featuresContainer.innerHTML = "";
        product.features.forEach((featureText) => {
            const singleDiv = document.createElement("div");
            singleDiv.className = "single";
            singleDiv.innerHTML = `
                <i class="fa-light fa-circle-check"></i>
                <p>${featureText}</p>
            `;
            featuresContainer.appendChild(singleDiv);
        });
    }

    // --- Spec Report Button ---
    if (specBtnEl) {
        if (product.specReportUrl) {
            specBtnEl.setAttribute("href", product.specReportUrl);
            specBtnEl.style.display = "inline-flex";
        } else {
            specBtnEl.style.display = "none";
        }
    }

    renderProductPartners(product.partners);

    // --- Sidebar Product Name Auto-Fill ---
    const inquiryInput = document.querySelector('input[name="product_name"]');
    if (inquiryInput) {
        inquiryInput.value = product.title;
    }
}

function renderProductPartners(partners) {
    const slider = document.querySelector(".mySwiper-category-soalr");
    const sliderWrapper = document.getElementById("product-partners-slider");
    if (!slider || !sliderWrapper) return;

    sliderWrapper.replaceChildren();
    const partnerList = Array.isArray(partners) ? partners : [];
    partnerList.forEach((partner) => {
        if (!partner || typeof partner.name !== "string" || typeof partner.logo !== "string"
            || !partner.name.trim() || !partner.logo.trim()) return;

        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        const card = document.createElement("div");
        card.className = "single-category";

        const thumbnail = document.createElement("div");
        thumbnail.className = "thumbnail";

        const logo = document.createElement("img");
        logo.src = partner.logo;
        logo.alt = partner.name;
        logo.loading = "lazy";
        thumbnail.appendChild(logo);

        const nameContainer = document.createElement("div");
        nameContainer.className = "single-category";
        const name = document.createElement("h5");
        name.className = "title";
        name.textContent = partner.name;
        nameContainer.appendChild(name);

        card.append(thumbnail, nameContainer);
        slide.appendChild(card);
        sliderWrapper.appendChild(slide);
    });

    const swiper = slider.swiper;
    if (swiper) {
        swiper.update();
    }
}