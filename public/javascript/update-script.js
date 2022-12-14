window.addEventListener("load", async function () {
  const id = getIdFromUrl();
  console.log(id);
  const destination = await getSpecificDestination(id);
  console.log(destination);
  fillInTheForm(destination);
});

const url = "http://localhost:8082/";

function getIdFromUrl() {
  const location = window.location.toString();
  const splitQuestionmark = location.split("?");
  const routeParams = splitQuestionmark[1];
  const splitIdParam = routeParams.split("=");
  console.log(splitIdParam[1]);
  return splitIdParam[1];
}
function fillInTheForm(destination) {
  console.log(destination);
  document.querySelector("#name").value = destination.name;
  document.querySelector("#location").value = destination.location;
  document.querySelector("#startDate").value = new Date(destination.startDate).toISOString().slice(0, 10);
  document.querySelector("#endDate").value = new Date (destination.endDate).toISOString().slice(0, 10);
  document.querySelector("#description").value = destination.description;
  document.querySelector("#img").src = destination.img;
}
const myform = document.querySelector("#updateForm");
myform.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("hey it is submited");
  const destination = {
    name: document.querySelector("#name").value,
    location: document.querySelector("#location").value,
    startDate: new Date(document.querySelector("#startDate").value).toISOString().slice(0, 10),
    endDate: new Date (document.querySelector("#endDate").value).toISOString().slice(0, 10),
    description: document.querySelector("#description").value,
    img: document.querySelector("#img").src,
  };
  const id = getIdFromUrl();
  const response = await putData(id, destination);
  console.log(response);
  if (response.status === 200) {
    clearForm();
  }
});
function clearForm() {
  document.querySelector("#name").value = "";
  document.querySelector("#location").value = "";
  document.querySelector("#startDate").value = "";
  document.querySelector("#endDate").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#img").value = "";
  document.querySelector("#confirmationModalUpdate").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector("#confirmationModalUpdate").classList.add("hidden");
  }, "2000");
}
async function getSpecificDestination(id) {
  console.log("i am in get destination");
  const response = await fetch(url + id);
  console.log(response);
  const body = await response.json();
  console.log(body);
  return body;
}
async function putData(id, destination) {
  const response = await fetch(url + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(destination),
  });
  console.log(response);
  return response;
}
