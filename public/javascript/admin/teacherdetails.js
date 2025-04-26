document.addEventListener("DOMContentLoaded", function () {
  // Sample data for demonstration
  let teachers = [
    {
      name: "John Doe",
      id: "T001",
      busNumber: "B101",
      routeNumber: "R001",
      department: "Computer Science",
      phoneNumber: "1234567890",
    },
    {
      name: "Jane Smith",
      id: "T002",
      busNumber: "B102",
      routeNumber: "R002",
      department: "Mathematics",
      phoneNumber: "0987654321",
    },
  ];

  // Function to render the teacher details in the table
  function renderTeachers() {
    const tbody = document.getElementById("teacher-details");
    tbody.innerHTML = "";

    teachers.forEach((teacher, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${teacher.name}</td>
        <td>${teacher.id}</td>
        <td>${teacher.busNumber}</td>
        <td>${teacher.routeNumber}</td>
        <td>${teacher.department}</td>
        <td>${teacher.phoneNumber}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editTeacher(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Function to handle the search functionality
  window.searchTeacher = function () {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredTeachers = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm) ||
        teacher.id.toLowerCase().includes(searchTerm)
    );
    renderFilteredTeachers(filteredTeachers);
  };

  // Function to render filtered teachers
  function renderFilteredTeachers(filteredTeachers) {
    const tbody = document.getElementById("teacher-details");
    tbody.innerHTML = "";

    filteredTeachers.forEach((teacher, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${teacher.name}</td>
        <td>${teacher.id}</td>
        <td>${teacher.busNumber}</td>
        <td>${teacher.routeNumber}</td>
        <td>${teacher.department}</td>
        <td>${teacher.phoneNumber}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editTeacher(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTeacher(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Function to handle editing a teacher
  window.editTeacher = function (index) {
    const teacher = teachers[index];
    document.getElementById("editName").value = teacher.name;
    document.getElementById("editId").value = teacher.id;
    document.getElementById("editBusNumber").value = teacher.busNumber;
    document.getElementById("editRouteNumber").value = teacher.routeNumber;
    document.getElementById("editDepartment").value = teacher.department;
    document.getElementById("editPhoneNumber").value = teacher.phoneNumber;

    // Show the edit modal
    $("#editTeacherModal").modal("show");

    // Handle form submission
    document.getElementById("editTeacherForm").onsubmit = function (e) {
      e.preventDefault();

      // Update the teacher's details
      teachers[index] = {
        name: document.getElementById("editName").value,
        id: document.getElementById("editId").value,
        busNumber: document.getElementById("editBusNumber").value,
        routeNumber: document.getElementById("editRouteNumber").value,
        department: document.getElementById("editDepartment").value,
        phoneNumber: document.getElementById("editPhoneNumber").value,
      };

      // Hide the modal
      $("#editTeacherModal").modal("hide");

      // Re-render the table
      renderTeachers();
    };
  };

  // Function to handle deleting a teacher
  window.deleteTeacher = function (index) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      teachers.splice(index, 1);
      renderTeachers();
    }
  };

  // Function to handle adding a new teacher
  document.getElementById("addTeacherForm").onsubmit = function (e) {
    e.preventDefault();

    const newTeacher = {
      name: document.getElementById("name").value,
      id: document.getElementById("id").value,
      busNumber: document.getElementById("busNumber").value,
      routeNumber: document.getElementById("routeNumber").value,
      department: document.getElementById("department").value,
      phoneNumber: document.getElementById("phoneNumber").value,
    };

    // Add the new teacher to the array
    teachers.push(newTeacher);

    // Re-render the table
    renderTeachers();

    // Clear the form
    document.getElementById("addTeacherForm").reset();

    // Hide the modal
    $("#addTeacherModal").modal("hide");
  };

  // Initial render
  renderTeachers();
});
