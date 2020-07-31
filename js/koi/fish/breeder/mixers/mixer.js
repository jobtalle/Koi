/**
 * A property mixer containing common mixing functions
 * @constructor
 */
const Mixer = function() {

};

/**
 * Mix two values by averaging
 * @param {Number} a The first value
 * @param {Number} b The second value
 * @param {Sampler} samplerMutate A numeric mutation offset sampler
 * @param {Random} random A randomizer
 */
Mixer.prototype.mixUint8Average = function(
    a,
    b,
    samplerMutate,
    random) {
    const offset = samplerMutate.sample(random.getFloat());

    return Math.min(0xFF, Math.max(0, Math.round(.5 * (a + b) + offset)));
};

/**
 * Choose a point between two values based on a sampler, where the sampler starts at the lowest of the given values
 * @param {Number} a The first value
 * @param {Number} b The second value
 * @param {Sampler} samplerBlend A numeric blend sampler
 * @param {Sampler} samplerMutate A numeric mutation offset sampler
 * @param {Random} random A randomizer
 */
Mixer.prototype.mixUint8Blend = function(
    a,
    b,
    samplerBlend,
    samplerMutate,
    random) {
    const offset = samplerMutate.sample(random.getFloat());
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    const sampled = low + (high - low) * samplerBlend.sample(random.getFloat());

    return Math.min(0xFF, Math.max(0, Math.round(sampled + offset)));
};