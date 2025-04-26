document.addEventListener("DOMContentLoaded", function () {
  // Sample data for demonstration
  let students = [
    {
      name: "John Doe",
      usn: "1NT20CS001",
      busNumber: "B101",
      routeNumber: "R001",
      year: "3",
    },
    {
      name: "Jane Smith",
      usn: "1NT20CS002",
      busNumber: "B102",
      routeNumber: "R002",
      year: "2",
    },
  ];

  // Function to render the student details in the table
  function renderStudents() {
    const tbody = document.getElementById("student-details");
    tbody.innerHTML = "";

    students.forEach((student, index) => {
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
      tbody.appendChild(row);
    });
  }

  // Function to handle editing a student
  window.editStudent = function (index) {
    const student = students[index];
    document.getElementById("editName").value = student.name;
    document.getElementById("editUSN").value = student.usn;
    document.getElementById("editBusNumber").value = student.busNumber;
    document.getElementById("editRouteNumber").value = student.routeNumber;
    document.getElementById("editYear").value = student.year;

    // Show the edit modal
    $("#editStudentModal").modal("show");

    // Handle form submission
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

      // Hide the modal
      $("#editStudentModal").modal("hide");

      // Re-render the table
      renderStudents();
    };
  };

  // Function to handle deleting a student
  window.deleteStudent = function (index) {
    if (confirm("Are you sure you want to delete this student?")) {
      students.splice(index, 1);
      renderStudents();
    }
  };

  // Initial render
  renderStudents();
});
