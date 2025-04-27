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

  // Update notification count
  notificationCount.textContent = notifications.length;
  notificationCountPopup.textContent = `${notifications.length} Notifications`;

  // Populate notification list
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

  // Toggle notification popup visibility
  notificationBell.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationPopup.style.display =
      notificationPopup.style.display === "block" ? "none" : "block";
  });

  // Close notification popup when clicking outside
  window.addEventListener("click", (event) => {
    if (
      !notificationPopup.contains(event.target) &&
      event.target !== notificationBell
    ) {
      notificationPopup.style.display = "none";
    }
  });

  // Chart.js configuration
  const donutChartCtx = document.getElementById("donutChart").getContext("2d");

  const donutChart = new Chart(donutChartCtx, {
    type: "doughnut",
    data: {
      labels: ["CSE", "ECE", "ME", "CV", "EEE"],
      datasets: [
        {
          label: "Number of Students",
          data: [300, 250, 200, 150, 100],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed !== null) {
                label += context.parsed;
              }
              return label;
            },
          },
        },
      },
    },
  });
});
