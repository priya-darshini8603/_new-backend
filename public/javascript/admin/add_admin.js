document.addEventListener("DOMContentLoaded", function () {
  const adminTableBody = document.getElementById("admin-table-body");

  function renderTable() {
    const admins = JSON.parse(localStorage.getItem("admins")) || []; // Retrieve admins from localStorage
    adminTableBody.innerHTML = ""; // Clear the table body

    admins.forEach((admin, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${admin.firstName}</td>
        <td>${admin.lastName}</td>
        <td><img src="${admin.profilePic}" alt="Profile Picture" class="profile-pic" /></td>
        <td>${admin.contact}</td>
        <td>${admin.email}</td>
        <td>${admin.gender}</td>
        <td>${admin.adminId}</td>
        <td>
          <button class="btn btn-sm btn-warning edit-btn" data-index="${index}"><i class="fas fa-pencil-alt"></i></button>
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

  function handleEdit(event) {
    const index = event.target.closest("button").dataset.index;
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const admin = admins[index];

    const newFirstName = prompt("Enter new first name:", admin.firstName);
    const newLastName = prompt("Enter new last name:", admin.lastName);

    if (newFirstName && newLastName) {
      admins[index].firstName = newFirstName;
      admins[index].lastName = newLastName;
      localStorage.setItem("admins", JSON.stringify(admins)); // Save updated data to localStorage
      renderTable();
    }
  }

  function handleDelete(event) {
    const index = event.target.closest("button").dataset.index;
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    admins.splice(index, 1); // Remove the admin from the array
    localStorage.setItem("admins", JSON.stringify(admins)); // Save updated data to localStorage
    renderTable();
  }

  renderTable(); // Initial render of the table
});

function previewProfilePic(event) {
  const input = event.target;
  const preview = document.getElementById("profile-pic-preview");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result; // Set the image source
      preview.style.display = "block"; // Show the preview
    };

    reader.readAsDataURL(input.files[0]); // Read the selected file
  }
}

// Form submission logic
document
  .getElementById("admin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("mail").value;
    const gender = document.getElementById("gender").value;
    const adminId = document.getElementById("admin-id").value;
    const profilePicInput = document.getElementById("profile-pic");

    if (profilePicInput.files && profilePicInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const profilePic = e.target.result;
        saveAdmin(
          firstName,
          lastName,
          profilePic,
          contact,
          email,
          gender,
          adminId
        );
      };
      reader.readAsDataURL(profilePicInput.files[0]);
    } else {
      const profilePic = "images/default-profile.png";
      saveAdmin(
        firstName,
        lastName,
        profilePic,
        contact,
        email,
        gender,
        adminId
      );
    }
  });

function saveAdmin(
  firstName,
  lastName,
  profilePic,
  contact,
  email,
  gender,
  adminId
) {
  const admins = JSON.parse(localStorage.getItem("admins")) || [];
  admins.push({
    firstName,
    lastName,
    profilePic,
    contact,
    email,
    gender,
    adminId,
  });
  localStorage.setItem("admins", JSON.stringify(admins)); // Save to localStorage
  alert("Admin details submitted successfully.");
  window.location.href = "/admin/manage_admin.hbs"; // Redirect to manage_admin page
}
