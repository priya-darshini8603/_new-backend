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

function activeLink() {
    list.forEach(item => item.classList.remove('hovered'));
    this.classList.add('hovered');
}
list.forEach(item => item.addEventListener('mouseover', activeLink));
