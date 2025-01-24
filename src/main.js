import anime from "animejs";
const img = document.createElement("img");
document.body.append(img);
const imgUrl = new URL('./media/wolf.png', import.meta.url);
img.src = imgUrl.href;

anime({
    targets: 'img',
    rotate: 360,
    duration: 8000,
    loop: true
})