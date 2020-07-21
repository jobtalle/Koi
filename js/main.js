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
    const sessionData = window["localStorage"].getItem("session");
    const systems = new Systems(gl, new Random(session.environmentSeed), wrapper.clientWidth, wrapper.clientHeight);
    let lastDate = null;
    let koi = null;
    let loaded = true;

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    window.onresize = () => {
        if (canvas.width === wrapper.offsetWidth && canvas.height === wrapper.offsetHeight)
            return;

        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        systems.resize(canvas.width, canvas.height);

        if (koi)
            koi.resize();
    };

    /**
     * Save the game state to local storage
     */
    const save = () => {
        window["localStorage"].setItem("session", session.serialize(koi).toString());

        // const serialized = session.serialize(koi);
        //
        // for (let i = 0; i < serialized.bytes.length; ++i)
        //     if (Math.random() < .4)
        //         serialized.bytes[i] = Math.floor(Math.random() * 256);
        //
        // window["localStorage"].setItem("session", serialized.toString());
    };

    /**
     * A function that creates a default game when serialization failed
     */
    const onDeserializationError = () => {
        session = new Session();
        koi = session.makeKoi(systems);
    };

    // Retrieve last session if it exists
    if (sessionData) {
        try {
            session.deserialize(new BinBuffer(sessionData));
            koi = session.makeKoi(systems);
        }
        catch(error) {
            onDeserializationError();
        }
    }

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

    // TODO: Debug save
    save();

    // Autosave
    setInterval(() => {
        if (!document["hidden"])
            save();
    }, 60000);

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
        save();

        koi.free();
        systems.free();
        loaded = false;
    };
}