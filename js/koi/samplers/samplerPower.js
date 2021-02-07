/**
 * A power sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} power The power for value interpolation
 * @constructor
 */
const SamplerPower = function(min, max, power) {
    Sampler.call(this, min, max);

    this.power = power;
};

SamplerPower.prototype = Object.create(Sampler.prototype);

/**
 * Sample this sampler
 * @param {Number} x A value in the range [0, 1]
 * @returns {Number} A number in the range [min, max]
 */
SamplerPower.prototype.sample = function(x) {
    return this.min + this.getDomain() * Math.pow(x, this.power);
};