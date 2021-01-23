/**
 * A sigmoid sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} power The power value, which may be increased to make the slope steeper
 * @constructor
 */
const SamplerSigmoid = function(min, max, power) {
    Sampler.call(this, min, max);

    this.power = power;
};

SamplerSigmoid.prototype = Object.create(Sampler.prototype);

/**
 * Sample this sampler
 * @param {Number} x A value in the range [0, 1]
 * @returns {Number} A number in the range [min, max]
 */
SamplerSigmoid.prototype.sample = function(x) {
    if (x < .5)
        return this.min + this.getDomain() * .5 * Math.pow(x + x, this.power);
    else
        return this.min + this.getDomain() * (1 - .5 * Math.pow(2 - x - x, this.power));
};