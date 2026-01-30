let allProducts = [];

/* ---------------- FETCH PRODUCTS ---------------- */
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data.products;
    displayProducts(allProducts);
  })
  .catch(() => {
    document.getElementById("products").innerHTML =
      "<h2>Failed to load products</h2>";
  });

/* ---------------- DISPLAY ---------------- */
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

    container.appendChild(card);
  });
}

/* ---------------- LOCAL STORAGE ---------------- */
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function saveSearch(term) {
  let history = getSearchHistory();

  const exists = history.some((item) => item.term === term);
  if (exists) return;

  const time = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  history.push({ term, time });

  localStorage.setItem("searchHistory", JSON.stringify(history));
}

/* ---------------- SEARCH ---------------- */
function searchProduct() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  const suggestionsBox = document.getElementById("suggestions");

  if (!value) {
    displayProducts(allProducts);
    suggestionsBox.innerHTML = "";
    return;
  }

  // ✅ FINAL SEARCH → SAVE HISTORY
  saveSearch(value);

  const filtered = allProducts.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  displayProducts(filtered);
  suggestionsBox.innerHTML = "";
}

/* ---------------- SUGGESTIONS ---------------- */
function showSuggestions(input) {
  const suggestionsBox = document.getElementById("suggestions");
  suggestionsBox.innerHTML = "";

  if (!input) return;

  /* ---------- 1. PRODUCT BASED SUGGESTIONS ---------- */
  const productMatches = allProducts
    .filter((product) => product.title.toLowerCase().includes(input))
    .slice(0, 5); // limit

  productMatches.forEach((product) => {
    const div = document.createElement("div");
    div.innerText = product.title;

    div.onclick = () => {
      document.getElementById("searchInput").value = product.title;
      searchProduct();
      suggestionsBox.innerHTML = "";
    };

    suggestionsBox.appendChild(div);
  });

  /* ---------- 2. SEARCH HISTORY SUGGESTIONS ---------- */
  const history = getSearchHistory();

  history
    .filter(
      (item) =>
        item.term.includes(input) &&
        !productMatches.some((p) => p.title === item.term),
    )
    .slice(0, 3)
    .forEach((item) => {
      const div = document.createElement("div");
      div.innerText = `🕘 ${item.term}`;

      div.onclick = () => {
        document.getElementById("searchInput").value = item.term;
        searchProduct();
        suggestionsBox.innerHTML = "";
      };

      suggestionsBox.appendChild(div);
    });
}

/* ---------------- INPUT LISTENER ---------------- */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const suggestionsBox = document.getElementById("suggestions");

  if (!value) {
    displayProducts(allProducts);
    suggestionsBox.innerHTML = "";
    return;
  }

  // ✅ LIVE PRODUCT FILTER
  filterProductsLive(value);

  // ✅ LIVE SUGGESTIONS
  showSuggestions(value);
});

/* ---------------- BUTTONS ---------------- */
document.getElementById("bagbutton").addEventListener("click", () => {
  alert("Item added to bag");
});

document.getElementById("wishlistbutton").addEventListener("click", () => {
  alert("Item added to wishlist");
});

function openHistory() {
  window.location.href = "history.html";
}

function filterProductsLive(value) {
  const filtered = allProducts.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  displayProducts(filtered);
}
