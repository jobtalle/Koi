const glParameters = {
    alpha: false,
    antialias: true,
    preserveDrawingBuffer: true
};
const canvas = document.getElementById("renderer");
const gl =
    canvas.getContext("webgl", glParameters) ||
    canvas.getContext("experimental-webgl", glParameters);

if (gl) {
    // Enable VAO
    gl.vao = gl.getExtension("OES_vertex_array_object");

    // Enable 32 bit element indices
    gl.getExtension("OES_element_index_uint");

    let session = new Session();
    const wrapper = document.getElementById("wrapper");
    const gui = new GUI(document.getElementById("gui"));
    const sessionData = window["localStorage"].getItem("session");
    const systems = new Systems(gl, new Random(session.environmentSeed), wrapper.clientWidth, wrapper.clientHeight);
    const audioEngine = new AudioEngine(new Random());
    const audio = new AudioBank(audioEngine);
    let lastDate = null;
    let koi = null;
    let loaded = true;
    let mouseLeft = false;

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    window.onresize = () => {
        if (canvas.width === wrapper.offsetWidth && canvas.height === wrapper.offsetHeight)
            return;

        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        systems.resize(canvas.width, canvas.height);
        gui.resize();

        if (koi)
            koi.resize();
    };

    /**
     * Save the game state to local storage
     */
    const save = () => {
        window["localStorage"].setItem("session", session.serialize(koi, gui).toString());
    };

    /**
     * A function that creates a new game session
     */
    const newSession = () => {
        session = new Session();

        koi = session.makeKoi(systems, audio, gui);
    };

    // Retrieve last session if it exists
    if (sessionData) {
        try {
            // throw new Error();
            session.deserialize(new BinBuffer(sessionData));

            koi = session.makeKoi(systems, audio, gui);
        }
        catch (error) {
            gui.clear();

            newSession();

            console.warn(error);
        }
    }
    else
        newSession();

    // Trigger the animation frame loop
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

    // Auto save
    setInterval(() => {
        if (!document["hidden"])
            save();
    }, 60000);

    canvas.addEventListener("mousedown", event => {
        audioEngine.interact(); // TODO: Use earlier trigger, see #47

        event.preventDefault();

        koi.touchStart(event.clientX, event.clientY);
    });

    canvas.addEventListener("touchstart", event => {
        audioEngine.interact(); // TODO: Use earlier trigger, see #47

        event.preventDefault();

        koi.touchStart(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    });

    canvas.addEventListener("mousemove", event => {
        koi.touchMove(event.clientX, event.clientY, mouseLeft);

        mouseLeft = false;
    });

    canvas.addEventListener("touchmove", event => {
        event.preventDefault();

        koi.touchMove(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    })

    canvas.addEventListener("mouseup", koi.touchEnd.bind(koi));

    canvas.addEventListener("touchend", event => {
        event.preventDefault();

        koi.touchEnd();
    });

    canvas.addEventListener("mouseleave", () => {
        mouseLeft = true;
    });

    window.onbeforeunload = () => {
        save();

        koi.free();
        systems.free();
        loaded = false;
    };
}