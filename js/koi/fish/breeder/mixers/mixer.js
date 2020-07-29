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
 * @param {Sampler} sampler A numeric mutation offset sampler
 * @param {Random} random A randomizer
 */
Mixer.prototype.mixUint8Average = function(a, b, sampler, random) {
    const offset = sampler.sample(random.getFloat());

    return Math.min(0xFF, Math.max(0, Math.round(.5 * (a + b) + offset)));
};