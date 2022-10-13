window.addEventListener("load", async (event) => {
  await getData(event);
});

const form = document.querySelector("#createForm");
const url = "http://localhost:8082/";

// Validation for the Client Side

const nameInp = document.querySelector("#name");
const nameError = document.querySelector("#name + span.error");
const locationInp = document.querySelector("#location");
const locationError = document.querySelector("#location + span.error");
const descInp = document.querySelector("#description");
const descError = document.querySelector("#description + span.error");

// Validation for name input
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

// Validation for Location
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

// Validation for Description
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

// Submit event and post the data
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (
    !nameInp.validity.valid ||
    !locationInp.validity.valid ||
    !descInp.validity.valid
  ) {
    console.log("This input is invalid");
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
      img: document.querySelector("#img").value,
    };

    const response = await postData(destination);
    if (response.status === 200) {
      clearForm();
    }
  }
});

// Clears the form
function clearForm() {
  document.querySelector("#name").value = "";
  document.querySelector("#location").value = "";
  document.querySelector("#startDate").value = "";
  document.querySelector("#endDate").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#img").value = "";
  document.querySelector("#confirmationModalCreate").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector("#confirmationModalCreate").classList.add("hidden");
  }, "2000");
}

async function getData(e) {
  e.preventDefault();
  const response = await fetch(url, {
    method: "GET",
  });
  console.log(response);
  return response;
}

// Create a new destination
async function postData(destination) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(destination),
  });
  console.log(response);
  return response;
}
