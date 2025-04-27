// Sample data for 25 buses
const buses = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Bus ${i + 1}`,
  availableSeats: Math.floor(Math.random() * 50) + 1,
  occupiedSeats: Math.floor(Math.random() * 50) + 1,
}));

const busChartsContainer = document.getElementById("busChartsContainer");
const editModal = document.getElementById("editModal");
const closeModal = document.querySelector(".close");
const saveSeatsBtn = document.getElementById("saveSeatsBtn");
const editAvailableSeats = document.getElementById("editAvailableSeats");
const editOccupiedSeats = document.getElementById("editOccupiedSeats");
const editBusId = document.getElementById("editBusId");

let currentBus = null;

// Function to render bus boxes with donut charts
function renderBusBoxes() {
  busChartsContainer.innerHTML = "";
  buses.forEach((bus) => {
    const busBox = document.createElement("div");
    busBox.className = "bus-box";
    busBox.innerHTML = `
        <h3>${bus.name}</h3>
        <canvas id="chart-${bus.id}"></canvas>
        <p>Available Seats: ${bus.availableSeats}</p>
        <p>Occupied Seats: ${bus.occupiedSeats}</p>
        <button onclick="openEditModal(${bus.id})">Edit</button>
      `;
    busChartsContainer.appendChild(busBox);

    // Render donut chart for the bus
    renderDonutChart(bus);
  });
}

// Function to render a donut chart for a bus
function renderDonutChart(bus) {
  const ctx = document.getElementById(`chart-${bus.id}`).getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Available Seats", "Occupied Seats"],
      datasets: [
        {
          label: "Seats",
          data: [bus.availableSeats, bus.occupiedSeats],
          backgroundColor: ["#36a2eb", "#ff6384"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Function to open the edit modal
window.openEditModal = function (busId) {
  currentBus = buses.find((bus) => bus.id === busId);
  editBusId.value = currentBus.id;
  editAvailableSeats.value = currentBus.availableSeats;
  editOccupiedSeats.value = currentBus.occupiedSeats;
  editModal.style.display = "block";
};

// Function to close the modal
closeModal.onclick = function () {
  editModal.style.display = "none";
};

// Function to save edited seats
saveSeatsBtn.onclick = function () {
  currentBus.availableSeats = parseInt(editAvailableSeats.value);
  currentBus.occupiedSeats = parseInt(editOccupiedSeats.value);
  renderBusBoxes(); // Re-render bus boxes and charts
  editModal.style.display = "none";
};

// Render bus boxes on page load
renderBusBoxes();
