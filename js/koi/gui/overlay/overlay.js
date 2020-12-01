/**
 * The overlay GUI
 * @param {HTMLDivElement} element The root element for the GUI
 * @constructor
 */
const Overlay = function(element) {
    this.element = element;
    this.pointerPosition = null;
    this.pointerElement = null;
};

Overlay.prototype.CLASS_POINTER = "pointer";

/**
 * Render the overlay GUI
 */
Overlay.prototype.render = function() {
    if (this.pointerPosition) {
        this.pointerElement.style.left = this.pointerPosition.x.toString() + "px";
        this.pointerElement.style.top = this.pointerPosition.y.toString() + "px";
    }
};

/**
 * A pointer to indicate where the player should do something
 */
Overlay.prototype.createPointerElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_POINTER;

    return element;
};

/**
 * Create a pointer
 * @returns {Vector2} The pointer position which can be changed
 */
Overlay.prototype.createPointer = function() {
    this.pointerPosition = new Vector2();
    this.pointerElement = this.createPointerElement();

    this.element.appendChild(this.pointerElement);

    return this.pointerPosition;
};

/**
 * Delete the pointer with a given position vector
 */
Overlay.prototype.deletePointer = function() {
    this.element.removeChild(this.pointerElement);

    this.pointerPosition = null;
    this.pointerElement = null;
};

/**
 * Set the overlay message
 * @param {String} message The message, or null if no message should be shown
 */
Overlay.prototype.setMessage = function(message) {
    console.log(message);
};