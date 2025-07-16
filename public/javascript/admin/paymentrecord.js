document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const showEntriesSelect = document.getElementById("showEntries");
  const dateFilterInput = document.getElementById("filter");

  searchInput.addEventListener("input", filterTable);
  showEntriesSelect.addEventListener("change", updateEntriesVisibility);
  dateFilterInput.addEventListener("change", filterTable);

  // Initial table sort by Paid Date
  sortTable(7, true);
});

function filterList() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filterDate = document.getElementById("filter").value;
  const formattedInputDate = formatDateToDDMMYYYY(filterDate);
  const rows = document.querySelectorAll("#personList tr");

  rows.forEach((row) => {
    const id = row.cells[0].textContent.toLowerCase();
    const name = row.cells[1].textContent.toLowerCase();
    const usn = row.cells[2].textContent.toLowerCase();
    const branch = row.cells[3].textContent.toLowerCase();
    const sem = row.cells[4].textContent.toLowerCase();
    const pickup = row.cells[5].textContent.toLowerCase();
    const amt = row.cells[6].textContent.toLowerCase();
    const paidDate = row.cells[7].textContent.trim();

    const matchesSearch =
      !searchTerm ||
      id.includes(searchTerm) ||
      name.includes(searchTerm) ||
      usn.includes(searchTerm) ||
      branch.includes(searchTerm) ||
      sem.includes(searchTerm) ||
      pickup.includes(searchTerm) ||
      amt.includes(searchTerm) ||
      paidDate.includes(searchTerm);

    const matchesDate = !filterDate || paidDate === formattedInputDate;

    row.style.display = matchesSearch && matchesDate ? "" : "none";
  });

  updateEntriesVisibility();
}

function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function updateEntriesVisibility() {
  const entriesPerPage = parseInt(document.getElementById("showEntries").value);
  const rows = document.querySelectorAll("#personList tr");
  const visibleRows = Array.from(rows).filter(
    (row) => row.style.display !== "none"
  );

  // First hide all
  rows.forEach((row) => (row.style.display = "none"));

  // Then show only limited entries
  for (let i = 0; i < entriesPerPage && i < visibleRows.length; i++) {
    visibleRows[i].style.display = "";
  }
}

// Sorting function for column index and order
function sortTable(columnIndex, ascending = true) {
  const tbody = document.getElementById("personList");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    let valA = a.cells[columnIndex].textContent.trim();
    let valB = b.cells[columnIndex].textContent.trim();

    // If sorting Paid Date (column 7), convert to yyyy-mm-dd for comparison
    if (columnIndex === 7) {
      valA = convertToComparableDate(valA);
      valB = convertToComparableDate(valB);
    }

    return ascending
      ? valA.localeCompare(valB, undefined, { numeric: true })
      : valB.localeCompare(valA, undefined, { numeric: true });
  });

  tbody.innerHTML = "";
  rows.forEach((row) => tbody.appendChild(row));
  updateEntriesVisibility();
}

// Convert dd-mm-yyyy to yyyy-mm-dd for correct date sorting
function convertToComparableDate(dateStr) {
  const [dd, mm, yyyy] = dateStr.split("/");
  return `${dd}/${mm}/${yyyy}`;
}
