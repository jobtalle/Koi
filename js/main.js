const searchParams = new URLSearchParams(window.location.search);
const glParameters = {
    alpha: false,
    antialias: window["localStorage"].getItem(Menu.prototype.KEY_MSAA) === null || window["localStorage"].getItem(Menu.prototype.KEY_MSAA) === "true",
    premultipliedAlpha: true,
    preserveDrawingBuffer: true
};
const canvas = document.getElementById("renderer");
const gl =
    canvas.getContext("webgl", glParameters) ||
    canvas.getContext("experimental-webgl", glParameters);
let chosenLocale = null;
let chosenSlot = -1;

/**
 * Check if game is running within WKWebView on iOS.
 */

const RUNNING_ON_WEBVIEW_IOS = (window.webkit && window.webkit.messageHandlers) ? true : false;

/**
 * Reload the game into the menu
 */
const reloadMenu = () => {
    window.location = window.location.protocol + "//" + window.location.host + window.location.pathname;
};

/**
 * Reload the currently loaded game
 */
const reloadGame = () => {
    if (chosenSlot === -1)
        reloadMenu();
    else
        window.location = window.location.protocol + "//" + window.location.host + window.location.pathname + "?resume=" + chosenSlot.toString();
};

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
        case "en-imperial":
            chosenLocale = "en-imperial";

            return new Language("KoiTranslations/english_imperial.json");
        case "en-metric":
            chosenLocale = "en-metric";

            return new Language("KoiTranslations/english_metric.json");
        case "nl":
            chosenLocale = "nl";

            return new Language("KoiTranslations/dutch.json");
        case "pl":
            chosenLocale = "pl";

            return new Language("KoiTranslations/polish.json");
        case "tr":
            chosenLocale = "tr";

            return new Language("KoiTranslations/turkish.json");
        case "de":
            chosenLocale = "de";

            return new Language("KoiTranslations/german.json");
        case "fr":
            chosenLocale = "fr";

            return new Language("KoiTranslations/french.json");
        case "ja":
            chosenLocale = "ja";

            return new Language("KoiTranslations/japanese.json");
        case "es":
            chosenLocale = "es";

            return new Language("KoiTranslations/spanish.json");
        case "pt":
            chosenLocale = "pt";

            return new Language("KoiTranslations/portuguese.json");
        case "zh":
            chosenLocale = "zh";

            return new Language("KoiTranslations/simplifiedchinese.json");
        case "ko":
            chosenLocale = "ko";

            return new Language("KoiTranslations/korean.json");
        case "ru":
            chosenLocale = "ru";

            return new Language("KoiTranslations/russian.json");
        case "fy":
            chosenLocale = "fy";

            return new Language("KoiTranslations/frisian.json");
        case "uk":
            chosenLocale = "uk";

            return new Language("KoiTranslations/ukrainian.json");
        case "it":
            chosenLocale = "it";

            return new Language("KoiTranslations/italian.json");
        case "fil":
            chosenLocale = "fil";

            return new Language("KoiTranslations/filipino.json");
        case "id":
            chosenLocale = "id";

            return new Language("KoiTranslations/indonesian.json");
    }
};

const paramLang = window["localStorage"].getItem(Menu.prototype.KEY_LANGUAGE) || searchParams.get("lang");
const language = paramLang ? makeLanguage(paramLang) : makeLanguage(navigator.language.substring(0, 2));
const loader = new Loader(
    document.getElementById("loader"),
    document.getElementById("loader-graphics"),
    document.getElementById("loader-slots"),
    document.getElementById("loader-button-settings"),
    document.getElementById("wrapper"),
    !RUNNING_ON_WEBVIEW_IOS,
    !RUNNING_ON_WEBVIEW_IOS);
let imperial = false;

