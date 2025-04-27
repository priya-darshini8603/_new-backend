document.addEventListener("DOMContentLoaded", function () {
  const addEventForm = document.getElementById("add-event-form");
  const eventList = document.getElementById("event-list");
  addEventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newEvent = {
      name: document.getElementById("event-name").value,
      busesRequired: parseInt(document.getElementById("buses-required").value),
      startPoint: document.getElementById("start-point").value,
      destinationPoint: document.getElementById("destination-point").value,
      time: document.getElementById("time").value,
      date: document.getElementById("date").value,
      students: parseInt(document.getElementById("students").value),
      purpose: document.getElementById("purpose").value,
    };
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${eventList.children.length + 1}</td> <td>${newEvent.name}</td>
    <td>${newEvent.busesRequired}</td> <td>${newEvent.startPoint}</td>
    <td>${newEvent.destinationPoint}</td> <td>${newEvent.time}</td>
    <td>${newEvent.date}</td> <td>${newEvent.students}</td>
    <td>${newEvent.purpose}</td> `;
    eventList.appendChild(row);
    addEventForm.reset();
  });
  document
    .getElementById("close-add-event-popup")
    .addEventListener("click", function () {
      window.close();
    });
});
