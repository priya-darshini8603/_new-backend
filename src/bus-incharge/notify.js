function selectAll() {
    document.querySelectorAll('.select-person').forEach(checkbox => checkbox.checked = true);
    showToast('All items selected!', 'success');
}

function resetForm() {
    document.querySelectorAll('.select-person').forEach(checkbox => checkbox.checked = false);
    showToast('Form reset!', 'error');
}

function sendMessage(name) {
    showToast(`Sending message to ${name}`, 'success');
}

function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");

    // Ensure toast container exists
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const icons = {
        success: "✅",
        error: "⚠️",
    };

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
<div class="toast-icon">${icons[type]}</div>
<div class="toast-message">${message}</div>
<button class="toast-close" onclick="this.parentElement.remove()">✖</button>
<div class="toast-progress"></div>
`;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

document.getElementById('search').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#personList tr');
    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase().trim();
        const id = row.cells[1].textContent.toLowerCase().trim();
        const phone = row.cells[4].textContent.toLowerCase().trim();
        const status = row.cells[5].textContent.toLowerCase().trim();
        if (name.includes(searchTerm) || id.includes(searchTerm) || phone.includes(
                searchTerm) || status.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updateEntriesVisibility();
});

document.getElementById('showEntries').addEventListener('change', function () {
    updateEntriesVisibility();
});

function updateEntriesVisibility() {
    const entriesPerPage = parseInt(document.getElementById('showEntries').value);
    const rows = document.querySelectorAll('#personList tr');
    const totalRows = rows.length;
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
    rows.forEach(row => row.style.display = 'none');
    for (let i = 0; i < entriesPerPage && i < visibleRows.length; i++) {
        visibleRows[i].style.display = '';
    }
}

function filterList() {
    const filter = document.getElementById('filter').value;
    document.querySelectorAll('#personList tr').forEach(row => {
        const role = row.getAttribute('data-role');
        row.style.display = (filter === 'all' || role === filter) ? '' : 'none';
    });
    updateEntriesVisibility();
}

function openModal() {
    document.getElementById('messageModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('messageModal').style.display = 'none';
    document.getElementById('messageInput').value = '';
}

function submitMessage() {
    const message = document.getElementById('messageInput').value;
    if (message.trim()) {
        showToast(`Message Sent: ${message}`, 'success');
        closeModal();
    } else {
        showToast('Please enter a message.', 'error');
    }
}

const table = document.getElementById('sortableTable');
const table_rows = Array.from(document.querySelectorAll('#personList tr'));
const table_headings = document.querySelectorAll('th');

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        sort_asc = head.classList.contains('asc') ? false : true;
        head.classList.toggle('asc', sort_asc);
        head.classList.toggle('desc', !sort_asc);

        sortTable(i, sort_asc);
    }
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
            return sort_asc ? first.localeCompare(second) : second.localeCompare(first);
        }
    });


    const tbody = document.getElementById('personList');
    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}
const avatar = document.getElementById('avatar');
const collapseMenu = document.getElementById('collapseMenu');

avatar.addEventListener('click', () => {
    collapseMenu.classList.toggle('active'); // Toggle the active class for collapse
});

document.addEventListener('click', (event) => {
    if (!avatar.contains(event.target) && !collapseMenu.contains(event.target)) {
        collapseMenu.classList.remove('active');
    }
});

const toggle = document.querySelector('.toggle');
const navigation = document.querySelector('.navigation');
const main = document.querySelector('.main');

toggle.onclick = function () {
    navigation.classList.toggle('active');
    main.classList.toggle('active');
};

const list = document.querySelectorAll('.navigation li');

// Function to set active class on click
function setActiveLink() {
    list.forEach(item => item.classList.remove('active')); // Remove active class from all
    this.classList.add('active'); // Add active class to clicked item
}

// Function for hover effect
function hoverEffect() {
    list.forEach(item => item.classList.remove('hovered')); // Remove hovered effect
    this.classList.add('hovered'); // Apply hovered effect
}

// Add event listeners for click and hover
list.forEach(item => {
    item.addEventListener('click', setActiveLink); // Set active link on click
    item.addEventListener('mouseover', hoverEffect); // Apply hover effect
});
