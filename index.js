let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 8;

/* ---------------- FETCH PRODUCTS ---------------- */
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data.products;
    filteredProducts = allProducts;
    renderPage();
  })
  .catch(() => {
    document.getElementById("products").innerHTML =
      "<h2>Failed to load products</h2>";
  });

/* ---------------- PAGINATION RENDER ---------------- */
function renderPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredProducts.slice(start, end);

  displayProducts(pageItems);
  updatePagination();
}

/* ---------------- DISPLAY PRODUCTS ---------------- */
function displayProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<h3>No products found</h3>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">₹ ${product.price}</p>
    `;

    card.addEventListener("click", () => {
      saveViewHistory(product);
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "product.html";
    });

    container.appendChild(card);
  });
}

/* ---------------- PAGINATION UI ---------------- */
function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

/* ---------------- PAGINATION BUTTONS ---------------- */
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

/* ---------------- SEARCH HISTORY ---------------- */
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function saveSearch(term) {
  let history = getSearchHistory();
  if (history.some((item) => item.term === term)) return;

  history.push({
    term,
    time: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });

  localStorage.setItem("searchHistory", JSON.stringify(history));
}

/* ---------------- VIEW HISTORY ---------------- */
function getViewHistory() {
  return JSON.parse(localStorage.getItem("viewHistory")) || [];
}

function saveViewHistory(product) {
  let history = getViewHistory();

  history.unshift({
    title: product.title,
    time: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });

  history = history.slice(0, 10);
  localStorage.setItem("viewHistory", JSON.stringify(history));
}

/* ---------------- SEARCH (BUTTON) ---------------- */
function searchProduct() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  const suggestionsBox = document.getElementById("suggestions");

  if (!value) {
    filteredProducts = allProducts;
    currentPage = 1;
    renderPage();
    suggestionsBox.innerHTML = "";
    return;
  }

  saveSearch(value);

  filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  currentPage = 1;
  renderPage();
  suggestionsBox.innerHTML = "";
}

/* ---------------- LIVE FILTER ---------------- */
function filterProductsLive(value) {
  filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  currentPage = 1;
  renderPage();
}

/* ---------------- SUGGESTIONS ---------------- */
function showSuggestions(input) {
  const suggestionsBox = document.getElementById("suggestions");
  suggestionsBox.innerHTML = "";
  if (!input) return;

  allProducts
    .filter((p) => p.title.toLowerCase().includes(input))
    .slice(0, 5)
    .forEach((p) => {
      const div = document.createElement("div");
      div.innerText = p.title;

      div.onclick = () => {
        document.getElementById("searchInput").value = p.title;
        searchProduct();
      };

      suggestionsBox.appendChild(div);
    });
}

/* ---------------- INPUT LISTENER ---------------- */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const suggestionsBox = document.getElementById("suggestions");

  if (!value) {
    filteredProducts = allProducts;
    currentPage = 1;
    renderPage();
    suggestionsBox.innerHTML = "";
    return;
  }

  filterProductsLive(value);
  showSuggestions(value);
});

/* ---------------- BUTTONS ---------------- */
document.getElementById("bagbutton").addEventListener("click", () => {
  alert("Item added to bag");
});

document.getElementById("wishlistbutton").addEventListener("click", () => {
  alert("Item added to wishlist");
});

/* ---------------- PAGE NAVIGATION ---------------- */
function openHistory() {
  window.location.href = "history.html";
}

function openViewHistory() {
  window.location.href = "viewhistory.html";
}
