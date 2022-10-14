window.addEventListener("load", async function () {
  const id = getIdFromUrl();
  console.log(id);
  const destination = await getSpecificDestination(id);
  console.log(destination);
  fillInTheForm(destination);
});

const url = "http://localhost:8082/";

const tokenFromStorage = localStorage.getItem("token");

// Get Id from Url
function getIdFromUrl() {
  const location = window.location.toString();
  const splitQuestionmark = location.split("?");
  const routeParams = splitQuestionmark[1];
  const splitIdParam = routeParams.split("=");
  console.log(splitIdParam[1]);
  return splitIdParam[1];
}

// Fill in the update form
function fillInTheForm(destination) {
  console.log(destination);
  document.querySelector("#name").value = destination.name;
  document.querySelector("#location").value = destination.location;
  document.querySelector("#startDate").value = new Date(destination.startDate)
    .toISOString()
    .slice(0, 10);
  document.querySelector("#endDate").value = new Date(destination.endDate)
    .toISOString()
    .slice(0, 10);
  document.querySelector("#description").value = destination.description;
  document.querySelector("#img").src = destination.img;
}

const myform = document.querySelector("#updateForm");

// Validation on the client side for update form
const nameInp = document.querySelector("#name");
const nameError = document.querySelector("#name + span.error");
const locationInp = document.querySelector("#location");
const locationError = document.querySelector("#location + span.error");
const descInp = document.querySelector("#description");
const descError = document.querySelector("#description + span.error");

nameInp.addEventListener("input", (event) => {
  if (nameInp.validity.valid) {
    nameError.textContent = "";
    nameError.className = "error";
    // make the first letter always uppercase
    let value = nameInp.value;
    let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    nameInp.value = upperCaseValue;
  } else {
    showErrorName();
  }
});

function showErrorName() {
  if (nameInp.validity.valueMissing) {
    nameError.textContent = "You need to enter a name.";
  } else if (nameInp.validity.tooShort) {
    nameError.textContent = `Name should be at least ${nameInp.minLength} characters, you entered ${nameInp.value.length}`;
  }
  nameError.className = "error active";
}

// Validation for location
locationInp.addEventListener("input", (event) => {
  if (locationInp.validity.valid) {
    locationError.textContent = "";
    locationError.className = "error";
    // make the first letter always uppercase
    let value = locationInp.value;
    let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    locationInp.value = upperCaseValue;
  } else {
    showErrorLocation();
  }
});

function showErrorLocation() {
  if (locationInp.validity.valueMissing) {
    locationError.textContent = "You need to enter a location.";
  } else if (locationInp.validity.tooShort) {
    locationError.textContent = `Location should be at least ${locationInp.minLength} characters, you entered ${locationInp.value.length}`;
  }
  locationError.className = "error active";
}

// Validation for description
descInp.addEventListener("input", (event) => {
  if (descInp.validity.valid) {
    descError.textContent = "";
    descError.className = "error";
    // make the first letter always uppercase
    let value = descInp.value;
    let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    descInp.value = upperCaseValue;
  } else {
    showErrorDesc();
  }
});

function showErrorDesc() {
  if (descInp.validity.valueMissing) {
    descError.textContent = "You need to write a short description.";
  } else if (descInp.validity.tooShort) {
    descError.textContent = `Description should be at least ${descInp.minLength} characters, you entered ${descInp.value.length}`;
  }
  descError.className = "error active";
}

myform.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (
    !nameInp.validity.valid ||
    !locationInp.validity.valid ||
    !descInp.validity.valid
  ) {
    console.log("an input is invalid that is why not sending post");
  } else {
    const destination = {
      name: document.querySelector("#name").value,
      location: document.querySelector("#location").value,
      startDate: new Date(document.querySelector("#startDate").value)
        .toISOString()
        .slice(0, 10),
      endDate: new Date(document.querySelector("#endDate").value)
        .toISOString()
        .slice(0, 10),
      description: document.querySelector("#description").value,
    };
    const id = getIdFromUrl();
    const response = await putData(id, destination);
    console.log(response);
    if (response.status === 200) {
      clearForm();
    }
  }
});

function clearForm() {
  document.querySelector("#name").value = "";
  document.querySelector("#location").value = "";
  document.querySelector("#startDate").value = "";
  document.querySelector("#endDate").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#confirmationModalUpdate").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector("#confirmationModalUpdate").classList.add("hidden");
  }, "2000");
}

// Get specific destination based on Id
async function getSpecificDestination(id) {
  console.log("i am in get destination");
  const response = await fetch(url + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenFromStorage}`,},
  });
  console.log(response);
  
  const body = await response.json();
  console.log(body);
  return body;
}

// Update the destinations based on the specific
async function putData(id, destination) {
  const response = await fetch(url + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenFromStorage}`,
    },
    body: JSON.stringify(destination),
  });
  console.log(response);
  return response;
}
