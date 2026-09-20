const CUSTOMER_STORAGE_KEY = "pioneerCustomers";
const CUSTOMER_ORDER_KEY = "pioneerCustomerOrder";

function getStoredCustomerOrder() {
    return localStorage.getItem(CUSTOMER_ORDER_KEY) || "oldest";
}

function sortCustomers(customers, order) {
    return order === "latest" ? [...customers].reverse() : [...customers];
}

function readCustomers() {
    const storedCustomers = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    return storedCustomers ? JSON.parse(storedCustomers) : null;
}

function saveCustomers(customers) {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
}

document.addEventListener("DOMContentLoaded", async () => {
    if (sessionStorage.getItem("pioneerAdminAuthenticated") !== "true") {
        window.location.href = "admin-login.html";
        return;
    }

    const tableBody = document.getElementById("admin-customer-list");
    const sortToggle = document.getElementById("customer-sort-toggle");
    const addModal = document.getElementById("add-customer-modal");
    const logoutModal = document.getElementById("logout-modal");
    const deleteModal = document.getElementById("delete-modal");
    const addForm = document.getElementById("add-customer-form");
    const modalTitle = document.getElementById("customer-modal-title");
    const saveButton = document.getElementById("save-customer-button");
    const statusMessage = document.getElementById("admin-status-message");
    let customers;
    let editingIndex = null;
    let deletingIndex = null;

    try {
        const response = await fetch("customers.json");
        if (!response.ok) throw new Error("Unable to load customers");
        customers = readCustomers() || await response.json();
        saveCustomers(customers);
    } catch (error) {
        console.error("Customer loading error:", error);
        statusMessage.textContent = "Customer list is currently unavailable.";
        return;
    }

    let customerOrder = getStoredCustomerOrder();

    const updateSortToggle = () => {
        const isLatest = customerOrder === "latest";
        sortToggle.setAttribute("aria-pressed", String(isLatest));
        sortToggle.querySelector("span").textContent = isLatest ? "Latest first" : "Oldest first";
        sortToggle.querySelector("i").className = isLatest
            ? "fa-regular fa-arrow-up-short-wide"
            : "fa-regular fa-arrow-down-short-wide";
    };

    const renderCustomers = () => {
        tableBody.innerHTML = "";
        const orderedCustomers = sortCustomers(customers, customerOrder);
        orderedCustomers.forEach((customer) => {
            const customerIndex = customers.indexOf(customer);
            const row = document.createElement("tr");
            [customer.customerName, customer.locations, customer.products].forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            const actionsCell = document.createElement("td");
            actionsCell.className = "admin-row-actions";
            actionsCell.innerHTML = `
                <button class="admin-icon-button edit-customer" type="button" aria-label="Edit ${customer.customerName}" title="Edit customer"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="admin-icon-button delete-customer" type="button" aria-label="Delete ${customer.customerName}" title="Delete customer"><i class="fa-regular fa-trash"></i></button>
            `;
            actionsCell.querySelector(".edit-customer").addEventListener("click", () => openEditModal(customerIndex));
            actionsCell.querySelector(".delete-customer").addEventListener("click", () => {
                deletingIndex = customerIndex;
                deleteModal.showModal();
            });
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    };

    const openEditModal = (customerIndex) => {
        const customer = customers[customerIndex];
        editingIndex = customerIndex;
        modalTitle.textContent = "Edit Customer";
        saveButton.textContent = "Update Customer";
        addForm.elements.customerName.value = customer.customerName;
        addForm.elements.locations.value = customer.locations;
        addForm.elements.products.value = customer.products;
        addModal.showModal();
    };

    sortToggle.addEventListener("click", () => {
        customerOrder = customerOrder === "oldest" ? "latest" : "oldest";
        localStorage.setItem(CUSTOMER_ORDER_KEY, customerOrder);
        updateSortToggle();
        renderCustomers();
    });

    addForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(addForm);
        const customer = {
            customerName: formData.get("customerName").trim(),
            locations: formData.get("locations").trim(),
            products: formData.get("products").trim(),
        };
        if (editingIndex === null) {
            customers.push(customer);
            statusMessage.textContent = "Customer added successfully.";
        } else {
            customers[editingIndex] = customer;
            statusMessage.textContent = "Customer updated successfully.";
        }
        saveCustomers(customers);
        renderCustomers();
        addForm.reset();
        addModal.close();
        editingIndex = null;
        modalTitle.textContent = "Add Customer";
        saveButton.textContent = "Save Customer";
    });

    document.getElementById("open-add-customer").addEventListener("click", () => {
        editingIndex = null;
        addForm.reset();
        modalTitle.textContent = "Add Customer";
        saveButton.textContent = "Save Customer";
        addModal.showModal();
    });
    document.getElementById("close-add-customer").addEventListener("click", () => addModal.close());
    document.getElementById("cancel-delete").addEventListener("click", () => deleteModal.close());
    document.getElementById("confirm-delete").addEventListener("click", () => {
        if (deletingIndex !== null) {
            customers.splice(deletingIndex, 1);
            saveCustomers(customers);
            renderCustomers();
            statusMessage.textContent = "Customer deleted successfully.";
        }
        deletingIndex = null;
        deleteModal.close();
    });
    document.getElementById("open-logout").addEventListener("click", () => logoutModal.showModal());
    document.getElementById("cancel-logout").addEventListener("click", () => logoutModal.close());
    document.getElementById("confirm-logout").addEventListener("click", () => {
        sessionStorage.removeItem("pioneerAdminAuthenticated");
        window.location.href = "admin-login.html";
    });

    updateSortToggle();
    renderCustomers();
});
