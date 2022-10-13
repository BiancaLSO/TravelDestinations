document.querySelector("#logOutBtn").addEventListener("click", logout);

function logout() {
  localStorage.clear();
  window.location.replace("/views/login.html");
}
