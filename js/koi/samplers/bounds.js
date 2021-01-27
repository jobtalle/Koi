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

/**
 * Map a number to the bounds
 * @param {Number} n A number in the range [0, 1]
 * @returns {Number} A number in the range [min, max]
 */
Bounds.prototype.map = function(n) {
    return this.min + this.getDomain() * n;
};