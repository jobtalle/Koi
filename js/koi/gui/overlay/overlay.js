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
    this.skipElement = null;
};

Overlay.prototype.CLASS_HOME = "home-button";
Overlay.prototype.CLASS_POINTER = "pointer";
Overlay.prototype.CLASS_HIGHLIGHT = "overlay-highlight";
Overlay.prototype.CLASS_ARROW = "overlay-arrow";
Overlay.prototype.CLASS_TEXT = "text";
Overlay.prototype.CLASS_SKIP = "skip-button";
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

Overlay.prototype.createHomeElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_HOME;

    return element;
}

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
 * Create a highlight element
 * @returns {HTMLDivElement} The element
 */
Overlay.prototype.createHighlightElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_HIGHLIGHT;

    const pathElement = document.createElement("svg");
    pathElement.setAttribute("viewBox", "0 0 24 24");
    pathElement.setAttribute("width", "24");
    pathElement.setAttribute("height", "24");
    // pathElement.setAttribute("fill", "none");
    pathElement.setAttribute("stroke", "currentColor");

    const path = document.createElement("path");
    // path.setAttribute("stroke-linecap", "round");
    // path.setAttribute("stroke-linejoin", "round");
    // path.setAttribute("stroke-width", "2");
    path.setAttribute("d", "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-4.5 " +
        "14c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm4.5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 " +
        "1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm4.5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z");

    pathElement.appendChild(path);
    element.appendChild(pathElement);

    element.addEventListener("click", function() {
            menu.toggle();
    });

    element.addEventListener("touchstart", function() {
            menu.toggle();
    });

    return element;
};

Overlay.prototype.createSkipElement = function() {
    const element = document.createElement("button");

    element.className = this.CLASS_SKIP;

    element.appendChild(document.createTextNode("Skip"));

    return element;
}

Overlay.prototype.createHome = function() {
    this.homeElement = this.createHomeElement();
    this.element.appendChild(this.homeElement);
}

Overlay.prototype.deleteHome = function() {
    if (this.homeElement) {
        this.element.removeChild(this.homeElement);

        this.homeElement = null;
    }
}

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
 * Create an arrow at a specific location
 * @param {String} direction A valid arrow direction class
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Overlay.prototype.createArrowAt = function(direction, x, y) {
    this.deleteArrow();

    this.arrowElement = this.createArrowElement(direction);
    this.arrowElement.style.left = x.toString() + "px";
    this.arrowElement.style.top = y.toString() + "px";
    this.arrowParent = this.element;

    this.element.appendChild(this.arrowElement);
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

Overlay.prototype.createSkip = function(callback) {
    this.deleteSkip();

    this.skipElement = this.createSkipElement();

    this.skipElement.onclick = () => {
        callback();
    }

    // this.skipElement.addEventListener("click", () => callback);
    // this.skipElement.addEventListener("touchstart", () => callback);

    this.element.appendChild(this.skipElement);
}

Overlay.prototype.deleteSkip = function() {
    if (this.skipElement) {
        this.element.removeChild(this.skipElement);

        this.skipElement = null;
    }
}

Overlay.prototype.clear = function() {
    // this.deleteHome();
    this.deletePointer();
    this.deleteArrow();
    this.removeText();
    this.deleteSkip();
}