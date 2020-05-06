const renderer = new Renderer(document.getElementById("renderer"));
const random = new Random();

const resize = () => {
    const canvas = document.getElementById("renderer");
    const wrapper = document.getElementById("wrapper");

    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    // TODO: Resize koi constellation
    renderer.resize(canvas.width, canvas.height);
};

window.onresize = resize;

resize();

const koi = new Koi(renderer, random);
const loop = () => {
    koi.render();

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);