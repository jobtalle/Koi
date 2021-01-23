/**
 * A range
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @constructor
 */
const Bounds = function(min, max) {
    this.min = min;
    this.max = max;
};

/**
 * Get the domain between the minimum and maximum values
 * @returns {Number} The domain
 */
Bounds.prototype.getDomain = function() {
    return this.max - this.min;
};