function showComplaints() {
  document.getElementById("complaints-section").style.display = "block";
  document.getElementById("solved-section").style.display = "none";
  document.getElementById("unsolved-section").style.display = "none";
}

function showSolvedComplaints() {
  document.getElementById("complaints-section").style.display = "none";
  document.getElementById("solved-section").style.display = "block";
  document.getElementById("unsolved-section").style.display = "none";
}

function showUnsolvedComplaints() {
  document.getElementById("complaints-section").style.display = "none";
  document.getElementById("solved-section").style.display = "none";
  document.getElementById("unsolved-section").style.display = "block";
}

function viewComplaint(element) {
  const row = element.closest("tr");
  document.getElementById("complaintTitle").innerText = row.cells[1].innerText;
  document.getElementById("complaintDetails").innerText =
    row.cells[7].innerText;
  document.getElementById("complaintPopup").style.display = "block";
}

function closePopup() {
  document.getElementById("complaintPopup").style.display = "none";
}

function markAsSolved(button) {
  const row = button.closest("tr");
  const resolvedTable = document.getElementById("resolved-complaints");
  resolvedTable.appendChild(row.cloneNode(true));
  row.remove();
}

function markAsUnsolved(button) {
  const row = button.closest("tr");
  const unresolvedTable = document.getElementById("unresolved-complaints");
  unresolvedTable.appendChild(row.cloneNode(true));
  row.remove();
}

function deleteComplaint(button) {
  const row = button.closest("tr");
  row.remove();
}

function openAddComplaintPopup() {
  document.getElementById("addComplaintPopup").style.display = "block";
}

function closeAddComplaintPopup() {
  document.getElementById("addComplaintPopup").style.display = "none";
}

function submitComplaint() {
  const complaintTopic = document.getElementById("complaintTopic").value;
  const complaintDate = document.getElementById("complaintDate").value;
  const busNo = document.getElementById("busNo").value;
  const routeNo = document.getElementById("routeNo").value;
  const driverName = document.getElementById("driverName").value;
  const complainant = document.getElementById("complainant").value;
  const complaintDetails = document.getElementById("complaintDetails").value;

  const complaintTable = document.getElementById("complaintTable");
  const newRow = complaintTable.insertRow();
  newRow.innerHTML = `
      <td>${complaintTable.rows.length}</td>
      <td>${complaintTopic}</td>
      <td>${complaintDate}</td>
      <td>${busNo}</td>
      <td>${routeNo}</td>
      <td>${driverName}</td>
      <td>${complainant}</td>
      <td>${complaintDetails}</td>
      <td>
        <span class="status-btn" onclick="viewComplaint(this)"><i class="fas fa-eye"></i></span>
      </td>
      <td>
        <button class="accept" onclick="markAsSolved(this)">Solved</button>
        <button class="reject" onclick="markAsUnsolved(this)">Unsolved</button>
        <button class="delete" onclick="deleteComplaint(this)">Delete</button>
      </td>
    `;

  closeAddComplaintPopup();
  alert("Complaint added successfully!");
}

function acceptComplaint() {
  alert("Complaint Accepted");
  closePopup();
}

function rejectComplaint() {
  alert("Complaint Rejected");
  closePopup();
}
// Function to make an element draggable
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  // Mouse down event to start dragging
  element.addEventListener("mousedown", (e) => {
    // Check if the target is an input, textarea, button, or other interactive elements
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "SELECT"
    ) {
      return; // Do nothing if the target is an interactive element
    }

    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.cursor = "grabbing";
  });

  // Mouse move event to drag the element
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  });

  // Mouse up event to stop dragging
  document.addEventListener("mouseup", () => {
    isDragging = false;
    element.style.cursor = "grab";
  });
}

// Function to open the add complaint popup
function openAddComplaintPopup() {
  const popup = document.getElementById("addComplaintPopup");
  popup.style.display = "block";
  makeDraggable(popup);
}

// Function to close the add complaint popup
function closeAddComplaintPopup() {
  const popup = document.getElementById("addComplaintPopup");
  popup.style.display = "none";
}

// Function to submit the complaint (dummy implementation)
function submitComplaint() {
  alert("Complaint submitted!");
  closeAddComplaintPopup();
}
