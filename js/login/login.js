import { createNewUser, loginUser } from "./userServices.js";


const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");

const loginMsg = document.getElementById("loginMsg");
const signUpMsg = document.getElementById("signUpMsg");

const switchToSignUp = document.getElementById("switchToSignUp");
const switchToLogIn = document.getElementById("switchToLogIn");

function setupPasswordValidation(formEl) {
  const passwordInput = formEl.querySelector('input[name="password"]');
  const submitBtn = formEl.querySelector('button[type="submit"]');

  const hint = document.createElement("p");
  hint.className = "text-xs mt-1 text-error hidden";
  hint.textContent = "The password must be at least 6 characters long.";
  passwordInput.insertAdjacentElement("afterend", hint); //Fügt das Element direkt nach dem Passwort-Input ins DOM ein mit afterend sagt man wo

  submitBtn.disabled = true;
  submitBtn.classList.add("btn-disabled");

  passwordInput.addEventListener("input", () => {
    const valid = passwordInput.value.length >= 6;
    submitBtn.disabled = !valid;
    submitBtn.classList.toggle("btn-disabled", !valid);
    hint.classList.toggle("hidden", valid);
  });
}
setupPasswordValidation(signUpForm);
setupPasswordValidation(logInForm);
switchToSignUp.addEventListener("click", () => {
  logInForm.style.display = "none";
  signUpForm.style.display = "block";
  loginMsg.textContent = "";
});
switchToLogIn.addEventListener("click", () => {
  signUpForm.style.display = "none";
  logInForm.style.display = "block";
  signUpMsg.textContent = "";
});

logInForm.addEventListener("submit", handleLogin);

async function handleLogin(e) {
  e.preventDefault(); // damit die seite nicht dadurch neu läd
  const formData = new FormData(logInForm);
  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  updateMsg(loginMsg, "login to account...", "black");
  try {
    await loginUser(user);
    updateMsg(loginMsg, "Succesfully logged in", "green");
    signUpForm.reset();
  } catch (err) {
    updateMsg(loginMsg, err.message || "Error", "red");
  }
  console.log(user);

  logInForm.reset();
  logInForm.querySelector('button[type="submit"]').disabled = true;
  logInForm.querySelector('button[type="submit"]').classList.add("btn-disabled");
}

signUpForm.addEventListener("submit", handleSignUp);

async function handleSignUp(e) {
  e.preventDefault();

  const formData = new FormData(signUpForm);
  const newUser = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  updateMsg(signUpMsg, "Creating account...", "black");

  try {
    await createNewUser(newUser);
    updateMsg(signUpMsg, "Successfully created", "green");
    signUpForm.reset();

    logInForm.querySelector('button[type="submit"]').disabled = true;
    logInForm.querySelector('button[type="submit"]').classList.add("btn-disabled");
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1000);
  } catch (err) {
    updateMsg(signUpMsg, err.message || "Error", "red");
  }
}

function updateMsg(elemt, text, color) {
  elemt.textContent = text;
  elemt.style.color = color;
}