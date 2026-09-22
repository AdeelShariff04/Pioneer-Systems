document.addEventListener("DOMContentLoaded", () => {
    // 1. Extract ?product=slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productKey = urlParams.get("product") || "ups-inverter"; // Default fallback

    const inquiryForm = document.getElementById("product-inquiry-form");
    if (inquiryForm) {
        inquiryForm.addEventListener("submit", (event) => {
            event.preventDefault();
        });
    }

    // 2. Fetch or load product data
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
    // Update Page & Breadcrumb Metadata
    document.title = `${product.title} | Pioneer System`;

    // Map content elements
    const categoryEl = document.getElementById("product-category");
    const titleEl = document.getElementById("product-title");
    const descEl = document.getElementById("product-description");
    const quoteEl = document.getElementById("product-quote");
    const headingEl = document.getElementById("product-features-heading");
    const featuresContainer = document.getElementById("product-features-container");
    const specBtnEl = document.getElementById("product-spec-btn");
    const partnersContainer = document.getElementById("product-partners");

    if (categoryEl) categoryEl.textContent = product.category;
    if (titleEl) titleEl.textContent = product.title;
    if (descEl) document.getElementById("product-description").textContent = product.description;
    if (quoteEl) quoteEl.textContent = product.quote;
    if (headingEl && product.featureHeading) headingEl.textContent = product.featureHeading;

    // Render 4 Feature Check Items
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

    // Set Technical Spec Report URL
    if (specBtnEl) {
        if (product.specReportUrl) {
            specBtnEl.setAttribute("href", product.specReportUrl);
            specBtnEl.style.display = "inline-flex";
        } else {
            specBtnEl.style.display = "none";
        }
    }

    if (partnersContainer) {
        partnersContainer.innerHTML = "";
        (Array.isArray(product.vendors) ? product.vendors : []).forEach((vendor) => {
            const partner = document.createElement("span");
            partner.className = "product-partner-pill";
            partner.textContent = vendor;
            partnersContainer.appendChild(partner);
        });
    }

    // Auto-fill sidebar inquiry form input
    const inquiryInput = document.querySelector('input[name="product_name"]');
    if (inquiryInput) {
        inquiryInput.value = product.title;
    }
}