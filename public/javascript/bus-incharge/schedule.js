function searchSchedule() {
    const input = document.getElementById('searchInput').value.toLowerCase();

    // Search in Bus Pickup Points
    const pickupItems = document.querySelectorAll('.pickup-container ul li');
    pickupItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(input) ? 'block' : 'none';
    });

    // Search in Upcoming Events
    const eventItems = document.querySelectorAll('.event');
    eventItems.forEach(event => {
        const text = event.textContent.toLowerCase();
        event.style.display = text.includes(input) ? 'flex' : 'none';
    });
}

// Attach search function to input
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', searchSchedule);
