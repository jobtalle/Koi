const renderer = new Renderer(document.getElementById("renderer"));
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