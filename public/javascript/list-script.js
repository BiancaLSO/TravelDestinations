// const { deleteModel } = require("mongoose");

window.addEventListener("load", async () => {
  await getData();
});
const url = "http://localhost:8082/";
async function getData() {
  // e.preventDefault();
  const response = await fetch(url, {
    method: "GET",
  });
  console.log(response);
  const body = await response.json();
  console.log(body);
  await loadAndShowData(body);
  return body;
}
async function loadAndShowData(response) {
  // Get the html element
  // const contactsListElement = document.querySelector(".contact-list");
  // // Clear the html content
  // contactsListElement.innerHTML = "";
  // Get data from backend
  const data = response;
  // Display each of the data elements.
  data.forEach((dest) => {
    const newNode = fillDestTemplate(dest);
    displayNewNode(newNode);
  });
}
function fillDestTemplate(dest) {
  console.log(dest);
  // Get the template
  const template = document.querySelector("#destination-card");
  // Clone template
  const clone = document.importNode(template.content, true);
  // Fill information into the cloned templated
  //   clone.querySelector("#temp").id = contact.id;
  clone.querySelector("#nameDestination").textContent = dest.name;
  clone.querySelector("#locationDestination").textContent = dest.location;
  clone.querySelector("#startDateDestination").textContent = new Date(dest.startDate).toISOString().slice(0, 10);
  clone.querySelector("#endDateDestination").textContent = new Date(dest.endDate).toISOString().slice(0, 10);
  clone.querySelector("#descriptionDestination").textContent = dest.description;
  clone.querySelector("#imgDestination").src = "https://picsum.photos/200/300";
  clone.querySelector("#delete-button").id = dest._id;
  //finish the edit button
  clone.querySelector("#edit-button").addEventListener("click", () => {
    window.location.replace("/views/update.html?id=" + dest._id);
  });
  // Return the filled node
  //   clone.querySelector("#delete-button").addEventListener("click", deleteMe(dest._id));
  return clone;
}
function displayNewNode(newNode) {
  const destList = document.querySelector(".dest-list");
  destList.appendChild(newNode);
}

// function clearForm() {
//     document.querySelector("#name").value = "";
//     document.querySelector("#surname").value = "";
//     document.querySelector("#company").value = "";
//     document.querySelector("#phone").value = "";
//     document.querySelector("#email").value = "";
//   }

async function deleteMe(obj) {
  const currentId = obj.id;

  const response = await fetch(url + currentId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(destination),
  });
  console.log(response);
  window.location.reload();
  return response;
}
