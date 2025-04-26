document.addEventListener("DOMContentLoaded", function () {
  const routeList = document.getElementById("route-list");
  const routes = JSON.parse(localStorage.getItem("routes")) || [];

  routes.forEach((route, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${route.routeNumber}</td>
        <td>${route.busNumber}</td>
        <td>${route.numStudents}</td>
        <td>${route.numSeats}</td>
        <td>${route.startPoint}</td>
        <td>${route.destinationPoint}</td>
        <td>${route.driverName}</td>
        <td>
          <button onclick="editRoute(${index})">✏️</button>
          <button onclick="deleteRoute(${index})">🗑️</button>
        </td>
      `;
    routeList.appendChild(row);
  });
});

function editRoute(index) {
  const routes = JSON.parse(localStorage.getItem("routes")) || [];
  const route = routes[index];

  document.getElementById("edit-route-number").value = route.routeNumber;
  document.getElementById("edit-bus-number").value = route.busNumber;
  document.getElementById("edit-num-students").value = route.numStudents;
  document.getElementById("edit-num-seats").value = route.numSeats;
  document.getElementById("edit-start-point").value = route.startPoint;
  document.getElementById("edit-destination-point").value =
    route.destinationPoint;
  document.getElementById("edit-driver-name").value = route.driverName;

  document.getElementById("edit-route-form").onsubmit = function (event) {
    event.preventDefault();

    route.routeNumber = document.getElementById("edit-route-number").value;
    route.busNumber = document.getElementById("edit-bus-number").value;
    route.numStudents = document.getElementById("edit-num-students").value;
    route.numSeats = document.getElementById("edit-num-seats").value;
    route.startPoint = document.getElementById("edit-start-point").value;
    route.destinationPoint = document.getElementById(
      "edit-destination-point"
    ).value;
    route.driverName = document.getElementById("edit-driver-name").value;

    routes[index] = route;
    localStorage.setItem("routes", JSON.stringify(routes));
    location.reload();
  };

  document.getElementById("editModal").style.display = "block";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function deleteRoute(index) {
  const routes = JSON.parse(localStorage.getItem("routes")) || [];
  routes.splice(index, 1);
  localStorage.setItem("routes", JSON.stringify(routes));
  location.reload();
}

function goToDashboard() {
  window.location.href = "admindashboard.html";
}
//mobile
const sidebarToggle = document.createElement("button");
sidebarToggle.classList.add("sidebar-toggle");
sidebarToggle.innerHTML = "☰"; // Hamburger icon
document.body.appendChild(sidebarToggle);

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".container");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  content.classList.toggle("active");
});
