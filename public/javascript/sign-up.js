const url = "http://localhost:8082/";
// validation
const form = document.querySelector("#signUpForm");

const nameInp = document.querySelector("#name");
const nameError = document.querySelector("#name + span.error");
const usernameInp = document.querySelector("#username");
const usernameError = document.querySelector("#username + span.error");
const emailInp = document.querySelector("#email");
const emailError = document.querySelector("#email+ span.error");
const passwordInp = document.querySelector("#password");
const passwordError = document.querySelector("#password+ span.error");
const confirmPasswordInp = document.querySelector("#confirmpassword");
const confirmPassworError = document.querySelector("#confirmpassword+ span.error");

// validation for name
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
// validation for email
emailInp.addEventListener("input", (event) => {
  if (emailInp.validity.valid) {
    emailError.textContent = "";
    emailError.className = "error";
    // // make the first letter always uppercase
    // let value = emailInp.value;
    // let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    // emailInp.value = upperCaseValue;
  } else {
    showErrorEmail();
  }
});
function showErrorEmail() {
  if (emailInp.validity.valueMissing) {
    emailError.textContent = "You need to enter a name.";
  } else if (emailInp.validity.tooShort) {
    emailError.textContent = `Name should be at least ${emailInp.minLength} characters, you entered ${emailInp.value.length}`;
  } else if (emailInp.validity.typeMismatch) {
    emailError.textContent = "Entered value needs to be an e-mail address.";
  }
  emailError.className = "error active";
}
// todo
// validation for username , should be received from backend as well

// validation for password
passwordInp.addEventListener("input", (event) => {
  if (passwordInp.validity.valid) {
    passwordError.textContent = "";
    passwordError.className = "error";
    // make the first letter always uppercase
    let value = passwordInp.value;
    let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    passwordInp.value = upperCaseValue;
  } else {
    showErrorPassword();
  }
});
function showErrorPassword() {
  if (passwordInp.validity.valueMissing) {
    passwordError.textContent = "You need to enter a password.";
  } else if (passwordInp.validity.tooShort) {
    passwordError.textContent = `Name should be at least ${passwordInp.minLength} characters, you entered ${passwordInp.value.length}`;
  }
  passwordError.className = "error active";
}

// validation for confirm password
confirmPasswordInp.addEventListener("input", (event) => {
  if (confirmPasswordInp.validity.valid) {
    confirmPassworError.textContent = "";
    confirmPassworError.className = "error";
    // make the first letter always uppercase
    let value = confirmPasswordInp.value;
    let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    confirmPasswordInp.value = upperCaseValue;
  } else {
    showErrorConfirmPassword();
  }
});

function showErrorConfirmPassword() {
  if (confirmPasswordInp.validity.valueMissing) {
    confirmPassworError.textContent = "You need to enter a name.";
  } else if (confirmPasswordInp.validity.tooShort) {
    confirmPassworError.textContent = `Name should be at least ${confirmPasswordInp.minLength} characters, you entered ${confirmPasswordInp.value.length}`;
  }
  // else if (passwordInp.value != confirmPasswordInp.value) {
  //   confirmPassworError.textContent = "Password does not match with the one above";
  // }
  confirmPassworError.className = "error active";
}
function checkPasswords() {
  if (passwordInp.value != confirmPasswordInp.value) {
    confirmPassworError.textContent = "Does not match with the one introduced above";
  }
  confirmPassworError.className = "error active";
}
// maybe change from click event to onsubmit event
document.querySelector("#signUp").addEventListener("click", async (event) => {
  event.preventDefault();
  checkPasswords();
  // fix confirm password validation
  if (!nameInp.validity.valid || !emailInp.validity.valid) {
    console.log("an input is invalid");
  } else {
    const user = {
      name: document.querySelector("#name").value,
      username: document.querySelector("#username").value,
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    };
    const response = await postUser(user);

    if (!response.errors) {
      window.location.replace("/views/index.html");
    } else {
      if (response.errors.username) {
        usernameError.textContent = response.errors.username.message;
      }
      if (response.errors.password) {
        passwordError.textContent = response.errors.password.message;
      }
    }
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
  const res = await response.json();
  return res;
}
