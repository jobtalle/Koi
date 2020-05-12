const canvas = document.getElementById("renderer");
const gl =
    canvas.getContext("webgl", {alpha: false, antialias: false}) ||
    canvas.getContext("experimental-webgl", {alpha: false, antialias: false});
const systems = new Systems(gl, canvas.width, canvas.height);
const random = new Random();
let lastDate = null;
let koi = null;
let loaded = true;

const resize = () => {
    const wrapper = document.getElementById("wrapper");

    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    systems.resize(canvas.width, canvas.height);

    if (koi)
        koi.resize();
};

window.onresize = resize;

resize();

koi = new Koi(systems, random);
lastDate = new Date();

const loop = () => {
    if (loaded) {
        const date = new Date();

        koi.render(.001 * (date - lastDate));
        lastDate = date;

        requestAnimationFrame(loop);
    }
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

window.onbeforeunload = () => {
    koi.free();
    systems.free();
    loaded = false;
};