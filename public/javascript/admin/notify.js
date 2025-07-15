// ✅ DYNAMIC LOADING
async function loadUsers() {
  try {
    const res = await fetch('/admin/api/users');
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const personList = document.getElementById('personList');
    personList.innerHTML = '';

    if (!data.users || data.users.length === 0) {
      personList.innerHTML = `
        <tr><td colspan="10" style="text-align:center;">No users found.</td></tr>
      `;
      return;
    }

    data.users.forEach(user => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-role', user.role?.toLowerCase() || "");

      tr.innerHTML = `
        <td><input type="checkbox" class="select-person" data-name="${user.fName || ''} ${user.lName || ''}" /></td>
        <td>${user.fName || ''} ${user.lName || ''}</td>
        <td>${capitalize(user.role || '')}</td>
        <td>${user.email || ''}</td>
        <td>${user.contactNo || ''}</td>
        <td>${user.busNo || ''}</td>
        <td>${user.routeNo || ''}</td>
        <td><span class="${user.paymentStatus === 'Paid' ? 'status-paid' : 'status-unpaid'}">${user.paymentStatus || ''}</span></td>
        <td><span class="${user.status === 'Active' ? 'status-active' : 'status-inactive'}">${user.status || ''}</span></td>
        <td><button class="msg" onclick="openModal()">📩</button></td>
      `;
      personList.appendChild(tr);
    });

    applyFilters();

  } catch (error) {
    console.error('Error loading users:', error);
    alert('Failed to load users. Check console.');
  }
}

// ✅ Capitalize helper
function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// ✅ SELECT ALL / RESET
function selectAll() {
  document
    .querySelectorAll(".select-person")
    .forEach(cb => cb.checked = true);
  alert("All items selected!");
}

function resetForm() {
  document
    .querySelectorAll(".select-person")
    .forEach(cb => cb.checked = false);
  alert("Form reset!");
}

// ✅ SEARCH FILTER
document.getElementById("search").addEventListener("input", applyFilters);

// ✅ SHOW ENTRIES
document.getElementById("showEntries").addEventListener("change", applyFilters);

// ✅ ROLE FILTER
function filterList() {
  applyFilters();
}

// ✅ Apply all filters together
function applyFilters() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;
  const entriesPerPage = parseInt(document.getElementById("showEntries").value);

  const rows = document.querySelectorAll("#personList tr");
  let visibleCount = 0;

  rows.forEach(row => {
    if (row.querySelector('td[colspan]')) {
      row.style.display = '';
      return;
    }

    const role = row.getAttribute("data-role") || "";
    const cells = row.cells;
    const name = cells[1]?.textContent.toLowerCase().trim() || "";
    const email = cells[3]?.textContent.toLowerCase().trim() || "";
    const status = cells[8]?.textContent.toLowerCase().trim() || "";

    const matchesSearch = (
      name.includes(searchTerm) ||
      email.includes(searchTerm) ||
      status.includes(searchTerm)
    );

    const matchesFilter = (filter === "all" || role === filter);

    if (matchesSearch && matchesFilter && visibleCount < entriesPerPage) {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });
}

// ✅ MODAL
function openModal() {
  document.getElementById("messageModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("messageModal").style.display = "none";
}

// ✅ SUBMIT MESSAGE
async function submitMessage() {
  const message = document.getElementById("messageInput").value.trim();

  if (!message) {
    alert("Please enter a message.");
    return;
  }

  const selectedNames = Array.from(document.querySelectorAll(".select-person:checked"))
    .map(cb => cb.getAttribute("data-name"))
    .filter(name => !!name);

  if (!selectedNames.length) {
    alert("Please select at least one recipient.");
    return;
  }

  try {
    const response = await fetch('/admin/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientNames: selectedNames, message })
    });

    const result = await response.json();

    if (result.success) {
      alert("Message sent successfully!");
    } else {
      alert("Failed: " + result.message);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Error sending message. Check console.");
  }

  closeModal();
}

// ✅ SORTABLE TABLE
document.querySelectorAll("th").forEach((head, i) => {
  let sortAsc = true;
  head.onclick = () => {
    document.querySelectorAll("th").forEach(h => h.classList.remove("active"));
    head.classList.add("active");

    sortAsc = !head.classList.contains("asc");
    head.classList.toggle("asc", sortAsc);
    head.classList.toggle("desc", !sortAsc);

    sortTable(i, sortAsc);
  };
});

function sortTable(column, sortAsc) {
  const tbody = document.getElementById("personList");
  const rows = Array.from(tbody.querySelectorAll("tr")).filter(row => !row.querySelector('td[colspan]'));

  const sortedRows = rows.sort((a, b) => {
    let first = a.cells[column]?.textContent.trim() || "";
    let second = b.cells[column]?.textContent.trim() || "";

    const isNumeric = !isNaN(parseFloat(first)) && !isNaN(parseFloat(second));
    if (isNumeric) {
      return sortAsc ? first - second : second - first;
    } else {
      return sortAsc
        ? first.localeCompare(second)
        : second.localeCompare(first);
    }
  });

  tbody.innerHTML = "";
  sortedRows.forEach(row => tbody.appendChild(row));
}

// ✅ MOBILE SIDEBAR
const sidebarToggle = document.createElement("button");
sidebarToggle.classList.add("sidebar-toggle");
sidebarToggle.innerHTML = "☰";
document.body.appendChild(sidebarToggle);

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".student-details");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  content.classList.toggle("active");
});

// ✅ CLOSE MODAL WHEN CLICKING OUTSIDE
window.onclick = function (event) {
  const modal = document.getElementById("messageModal");
  if (event.target === modal) {
    closeModal();
  }
};

// ✅ INITIAL LOAD
window.addEventListener('DOMContentLoaded', loadUsers);
