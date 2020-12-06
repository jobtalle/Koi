/**
 * The overlay GUI
 * @param {HTMLDivElement} element The root element for the GUI
 * @constructor
 */
const Overlay = function(element) {
    this.element = element;
    this.pointerPosition = null;
    this.pointerElement = null;
    this.arrowElement = null;
    this.arrowParent = null;
    this.textElement = null;
};

Overlay.prototype.CLASS_POINTER = "pointer";
Overlay.prototype.CLASS_ARROW = "overlay-arrow";
Overlay.prototype.CLASS_ARROW_DOWN = "down";
Overlay.prototype.CLASS_TEXT = "text";
Overlay.prototype.POINTER_RADIUS =
    StyleUtils.getInt("--overlay-pointer-radius") +
    StyleUtils.getInt("--overlay-pointer-border");

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
 * Create a pointer element to indicate where the player should do something
 * @returns {HTMLDivElement} The element
 */
Overlay.prototype.createPointerElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_POINTER;

    return element;
};

/**
 * Create an arrow element pointing at a GUI element
 * @param {String} direction A valid arrow direction class
 * @returns {HTMLDivElement} The element
 */
Overlay.prototype.createArrowElement = function(direction) {
    const element = document.createElement("div");

    element.className = this.CLASS_ARROW;
    element.classList.add(direction);

    return element;
};

/**
 * Create a text element
 * @param {String} text The text to display
 * @returns {HTMLDivElement} The element
 */
Overlay.prototype.createTextElement = function(text) {
    const element = document.createElement("div");
    const paragraph = document.createElement("p");

    paragraph.appendChild(document.createTextNode(text));

    element.className = this.CLASS_TEXT;
    element.appendChild(paragraph);

    return element;
};

/**
 * Create a pointer
 * @returns {Vector2} The pointer position which can be changed
 */
Overlay.prototype.createPointer = function() {
    this.deletePointer();

    this.pointerPosition = new Vector2(-this.POINTER_RADIUS, -this.POINTER_RADIUS);
    this.pointerElement = this.createPointerElement();

    this.element.appendChild(this.pointerElement);

    return this.pointerPosition;
};

/**
 * Delete the pointer
 */
Overlay.prototype.deletePointer = function() {
    if (this.pointerPosition) {
        this.element.removeChild(this.pointerElement);

        this.pointerPosition = null;
        this.pointerElement = null;
    }
};

/**
 * Create an arrow
 * @param {HTMLElement} parent The parent element
 * @param {String} direction A valid arrow direction class
 */
Overlay.prototype.createArrow = function(parent, direction) {
    this.deleteArrow();

    this.arrowElement = this.createArrowElement(direction);
    this.arrowParent = parent;

    parent.appendChild(this.arrowElement);
};

/**
 * Delete the arrow
 */
Overlay.prototype.deleteArrow = function() {
    if (this.arrowElement) {
        this.arrowParent.removeChild(this.arrowElement);

        this.arrowElement = null;
    }
};

/**
 * Set the overlay message
 * @param {String} message The message, or null if no message should be shown
 */
Overlay.prototype.setText = function(message) {
    this.removeText();

    this.textElement = this.createTextElement(message);

    this.element.appendChild(this.textElement);
};

/**
 * Remove any currently visible text
 */
Overlay.prototype.removeText = function() {
    if (this.textElement) {
        this.element.removeChild(this.textElement);
        this.textElement = null;
    }
};