/**
 * A property mixer containing common mixing functions
 * @constructor
 */
const Mixer = function() {

};

Mixer.prototype = Object.create(NumericManipulator.prototype);

/**
 * Choose a point between two values based on a sampler
 * @param {Number} a The first value
 * @param {Number} b The second value
 * @param {Sampler} sampler A numeric blend sampler
 * @param {Number} x The interpolation factor in the range [0, 1]
 */
Mixer.prototype.mixUint8 = function(a, b, sampler, x) {
    return this.clampUint8(a + (b - a) * sampler.sample(x));
};

/**
 * Choose a point between two values based on a sampler, where the sampler starts at the lowest of the given values
 * @param {Number} a The first value
 * @param {Number} b The second value
 * @param {Sampler} sampler A numeric blend sampler
 * @param {Number} x The interpolation factor in the range [0, 1]
 */
Mixer.prototype.mixUint8Ordered = function(a, b, sampler, x) {
    if (a < b)
        return this.clampUint8(a + (b - a) * sampler.sample(x));

    return this.clampUint8(b + (a - b) * sampler.sample(x));
};

/**
 * Mix two palette samples
 * @param {Palette.Sample} a The first palette sample
 * @param {Palette.Sample} b The second palette sample
 * @param {Sampler} sampler A sampler
 * @param {Number} x The interpolation factor in the range [0, 1]
 */
Mixer.prototype.mixPalette = function(a, b, sampler, x) {
    return a.interpolate(b, sampler.sample(x));
};