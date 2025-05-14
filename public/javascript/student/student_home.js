// Highlight the current sidebar item
document.querySelectorAll('.sidebar ul li a').forEach(link => {
    if (link.href === window.location.href) {
        link.style.color = '#004080';
        link.style.fontWeight = 'bold';
    }
});
