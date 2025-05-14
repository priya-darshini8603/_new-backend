document.addEventListener("DOMContentLoaded", function () {
    // Ensure profile image is loaded
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        document.getElementById("profilePhoto").src = savedImage;
    }

    // Load and show stored toast messages
    const message = sessionStorage.getItem("toastMessage");
    const type = sessionStorage.getItem("toastType");

    if (message && type) {
        setTimeout(() => showToast(message, type), 100);
        sessionStorage.removeItem("toastMessage");
        sessionStorage.removeItem("toastType");
    }
});

// Function to edit fields
function editSection(button, editableFields) {
    editableFields.forEach((id) => {
        const span = document.getElementById(id);
        if (!span) return;

        const input = document.createElement("input");
        input.id = id;
        input.classList.add("edit-input");
        input.required = true;

        // Set input values and types
        if (id.includes("dob") || id.includes("joinedDate")) {
            input.type = "date";
            // Convert DD-MM-YYYY to YYYY-MM-DD for input
            const dateParts = span.innerText.split("-");
            if (dateParts.length === 3) {
                input.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
        } else if (id.includes("experience")) {
            input.type = "number";
            input.min = "0";
            input.step = "1";
            input.value = span.innerText;
        } else {
            input.type = "text";
            input.value = span.innerText;
        }

        span.replaceWith(input);
    });

    button.innerText = "Save 💾";
    button.onclick = () => saveSection(button, editableFields);
}

// Function to save edited fields
function saveSection(button, editableFields) {
    let valid = true;

    editableFields.forEach((id) => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            valid = false;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }

        // Validate and format date to DD-MM-YYYY
        if (input.type === "date" && input.value) {
            const date = new Date(input.value);
            if (isNaN(date)) {
                valid = false;
                alert(`Please enter a valid date for ${id}`);
            } else {
                input.dataset.formattedDate =
                    `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
            }
        }

        // Validate experience as a positive integer
        if (id.includes("experience") && (isNaN(input.value) || input.value < 0)) {
            valid = false;
            alert("Years of Experience must be a valid positive number.");
        }
    });

    if (!valid) {
        alert("Please fill out all fields correctly before saving.");
        return;
    }

    editableFields.forEach((id) => {
        const input = document.getElementById(id);
        const span = document.createElement("span");
        span.id = id;

        // Use formatted date or input value
        if (input.type === "date" && input.dataset.formattedDate) {
            span.innerText = input.dataset.formattedDate;
        } else {
            span.innerText = input.value;
        }

        input.replaceWith(span);
    });

    button.innerText = "Edit ✎";
    button.onclick = () => editSection(button, editableFields);

    showToast("Profile updated successfully!", "success");
}

// Helper function to display a toast message
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


// Function to change profile image
document.getElementById("fileInput").addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageUrl = e.target.result;

            // Update profile image instantly
            document.getElementById("profilePhoto").src = imageUrl;

            // Save image URL to localStorage
            localStorage.setItem("profileImage", imageUrl);

            setTimeout(() => showToast("Profile image updated successfully!", "success"), 100);
        };

        reader.readAsDataURL(file);
    } else {
        setTimeout(() => showToast("Failed to upload image.", "error"), 100);
    }
});

// Function to show toast notifications
function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");

    // Ensure toast container exists
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const icons = {
        success: "✅",
        error: "⚠️",
    };

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">✖</button>
  `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// Handle Sidebar Toggle
const toggle = document.querySelector(".toggle");
const navigation = document.querySelector(".navigation");
const main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};

// Handle Navigation Highlighting
const list = document.querySelectorAll(".navigation li");

function activeLink() {
    list.forEach((item) => item.classList.remove("hovered"));
    this.classList.add("hovered");
}
list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Handle Avatar Click to Toggle Collapse Menu
const avatar = document.getElementById("avatar");
const collapseMenu = document.getElementById("collapseMenu");

avatar.addEventListener("click", () => {
    collapseMenu.classList.toggle("active");
});

// Close collapse menu when clicking outside
document.addEventListener("click", (event) => {
    if (!avatar.contains(event.target) && !collapseMenu.contains(event.target)) {
        collapseMenu.classList.remove("active");
    }
});
