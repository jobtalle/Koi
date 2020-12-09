/**
 * A lock for a card page
 * @param {PageLockRequirement[]} requirements The requirements to unlock this lock
 * @constructor
 */
const PageLock = function(requirements) {
    this.requirements = requirements;
    this.element = this.createElement();
    this.locked = true;
};

PageLock.prototype.CLASS = "page-lock";

/**
 * Unlock this lock
 */
PageLock.prototype.unlock = function() {
    this.locked = false;
    this.element.parentElement.removeChild(this.element);
};

/**
 * Create the page lock element
 * @returns {HTMLDivElement} The element
 */
PageLock.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;

    return element;
};