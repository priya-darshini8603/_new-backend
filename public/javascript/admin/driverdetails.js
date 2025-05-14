document.addEventListener("DOMContentLoaded", function () {
  const driverTableBody = document.getElementById("driver-details");

  // Retrieve driver details from localStorage
  let drivers = JSON.parse(localStorage.getItem("drivers")) || [];

  // Function to render the driver table
  function renderDrivers(filteredDrivers = drivers) {
    driverTableBody.innerHTML = ""; // Clear the table body

    filteredDrivers.forEach((driver, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${driver.name}</td>
        <td>${driver.busNumber}</td>
        <td>${driver.routeNumber}</td>
        <td>${driver.phoneNumber}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" onclick="editDriver(${index})">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-btn" onclick="deleteDriver(${index})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;

      driverTableBody.appendChild(row);
    });
  }

  // Function to handle searching drivers
  window.searchDriver = function () {
    const searchInput = document.getElementById("search").value.toLowerCase();

    // Filter drivers based on the search term
    const filteredDrivers = drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchInput) ||
        driver.busNumber.toLowerCase().includes(searchInput)
    );

    // Render filtered drivers
    renderDrivers(filteredDrivers);
  };

  // Function to handle editing a driver
  window.editDriver = function (index) {
    const driver = drivers[index];

    // Populate the edit modal with driver details
    document.getElementById("edit-driver-name").value = driver.name;
    document.getElementById("edit-bus-number").value = driver.busNumber;
    document.getElementById("edit-route-number").value = driver.routeNumber;
    document.getElementById("edit-phone-number").value = driver.phoneNumber;

    // Show the edit modal
    $("#editDriverModal").modal("show");

    // Handle form submission for editing
    document.getElementById("save-changes").onclick = function () {
      // Update the driver's details
      drivers[index] = {
        name: document.getElementById("edit-driver-name").value,
        busNumber: document.getElementById("edit-bus-number").value,
        routeNumber: document.getElementById("edit-route-number").value,
        phoneNumber: document.getElementById("edit-phone-number").value,
      };

      // Save updated data to localStorage
      localStorage.setItem("drivers", JSON.stringify(drivers));

      // Re-render the table and hide the modal
      renderDrivers();
      $("#editDriverModal").modal("hide");
    };
  };

  // Function to handle deleting a driver
  window.deleteDriver = function (index) {
    if (confirm("Are you sure you want to delete this driver?")) {
      drivers.splice(index, 1); // Remove the driver from the array

      // Save updated data to localStorage
      localStorage.setItem("drivers", JSON.stringify(drivers));

      // Re-render the table
      renderDrivers();
    }
  };

  // Initial render of the table
  renderDrivers();
});
