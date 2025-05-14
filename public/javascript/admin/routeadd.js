document
  .getElementById("add-route-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const routeNumber = document.getElementById("route-number").value;
    const busNumber = document.getElementById("bus-number").value;
    const numStudents = document.getElementById("num-students").value;
    const numSeats = document.getElementById("num-seats").value;
    const startPoint = document.getElementById("start-point").value;
    const destinationPoint = document.getElementById("destination-point").value;
    const driverName = document.getElementById("driver-name").value;

    // Here you can add the logic to save the route details
    // For example, you can send the data to a server or save it in local storage

    alert("Route added successfully!");

    // Clear the form
    document.getElementById("add-route-form").reset();
  });
