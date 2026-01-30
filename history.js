const historyList = document.getElementById("historyList");

function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function renderHistory() {
  const history = getSearchHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No search history found</li>";
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.term}</strong>
      <br />
      <small>Searched on: ${item.time}</small>
    `;

    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("searchHistory");
  renderHistory();
}

function goBack() {
  window.location.href = "index.html";
}

renderHistory();
