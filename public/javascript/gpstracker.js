function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            document.getElementById("location").innerText = `Lat: ${latitude}, Lng: ${longitude}`;
            
            // Send to server
            await fetch('/gps/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude })
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
