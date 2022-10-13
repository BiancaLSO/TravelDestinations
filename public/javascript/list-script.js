window.addEventListener("load", async () => {
  await getData();
});

const url = "http://localhost:8082/";

async function getData() {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  await loadAndShowData(body);
  return body;
}

// Loads and shows the data
async function loadAndShowData(response) {
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
  clone.querySelector("#nameDestination").textContent = dest.name;
  clone.querySelector("#locationDestination").textContent = dest.location;
  clone.querySelector("#startDateDestination").textContent = new Date(
    dest.startDate
  )
    .toISOString()
    .slice(0, 10);
  clone.querySelector("#endDateDestination").textContent = new Date(
    dest.endDate
  )
    .toISOString()
    .slice(0, 10);
  clone.querySelector("#descriptionDestination").textContent = dest.description;
  clone.querySelector("#imgDestination").src = "https://picsum.photos/200/300";
  clone.querySelector("#delete-button").id = dest._id;
  clone.querySelector("#edit-button").addEventListener("click", () => {
    window.location.replace("/views/update.html?id=" + dest._id);
  });

  // Hide edit & delete buttons from non-users
  const token = localStorage.getItem("token");
  if (token) {
    console.log("token exists");
    clone.getElementById(`${dest._id}`).classList.remove("hideBtn");
    clone.querySelector("#edit-button").classList.remove("hideBtn");
  } else {
    // clone.querySelector("#delete-button").classList.add("hideBtn");
    clone.getElementById(`${dest._id}`).classList.add("hideBtn");

    clone.querySelector("#edit-button").classList.add("hideBtn");
  }

  // Return the filled nod
  return clone;
}

function displayNewNode(newNode) {
  const destList = document.querySelector(".dest-list");
  destList.appendChild(newNode);
}

async function deleteMe(obj) {
  const currentId = obj.id;
  const response = await fetch(url + currentId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  window.location.reload();
  return response;
}
