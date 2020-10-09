/**
 * A single sided page with cards
 * @param {Number} width The width of the page in pixels
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @constructor
 */
const CardPage = function(width, direction) {
    this.element = this.createElement(width, direction);
};

CardPage.prototype.CLASS = "page";
CardPage.prototype.CLASS_LEFT = "left";
CardPage.prototype.CLASS_RIGHT = "right";

/**
 * Create a page element
 * @param {Number} width The width of the page in pixels
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @returns {HTMLDivElement} The element
 */
CardPage.prototype.createElement = function(width, direction) {
    const element = document.createElement("div");

    element.className = this.CLASS;
    element.style.width = width + "px";

    if (direction === -1)
        element.classList.add(this.CLASS_LEFT);
    else
        element.classList.add(this.CLASS_RIGHT);

    return element;
};