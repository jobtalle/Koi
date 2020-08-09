/**
 * A fish tail mutator that mutates a tail in place
 * @param {Tail} tail The tail
 * @constructor
 */
const MutatorTail = function(tail) {
    this.tail = tail;
};

MutatorTail.prototype = Object.create(Mutator.prototype);
MutatorTail.prototype.SAMPLER_LENGTH = new SamplerPlateau(-20, 0, 20, 0);

/**
 * Mutate the tail
 * @param {Random }random A randomizer
 */
MutatorTail.prototype.mutate = function(random) {
    this.tail.length = this.mutateUint8(this.tail.length, this.SAMPLER_LENGTH, random.getFloat());
};