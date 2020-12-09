/**
 * A requirement for a page to unlock
 * @constructor
 */
const PageLockRequirement = function() {
    this.checkBox = this.createCheckBox();
    this.element = this.createElement();
};

PageLockRequirement.prototype.CLASS = "requirement";
PageLockRequirement.prototype.CLASS_CHECK_BOX = "check";

/**
 * Create a check box element
 * @returns {HTMLDivElement} The check box element
 */
PageLockRequirement.prototype.createCheckBox = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_CHECK_BOX;

    return element;
};

/**
 * Create the element representing this requirement
 * @returns {HTMLDivElement} The element
 */
PageLockRequirement.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;
    element.appendChild(this.checkBox);
    element.appendChild(this.createIcon().element);

    return element;
};

/**
 * Create the icon for this requirement
 * @returns {FishIcon} A fish icon
 */
PageLockRequirement.prototype.createIcon = function() {
    return null;
};

/**
 * Validate whether this requirement is satisfied
 * @param {FishBody[]} bodies All fish bodies in the book
 */
PageLockRequirement.prototype.validate = function(bodies) {
    return false;
};