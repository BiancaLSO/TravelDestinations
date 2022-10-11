const url = "http://localhost:8082/";
document.querySelector("#logIn").addEventListener("click", async (event) => {
  event.preventDefault();
  // const user = {
  //     username: document.querySelector("#username").value,
  //     password: document.querySelector("#password").value,
  //   };
  const response = await getUser();
  console.log(response);
});
async function getUser() {
  console.log("it gets here");
  const result = await fetch(url + "auth/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQzZGVmOTg0MTgxNDY4YWYwYzIzMWQiLCJpYXQiOjE2NjUzOTM5ODV9.p6fT1YeLOGVoy20rBqc7k9JQvChCvEtGbCJlyQ9W_kI",
    },
  });
  const res = await result.json();
  console.log(res);
}
