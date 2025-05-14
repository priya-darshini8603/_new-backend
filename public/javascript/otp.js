// Move to next input
function moveToNext(input, nextIndex) {
  const inputs = document.querySelectorAll(".input-field input");
  if (input.value.length === 1 && nextIndex < inputs.length) {
    inputs[nextIndex].removeAttribute("disabled");
    inputs[nextIndex].focus();
  }
}

// Verify OTP
function verifyOTP() {
  const inputs = document.querySelectorAll(".input-field input");
  let otp = "";

  for (let input of inputs) {
    if (input.value === "") {
      alert("Please enter all OTP digits.");
      return;
    }
    otp += input.value;
  }

  if (otp) {
    // You can also send OTP via fetch/AJAX if needed
    window.location.href = "/resetpassword";
  }
}

// Setup input navigation on load
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".input-field input");

  inputs.forEach((input, index) => {
    if (index !== 0) input.disabled = true;

    input.addEventListener("input", function () {
      moveToNext(input, index + 1);
    });
  });

  document.getElementById("verifyButton").addEventListener("click", verifyOTP);
});
