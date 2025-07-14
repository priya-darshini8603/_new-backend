document
  .getElementById("add-event-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const eventName = document.getElementById("event-name").value;
    const busesRequired = document.getElementById("buses-required").value;
    const startPoint = document.getElementById("start-point").value;
    const destinationPoint = document.getElementById("destination-point").value;
    const eventTime = document.getElementById("event-time").value;
    const eventDate = document.getElementById("event-date").value;
    const numberOfStudents =
      document.getElementById("number-of-students").value;
    const purpose = document.getElementById("purpose").value;
    const eventDetails = {
      eventName,
      busesRequired,
      startPoint,
      destinationPoint,
      eventTime,
      eventDate,
      numberOfStudents,
      purpose,
    };
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(eventDetails);
    localStorage.setItem("events", JSON.stringify(events));
    window.location.href = "/admin/scheduleevent.hbs";
  });
