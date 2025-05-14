document
  .getElementById("teacher-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const teacher = {
      name: document.getElementById("name").value,
      id: document.getElementById("id").value,
      department: document.getElementById("department").value,
      busNumber: document.getElementById("bus-number").value,
      routeNumber: document.getElementById("route-number").value,
      phoneNumber: document.getElementById("phone-number").value,
    };

    // Validate phone number
    if (!validatePhoneNumber(teacher.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    // Check for duplicate ID
    const isDuplicate = teachers.some((t) => t.id === teacher.id);
    if (isDuplicate) {
      alert("Teacher with this ID already exists. Please use a unique ID.");
      return;
    }

    teachers.push(teacher);
    localStorage.setItem("teachers", JSON.stringify(teachers));

    alert("Teacher details submitted successfully.");
    window.location.href = "/admin/teacherdetails.hbs"; // Redirect to teacherdetails page
  });

// Function to validate phone number format (example: 10-digit number)
function validatePhoneNumber(phoneNumber) {
  const regex = /^\d{10}$/; // Example: 10-digit phone number
  return regex.test(phoneNumber);
}
