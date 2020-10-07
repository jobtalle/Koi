/**
 * A single sided page with cards
 * @param {Number} width The width of the page in pixels
 * @param {Number} height The height of the page in pixels
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @constructor
 */
const CardPage = function(width, height, direction) {
    this.element = this.createElement(width, height, direction);
};

CardPage.prototype.CLASS = "page";

/**
 * Create a page element
 * @param {Number} width The width of the page in pixels
 * @param {Number} height The height of the page in pixels
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @returns {HTMLDivElement} The element
 */
CardPage.prototype.createElement = function(width, height, direction) {
    const element = document.createElement("div");

    element.className = this.CLASS;
    element.style.width = width + "px";
    element.style.height = height + "px";

    if (direction === -1)
        element.style.right = "0";
    else
        element.style.left = "0";

    return element;
};