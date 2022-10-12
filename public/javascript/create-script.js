window.addEventListener("load", async (event) => {
  await getData(event);
});

const form = document.querySelector("#createForm");
const url = "http://localhost:8082/";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const destination = {
    name: document.querySelector("#name").value,
    location: document.querySelector("#location").value,
    startDate: new Date(document.querySelector("#startDate").value).toISOString().slice(0, 10),
    endDate: new Date(document.querySelector("#endDate").value).toISOString().slice(0, 10),
    description: document.querySelector("#description").value,
    img: document.querySelector("#img").src,
  };

  const response = await postData(destination);
  console.log(response);
  //   if (response.status === 200) {
  //     clearForm();
  //     // const newNode = fillContactTemplate(contact);
  //     // displayNewNode(newNode);
  //   }
});
async function getData(e) {
  e.preventDefault();
  const response = await fetch(url, {
    method: "GET",
  });
  console.log(response);
  return response;
}

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
