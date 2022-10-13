document.querySelector("#logOutBtn").addEventListener("click", logout);

// Log out function
function logout() {
  localStorage.clear();
  window.location.replace("/views/login.html");
}
