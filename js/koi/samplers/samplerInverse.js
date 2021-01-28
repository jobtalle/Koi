/**
 * An inverse sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} multiplier The X multiplier, higher makes the graph steeper
 * @constructor
 */
const SamplerInverse = function(min, max, multiplier) {
    Sampler.call(this, min, max);

    this.multiplier = multiplier;
    this.amplitude = this.getDomain() * (1 + 1 / multiplier);
};

SamplerInverse.prototype = Object.create(Sampler.prototype);

/**
 * Sample this sample
 * @param {Number} x A value in the range [0, 1]
 * @returns {Number} A number in the range [min, max]
 */
SamplerInverse.prototype.sample = function(x) {
    return this.min + this.amplitude * (1 - 1 / (this.multiplier * x + 1));
};