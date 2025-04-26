document.addEventListener("DOMContentLoaded", function () {
  const adminTableBody = document.getElementById("admin-table-body");

  // Example data
  const admins = [
    {
      firstName: "John",
      lastName: "Doe",
      profilePic: "images/default-profile.png",
      contact: "1234567890",
      email: "john.doe@example.com",
      gender: "Male",
      adminId: "A001",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      profilePic: "images/default-profile.png",
      contact: "0987654321",
      email: "jane.smith@example.com",
      gender: "Female",
      adminId: "A002",
    },
  ];

  function renderTable() {
    adminTableBody.innerHTML = "";
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

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", handleEdit);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDelete);
    });
  }

  function handleEdit(event) {
    const index = event.target.closest("button").dataset.index;
    const admin = admins[index];
    const newFirstName = prompt("Enter new first name:", admin.firstName);
    const newLastName = prompt("Enter new last name:", admin.lastName);

    if (newFirstName && newLastName) {
      admins[index].firstName = newFirstName;
      admins[index].lastName = newLastName;
      renderTable();
    }
  }

  function handleDelete(event) {
    const index = event.target.closest("button").dataset.index;
    admins.splice(index, 1);
    renderTable();
  }

  renderTable();
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
