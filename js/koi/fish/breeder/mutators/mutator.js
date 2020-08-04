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
    return this.asUint8(n + sampler.sample(x));
};