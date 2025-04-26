document.getElementById("search").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const rows = document.querySelectorAll("#personList tr");
  rows.forEach((row) => {
    const name = row.cells[1].textContent.toLowerCase().trim();
    const id = row.cells[0].textContent.toLowerCase().trim();
    const usn = row.cells[2].textContent.toLowerCase().trim();
    const branch = row.cells[3].textContent.toLowerCase().trim();
    const sem = row.cells[4].textContent.toLowerCase().trim();
    const pickup = row.cells[5].textContent.toLowerCase().trim();
    const amt = row.cells[6].textContent.toLowerCase().trim();
    const date = row.cells[7].textContent.toLowerCase().trim();
    if (
      name.includes(searchTerm) ||
      id.includes(searchTerm) ||
      date.includes(searchTerm) ||
      usn.includes(searchTerm) ||
      amt.includes(searchTerm)
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
  const dateInput = document.getElementById("filter");
  const date = dateInput.value; // Input date (yyyy-mm-dd)
  const rows = document.querySelectorAll("#personList tr");

  rows.forEach((row) => {
    const rowDate = row.getAttribute("data-date"); // dd-mm-yyyy format
    const formattedInputDate = formatDateToDDMMYYYY(date); // Convert input to dd-mm-yyyy

    // Ensure the row is displayed if input is empty or matches the row date
    if (!date || rowDate === formattedInputDate) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  updateEntriesVisibility();
}

// Convert yyyy-mm-dd to dd-mm-yyyy
function formatDateToDDMMYYYY(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}
// Trigger filtering on input change (clears on reset)
document.getElementById("filter").addEventListener("change", filterList);
document.getElementById("filter").addEventListener("input", function () {
  if (!this.value) filterList();
});

document.addEventListener("DOMContentLoaded", () => {
  // Automatically sort by the date column (index 4) in descending order
  sortTable(0, false);
});

function sortTable(column, sort_asc) {
  const tbody = document.getElementById("personList");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  const sortedRows = rows.sort((a, b) => {
    let first = a.cells[column].textContent.trim();
    let second = b.cells[column].textContent.trim();

    // Check if the column is the date (assuming column index 4)
    if (column === 4) {
      first = formatDate(first);
      second = formatDate(second);
    }

    return sort_asc ? first.localeCompare(second) : second.localeCompare(first);
  });

  tbody.innerHTML = "";
  sortedRows.forEach((row) => tbody.appendChild(row));
}
// Toggle sidebar
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function toggleSidebar() {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

// Close sidebar when clicking outside
overlay.addEventListener("click", toggleSidebar);

// Add a button to open the sidebar
const openSidebarBtn = document.createElement("button");
openSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
openSidebarBtn.classList.add("open-sidebar-btn");
openSidebarBtn.addEventListener("click", toggleSidebar);
document.body.appendChild(openSidebarBtn);

// Filter table by date
function filterList() {
  const filterDate = document.getElementById("filter").value;
  const rows = document.querySelectorAll("#personList tr");

  rows.forEach((row) => {
    const rowDate = row.getAttribute("data-date");
    if (filterDate === "" || rowDate === filterDate) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
//mobile
