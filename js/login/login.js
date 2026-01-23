import { createNewUser } from "./loginServices.js";

const signUpForm = document.getElementById('signUpForm');
const logInForm = document.getElementById('logInForm');
const switchToSignUp = document.getElementById('switchToSignUp');
const switchToLogIn = document.getElementById('switchToLogIn');

switchToSignUp.addEventListener('click', () => {
    logInForm.style.display = "none";
    signUpForm.style.display = "block";
});
switchToLogIn.addEventListener('click', () => {
    signUpForm.style.display = "none";
    logInForm.style.display = "block";
});
logInForm.addEventListener('submit', (e) => {
    e.preventDefault() // damit die seite nicht dadurch neu läd
    const formData = new FormData(logInForm);
    const user = {
        email: formData.get('email'),
        password: formData.get('password')
    }
    console.log(user)
});
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(signUpForm);
    const newUser = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    }
    console.log(newUser);
    createNewUser(newUser)
    signUpForm.reset();
})

