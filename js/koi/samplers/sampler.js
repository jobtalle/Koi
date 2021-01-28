/**
 * A numeric sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @constructor
 */
const Sampler = function(min, max) {
    Bounds.call(this, min, max);
};

Sampler.prototype = Object.create(Bounds.prototype);

/**
 * The default linear sample function
 * @param x The X value to sample in the range [0, 1]
 * @returns {Number} The sampled number
 */
Sampler.prototype.sample = function(x) {
    return this.min + this.getDomain() * x;
};