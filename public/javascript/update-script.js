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
  document.querySelector("#name").value = destination.name;
  document.querySelector("#location").value = destination.location;
  document.querySelector("#startDate").value = destination.startDate;
  document.querySelector("#endDate").value = destination.endDate;
  document.querySelector("#description").value = destination.description;
  document.querySelector("#img").value = destination.img;
}
const myform = document.querySelector("#updateForm");
myform.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("hey it is submited");
  const destination = {
    name: document.querySelector("#name").value,
    location: document.querySelector("#location").value,
    startDate: document.querySelector("#startDate").value,
    endDate: document.querySelector("#endDate").value,
    description: document.querySelector("#description").value,
    img: document.querySelector("#img").value,
  };
  const id = getIdFromUrl();
  putData(id, destination);
});
async function getSpecificDestination(id) {
  const response = await fetch(url + id);
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
