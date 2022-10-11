const url = "http://localhost:8082/";

document.querySelector("#signUp").addEventListener("click", async (event) => {
  event.preventDefault();
  const user = {
    username: document.querySelector("#username").value,
    password: document.querySelector("#password").value,
  };
  const response = await postUser(user);
  console.log(response);
  if (response.status === 200) {
    window.location.replace("/views/index.html");
  }
});
async function postUser(user) {
  console.log(user);
  const response = await fetch(url + "auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  console.log(response);
  return response;
}
