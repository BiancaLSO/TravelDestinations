const url = "http://localhost:8082/";
document.querySelector("#logIn").addEventListener("click", async (event) => {
  event.preventDefault();
  const user = {
    username: document.querySelector("#username").value,
    password: document.querySelector("#password").value,
  };
  const response = await getUser(user);
  console.log(response);
  // if (response.errors.description) {
  //   console.log("you have backend error");
  // }
});
async function getUser(user) {
  console.log("it gets here");
  const result = await fetch(url + "auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQzZGVmOTg0MTgxNDY4YWYwYzIzMWQiLCJpYXQiOjE2NjUzOTM5ODV9.p6fT1YeLOGVoy20rBqc7k9JQvChCvEtGbCJlyQ9W_kI",
    },
    body: JSON.stringify(user),
  });
  if (result.status === 200) {
    // make log in work and redirect to another page
    // window.location.replace("/views/index.html");
    console.log("user logged in succesfully");
  }
  const res = await result.json();
  console.log(res);
  return res;
}
