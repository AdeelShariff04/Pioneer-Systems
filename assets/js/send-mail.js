document.addEventListener("DOMContentLoaded", () => {
    ["contact-form", "product-inquiry-form"].forEach((formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (form.dataset.submitting === "true") return;
            form.dataset.submitting = "true";

            const submitButton = form.querySelector('[type="submit"]');
            const originalButtonText = submitButton?.textContent;
            const formData = new FormData(form);
            const productName = formData.get("product_name");

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            try {
                const response = await fetch("send-mail.php", {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();

                if (!response.ok || result.status !== "success") {
                    throw new Error(result.message || "Your message could not be sent.");
                }

                alert(result.message);
                form.reset();
                if (productName) {
                    form.elements.namedItem("product_name").value = productName;
                }
            } catch (error) {
                alert(error.message || "Your message could not be sent. Please try again.");
            } finally {
                delete form.dataset.submitting;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    });
});