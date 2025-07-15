// ✅ Sample Notification Data (for now)
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

// ✅ DOM Elements
const notificationList = document.getElementById("notificationList");
const searchInput = document.getElementById("searchInput");
const notificationCount = document.getElementById("notification-count");
const notificationPopup = document.getElementById("notificationPopup");
const popupNotificationTitle = document.getElementById("popupNotificationTitle");
const popupSender = document.getElementById("popupSender");
const popupDate = document.getElementById("popupDate");
const popupContent = document.getElementById("popupContent");
const closePopup = document.getElementById("closePopup");

// ✅ Render Notifications
function renderNotifications(list) {
  if (!notificationList) return;
  notificationList.innerHTML = list
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

// ✅ Update Notification Count
function updateNotificationCount() {
  if (notificationCount) {
    notificationCount.textContent = notifications.length;
  }
}

// ✅ Search Notifications
function searchNotifications(query) {
  const filtered = notifications.filter((n) =>
    [n.name, n.designation, n.content].some((field) =>
      field.toLowerCase().includes(query.toLowerCase())
    )
  );
  renderNotifications(filtered);
}

// ✅ Show Notification Details in Popup
function showNotificationDetails(id) {
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    popupNotificationTitle.textContent = `Notification from ${notification.name}`;
    popupSender.textContent = `Sender: ${notification.name} (${notification.designation})`;
    popupDate.textContent = `Date: ${notification.date}`;
    popupContent.textContent = notification.content;
    notificationPopup.style.display = "flex";
  }
}

// ✅ Close Popup
function closeNotificationPopup() {
  notificationPopup.style.display = "none";
}

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  renderNotifications(notifications);
  updateNotificationCount();

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchNotifications(e.target.value);
    });
  }

  // Click notification to open popup
  if (notificationList) {
    notificationList.addEventListener("click", (e) => {
      const item = e.target.closest(".notification-item");
      if (item) {
        const id = parseInt(item.dataset.id, 10);
        showNotificationDetails(id);
      }
    });
  }

  // Close popup
  if (closePopup) {
    closePopup.addEventListener("click", closeNotificationPopup);
  }

  // Close popup by clicking outside
  if (notificationPopup) {
    window.addEventListener("click", (e) => {
      if (e.target === notificationPopup) {
        closeNotificationPopup();
      }
    });
  }
});

// ✅ Mobile Sidebar Toggle
const sidebarToggle = document.createElement("button");
sidebarToggle.classList.add("sidebar-toggle");
sidebarToggle.innerHTML = "☰";
document.body.appendChild(sidebarToggle);

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".container");

sidebarToggle.addEventListener("click", () => {
  if (sidebar) sidebar.classList.toggle("active");
  if (content) content.classList.toggle("active");
});
