document
  .getElementById("add-route-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Retrieve form values
    const routeNumber = document.getElementById("route-number").value;
    const busNumber = document.getElementById("bus-number").value;
    const numStudents = document.getElementById("num-students").value;
    const numSeats = document.getElementById("num-seats").value;
    const startPoint = document.getElementById("start-point").value;
    const destinationPoint = document.getElementById("destination-point").value;
    const driverName = document.getElementById("driver-name").value;

    // Create route object
    const routeDetails = {
      routeNumber,
      busNumber,
      numStudents,
      numSeats,
      startPoint,
      destinationPoint,
      driverName,
    };

    // Save to localStorage
    let routes = JSON.parse(localStorage.getItem("routes")) || [];
    routes.push(routeDetails);
    localStorage.setItem("routes", JSON.stringify(routes));

    // Redirect to the route page
    alert("Route added successfully!");
    window.location.href = "/admin/route.hbs";
  });
