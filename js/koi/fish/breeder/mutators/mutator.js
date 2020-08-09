/**
 * A property mutator containing common mutation functions
 * @constructor
 */
const Mutator = function() {

};

Mutator.prototype = Object.create(NumericManipulator.prototype);

/**
 * Mutate an unsigned 8 bit integer
 * @param {Number} n The 8 bit integer
 * @param {Sampler} sampler A sample to sample mutation offset from
 * @param {Number} x A random number in the range [0, 1] to use for sampling
 * @returns {Number} The mutated integer
 */
Mutator.prototype.mutateUint8 = function(n, sampler, x) {
    return this.clampUint8(n + sampler.sample(x));
};

/**
 * Mutate a palette sample
 * @param {Palette.Sample} sample The palette sampler
 * @param {Sampler} distance A mutate distance sampler
 * @param {Random} random A randomizer
 */
Mutator.prototype.mutatePalette = function(sample, distance, random) {
    const angle = Math.PI * 2 * random.getFloat();
    const radius = distance.sample(random.getFloat());

    sample.x += Math.round(Math.cos(angle) * radius);
    sample.y += Math.round(Math.sin(angle) * radius);

    sample.tile();
};