const API_URL = "/api/products";

// Fetch and display all products
const fetchProducts = async () => {
  const response = await fetch(API_URL);
  const products = await response.json();

  const tableBody = document.querySelector("#products-table tbody");
  tableBody.innerHTML = ""; // Clear table before appending new rows

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.description}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>
        <button onclick="editProduct('${product._id}')">Edit</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Add a new product
document
  .getElementById("add-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value,
      stock: document.getElementById("stock").value,
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    event.target.reset();
    fetchProducts();
  });

// Delete a product
const deleteProduct = async (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  }
};

// Edit a product
const editProduct = async (id) => {
  // Add logic for editing a product
  alert(`Edit feature for product ID: ${id} not implemented yet.`);
};

// Initial fetch
fetchProducts();
