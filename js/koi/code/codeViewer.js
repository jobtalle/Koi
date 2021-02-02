/**
 * The fish code viewer
 * @param {HTMLElement} element The element
 * @param {StorageSystem} storage A storage system
 * @constructor
 */
const CodeViewer = function(element, storage) {
    this.element = element;
    this.storage = storage;
    this.current = null;

    element.addEventListener("mousedown", this.hide.bind(this));
};

CodeViewer.prototype.CLASS_VIEW = "view";
CodeViewer.prototype.CLASS_ACTIVE = "active";
CodeViewer.prototype.CLASS_HELP = "help";
CodeViewer.prototype.CLASS_HELP_TEXT = "help-text";
CodeViewer.prototype.DEFAULT_NAME = "koi.png";
CodeViewer.prototype.LANG_SAVE = "SAVE";
CodeViewer.prototype.LANG_COPY = "COPY";
CodeViewer.prototype.LANG_HELP = "TUTORIAL_CODE";

/**
 * Create the copy button
 * @param {HTMLCanvasElement} image The fish code image
 * @param {AudioBank} audio Game audio
 * @returns {HTMLButtonElement} The copy button
 */
CodeViewer.prototype.createButtonCopy = function(image, audio) {
    const button = document.createElement("button");

    button.appendChild(document.createTextNode(language.get(this.LANG_COPY)));
    button.onclick = () => {
        audio.effectClick.play();

        image.toBlob(blob => this.storage.imageToClipboard(blob));

        this.hide();
    };

    return button;
};

/**
 * Create the download button
 * @param {HTMLCanvasElement} image The fish code image
 * @param {AudioBank} audio Game audio
 * @returns {HTMLButtonElement} The download button
 */
CodeViewer.prototype.createButtonDownload = function(image, audio) {
    const button = document.createElement("button");

    button.appendChild(document.createTextNode(language.get(this.LANG_SAVE)));
    button.onclick = () => {
        audio.effectClick.play();

        image.toBlob(blob => this.storage.imageToFile(blob, this.DEFAULT_NAME));

        this.hide();
    };

    return button;
};

/**
 * Create the help text
 * @returns {HTMLDivElement} The help text element
 */
CodeViewer.prototype.createHelpText = function() {
    const element = document.createElement("div");
    const text = document.createElement("p");

    text.appendChild(document.createTextNode(language.get(this.LANG_HELP)));

    element.className = this.CLASS_HELP_TEXT;
    element.appendChild(text);

    return element;
};

/**
 * Create a help button
 * @param {HTMLDivElement} element The element to add the help message to
 * @param {AudioBank} audio Game audio
 * @returns {HTMLButtonElement} The help button
 */
CodeViewer.prototype.createButtonHelp = function(element, audio) {
    const button = document.createElement("button");
    let pressed = false;

    button.className = this.CLASS_HELP;

    button.appendChild(document.createTextNode("?"));
    button.onclick = () => {
        if (pressed)
            audio.effectNegative.play();
        else {
            audio.effectClick.play();

            element.appendChild(this.createHelpText());

            pressed = true;
        }
    };

    return button;
};

/**
 * Create a view
 * @param {HTMLCanvasElement} image The fish code image
 * @param {AudioBank} audio Game audio
 * @returns {HTMLDivElement} The view element
 */
CodeViewer.prototype.createView = function(image, audio) {
    const element = document.createElement("div");

    element.className = this.CLASS_VIEW;
    element.appendChild(this.createButtonHelp(element, audio));
    element.appendChild(image);
    element.appendChild(this.createButtonDownload(image, audio));

    if (this.storage.hasClipboard)
        element.appendChild(this.createButtonCopy(image, audio));

    element.addEventListener("mousedown", event => event.stopImmediatePropagation());

    return element;
};

/**
 * Hide any active view
 */
CodeViewer.prototype.hide = function() {
    if (this.current)
        this.element.removeChild(this.current);

    this.current = null;
    this.element.classList.remove(this.CLASS_ACTIVE);
};

/**
 * View a code
 * @param {HTMLCanvasElement} image The fish code image
 * @param {Audio} audio Game audio
 */
CodeViewer.prototype.view = function(image, audio) {
    if (this.current)
        this.element.removeChild(this.current);

    this.element.appendChild(this.current = this.createView(image, audio));
    this.element.classList.add(this.CLASS_ACTIVE);
};
