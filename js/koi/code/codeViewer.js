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
CodeViewer.prototype.DEFAULT_NAME = "koi.png";
CodeViewer.prototype.LANG_DOWNLOAD = "DOWNLOAD";
CodeViewer.prototype.LANG_COPY = "COPY";

/**
 * Create the copy button
 * @param {HTMLCanvasElement} image The fish code image
 * @returns {HTMLButtonElement} The copy button
 */
CodeViewer.prototype.createButtonCopy = function(image) {
    const button = document.createElement("button");

    button.appendChild(document.createTextNode(language.get(this.LANG_COPY)));
    button.onclick = () => {
        image.toBlob(blob => this.storage.imageToClipboard(blob));

        this.hide();
    };

    return button;
};

/**
 * Create the download button
 * @param {HTMLCanvasElement} image The fish code image
 * @returns {HTMLButtonElement} The download button
 */
CodeViewer.prototype.createButtonDownload = function(image) {
    const button = document.createElement("button");

    button.appendChild(document.createTextNode(language.get(this.LANG_DOWNLOAD)));
    button.onclick = () => {
        image.toBlob(blob => this.storage.imageToFile(blob, this.DEFAULT_NAME));

        this.hide();
    };

    return button;
}

/**
 * Create a view
 * @param {HTMLCanvasElement} image The fish code image
 * @returns {HTMLDivElement} The view element
 */
CodeViewer.prototype.createView = function(image) {
    const element = document.createElement("div");

    element.className = this.CLASS_VIEW;
    element.appendChild(image);
    element.appendChild(this.createButtonDownload(image));

    if (this.storage.hasClipboard)
        element.appendChild(this.createButtonCopy(image));

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
 */
CodeViewer.prototype.view = function(image) {
    if (this.current)
        this.element.removeChild(this.current);

    this.element.appendChild(this.current = this.createView(image));
    this.element.classList.add(this.CLASS_ACTIVE);
};
