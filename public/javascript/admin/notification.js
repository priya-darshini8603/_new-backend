// Sample Notification Data
const notifications = [
  {
    id: 1,
    profilePic: "./profile1.jpg",
    name: "John Doe",
    date: "2023-10-15",
    designation: "Teacher",
    content: "Your leave request has been approved.",
  },
  {
    id: 2,
    profilePic: "./profile2.jpg",
    name: "Jane Smith",
    date: "2023-10-14",
    designation: "Student",
    content: "Your assignment submission is due tomorrow.",
  },
  {
    id: 3,
    profilePic: "./profile3.jpg",
    name: "Alice Johnson",
    date: "2023-10-13",
    designation: "Teacher",
    content: "Reminder: Staff meeting at 10 AM.",
  },
];

// DOM Elements
const notificationList = document.getElementById("notificationList");
const searchInput = document.getElementById("searchInput");
const notificationCount = document.getElementById("notification-count");
const notificationPopup = document.getElementById("notificationPopup");
const popupNotificationTitle = document.getElementById(
  "popupNotificationTitle"
);
const popupSender = document.getElementById("popupSender");
const popupDate = document.getElementById("popupDate");
const popupContent = document.getElementById("popupContent");
const closePopup = document.getElementById("closePopup");

// Render Notifications
function renderNotifications(notifications) {
  notificationList.innerHTML = notifications
    .map(
      (notification) => `
      <li class="notification-item" data-id="${notification.id}">
        <div class="profile-info">
          <img src="${notification.profilePic}" alt="Profile Picture" />
          <div class="details">
            <p class="name">${notification.name}</p>
            <p class="date">${notification.date}</p>
            <p class="designation">${notification.designation}</p>
          </div>
        </div>
        <div class="notification-content">
          <p>${notification.content}</p>
        </div>
      </li>
    `
    )
    .join("");
}

// Update Notification Count
function updateNotificationCount() {
  notificationCount.textContent = notifications.length;
}

// Search Notifications
function searchNotifications(query) {
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.name.toLowerCase().includes(query.toLowerCase()) ||
      notification.designation.toLowerCase().includes(query.toLowerCase()) ||
      notification.content.toLowerCase().includes(query.toLowerCase())
  );
  renderNotifications(filteredNotifications);
}

// Show Notification Details in Popup
function showNotificationDetails(id) {
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    popupNotificationTitle.textContent = `Notification from ${notification.name}`;
    popupSender.textContent = `Sender: ${notification.name}`;
    popupDate.textContent = `Date: ${notification.date}`;
    popupContent.textContent = `Content: ${notification.content}`;
    notificationPopup.style.display = "block";
  }
}

// Close Popup
function closeNotificationPopup() {
  notificationPopup.style.display = "none";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Render initial notifications
  renderNotifications(notifications);
  updateNotificationCount();

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    searchNotifications(e.target.value);
  });

  // Open notification details popup
  notificationList.addEventListener("click", (e) => {
    const notificationItem = e.target.closest(".notification-item");
    if (notificationItem) {
      const notificationId = parseInt(notificationItem.dataset.id);
      showNotificationDetails(notificationId);
    }
  });

  // Close popup
  closePopup.addEventListener("click", closeNotificationPopup);
});
//mobile menu
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
