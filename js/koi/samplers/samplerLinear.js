/**
 * A linear sampler
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @constructor
 */
const SamplerLinear = function(min, max) {
    Sampler.call(this, min, max);
};

SamplerLinear.prototype = Object.create(Sampler.prototype);