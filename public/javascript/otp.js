// Function to move to the next input field
function moveToNext(input, nextIndex) {
  const inputs = document.querySelectorAll(".input-field input");
  if (input.value.length === 1 && nextIndex < inputs.length) {
    inputs[nextIndex].removeAttribute("disabled");
    inputs[nextIndex].focus();
  }
}

// Function to verify OTP
function verifyOTP() {
  const inputs = document.querySelectorAll(".input-field input");
  let otp = "";

  // Collect OTP from all input fields
  for (let input of inputs) {
    if (input.value === "") {
      alert("Please enter all OTP digits.");
      return;
    }
    otp += input.value;
  }
 if(otp){
  window.location.href = "/resetpassword"; // Redirect to the password reset page
}

// Add event listeners to input fields for navigation
document.querySelectorAll(".input-field input").forEach((input, index) => {
  input.addEventListener("input", function () {
    moveToNext(input, index + 1); // Move to the next input field after a digit is entered
  });
});

// Add event listener to submit the OTP (e.g., for a button click)
document.getElementById("verifyButton").addEventListener("click", verifyOTP);
  /* Simulate OTP verification
  //if (otp === "1234") {
    // Replace "1234" with the actual OTP logic
    //alert("OTP Verified!");
    window.location.href = "/resetpassword";
  //} else {
    //alert("Invalid OTP. Please try again.");
  //}
}
*/
 //Add event listeners to input fields for navigation
document.querySelectorAll(".input-field input").forEach((input, index) => {
  input.addEventListener("input", function () {
    moveToNext(input, index + 1);
  });
});
