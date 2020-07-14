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

const sessionData = window["localStorage"].getItem("session");
let session = new Session(); // TODO: Make this const, it's variable for debugging only

// const c = new Compress([]);
// const indices = [301, 301];
// console.log(indices);
// const bytes = c.indicesToBytes(indices, 1000);
// console.log(bytes);
// const back = c.bytesToIndices(bytes);
// console.log(back);

const testData = `
A string to compress to a compressed string, with a number of test symbols!
The string contains several repetitions and repetitions and repetitions.
The repetitions should compress well!
This only works if the string contains enough repetitions though.
It works on a byte per byte level.
A string with many repetitions and repetitive characters compresses best. compressed`;
const testBytes = [];

for (let i = 0; i < testData.length; ++i)
    testBytes.push(testData.charCodeAt(i));

console.log(testBytes);

const compressed = new Compress(testBytes).compress();

console.log(compressed);

const decompressed = new Compress(compressed).decompress();

console.log(decompressed);

let decompressedData = "";

for (let i = 0; i < decompressed.length; ++i)
    decompressedData += String.fromCharCode(decompressed[i]);

console.log(decompressedData);

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

koi = session.makeKoi(systems);
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
    window["localStorage"].setItem("session", session.serialize().toString());

    koi.free();
    systems.free();
    loaded = false;
};