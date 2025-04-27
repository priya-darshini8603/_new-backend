document.addEventListener("DOMContentLoaded", function () {
  const adminTableBody = document.getElementById("admin-table-body");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  const admins = JSON.parse(localStorage.getItem("admins")) || []; // Retrieve admins from localStorage

  // Function to render the table
  function renderTable(filteredAdmins = admins) {
    adminTableBody.innerHTML = ""; // Clear the table body

    filteredAdmins.forEach((admin, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${admin.firstName}</td>
        <td>${admin.lastName}</td>
        <td><img src="${admin.profilePic}" alt="Profile Picture" class="profile-pic" style="width: 50px; height: 50px; border-radius: 50%;" /></td>
        <td>${admin.contact}</td>
        <td>${admin.email}</td>
        <td>${admin.gender}</td>
        <td>${admin.adminId}</td>
        <td>
          <button class="btn btn-sm btn-warning edit-btn" data-index="${index}" data-toggle="modal" data-target="#editAdminModal"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn btn-sm btn-danger delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        </td>
      `;

      adminTableBody.appendChild(row);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", handleEdit);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDelete);
    });
  }

  // Function to handle search
  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filteredAdmins = admins.filter((admin) => {
      return (
        admin.firstName.toLowerCase().includes(query) ||
        admin.lastName.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.adminId.toLowerCase().includes(query)
      );
    });
    renderTable(filteredAdmins);
  }

  // Function to handle edit
  function handleEdit(event) {
    const index = event.target.closest("button").dataset.index; // Get the index of the admin
    const admin = admins[index]; // Retrieve the admin object from the array

    // Populate the modal form with the selected admin's details
    document.getElementById("edit-first-name").value = admin.firstName;
    document.getElementById("edit-last-name").value = admin.lastName;
    document.getElementById("edit-contact").value = admin.contact;
    document.getElementById("edit-email").value = admin.email;
    document.getElementById("edit-gender").value = admin.gender;
    document.getElementById("edit-admin-id").value = admin.adminId;

    const editForm = document.getElementById("edit-admin-form");
    editForm.onsubmit = function (e) {
      e.preventDefault(); // Prevent the default form submission behavior

      // Update the admin object with the new values from the form
      admin.firstName = document.getElementById("edit-first-name").value;
      admin.lastName = document.getElementById("edit-last-name").value;
      admin.contact = document.getElementById("edit-contact").value;
      admin.email = document.getElementById("edit-email").value;
      admin.gender = document.getElementById("edit-gender").value;
      admin.adminId = document.getElementById("edit-admin-id").value;

      const profilePicInput = document.getElementById("edit-profile-pic");
      if (profilePicInput.files && profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          admin.profilePic = e.target.result; // Update the profile picture
          admins[index] = admin; // Save the updated admin object
          localStorage.setItem("admins", JSON.stringify(admins)); // Save to localStorage
          renderTable(); // Re-render the table
          $("#editAdminModal").modal("hide"); // Hide the modal
        };
        reader.readAsDataURL(profilePicInput.files[0]);
      } else {
        admins[index] = admin; // Save the updated admin object
        localStorage.setItem("admins", JSON.stringify(admins)); // Save to localStorage
        renderTable(); // Re-render the table
        $("#editAdminModal").modal("hide"); // Hide the modal
      }
    };
  }

  // Function to handle delete
  function handleDelete(event) {
    const index = event.target.closest("button").dataset.index;
    admins.splice(index, 1); // Remove the admin from the array
    localStorage.setItem("admins", JSON.stringify(admins)); // Save updated data to localStorage
    renderTable(); // Re-render the table
  }

  // Attach search button event listener
  searchButton.addEventListener("click", handleSearch);

  // Initial render of the table
  renderTable();
});
