document.addEventListener("DOMContentLoaded", function () {
  const passwordForm = document.getElementById("password-form");
  const newPassword = document.querySelector(
    'input[placeholder="New Password"]'
  );
  const confirmPassword = document.querySelector(
    'input[placeholder="Confirm Password"]'
  );
   passwordForm.addEventListener("submit", function (event) {
        if (newPassword.value !== confirmPassword.value) {
          event.preventDefault();
          alert("Passwords do not match!");
        }
      });
    });
 
