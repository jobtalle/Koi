/**
 * A lock for a card page
 * @constructor
 */
const CardPageLock = function() {
    this.element = this.createElement();
    this.locked = true;
};

CardPageLock.prototype.CLASS = "page-lock";

/**
 * Unlock this lock
 */
CardPageLock.prototype.unlock = function() {
    this.locked = false;
};

/**
 * Create the page lock element
 * @returns {HTMLDivElement} The element
 */
CardPageLock.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;

    return element;
};