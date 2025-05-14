document.addEventListener("DOMContentLoaded", function () {
  const calendarTitle = document.getElementById("calendar-title");
  const calendarBody = document.getElementById("calendar-body");
  const prevMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");
  const searchInput = document.getElementById("search-input");
  const eventList = document.getElementById("event-list");
  const eventPopup = document.getElementById("event-popup");
  const closePopupButton = document.getElementById("close-popup");
  const acceptEventButton = document.getElementById("accept-event");
  const rejectEventButton = document.getElementById("reject-event");
  const addEventButton = document.getElementById("add-event");
  const addEventPopup = document.getElementById("add-event-popup");
  const closeAddEventPopupButton = document.getElementById(
    "close-add-event-popup"
  );
  const addEventForm = document.getElementById("add-event-form");
  const acceptedEventsList = document
    .getElementById("accepted-events")
    .querySelector("ul");
  const rejectedEventsList = document
    .getElementById("rejected-events")
    .querySelector("ul");

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  const events = [
    {
      id: 1,
      name: "School Trip",
      busesRequired: 2,
      startPoint: "School",
      destinationPoint: "Museum",
      time: "10:00 AM",
      date: "2025-02-20",
      students: 50,
      purpose: "Educational",
      status: "pending",
    },
    {
      id: 2,
      name: "Sports Event",
      busesRequired: 3,
      startPoint: "School",
      destinationPoint: "Stadium",
      time: "8:00 AM",
      date: "2025-02-22",
      students: 100,
      purpose: "Sports",
      status: "pending",
    },
  ];

  // Render the calendar
  function renderCalendar(month, year) {
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = "";

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      calendarBody.appendChild(emptyCell);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateCell = document.createElement("div");
      dateCell.textContent = day;
      if (
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear()
      ) {
        dateCell.classList.add("today");
      }
      calendarBody.appendChild(dateCell);
    }

    // Update the calendar title
    calendarTitle.textContent = `${new Date(year, month).toLocaleString(
      "default",
      { month: "long" }
    )} ${year}`;
  }

  // Render the event list
  function renderEvents(filteredEvents) {
    eventList.innerHTML = "";
    filteredEvents.forEach((event, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${event.name}</td>
          <td>${event.busesRequired}</td>
          <td>${event.startPoint}</td>
          <td>${event.destinationPoint}</td>
          <td>${event.time}</td>
          <td>${event.date}</td>
          <td>${event.students}</td>
          <td>${event.purpose}</td>
          <td><i class="fas fa-eye view-icon" data-id="${event.id}"></i></td>
          <td class="status">${
            event.status === "accepted"
              ? '<i class="fas fa-check-circle" style="color: green;"></i>'
              : event.status === "rejected"
              ? '<i class="fas fa-times-circle" style="color: red;"></i>'
              : ""
          }</td>
        `;
      eventList.appendChild(row);
    });

    // Add event listeners to view icons
    document.querySelectorAll(".view-icon").forEach((icon) => {
      icon.addEventListener("click", function () {
        const eventId = this.getAttribute("data-id");
        const event = events.find((e) => e.id == eventId);

        // Populate the event popup with event details
        document.getElementById(
          "popup-event-name"
        ).textContent = `Event Name: ${event.name}`;
        document.getElementById(
          "popup-buses-required"
        ).textContent = `Buses Required: ${event.busesRequired}`;
        document.getElementById(
          "popup-start-point"
        ).textContent = `Start Point: ${event.startPoint}`;
        document.getElementById(
          "popup-destination-point"
        ).textContent = `Destination Point: ${event.destinationPoint}`;
        document.getElementById(
          "popup-time"
        ).textContent = `Time: ${event.time}`;
        document.getElementById(
          "popup-date"
        ).textContent = `Date: ${event.date}`;
        document.getElementById(
          "popup-students"
        ).textContent = `Students: ${event.students}`;
        document.getElementById(
          "popup-purpose"
        ).textContent = `Purpose: ${event.purpose}`;

        // Set event ID for accept/reject buttons
        acceptEventButton.setAttribute("data-id", event.id);
        rejectEventButton.setAttribute("data-id", event.id);

        // Show the event popup
        eventPopup.style.display = "block";
      });
    });
  }

  // Render accepted events
  function renderAcceptedEvents() {
    acceptedEventsList.innerHTML = "";
    events
      .filter((event) => event.status === "accepted")
      .forEach((event) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${event.name}
            <i class="fas fa-bell notification-icon" data-id="${event.id}"></i>
          `;
        acceptedEventsList.appendChild(listItem);
      });

    // Add event listeners to notification icons
    document
      .querySelectorAll("#accepted-events .notification-icon")
      .forEach((icon) => {
        icon.addEventListener("click", function () {
          const eventId = this.getAttribute("data-id");
          const event = events.find((e) => e.id == eventId);
          alert(`Event "${event.name}" has been accepted.`);
        });
      });
  }

  // Render rejected events
  function renderRejectedEvents() {
    rejectedEventsList.innerHTML = "";
    events
      .filter((event) => event.status === "rejected")
      .forEach((event) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${event.name}
            <i class="fas fa-bell notification-icon" data-id="${event.id}"></i>
          `;
        rejectedEventsList.appendChild(listItem);
      });

    // Add event listeners to notification icons
    document
      .querySelectorAll("#rejected-events .notification-icon")
      .forEach((icon) => {
        icon.addEventListener("click", function () {
          const eventId = this.getAttribute("data-id");
          const event = events.find((e) => e.id == eventId);
          alert(`Event "${event.name}" has been rejected.`);
        });
      });
  }

  // Initial render
  renderCalendar(currentMonth, currentYear);
  renderEvents(events);
  renderAcceptedEvents();
  renderRejectedEvents();

  // Event listeners for calendar navigation
  prevMonthButton.addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextMonthButton.addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  // Event listener for search input
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEvents = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm) ||
        event.startPoint.toLowerCase().includes(searchTerm) ||
        event.destinationPoint.toLowerCase().includes(searchTerm) ||
        event.purpose.toLowerCase().includes(searchTerm)
    );
    renderEvents(filteredEvents);
  });

  // Event listener for add event button
  addEventButton.addEventListener("click", function () {
    addEventPopup.style.display = "block";
  });

  // Event listener for close popup button
  closePopupButton.addEventListener("click", function () {
    eventPopup.style.display = "none";
  });

  // Event listener for close add event popup button
  closeAddEventPopupButton.addEventListener("click", function () {
    addEventPopup.style.display = "none";
  });

  // Event listener for accept event button
  acceptEventButton.addEventListener("click", function () {
    const eventId = this.getAttribute("data-id");
    const event = events.find((e) => e.id == eventId);
    event.status = "accepted";
    renderEvents(events);
    renderAcceptedEvents();
    eventPopup.style.display = "none";
  });

  // Event listener for reject event button
  rejectEventButton.addEventListener("click", function () {
    const eventId = this.getAttribute("data-id");
    const event = events.find((e) => e.id == eventId);
    event.status = "rejected";
    renderEvents(events);
    renderRejectedEvents();
    eventPopup.style.display = "none";
  });

  // Event listener for add event form submission
  addEventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newEvent = {
      id: events.length + 1,
      name: document.getElementById("event-name").value,
      busesRequired: parseInt(document.getElementById("buses-required").value),
      startPoint: document.getElementById("start-point").value,
      destinationPoint: document.getElementById("destination-point").value,
      time: document.getElementById("time").value,
      date: document.getElementById("date").value,
      students: parseInt(document.getElementById("students").value),
      purpose: document.getElementById("purpose").value,
      status: "pending",
    };

    events.push(newEvent);
    renderEvents(events);
    addEventPopup.style.display = "none";
    addEventForm.reset();
  });

  // Close popups when clicking outside of them
  window.addEventListener("click", function (e) {
    if (e.target === eventPopup) {
      eventPopup.style.display = "none";
    }
    if (e.target === addEventPopup) {
      addEventPopup.style.display = "none";
    }
  });
});
