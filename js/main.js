const renderer = new Renderer(document.getElementById("renderer"));
const random = new Random();
const koi = new Koi(renderer, random);

const resize = () => {
    const canvas = document.getElementById("renderer");
    const wrapper = document.getElementById("wrapper");

    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    renderer.resize(canvas.width, canvas.height);
};

window.onresize = resize;

resize();

setInterval(() => koi.update(), Math.round(Koi.prototype.UPDATE_RATE * 1000));

const loop = () => {
    koi.render();

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);