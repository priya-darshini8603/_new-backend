document.addEventListener("DOMContentLoaded", function () {
  const signInButton = document.getElementById("signInButton");
  const signUpButton = document.getElementById("signUpButton");
  const signUpContainer = document.getElementById("signup");
  const signInContainer = document.getElementById("signIn");
  const signInForm = document.querySelector("#signIn form");
  const signUpForm = document.querySelector("#signup form");

  signInButton.addEventListener("click", function () {
    signUpContainer.style.display = "none";
    signInContainer.style.display = "block";
  });

  signUpButton.addEventListener("click", function () {
    signInContainer.style.display = "none";
    signUpContainer.style.display = "block";
  });

 
});
