document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("customer-list");

    if (!tableBody) return;

    fetch("customers.json")
        .then((response) => {
            if (!response.ok) throw new Error("Unable to load customer list");
            return response.json();
        })
        .then((customers) => {
            const storedCustomers = localStorage.getItem("pioneerCustomers");
            const storedOrder = localStorage.getItem("pioneerCustomerOrder") || "oldest";
            const visibleCustomers = storedCustomers ? JSON.parse(storedCustomers) : customers;
            const orderedCustomers = storedOrder === "latest"
                ? [...visibleCustomers].reverse()
                : visibleCustomers;
            tableBody.innerHTML = "";

            orderedCustomers.forEach((customer) => {
                const row = document.createElement("tr");
                [customer.customerName, customer.locations, customer.products].forEach((value) => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Customer list loading error:", error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3">Customer list is currently unavailable.</td>
                </tr>
            `;
        });
});
