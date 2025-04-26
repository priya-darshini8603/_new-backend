document.addEventListener("DOMContentLoaded", function () {
  const switchToSignInBtn = document.getElementById("switch-to-signin");
  const switchToSignUpBtn = document.getElementById("switch-to-signup");
  const signUpForm = document.getElementById("signup-form");
  const signInForm = document.getElementById("signin-form");
  const title = document.getElementById("title");

  switchToSignInBtn.addEventListener("click", function () {
    signUpForm.classList.remove("active-form");
    signInForm.classList.add("active-form");
    title.textContent = "Sign In";
  });

  switchToSignUpBtn.addEventListener("click", function () {
    signInForm.classList.remove("active-form");
    signUpForm.classList.add("active-form");
    title.textContent = "Sign Up";
  });
});
