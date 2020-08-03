/**
 * A property mutator containing common mutation functions
 * @constructor
 */
const Mutator = function() {

};

/**
 * Mutate an unsigned 8 bit integer
 * @param {Number} n The 8 bit integer
 * @param {Sampler} sampler A sample to sample mutation offset from
 * @param {Random} random A randomizer
 * @returns {Number} The mutated integer
 */
Mutator.prototype.mutateUint8 = function(n, sampler, random) {
    const offset = sampler.sample(random.getFloat());

    return Math.min(0xFF, Math.max(0, Math.round(n + offset)));
};