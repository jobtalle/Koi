/**
 * A requirement to have a given number of cards in the book
 * @param {Number} count The number of fish required to complete this requirement
 * @constructor
 */
const PageLockRequirementCount = function(count) {
    this.count = count;

    PageLockRequirement.call(this);
};

PageLockRequirementCount.prototype = Object.create(PageLockRequirement.prototype);
PageLockRequirementCount.prototype.SYMBOL_MULTIPLY = "✕";

/**
 * Create the icon for this requirement
 * @returns {FishIcon} A fish icon
 */
PageLockRequirementCount.prototype.createIcon = function() {
    return new FishIcon([
        new FishIconLayerOutline()
    ]);
};

/**
 * Create a text element for this requirement
 * @returns {HTMLParagraphElement} The text element, or null if no text is needed
 */
PageLockRequirementCount.prototype.createText = function() {
    const element = document.createElement("p");

    element.appendChild(document.createTextNode(this.SYMBOL_MULTIPLY + " " + this.count.toString()));

    return element;
};

/**
 * Validate whether this requirement is satisfied
 * @param {FishBody[]} bodies All fish bodies in the book
 */
PageLockRequirementCount.prototype.validate = function(bodies) {
    return bodies.length >= this.count;
};