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

  signInForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    const role = document.querySelector('input[name="role"]:checked').value;

    // Store the details in local storage
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("role", role);

    // Redirect to the respective page based on the role
    if (role === "admin") {
      window.location.href = "/admin/admindashboard";
    } else if (role === "student") {
      window.location.href = "/student/student_home";
    } else if (role === "busincharge") {
      window.location.href = "busincharge/busincharge-dashboard";
    }
  });

  signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const fName = document.getElementById("fName").value;
    const lName = document.getElementById("lName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.querySelector('input[name="role"]:checked').value;

    // Store the details in local storage
    localStorage.setItem("fName", fName);
    localStorage.setItem("lName", lName);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("role", role);

    alert("Sign Up successful!");

    // Optionally, you can redirect to the sign-in page after successful sign-up
    signUpContainer.style.display = "none";
    signInContainer.style.display = "block";
  });
});
