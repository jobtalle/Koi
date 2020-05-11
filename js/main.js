const canvas = document.getElementById("renderer");
const renderer = new Renderer(canvas);
const random = new Random();
let koi = null;

const resize = () => {
    const canvas = document.getElementById("renderer");
    const wrapper = document.getElementById("wrapper");

    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    renderer.resize(canvas.width, canvas.height);

    if (koi)
        koi.resize();
};

window.onresize = resize;

resize();

koi = new Koi(renderer, random);

const loop = () => {
    koi.render();

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

canvas.addEventListener("mousedown", event => {
    event.preventDefault();

    koi.touchStart(event.clientX, event.clientY);
});

canvas.addEventListener("touchstart", event => {
    event.preventDefault();

    koi.touchStart(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
});

canvas.addEventListener("mousemove", event => {
    koi.touchMove(event.clientX, event.clientY);
});

canvas.addEventListener("touchmove", event => {
    event.preventDefault();

    koi.touchMove(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
})

canvas.addEventListener("mouseup", () => {
    koi.touchEnd();
});

canvas.addEventListener("touchend", event => {
    event.preventDefault();

    koi.touchEnd();
});