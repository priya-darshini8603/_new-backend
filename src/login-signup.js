// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {
  // Get form and buttons by their IDs
  const loginForm = document.getElementById("login-form");
  const goToSignup = document.getElementById("go-to-signup");
  const goToLogin = document.getElementById("go-to-login"); 

  // When signup button is clicked, go to signup page
  if (goToSignup) {
    goToSignup.addEventListener("click", function () {
      window.location.href = "/signup"; 
    });
  }

  // When login button is clicked, go to login page
  if (goToLogin) {
    goToLogin.addEventListener("click", function () {
      window.location.href = "/login"; 
    });
  }

  // Handle form submission
  /*if (loginForm) {

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
   
      // Get the selected role from radio buttons
      const role = document.querySelector('input[name="role"]:checked').value;

      // Redirect to the correct dashboard based on the selected role
      if (role === "admin") {
        window.location.href = "/admindash"; 
      } else if (role === "student") {
        window.location.href = "/student-dashboard"; 
      } else if (role === "busincharge") {
        window.location.href = "/bus-incharge/busincharge-dashboard"; 
      }
    });
  }*/
});
