import { createNewUser, loginUser } from "./loginServices.js";


const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");

const loginMsg = document.getElementById("loginMsg");
const signUpMsg = document.getElementById("signUpMsg");

const switchToSignUp = document.getElementById("switchToSignUp");
const switchToLogIn = document.getElementById("switchToLogIn");

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
