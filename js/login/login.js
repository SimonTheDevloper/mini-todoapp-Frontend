import { getFeedbackToPasswort } from "./feedbackPasswort.js";
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

  const wrapper = passwordInput.closest(".relative") || passwordInput.parentElement;

  const hint = document.createElement("p");
  hint.className = "text-xs mt-1 text-error hidden";
  wrapper.insertAdjacentElement("afterend", hint);

  const feedbackText = document.createElement("p");
  feedbackText.className = "text-xs mt-1 hidden";
  wrapper.insertAdjacentElement("afterend", feedbackText);

  function validatePassword() {
    const value = passwordInput.value.trim();
    const minLengthOk = value.length >= 3;

    const { score, text } = getFeedbackToPasswort(value);

    const strongEnough = score >= 2; // also als besser oder ok

    const valid = minLengthOk && strongEnough;

    submitBtn.disabled = !valid;
    submitBtn.classList.toggle("btn-disabled", !valid);

    if (!minLengthOk) {
      hint.textContent = "The password must be at least 3 characters long.";
      hint.classList.remove("hidden");
    } else {
      hint.classList.add("hidden");
    }
    feedbackText.classList.remove("hidden");
    feedbackText.textContent = `strength: ${text}`;
    feedbackText.className = `text-xs mt-1 ${strongEnough ? "text-success" : "text-error"}`;
  }

  passwordInput.addEventListener("input", validatePassword);
  validatePassword();
}
function switchForms(hideEl, showEl) {
  hideEl.classList.add("hidden");
  showEl.classList.remove("hidden");
}

switchToSignUp.addEventListener("click", () => {
  loginMsg.textContent = "";
  switchForms(logInForm, signUpForm);
});

switchToLogIn.addEventListener("click", () => {
  signUpMsg.textContent = "";
  switchForms(signUpForm, logInForm);
});

function setupPasswordToggle(formEl) {
  const btn = formEl.querySelector(".toggle-password");
  const input = formEl.querySelector('input[name="password"]');
  const eyeOpen = btn.querySelector(".eye-open");
  const eyeClosed = btn.querySelector(".eye-closed");

  btn.type = "button";

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    eyeOpen.classList.toggle("hidden", isHidden);
    eyeClosed.classList.toggle("hidden", !isHidden);
  });
}


logInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(logInForm);
  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  updateMsg(loginMsg, "Logging in...", "black");
  try {
    await loginUser(user);
    updateMsg(loginMsg, "Successfully logged in", "green");
  } catch (err) {
    updateMsg(loginMsg, err.message || "Error", "red");
  }
  logInForm.reset();
  resetBtn(logInForm);
});


signUpForm.addEventListener("submit", async (e) => {
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
    resetBtn(signUpForm);
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
  } catch (err) {
    updateMsg(signUpMsg, err.message || "Error", "red");
  }
});

function updateMsg(el, text, color) {
  el.textContent = text;
  el.style.color = color;
}

function resetBtn(formEl) {
  const btn = formEl.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.classList.add("btn-disabled");
}

// Initialisierung
setupPasswordValidation(signUpForm);
setupPasswordToggle(logInForm);
setupPasswordToggle(signUpForm);