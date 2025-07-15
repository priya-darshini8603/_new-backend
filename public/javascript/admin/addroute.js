// FILE: /route-management-page/route-management-page/src/script.js

document.addEventListener("DOMContentLoaded", function () {
  const routeTableBody = document.getElementById("route-table-body");
  const addRouteForm = document.getElementById("add-route-form");

  addRouteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const routeNumber = document.getElementById("route-number").value;
    const busNumber = document.getElementById("bus-number").value;
    const numberOfSeats = document.getElementById("num-seats").value;
    const pickupPoint = document.getElementById("pickup-point").value;
    const driverID = document.getElementById("driver-id").value;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${routeNumber}</td>
            <td>${busNumber}</td>
            <td>${numberOfSeats}</td>
            <td>${pickupPoint}</td>
            <td>${driverID}</td>
        `;

    routeTableBody.appendChild(newRow);
    addRouteForm.reset();
  });
});
