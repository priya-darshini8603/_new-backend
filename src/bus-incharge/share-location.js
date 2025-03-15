let userLatitude = null, userLongitude = null;

// Update date and time every second
function updateDateTime() {
    document.getElementById("datetime").textContent = new Date().toLocaleString();
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Function to request location ONLY when button is clicked
function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                showToast("Location access granted.", "success");
               
            },
            function (error) {
                console.error("Error getting location:", error.message);
                showToast("Geolocation failed or permission denied.", "error");
                userLatitude = null;
                userLongitude = null;
             
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        showToast("Geolocation is not supported by this browser.", "error");
        document.getElementById("shareBtn").disabled = true;
    }
}

// Show the map
function showMap() {
    document.getElementById("googleMap").style.display = "block";
    myMap();
}

function myMap() {
    var map;
    var marker;

    // Default location (if GPS is not available)
    var defaultLocation = { lat: 51.508742, lng: -0.120850 };

    // Initialize the map
    map = new google.maps.Map(document.getElementById("googleMap"), {
      center: defaultLocation,
      zoom: 15,
    });

    // Try to get the user's GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(userLocation);

          // Place a marker on the user's location
          marker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
          });
        },
        function () {
          alert("Geolocation failed or permission denied.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    // Add event listener to allow user to select a location
    map.addListener("click", function (event) {
      var clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // If marker exists, move it; otherwise, create a new marker
      if (marker) {
        marker.setPosition(clickedLocation);
      } else {
        marker = new google.maps.Marker({
          position: clickedLocation,
          map: map,
          title: "Selected Location",
        });
      }

      map.setCenter(clickedLocation);
    });
  }
// Share location
function shareLocation() {
    if (userLatitude === null || userLongitude === null) {
        showToast("Please allow location access", "error");
        return;
    }

    const shareWith = document.getElementById("shareWith").value.trim();
    if (!shareWith) {
        showToast("Please enter a name to share the location.", "error");
        return;
    }

    const timestamp = new Date().toLocaleString();
    const historyList = document.getElementById("historyList");

    const newHistoryItem = `
        <div class="history-item">
            <div class="history-text">📍 Shared with ${shareWith} <br><small>${timestamp}</small></div>
            <button class="view-map" onclick="window.open('https://www.google.com/maps?q=${userLatitude},${userLongitude}', '_blank')">View Map</button>
        </div>`;

    historyList.innerHTML = newHistoryItem + historyList.innerHTML;
    document.getElementById("historyContainer").style.display = "block";
}

// Show toast messages
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Attach event listener to the "Allow Location Access" button
document.getElementById("allowLocationBtn").addEventListener("click", requestLocation);
