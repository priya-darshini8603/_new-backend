document
  .getElementById("add-complaint-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Get form data const
    complaint = {
      topic: document.getElementById("topic").value,
      date: document.getElementById("date").value,
      busNumber: document.getElementById("busNumber").value,
      routeNumber: document.getElementById("routeNumber").value,
      driverName: document.getElementById("driverName").value,
      complainant: document.getElementById("complainant").value,
      details: document.getElementById("details").value,
      status: "unresolved", // Default
      status,
    }; // Save the complaint to local storage (or send to server) let
    complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints)); // Show success message and redirect
    alert("Complaint added successfully!");
    window.location.href = "/admin/complaintbox.hbs";
  });
