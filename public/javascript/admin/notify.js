function selectAll() {
  document
    .querySelectorAll(".select-person")
    .forEach((checkbox) => (checkbox.checked = true));
  alert("All items selected!");
}

function resetForm() {
  document
    .querySelectorAll(".select-person")
    .forEach((checkbox) => (checkbox.checked = false));
  alert("Form reset!");
}

function sendMessage(name) {
  alert(`Sending message to ${name}`);
}

document.getElementById("search").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const rows = document.querySelectorAll("#personList tr");
  rows.forEach((row) => {
    const name = row.cells[2].textContent.toLowerCase().trim();
    const id = row.cells[1].textContent.toLowerCase().trim();
    const phone = row.cells[4].textContent.toLowerCase().trim();
    const status = row.cells[5].textContent.toLowerCase().trim();
    if (
      name.includes(searchTerm) ||
      id.includes(searchTerm) ||
      phone.includes(searchTerm) ||
      status.includes(searchTerm)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  updateEntriesVisibility();
});

document.getElementById("showEntries").addEventListener("change", function () {
  updateEntriesVisibility();
});

function updateEntriesVisibility() {
  const entriesPerPage = parseInt(document.getElementById("showEntries").value);
  const rows = document.querySelectorAll("#personList tr");
  const totalRows = rows.length;
  const visibleRows = Array.from(rows).filter(
    (row) => row.style.display !== "none"
  );
  rows.forEach((row) => (row.style.display = "none"));
  for (let i = 0; i < entriesPerPage && i < visibleRows.length; i++) {
    visibleRows[i].style.display = "";
  }
}

function filterList() {
  const filter = document.getElementById("filter").value;
  document.querySelectorAll("#personList tr").forEach((row) => {
    const role = row.getAttribute("data-role");
    row.style.display = filter === "all" || role === filter ? "" : "none";
  });
  updateEntriesVisibility();
}

function openModal() {
  document.getElementById("messageModal").style.display = "block";
}

function closeModal() {
  document.getElementById("messageModal").style.display = "none";
}

function submitMessage() {
  const message = document.getElementById("messageInput").value;
  if (message.trim()) {
    alert("Message Sent: " + message);
    closeModal();
  } else {
    alert("Please enter a message.");
  }
}
const table = document.getElementById("sortableTable");
const table_rows = Array.from(document.querySelectorAll("#personList tr"));
const table_headings = document.querySelectorAll("th");

table_headings.forEach((head, i) => {
  let sort_asc = true;
  head.onclick = () => {
    table_headings.forEach((head) => head.classList.remove("active"));
    head.classList.add("active");

    sort_asc = head.classList.contains("asc") ? false : true;
    head.classList.toggle("asc", sort_asc);
    head.classList.toggle("desc", !sort_asc);

    sortTable(i, sort_asc);
  };
});

function sortTable(column, sort_asc) {
  const sortedRows = [...table_rows].sort((a, b) => {
    let first = a.cells[column].textContent.trim();
    let second = b.cells[column].textContent.trim();

    // Check if the value is numeric
    const isNumeric = !isNaN(parseFloat(first)) && !isNaN(parseFloat(second));

    if (isNumeric) {
      return sort_asc ? first - second : second - first;
    } else {
      return sort_asc
        ? first.localeCompare(second)
        : second.localeCompare(first);
    }
  });

  // Reinsert sorted rows into the table
  const tbody = document.getElementById("personList");
  tbody.innerHTML = "";
  sortedRows.forEach((row) => tbody.appendChild(row));
}
//mobile
const sidebarToggle = document.createElement("button");
sidebarToggle.classList.add("sidebar-toggle");
sidebarToggle.innerHTML = "☰"; // Hamburger icon
document.body.appendChild(sidebarToggle);

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".student-details");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  content.classList.toggle("active");
});
// Function to open the modal
function openModal() {
  const modal = document.getElementById("messageModal");
  modal.style.display = "flex"; // Display the modal as a flex container
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("messageModal");
  modal.style.display = "none"; // Hide the modal
}

// Function to submit the message
function submitMessage() {
  const message = document.getElementById("messageInput").value;
  if (message.trim() === "") {
    alert("Please enter a message."); // Validate the message
    return;
  }
  alert(`Message sent: ${message}`); // Simulate sending the message
  closeModal(); // Close the modal after sending
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById("messageModal");
  if (event.target === modal) {
    closeModal();
  }
};
