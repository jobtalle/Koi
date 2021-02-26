const searchParams = new URLSearchParams(window.location.search);
const glParameters = {
    alpha: false,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true
};
const loader = new Loader(
    document.getElementById("loader"),
    document.getElementById("loader-graphics"),
    document.getElementById("loader-button-start"),
    document.getElementById("loader-button-new"),
    document.getElementById("loader-button-settings"),
    document.getElementById("wrapper"));
const canvas = document.getElementById("renderer");
const gl =
    canvas.getContext("webgl", glParameters) ||
    canvas.getContext("experimental-webgl", glParameters);
let chosenLocale = null;

/**
 * Called when loading resources failed
 */
const onFailure = () => {
    alert("Failed loading resources");
};

/**
 * Make a language object from a locale code
 * @param {String} locale The locale code
 * @returns {Language} The language object most suitable for this locale
 */
const makeLanguage = locale => {
    switch (locale) {
        default:
        case "en":
            chosenLocale = "en";

            return new Language("language/english.json");
        case "nl":
            chosenLocale = "nl";

            return new Language("language/dutch.json");
        case "pl":
            chosenLocale = "pl";

            return new Language("language/polish.json");
    }
};

const paramLang = window["localStorage"].getItem(Menu.prototype.KEY_LANGUAGE) || searchParams.get("lang");
const language = paramLang ? makeLanguage(paramLang) : makeLanguage(navigator.language.substring(0, 2));
let imperial = false;

if (gl &&
    gl.getExtension("OES_element_index_uint") &&
    (gl.vao = gl.getExtension("OES_vertex_array_object"))) {
    const audioEngine = new AudioEngine(new Random());
    const audio = new AudioBank(audioEngine);

    language.load(() => {
        imperial = language.get("UNIT_LENGTH") === "ft";

        let session = new Session();
        const storage = window["require"] ? new StorageFile() : new StorageLocal();
        const tutorial = storage.get("tutorial") !== null;
        const wrapper = document.getElementById("wrapper");
        const gui = new GUI(
            document.getElementById("gui"),
            new CodeViewer(document.getElementById("code"), storage),
            audio);
        const systems = new Systems(gl, new Random(2893), wrapper.clientWidth, wrapper.clientHeight);
        const sessionBuffer = tutorial ? storage.getBuffer("session") : null;
        const menu = new Menu(
            document.getElementById("menu"),
            loader.fullscreen,
            chosenLocale,
            audioEngine,
            audio);
        let lastTime = null;
        let koi = null;
        let loaded = true;
        let mouseLeft = false;
        let alt = false;

        new Drop(gui, systems, document.getElementById("drop"), canvas);

        loader.setMenu(menu);

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
            storage.setBuffer("session", session.serialize(koi, gui));
        };

        /**
         * A function that creates a new game session
         */
        const newSession = () => {
            storage.remove("tutorial");

            session = new Session();

            gui.clear();

            if (koi)
                koi.free();

            koi = session.makeKoi(storage, systems, audio, gui, new TutorialBreeding(storage, gui.overlay));
        };

        // Retrieve last session if it exists
        if (sessionBuffer) {
            try {
                session.deserialize(sessionBuffer);

                koi = session.makeKoi(storage, systems, audio, gui, new TutorialCards(storage, gui.overlay));

                loader.setLoadedPrevious();
            } catch (error) {
                newSession();

                console.warn(error);
            }
        }
        else
            newSession();

        // Trigger the animation frame loop
        lastTime = performance.now();

        const loop = time => {
            if (loaded) {
                koi.render(.001 * (time - lastTime));

                lastTime = time;

                requestAnimationFrame(loop);
            }
        };

        canvas.addEventListener("mousedown", event => {
            event.preventDefault();

            koi.touchStart(event.clientX, event.clientY);
        });

        canvas.addEventListener("touchstart", event => {
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

        canvas.addEventListener("mouseup", () => {
            koi.touchEnd();
        });

        canvas.addEventListener("touchend", event => {
            event.preventDefault();

            koi.touchEnd();
        });

        canvas.addEventListener("mouseleave", () => {
            koi.mouseLeave();

            mouseLeft = true;
        });

        window.onkeydown = event => {
            if (event.key === "Alt")
                alt = true;
            else if (event.key === "Enter")
                loader.fullscreen.toggle();
            else if (event.key === "Escape" || event.key === "m")
                menu.toggle();
            else if (koi.keyDown(event.key))
                event.preventDefault();
        };

        window.onkeyup = event => {
            if (event.key === "Alt")
                alt = false;
        };

        window.onbeforeunload = () => {
            gui.cancelAction();
            koi.touchEnd();

            save();

            koi.free();
            systems.free();
            gui.clear();

            loaded = false;
        };

        loader.setFinishCallback(() => {
            requestAnimationFrame(loop);

            audioEngine.interact();
        });

        loader.setNewGameCallback(newSession);
    }, onFailure);

    // Create globally available SVG defs
    new FishIconDefs(
        document.getElementById("fish-icon-defs"),
        new Random(Random.prototype.makeSeed(Koi.prototype.COLOR_BACKGROUND.r)));
    new CodeIconDefs(
        document.getElementById("code-icon-defs"));
}
else
    onFailure();