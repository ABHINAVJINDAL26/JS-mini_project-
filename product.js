const container = document.getElementById("productDetail");

const product = JSON.parse(localStorage.getItem("selectedProduct"));

if (!product) {
  container.innerHTML = "<h2>No product data found</h2>";
} else {
  container.innerHTML = `
    <img src="${product.thumbnail}" alt="${product.title}">
    <h2>${product.title}</h2>
    <p class="price">₹ ${product.price}</p>

    <p>${product.description}</p>

    <div>
      <span class="tag">Brand: ${product.brand}</span>
      <span class="tag">Category: ${product.category}</span>
    </div>
  `;
}

function goBack() {
  window.location.href = "index.html";
}