if (gl &&
    gl.getExtension("OES_element_index_uint") &&
    (gl.vao = gl.getExtension("OES_vertex_array_object"))) {
    const audioEngine = new AudioEngine(new Random());
    const audio = new AudioBank(audioEngine);

    language.load(() => {
        imperial = language.get("UNIT_LENGTH") === "ft";

        const settings = {
            flash: true
        };

        let session = new Session();
        let slot = null;
        const slotNames = ["session", "session2", "session3"];
        const storage = window["require"] ? new StorageFile() : new StorageLocal();
        const wrapper = document.getElementById("wrapper");
        const gui = new GUI(
            document.getElementById("gui"),
            new CodeViewer(document.getElementById("code"), storage),
            audio);
        const systems = new Systems(gl, new Random(2893), wrapper.clientWidth, wrapper.clientHeight);
        const menu = new Menu(
            document.getElementById("menu"),
            loader.fullscreen,
            chosenLocale,
            audioEngine,
            settings,
            audio);
        let lastTime = null;
        let koi = null;
        let loaded = true;
        let mouseLeft = false;
        let alt = false;
        let control = false;
        let shift = false;

        new Drop(gui, systems, document.getElementById("drop"), canvas);

        loader.setMenu(menu);

        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;

        window.onresize = () => {
            if (canvas.width === wrapper.clientWidth && canvas.height === wrapper.clientHeight)
                return;

            canvas.width = wrapper.clientWidth;
            canvas.height = wrapper.clientHeight;

            systems.resize(canvas.width, canvas.height);
            gui.resize();

            if (koi)
                koi.resize();
        };

        /**
         * Save the game state to local storage
         */
        const save = () => {
            storage.setBuffer(slot, session.serialize(koi, gui));
        };

        /**
         * A function that creates a new game session
         * @param {number} index Create a new game at a given slot index
         */
        const newSession = index => {
            chosenSlot = index;
            slot = slotNames[index];
            session = new Session();

            gui.clear();

            if (koi)
                koi.free();

            koi = session.makeKoi(storage, systems, audio, gui, save, new TutorialBreeding(storage, gui.overlay));
        };

        /**
         * Continue an existing game
         * @param {number} index Create a new game at a given slot index
         */
        const continueGame = index => {
            chosenSlot = index;
            slot = slotNames[index];

            gui.cards.enableBookButton(audio);

            try {
                session.deserialize(storage.getBuffer(slot));

                koi = session.makeKoi(storage, systems, audio, gui, save);
            } catch (error) {
                newSession(index);

                console.warn(error);
            }
        };

        loader.setResumables([
            storage.getBuffer(slotNames[0]) !== null,
            storage.getBuffer(slotNames[1]) !== null,
            storage.getBuffer(slotNames[2]) !== null
        ]);

        // Trigger the animation frame loop
        lastTime = performance.now();

        const loop = time => {
            if (loaded) {
                koi.render(.001 * (time - lastTime), settings);

                lastTime = time;

                requestAnimationFrame(loop);
            }
        };

        canvas.addEventListener("mousedown", event => {
            event.preventDefault();

            koi.touchStart(event.clientX, event.clientY, control, shift);
        });

        canvas.addEventListener("touchstart", event => {
            event.preventDefault();

            koi.touchStart(event.changedTouches[0].clientX, event.changedTouches[0].clientY, control, shift);
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
            else if (event.key === "Control")
                control = true;
            else if (event.key === "Shift")
                shift = true;
            else if (event.key === "Enter" && alt)
                loader.fullscreen.toggle();
            else if (event.key === "Escape" || event.key === "m")
                menu.toggle();
            else if (koi && koi.keyDown(event.key))
                event.preventDefault();
        };

        window.onkeyup = event => {
            switch (event.key) {
                case "Alt":
                    alt = false;

                    break;
                case "Control":
                    control = false;

                    break;
                case "Shift":
                    shift = false;

                    break;
            }
        };

        window.onbeforeunload = () => {
            gui.cancelAction();
            if (koi) {
                koi.touchEnd();

                save();

                koi.free();
            }

            systems.free();
            gui.clear();

            loaded = false;
        };

        window.addEventListener('appMovedToBackground', () => {
            save();
            menu.show();
        });

        loader.setFinishCallback(() => {
            requestAnimationFrame(loop);

            audioEngine.interact();
        });

        loader.setNewGameCallback(newSession);
        loader.setContinueCallback(continueGame);
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
