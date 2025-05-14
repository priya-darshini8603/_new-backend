// Toggle the notification panel visibility
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
}

// Open notification details and remove from the dropdown
function openDetails(title, description) {
    document.getElementById('notifTitle').textContent = title;
    document.getElementById('notifDescription').textContent = description;
    document.getElementById('notificationDetails').style.display = 'block';

    // Find and remove the corresponding notification
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notif => {
        if (notif.querySelector('strong').textContent === title) {
            notif.remove();
        }
    });

    decrementNotificationCount();
}

// Decrement the notification count
function decrementNotificationCount() {
    const badge = document.getElementById('notifCount');
    let count = parseInt(badge.textContent, 10) || 0;

    if (count > 0) {
        count--;
        badge.textContent = count;
        document.getElementById('notifHeader').textContent = `You have ${count} notifications`;

        if (count === 0) {
            badge.style.display = 'none';
        }
    }
}

// Show the full notification page and clear the dropdown
function showNotificationPageAndClear() {
    document.getElementById('notificationPanel').style.display = 'none';
    document.getElementById('notificationPage').style.display = 'block';

    // Clear all notifications
    clearNotifications();
}

// Clear all notifications from the dropdown and reset count
function clearNotifications() {
    const notifContainer = document.querySelectorAll('.notification');
    notifContainer.forEach(el => el.remove());

    const badge = document.getElementById('notifCount');
    const notifHeader = document.getElementById('notifHeader');

    badge.textContent = "0";
    badge.style.display = 'none';
    notifHeader.textContent = 'You have 0 notifications';
}


// Close the notification detail popup
function closeNotification() {
    document.getElementById('notificationDetails').style.display = 'none';
}
function closePanel() {
    document.getElementById('notificationPanel').style.display = 'none';
}

// Open reply popup
function openReplyPopup(title) {
    document.getElementById('replyTitle').textContent = 'Reply to: ' + title;
    document.getElementById('replyMessage').value = '';
    document.getElementById('replyPopup').style.display = 'block';
}

// Close reply popup
function closeReplyPopup() {
    document.getElementById('replyPopup').style.display = 'none';
}

// Send reply
function sendReply() {
    const message = document.getElementById('replyMessage').value.trim();
    if (!message) {
        showToast('Reply message cannot be empty!', 'error');
        return;
    }
    showToast('Reply sent successfully!', 'success');
    closeReplyPopup();
}

// Show toast notification
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
        info: "ℹ️"
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

// Search notifications
function searchNotifications() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card, .notification');

    cards.forEach(card => {
        const content = card.textContent.toLowerCase();
        card.style.display = content.includes(query) ? '' : 'none';
    });
}
window.onload = () => {
    document.getElementById('notificationPage').style.display = 'block';

    // Reset notification count and badge
    resetNotifications();
};

function resetNotifications() {
    // Set notification count to 0
    document.getElementById('notifCount').textContent = '0';
    document.getElementById('notifHeader').textContent = 'You have 0 notifications';

    // Hide badge when count is 0
    document.getElementById('notifCount').style.display = 'none';

    // Clear notifications from the dropdown
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => notification.remove());
}

