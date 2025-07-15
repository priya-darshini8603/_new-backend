// Profile dropdown toggle
document.getElementById('profileToggle').addEventListener('click', function () {
  const menu = document.getElementById('dropdownMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Notification bell toggle
document.getElementById('bellToggle').addEventListener('click', function (e) {
  e.stopPropagation();
  const notif = document.getElementById('notificationMenu');
  notif.style.display = notif.style.display === 'block' ? 'none' : 'block';
});

// Close both dropdowns when clicking outside
window.addEventListener('click', function (e) {
  const profile = document.getElementById('profileToggle');
  const menu = document.getElementById('dropdownMenu');
  const bell = document.getElementById('bellToggle');
  const notif = document.getElementById('notificationMenu');

  if (!profile.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }

  if (!bell.contains(e.target) && !notif.contains(e.target)) {
    notif.style.display = 'none';
  }
});
