/**
 * Vertical bug hover behavior
 * @param {Number} target The target height
 * @constructor
 */
const BugHover = function(target) {
    this.target = target;
    this.z = target;
};

/**
 * Update the hover state
 * @returns {Number} The new Z position
 */
BugHover.prototype.update = function() {
    return this.z;
};