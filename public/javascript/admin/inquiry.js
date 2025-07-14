document.addEventListener("DOMContentLoaded", function () {
  const statusTabs = document.querySelectorAll(".status-tab");
  const tableBody = document.getElementById("table-body");

  function renderTableRows(inquiries) {
    tableBody.innerHTML = "";

    if (!inquiries.length) {
      tableBody.innerHTML = `<tr><td colspan="6">No inquiries found</td></tr>`;
      return;
    }

    inquiries.forEach((inquiry) => {
   

      const row = document.createElement("tr");
      row.setAttribute("data-status", inquiry.status);

      row.innerHTML = `
        <td>${inquiry.inquiry_ref_id}</td>
        <td>${inquiry.first_name || ""} ${inquiry.last_name || ""}</td>
        <td>${inquiry.email}</td>
        <td>${inquiry.message}</td>
        <td>${inquiry.priority|| "-"}</td>
        <td>
          <form action="/inquiryupdate/${inquiry._id}" method="POST">
            <button type="submit" name="status" value="Solved" class="btn btn-success">Solved</button>
            <button type="submit" name="status" value="Ongoing" class="btn btn-warning">Ongoing</button>
            <button type="submit" name="status" value="Pending" class="btn btn-danger">Pending</button>
          </form>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  function fetchInquiries(status) {
    fetch(`/admin/inquiry/status/${status}`)
      .then((res) => res.json())
      .then((data) => renderTableRows(data))
      .catch((err) => {
        console.error("Failed to fetch inquiries", err);
        tableBody.innerHTML = `<tr><td colspan="6">Error loading inquiries</td></tr>`;
      });
  }

  // Event listener for tabs
  statusTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const status = this.dataset.status;

      statusTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      fetchInquiries(status);
    });
  });

  // Initial load
  fetchInquiries("All");
});
