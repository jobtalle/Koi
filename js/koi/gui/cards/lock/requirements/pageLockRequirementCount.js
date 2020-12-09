/**
 * A requirement to have a given number of cards in the book
 * @param {Number} count The number of fish required to complete this requirement
 * @constructor
 */
const PageLockRequirementCount = function(count) {
    PageLockRequirement.call(this);

    this.count = count;
};

PageLockRequirementCount.prototype = Object.create(PageLockRequirement.prototype);

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
 * Validate whether this requirement is satisfied
 * @param {FishBody[]} bodies All fish bodies in the book
 */
PageLockRequirementCount.prototype.validate = function(bodies) {
    return bodies.length >= this.count;
};