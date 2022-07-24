const banner = document.getElementById('banner');
const header = document.querySelector("#banner > h1");

let bbox = banner.getBoundingClientRect();
let hbox = header.getBoundingClientRect();

document.addEventListener('scroll', () => {
    bbox = banner.getBoundingClientRect();
    hbox = header.getBoundingClientRect();

    if (((-bbox.y + hbox.height) / bbox.height) < 0.9) {
        header.style.top = (bbox.height - bbox.y - hbox.height) / 2 + 'px';
    }
});