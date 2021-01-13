/**
 * The fish code viewer
 * @param {HTMLElement} element The element
 * @constructor
 */
const CodeViewer = function(element) {
    this.element = element;
    this.current = null;

    element.addEventListener("mousedown", this.hide.bind(this));
};

CodeViewer.prototype.CLASS_VIEW = "view";
CodeViewer.prototype.CLASS_ACTIVE = "active";

/**
 * Create a view
 * @param {HTMLCanvasElement} image The fish code image
 * @returns {HTMLDivElement} The view element
 */
CodeViewer.prototype.createView = function(image) {
    const element = document.createElement("div");

    element.className = this.CLASS_VIEW;
    element.appendChild(image);

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
