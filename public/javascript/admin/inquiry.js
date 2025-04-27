document.addEventListener("DOMContentLoaded", function () {
  const inquiryForm = document.getElementById("inquiry-form");
  const inquiryTable = document
    .getElementById("inquiry-table")
    .getElementsByTagName("tbody")[0];
  const statusTabs = document.querySelectorAll(".status-tab");

  // Retrieve inquiries from localStorage
  let inquiries = JSON.parse(localStorage.getItem("inquiries")) || [];

  // Function to render the inquiry table
  function renderTable(filterStatus = "All") {
    inquiryTable.innerHTML = ""; // Clear the table body

    inquiries
      .filter(
        (inquiry) => filterStatus === "All" || inquiry.status === filterStatus
      )
      .forEach((inquiry, index) => {
        const row = inquiryTable.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);

        cell1.textContent = index + 1; // Inquiry ID
        cell2.textContent = inquiry.name;
        cell3.textContent = inquiry.email;
        cell4.textContent = inquiry.message;
        cell5.innerHTML = `<span class="badge ${inquiry.status.toLowerCase()}">${
          inquiry.status
        }</span>`;
        cell6.innerHTML = `
          <button class="btn btn-sm btn-success" onclick="updateStatus(${index}, 'Completed')">Completed</button>
          <button class="btn btn-sm btn-warning" onclick="updateStatus(${index}, 'Ongoing')">Ongoing</button>
          <button class="btn btn-sm btn-danger" onclick="updateStatus(${index}, 'Pending')">Pending</button>
        `;
      });
  }

  // Function to update the status of an inquiry
  window.updateStatus = function (index, status) {
    inquiries[index].status = status;

    // Save updated inquiries to localStorage
    localStorage.setItem("inquiries", JSON.stringify(inquiries));

    // Re-render the table
    renderTable();
  };

  // Handle form submission
  inquiryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Add the new inquiry to the array
    const newInquiry = { name, email, message, status: "Pending" };
    inquiries.push(newInquiry);

    // Save inquiries to localStorage
    localStorage.setItem("inquiries", JSON.stringify(inquiries));

    // Re-render the table
    renderTable();

    // Reset the form
    inquiryForm.reset();
  });

  // Handle status tab clicks
  statusTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const status = this.dataset.status;
      renderTable(status);

      // Highlight the active tab
      statusTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Initial render of the table
  renderTable();
});
