const avatar = document.getElementById('avatar');
const collapseMenu = document.getElementById('collapseMenu');

avatar.addEventListener('click', () => {
    collapseMenu.classList.toggle('active'); // Toggle the active class for collapse
});

document.addEventListener('click', (event) => {
    if (!avatar.contains(event.target) && !collapseMenu.contains(event.target)) {
        collapseMenu.classList.remove('active');
    }
});

const toggle = document.querySelector('.toggle');
const navigation = document.querySelector('.navigation');
const main = document.querySelector('.main');

toggle.onclick = function () {
    navigation.classList.toggle('active');
    main.classList.toggle('active');
};

const list = document.querySelectorAll('.navigation li');

// Function to set active class on click
function setActiveLink() {
    list.forEach(item => item.classList.remove('active')); // Remove active class from all
    this.classList.add('active'); // Add active class to clicked item
}

// Function for hover effect
function hoverEffect() {
    list.forEach(item => item.classList.remove('hovered')); // Remove hovered effect
    this.classList.add('hovered'); // Apply hovered effect
}

// Add event listeners for click and hover
list.forEach(item => {
    item.addEventListener('click', setActiveLink); // Set active link on click
    item.addEventListener('mouseover', hoverEffect); // Apply hover effect
});

// Search function for announcements
function searchAnnouncements() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.announcement');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(input) ? 'block' : 'none';
    });
}
