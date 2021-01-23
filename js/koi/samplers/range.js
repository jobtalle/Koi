/**
 * A range
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @constructor
 */
const Range = function(min, max) {
    this.min = min;
    this.max = max;
};

/**
 * Get the domain between the minimum and maximum values
 * @returns {Number} The domain
 */
Range.prototype.getDomain = function() {
    return this.max - this.min;
};