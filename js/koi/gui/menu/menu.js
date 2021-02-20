/**
 * The menu
 * @param {HTMLElement} element The menu element
 * @param {LoaderFullscreen} fullscreen The fullscreen object
 * @param {AudioEngine} audioEngine The audio engine
 * @param {AudioBank} audio Game audio
 * @constructor
 */
const Menu = function(element, fullscreen, audioEngine, audio) {
    this.element = element;
    this.element.onclick = this.hide.bind(this);
    this.element.appendChild(this.createBox(fullscreen, audioEngine, audio));
};

Menu.prototype.ID_BOX = "menu-box";
Menu.prototype.CLASS_VISIBLE = "visible";
Menu.prototype.LANG_TITLE = "MENU";
Menu.prototype.LANG_VOLUME = "VOLUME";
Menu.prototype.LANG_FULLSCREEN = "TOGGLE_FULLSCREEN";
Menu.prototype.LANG_EXIT = "BACK";
Menu.prototype.KEY_VOLUME = "volume";

/**
 * Create the menu box
 * @param {LoaderFullscreen} fullscreen The fullscreen object
 * @param {AudioEngine} audioEngine The audio engine
 * @param {AudioBank} audio Game audio
 * @returns {HTMLDivElement} The menu box
 */
Menu.prototype.createBox = function(fullscreen, audioEngine, audio) {
    const element = document.createElement("div");

    element.id = this.ID_BOX;
    element.onclick = event => event.stopPropagation();

    element.appendChild(this.createTitle());
    element.appendChild(this.createVolumeSlider(audioEngine));
    element.appendChild(this.createButtonFullscreen(fullscreen, audio));
    element.appendChild(this.createButtonExit(audio));

    return element;
};

/**
 * Create the title element
 * @returns {HTMLHeadingElement} The title element
 */
Menu.prototype.createTitle = function() {
    const element = document.createElement("h1");

    element.appendChild(document.createTextNode(language.get(this.LANG_TITLE)));

    return element;
};

/**
 * Create the volume slider
 * @param {AudioEngine} audioEngine The audio engine
 */
Menu.prototype.createVolumeSlider = function(audioEngine) {
    const label = document.createElement("label");
    const element = document.createElement("input");

    element.type = "range";
    element.min = ".01";
    element.max = "1";
    element.step = ".01";

    if (window["localStorage"].getItem(this.KEY_VOLUME)) {
        element.value = window["localStorage"].getItem(this.KEY_VOLUME);

        audioEngine.setMasterVolume(element.valueAsNumber);
    }
    else
        element.value = "1";

    element.oninput = () => {
        window["localStorage"].setItem(this.KEY_VOLUME, element.value);

        audioEngine.setMasterVolume(element.valueAsNumber);
    };

    label.appendChild(document.createTextNode(language.get(this.LANG_VOLUME)));
    label.appendChild(element);

    return label;
};

/**
 * Create the fullscreen toggle button
 * @param {LoaderFullscreen} fullscreen The fullscreen object
 * @param {AudioBank} audio Game audio
 * @returns {HTMLButtonElement} The fullscreen toggle button
 */
Menu.prototype.createButtonFullscreen = function(fullscreen, audio) {
    const element = document.createElement("button");

    element.appendChild(document.createTextNode(language.get(this.LANG_FULLSCREEN)));
    element.onclick = () => {
        fullscreen.toggle();

        audio.effectClick.play();
    };

    return element;
};

/**
 * Create the exit button
 * @returns {HTMLButtonElement} The button element
 * @param {AudioBank} audio Game audio
 */
Menu.prototype.createButtonExit = function(audio) {
    const element = document.createElement("button");

    element.appendChild(document.createTextNode(language.get(this.LANG_EXIT)));
    element.onclick = () => {
        this.hide();

        audio.effectClick.play();
    };

    return element;
};

/**
 * Show the menu
 */
Menu.prototype.show = function() {
    this.element.classList.add(this.CLASS_VISIBLE);
};

/**
 * Hide the menu
 */
Menu.prototype.hide = function() {
    this.element.classList.remove(this.CLASS_VISIBLE);
};

/**
 * Toggle the menu
 */
Menu.prototype.toggle = function() {
    if (this.element.classList.contains(this.CLASS_VISIBLE))
        this.hide();
    else
        this.show();
};