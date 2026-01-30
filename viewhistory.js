const list = document.getElementById("viewHistoryList");

function getViewHistory() {
  return JSON.parse(localStorage.getItem("viewHistory")) || [];
}

function renderViewHistory() {
  const history = getViewHistory();
  list.innerHTML = "";

  if (history.length === 0) {
    list.innerHTML = "<li>No viewed products yet</li>";
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.title}</strong><br>
      <small>Viewed on: ${item.time}</small>
    `;
    list.appendChild(li);
  });
}

function goBack() {
  window.location.href = "index.html";
}

renderViewHistory();
