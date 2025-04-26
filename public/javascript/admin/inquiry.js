document.addEventListener("DOMContentLoaded", function () {
  const profilePic = localStorage.getItem("profilePic");
  const profileName = localStorage.getItem("profileName");

  if (profilePic) {
    document.getElementById("profile-pic").src = profilePic;
  }
  if (profileName) {
    document.getElementById("profile-name").textContent = profileName;
  }

  // Sample notifications data
  const notifications = [
    {
      name: "John Doe",
      role: "Student",
      message: "New complaint received",
    },
    { name: "Jane Smith", role: "Staff", message: "Payment completed" },
    {
      name: "Alice Johnson",
      role: "Student",
      message: "Bus delay reported",
    },
    {
      name: "Michael Brown",
      role: "Staff",
      message: "New student registered",
    },
    { name: "Emily Davis", role: "Student", message: "Schedule updated" },
  ];

  const notificationPopup = document.getElementById("notification-popup");
  const notificationBell = document.getElementById("notification-bell");
  const notificationCount = document.getElementById("notification-count");
  const notificationCountPopup = document.getElementById(
    "notification-count-popup"
  );
  const notificationList = document.getElementById("notification-list");

  notificationCount.textContent = notifications.length;
  notificationCountPopup.textContent = `${notifications.length} Notifications`;

  notifications.forEach((notification) => {
    const notificationItem = document.createElement("div");
    notificationItem.classList.add("notification-item");
    notificationItem.innerHTML = `
        <i class="fas fa-user"></i>
        <div>
          <span>${notification.name}</span>
          <div class="role">${notification.role}</div>
          <div>${notification.message}</div>
        </div>
      `;
    notificationList.appendChild(notificationItem);
  });

  notificationBell.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationPopup.style.display =
      notificationPopup.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", (event) => {
    if (
      !notificationPopup.contains(event.target) &&
      event.target !== notificationBell
    ) {
      notificationPopup.style.display = "none";
    }
  });

  // Handle form submission
  const inquiryForm = document.getElementById("inquiry-form");
  const inquiryTable = document
    .getElementById("inquiry-table")
    .getElementsByTagName("tbody")[0];

  inquiryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const newRow = inquiryTable.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);

    cell1.innerHTML = inquiryTable.rows.length + 1;
    cell2.innerHTML = name;
    cell3.innerHTML = email;
    cell4.innerHTML = message;
    cell5.innerHTML =
      '<span class="badge pending"><i class="fas fa-times-circle"></i> Pending</span>';

    inquiryForm.reset();
  });
});
