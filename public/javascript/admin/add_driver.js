// /public/admin/js/add_driver.js
function generateDriverID() {
  const routeInput = document.getElementById("route-number");
  const driverIdInput = document.getElementById("driver-id");

  function createDriverID(routeNumber) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `NMITbus-${routeNumber}-${randomDigits}`;
  }

  // Generate when route number is typed
  routeInput.addEventListener("input", () => {
    const route = routeInput.value.trim();
    if (route) {
      driverIdInput.value = createDriverID(route);
    } else {
      driverIdInput.value = "";
    }
  });
}

window.onload = generateDriverID;
