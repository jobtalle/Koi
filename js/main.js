const glParameters = {
    alpha: false,
    antialias: true,
    preserveDrawingBuffer: true
};
const canvas = document.getElementById("renderer");
const gl =
    canvas.getContext("webgl", glParameters) ||
    canvas.getContext("experimental-webgl", glParameters);

// Enable VAO
gl.vao = gl.getExtension("OES_vertex_array_object");

// Enable 32 bit element indices
gl.getExtension("OES_element_index_uint");

const sessionData = localStorage.getItem("session");
const session = new Session();

// Retrieve last session if it exists
if (sessionData) {
    const buffer = new BinBuffer();

    buffer.fromString(sessionData);

    session.deserialize(buffer);
}

const systems = new Systems(gl, new Random(session.environmentSeed), canvas.width, canvas.height);
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

koi = new Koi(systems, session.environmentSeed, session.random);
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
    localStorage.setItem("session", session.serialize().toString());

    koi.free();
    systems.free();
    loaded = false;
};