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

    // Retrieve existing students from localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Add the new student to the array
    students.push(studentData);

    // Save updated data to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    // Redirect to the student details page
    window.location.href = "/admin/studentdetails.hbs";
  });
