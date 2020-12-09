/**
 * A requirement for a page to unlock
 * @constructor
 */
const PageLockRequirement = function() {
    this.checkBox = this.createCheckBox();
    this.element = this.createElement();
    this.checked = false;
};

PageLockRequirement.prototype.CLASS = "requirement";
PageLockRequirement.prototype.CLASS_CHECK_BOX = "check";
PageLockRequirement.prototype.CLASS_CHECK_BOX_CHECKED = "checked";

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
    const text = this.createText();

    element.className = this.CLASS;
    element.appendChild(this.checkBox);
    element.appendChild(this.createIcon().element);

    if (text)
        element.appendChild(text);

    return element;
};

/**
 * Mark this requirement as satisfied
 */
PageLockRequirement.prototype.check = function() {
    this.checkBox.classList.add(this.CLASS_CHECK_BOX_CHECKED);
    this.checked = true;
};

/**
 * Create the icon for this requirement
 * @returns {FishIcon} A fish icon
 */
PageLockRequirement.prototype.createIcon = function() {
    return null;
};

/**
 * Create a text element for this requirement
 * @returns {HTMLParagraphElement} The text element, or null if no text is needed
 */
PageLockRequirement.prototype.createText = function() {
    return null;
};

/**
 * Validate whether this requirement is satisfied
 * @param {FishBody[]} bodies All fish bodies in the book
 */
PageLockRequirement.prototype.validate = function(bodies) {
    return false;
};