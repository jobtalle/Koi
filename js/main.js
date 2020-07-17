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

    const sessionData = window["localStorage"].getItem("session");
    const session = new Session();

    const save = () => {
        window["localStorage"].setItem("session", session.serialize(koi).toString());

        // const serialized = session.serialize(koi);
        //
        // for (let i = 0; i < serialized.bytes.length; ++i)
        //     if (Math.random() < .0001)
        //         serialized.bytes[i] = Math.floor(Math.random() * 256);
        //
        // window["localStorage"].setItem("session", serialized.toString());
    };

    const onDeserializationError = () => {
        window["localStorage"].removeItem("session");

        location.reload();
    };

    // Retrieve last session if it exists
    if (sessionData) {
        try {
            session.deserialize(new BinBuffer(sessionData));
        }
        catch(error) {
            onDeserializationError();
        }
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

    try {
        koi = session.makeKoi(systems);

        // TODO: Debug warp
        if (!sessionData)
            for (let i = 0; i < 1500; ++i)
                koi.update();
    }
    catch (error) {
        onDeserializationError();
    }

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
    setInterval(save, 60000);

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