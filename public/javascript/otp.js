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
 let form = document.getElementById("otp-form");
 // Set OTP value in a hidden field
  let existing = document.getElementById("otpCombined");

   if (!existing) {
    let hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "otp";
    hiddenInput.id = "otpCombined";
    hiddenInput.value = otp;
    form.appendChild(hiddenInput);
  } else {
    existing.value = otp;
  }
  // Set email from localStorage if needed
  
  // Submit the form to server for verification
  form.submit();
}

// Setup input navigation on load
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".input-field input");
   // Handle OTP inputs
  inputs.forEach((input, index) => {
    if (index !== 0) input.disabled = true;

    input.addEventListener("input", function () {
      moveToNext(input, index + 1);
    });
    input.addEventListener("keydown", (e) => {
      if (
        e.key === "Backspace" &&
        input.value.length === 0 &&
        index > 0
      ) {
        inputs[index - 1].focus();
      }
  });
});
// Attach the verify button
  document.getElementById("verifyButton").addEventListener("click", verifyOTP);
});
