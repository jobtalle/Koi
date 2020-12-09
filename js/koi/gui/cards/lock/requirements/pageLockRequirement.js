/**
 * A requirement for a page to unlock
 * @constructor
 */
const PageLockRequirement = function() {

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