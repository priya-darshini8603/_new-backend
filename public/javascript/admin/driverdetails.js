// Function to search for a driver
function searchDriver() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const tableRows = document
    .getElementById("driver-details")
    .getElementsByTagName("tr");

  for (let i = 0; i < tableRows.length; i++) {
    const cells = tableRows[i].getElementsByTagName("td");
    const driverName = cells[0].textContent.toLowerCase();
    const busNumber = cells[1].textContent.toLowerCase();

    if (driverName.includes(searchInput) || busNumber.includes(searchInput)) {
      tableRows[i].style.display = "";
    } else {
      tableRows[i].style.display = "none";
    }
  }
}

// Function to handle edit and delete actions
document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const row = button.closest("tr");
      const cells = row.getElementsByTagName("td");

      const driverName = cells[0].textContent;
      const busNumber = cells[1].textContent;
      const routeNumber = cells[2].textContent;
      const phoneNumber = cells[3].textContent;

      // Populate the form with the current values
      document.getElementById("edit-driver-name").value = driverName;
      document.getElementById("edit-bus-number").value = busNumber;
      document.getElementById("edit-route-number").value = routeNumber;
      document.getElementById("edit-phone-number").value = phoneNumber;

      // Show the edit modal (assuming you have a modal for editing)
      $("#editDriverModal").modal("show");

      // Save changes
      document.getElementById("save-changes").onclick = function () {
        cells[0].textContent =
          document.getElementById("edit-driver-name").value;
        cells[1].textContent = document.getElementById("edit-bus-number").value;
        cells[2].textContent =
          document.getElementById("edit-route-number").value;
        cells[3].textContent =
          document.getElementById("edit-phone-number").value;
        $("#editDriverModal").modal("hide");
      };
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const row = button.closest("tr");
      row.remove();
    });
  });
});
