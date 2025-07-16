
window.searchDriver = function () {
    const searchInput = document.getElementById("search").value.toLowerCase();

    const filteredDrivers = drivers.filter(
      (driver) =>
        driver.name?.toLowerCase().includes(searchInput) ||
        driver.busNumber?.toLowerCase().includes(searchInput)
    );

    renderDrivers(filteredDrivers);
  }
