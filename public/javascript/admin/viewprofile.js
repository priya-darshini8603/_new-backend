document.addEventListener("DOMContentLoaded", function () {
    // Load profile image from localStorage
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        document.getElementById("profilePhoto").src = savedImage;
    }

    // Show toast if exists
    const message = sessionStorage.getItem("toastMessage");
    const type = sessionStorage.getItem("toastType");
    if (message && type) {
        setTimeout(() => showToast(message, type), 100);
        sessionStorage.removeItem("toastMessage");
        sessionStorage.removeItem("toastType");
    }
});

// Edit profile fields
function editSection(button, editableFields) {
    editableFields.forEach((id) => {
        const span = document.getElementById(id);
        if (!span) return;

        const input = document.createElement("input");
        input.id = id;
        input.classList.add("edit-input");
        input.required = true;

        if (id.includes("dob") || id.includes("joinedDate")) {
            input.type = "date";
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

// Save edited fields and submit
function saveSection(button, editableFields) {
    let valid = true;

    editableFields.forEach((id) => {
        const input = document.getElementById(id);
        if (!input || !input.value.trim()) {
            valid = false;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }

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

        if (id.includes("experience") && (isNaN(input.value) || input.value < 0)) {
            valid = false;
            alert("Years of Experience must be a valid positive number.");
        }
    });

    if (!valid) {
        alert("Please fill out all fields correctly before saving.");
        return;
    }

    // Update spans and hidden inputs
    editableFields.forEach((id) => {
        const input = document.getElementById(id);
        const span = document.createElement("span");
        span.id = id;

        const valueToDisplay = input.type === "date" && input.dataset.formattedDate
            ? input.dataset.formattedDate
            : input.value;

        span.innerText = valueToDisplay;
         input.replaceWith(span);

        // Set corresponding hidden input values
        const hiddenInput = document.getElementById(id + "Hidden");
        if (hiddenInput) hiddenInput.value = valueToDisplay;

      
    });

    

    button.innerText = "Edit ✎";
    button.onclick = () => editSection(button, editableFields);

    // Submit the form
    document.getElementById("profileForm").submit();
}
const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");

  if (status === "success") {
   showToast("Profile updated successfully!", "success");
    window.history.replaceState(null, "", window.location.pathname); // clear the URL param
  } else if (status === "error") {
   showToast("Something went wrong!", "error");
    window.history.replaceState(null, "", window.location.pathname);
  }
// Profile image change handler
document.getElementById("fileInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        document.getElementById("saveImageBtn").style.display = "inline-block";
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            document.getElementById("profilePhoto").src =imageUrl;

            document.getElementById("saveImageBtn").style.display = "inline-block";
            document.getElementById("editImageBtn").style.display = "none"; 
           
        };
        reader.readAsDataURL(file);

    } 
    else{
        alert("Failed to load image.");
    }
});

// Toast notification
function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const icons = { success: "✅", error: "⚠️" };
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

// Sidebar toggle
const toggle = document.querySelector(".toggle");
const navigation = document.querySelector(".navigation");
const main = document.querySelector(".main");
if (toggle && navigation && main) {
    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
}

// Navigation hover
const list = document.querySelectorAll(".navigation li");
list.forEach((item) => item.addEventListener("mouseover", function () {
    list.forEach((el) => el.classList.remove("hovered"));
    this.classList.add("hovered");
}));

// Avatar collapse toggle
const avatar = document.getElementById("avatar");
const collapseMenu = document.getElementById("collapseMenu");
if (avatar && collapseMenu) {
    avatar.addEventListener("click", () => {
        collapseMenu.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!avatar.contains(event.target) && !collapseMenu.contains(event.target)) {
            collapseMenu.classList.remove("active");
        }
    });
}