// FILE: /route-management-page/route-management-page/src/script.js

document.addEventListener("DOMContentLoaded", function () {
  const routeTableBody = document.getElementById("route-table-body");
  const addRouteForm = document.getElementById("add-route-form");

  addRouteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const routeNumber = document.getElementById("route-number").value;
    const busNumber = document.getElementById("bus-number").value;
    const numberOfStudents =
      document.getElementById("number-of-students").value;
    const numberOfSeats = document.getElementById("number-of-seats").value;
    const startPoint = document.getElementById("start-point").value;
    const destinationPoint = document.getElementById("destination-point").value;
    const driverName = document.getElementById("driver-name").value;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${routeNumber}</td>
            <td>${busNumber}</td>
            <td>${numberOfStudents}</td>
            <td>${numberOfSeats}</td>
            <td>${startPoint}</td>
            <td>${destinationPoint}</td>
            <td>${driverName}</td>
        `;

    routeTableBody.appendChild(newRow);
    addRouteForm.reset();
  });
});
