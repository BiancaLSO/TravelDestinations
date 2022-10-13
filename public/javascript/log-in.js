const url = "http://localhost:8082/";

document.querySelector("#logIn").addEventListener("click", async (event) => {
  event.preventDefault();
  const user = {
    username: document.querySelector("#username").value,
    password: document.querySelector("#password").value,
  };
  const response = await getUser(user);
  console.log(response);
  localStorage.setItem("token", response);
  if (response) {
    window.location.replace("/views/index.html");
  }
});

// Log in
async function getUser(user) {
  const result = await fetch(url + "auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (result.status === 200) {
    console.log("User logged in succesfully");
  }
  const res = await result.json();
  console.log(res);
  return res;
}
