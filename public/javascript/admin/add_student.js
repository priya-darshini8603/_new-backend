document
  .getElementById("student-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Capture form data
    const studentData = {
      name: document.getElementById("name").value,
      usn: document.getElementById("usn").value,
      busNumber: document.getElementById("bus-number").value,
      routeNumber: document.getElementById("route-number").value,
      year: document.getElementById("year").value,
    };

    // Store data in localStorage
    localStorage.setItem("studentData", JSON.stringify(studentData));

    // Redirect to teacher details page
    window.location.href = "studentdetails.html";
  });
