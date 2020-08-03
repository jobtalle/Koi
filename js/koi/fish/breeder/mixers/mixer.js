/**
 * A property mixer containing common mixing functions
 * @constructor
 */
const Mixer = function() {

};

/**
 * Choose a point between two values based on a sampler, where the sampler starts at the lowest of the given values
 * @param {Number} a The first value
 * @param {Number} b The second value
 * @param {Sampler} sampler A numeric blend sampler
 * @param {Random} random A randomizer
 */
Mixer.prototype.mixUint8 = function(a, b, sampler, random) {
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    const sampled = low + (high - low) * sampler.sample(random.getFloat());

    return Math.min(0xFF, Math.max(0, Math.round(sampled)));
};