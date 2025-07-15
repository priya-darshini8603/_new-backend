document.addEventListener("DOMContentLoaded", function () {
  const teacherTableBody = document.getElementById("teacher-details");

  // Retrieve teacher details from localStorage
  let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

  // Function to render the teacher table
  function renderTeachers(filteredTeachers = teachers) {
    teacherTableBody.innerHTML = ""; // Clear the table body

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

      teacherTableBody.appendChild(row);
    });
  }

  // Function to handle searching teachers
  window.searchTeacher = function () {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    // Filter teachers based on the search term
    const filteredTeachers = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm) ||
        teacher.id.toLowerCase().includes(searchTerm)
    );

    // Render filtered teachers
    renderTeachers(filteredTeachers);
  };

  // Function to handle editing a teacher
  window.editTeacher = function (index) {
    const teacher = teachers[index];

    // Populate the edit modal with teacher details
    document.getElementById("editName").value = teacher.name;
    document.getElementById("editId").value = teacher.id;
    document.getElementById("editBusNumber").value = teacher.busNumber;
    document.getElementById("editRouteNumber").value = teacher.routeNumber;
    document.getElementById("editDepartment").value = teacher.department;
    document.getElementById("editPhoneNumber").value = teacher.phoneNumber;

    // Show the edit modal
    $("#editTeacherModal").modal("show");

    // Handle form submission for editing
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

      // Save updated data to localStorage
      localStorage.setItem("teachers", JSON.stringify(teachers));

      // Re-render the table and hide the modal
      renderTeachers();
      $("#editTeacherModal").modal("hide");
    };
  };

  // Function to handle deleting a teacher
  window.deleteTeacher = function (index) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      teachers.splice(index, 1); // Remove the teacher from the array

      // Save updated data to localStorage
      localStorage.setItem("teachers", JSON.stringify(teachers));

      // Re-render the table
      renderTeachers();
    }
  };

  // Function to load and display all teachers (called by View Teacher button)
  window.loadAllTeachers = function () {
    // Clear any search filters and show all teachers
    document.getElementById("search").value = "";
    
    // Refresh teachers from localStorage in case new data was added
    teachers = JSON.parse(localStorage.getItem("teachers")) || [];
    
    // Show all teachers in the table
    renderTeachers();
    
    // Smooth scroll to the table to show the results
    document.querySelector('.table').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    // Show a success message
    alert(`Displaying ${teachers.length} teacher(s) in the system.`);
  };

  // Initial render of the table
  renderTeachers();
});
