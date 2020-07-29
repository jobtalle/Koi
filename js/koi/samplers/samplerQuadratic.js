/**
 * A quadratic sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} power The power for value interpolation
 * @constructor
 */
const SamplerQuadratic = function(min, max, power) {
    this.power = power;

    Sampler.call(this, min, max);
};

SamplerQuadratic.prototype = Object.create(Sampler.prototype);

/**
 * Sample this sampler
 * @param {Number} x A value in the range [0, 1]
 * @returns {Number} A number in the range [min, max]
 */
SamplerQuadratic.prototype.sample = function(x) {
    return this.min + (this.max - this.min) * Math.pow(x, this.power);
};