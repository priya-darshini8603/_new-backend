document.addEventListener("DOMContentLoaded", function () {
  const routeList = document.getElementById("route-list");

  // Retrieve routes from localStorage
  let routes = JSON.parse(localStorage.getItem("routes")) || [];

  // Function to render the route table
  function renderTable() {
    routeList.innerHTML = ""; // Clear the table body

    routes.forEach((route, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${route.routeNumber}</td>
        <td>${route.busNumber}</td>
        <td>${route.numSeats}</td>
        <td>${route.pickupPoint}</td>
        <td>${route.driverID}</td>
        <td>
          <i class="fas fa-edit edit-icon" onclick="editRoute(${index})"></i>
          <i class="fas fa-trash delete-icon" onclick="deleteRoute(${index})"></i>
        </td>
      `;

      routeList.appendChild(row);
    });
  }

  // Function to handle deleting a route
  window.deleteRoute = function (index) {
    if (confirm("Are you sure you want to delete this route?")) {
      routes.splice(index, 1); // Remove the route from the array

      // Save updated routes to localStorage
      localStorage.setItem("routes", JSON.stringify(routes));

      // Re-render the table
      renderTable();
    }
  };

  // Initial render of the table
  renderTable();
});
