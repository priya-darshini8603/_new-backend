function updateDateTime() {
    const now = new Date();
    document.getElementById("datetime").textContent = now.toLocaleString();
}

// Update the time on load and every second
updateDateTime();
setInterval(updateDateTime, 1000);

let userLatitude, userLongitude;

function getLocation() {
    if (navigator.geolocation) {
        showToast('Getting Location...', 'info');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;

                showToast("Location detected!", "success");
                document.getElementById("mapContainer").style.display = "block";
                document.getElementById("map").src =
                    `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${userLatitude},${userLongitude}`;
            },
            (error) => {
                showToast('Location access denied.', 'error');
            }
        );
    } else {
        showToast('Geolocation is not supported by this browser.', 'error');
    }
}

function shareLocation() {
    if (!userLatitude || !userLongitude) {
        showToast('Please allow location access first.', 'error');
        return;
    }

    const shareWith = document.getElementById("shareWith").value;
    const timestamp = new Date().toLocaleString();
    const historyList = document.getElementById("historyList");

    const newHistoryItem = `<div class="history-item">
                <div class="history-text">📍 Shared with ${shareWith} <br><small>${timestamp}</small></div>
                <button class="view-map" onclick="window.open('https://www.google.com/maps?q=${userLatitude},${userLongitude}', '_blank')">View Map</button>
            </div>`;

    historyList.innerHTML = newHistoryItem + historyList.innerHTML;
    document.getElementById("historyContainer").style.display = "block";
}
