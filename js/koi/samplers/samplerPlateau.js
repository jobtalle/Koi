/**
 * A plateau shaped sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Number} width The plateau width factor, in the range [0, infinite>
 * @constructor
 */
const SamplerPlateau = function(min, max, width) {
    this.min = min;
    this.max = max;
    this.width = width;
};

/**
 * Sampler this sample
 * @param {Number} x A value in the range [0, 1]
 * @returns {Number} A number in the range [min, max]
 */
SamplerPlateau.prototype.sample = function(x) {
    const at = x - .5;
    const multiplier = Math.pow(1 - Math.sin(Math.PI * x), this.width);

    return this.min + (this.max - this.min) * (4 * at * at * at * multiplier + .5);
};