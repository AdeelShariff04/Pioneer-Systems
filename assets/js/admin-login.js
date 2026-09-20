document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("admin-login-form");
    const message = document.getElementById("admin-login-message");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        message.textContent = "";

        try {
            const response = await fetch("admin-auth.json");
            if (!response.ok) throw new Error("Unable to load admin credentials");
            const credentials = await response.json();
            const username = form.elements.username.value.trim();
            const password = form.elements.password.value;

            if (username !== credentials.username || password !== credentials.password) {
                message.textContent = "Incorrect username or password.";
                return;
            }

            sessionStorage.setItem("pioneerAdminAuthenticated", "true");
            window.location.href = "admin-manage.html";
        } catch (error) {
            console.error("Admin login error:", error);
            message.textContent = "Login is currently unavailable.";
        }
    });
});
