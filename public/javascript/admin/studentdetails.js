document.addEventListener("DOMContentLoaded", function () {
  const studentTableBody = document.getElementById("student-details");

  // Retrieve student details from localStorage
  let students = JSON.parse(localStorage.getItem("students")) || [];

  // Function to render the student table
  function renderStudents(filteredStudents = students) {
    studentTableBody.innerHTML = ""; // Clear the table body

    filteredStudents.forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.usn}</td>
        <td>${student.busNumber}</td>
        <td>${student.routeNumber}</td>
        <td>${student.year}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editStudent(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent(${index})">Delete</button>
        </td>
      `;

      studentTableBody.appendChild(row);
    });
  }

  // Function to handle searching students
  window.searchStudent = function () {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    // Filter students based on the search term
    const filteredStudents = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.usn.toLowerCase().includes(searchTerm)
    );

    // Render filtered students
    renderStudents(filteredStudents);
  };

  // Function to handle editing a student
  window.editStudent = function (index) {
    const student = students[index];

    // Populate the edit modal with student details
    document.getElementById("editName").value = student.name;
    document.getElementById("editUSN").value = student.usn;
    document.getElementById("editBusNumber").value = student.busNumber;
    document.getElementById("editRouteNumber").value = student.routeNumber;
    document.getElementById("editYear").value = student.year;

    // Show the edit modal
    $("#editStudentModal").modal("show");

    // Handle form submission for editing
    document.getElementById("editStudentForm").onsubmit = function (e) {
      e.preventDefault();

      // Update the student's details
      students[index] = {
        name: document.getElementById("editName").value,
        usn: document.getElementById("editUSN").value,
        busNumber: document.getElementById("editBusNumber").value,
        routeNumber: document.getElementById("editRouteNumber").value,
        year: document.getElementById("editYear").value,
      };

      // Save updated data to localStorage
      localStorage.setItem("students", JSON.stringify(students));

      // Re-render the table and hide the modal
      renderStudents();
      $("#editStudentModal").modal("hide");
    };
  };

  // Function to handle deleting a student
  window.deleteStudent = function (index) {
    if (confirm("Are you sure you want to delete this student?")) {
      students.splice(index, 1); // Remove the student from the array

      // Save updated data to localStorage
      localStorage.setItem("students", JSON.stringify(students));

      // Re-render the table
      renderStudents();
    }
  };

  // Initial render of the table
  renderStudents();
});
