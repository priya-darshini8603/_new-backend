document.addEventListener("DOMContentLoaded", function () {
  const adminTableBody = document.getElementById("admin-table-body");

  function renderTable() {
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
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
          <button class="btn btn-sm btn-warning edit-btn" data-index="${index}" data-toggle="modal" data-target="#editAdminModal"><i class="fas fa-pencil-alt"></i></button>
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
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const admin = admins[index];

    document.getElementById("edit-first-name").value = admin.firstName;
    document.getElementById("edit-last-name").value = admin.lastName;
    document.getElementById("edit-contact").value = admin.contact;
    document.getElementById("edit-email").value = admin.email;
    document.getElementById("edit-gender").value = admin.gender;
    document.getElementById("edit-admin-id").value = admin.adminId;

    const editForm = document.getElementById("edit-admin-form");
    editForm.onsubmit = function (e) {
      e.preventDefault();

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
          admin.profilePic = e.target.result;
          admins[index] = admin;
          localStorage.setItem("admins", JSON.stringify(admins));
          renderTable();
          $("#editAdminModal").modal("hide");
        };
        reader.readAsDataURL(profilePicInput.files[0]);
      } else {
        admins[index] = admin;
        localStorage.setItem("admins", JSON.stringify(admins));
        renderTable();
        $("#editAdminModal").modal("hide");
      }
    };
  }

  function handleDelete(event) {
    const index = event.target.closest("button").dataset.index;
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    admins.splice(index, 1);
    localStorage.setItem("admins", JSON.stringify(admins));
    renderTable();
  }

  renderTable();
});
