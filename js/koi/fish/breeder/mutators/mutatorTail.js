/**
 * A fish tail mutator that mutates a tail in place
 * @param {Tail} tail The tail
 * @constructor
 */
const MutatorTail = function(tail) {
    this.tail = tail;
};

MutatorTail.prototype = Object.create(Mutator.prototype);
MutatorTail.prototype.SAMPLER_LENGTH = new SamplerPlateau(-15, 0, 15, 1);
MutatorTail.prototype.SAMPLER_SKEW = MutatorTail.prototype.SAMPLER_LENGTH;

/**
 * Mutate the tail
 * @param {Random }random A randomizer
 */
MutatorTail.prototype.mutate = function(random) {
    this.tail.length = this.mutateUint8(this.tail.length, this.SAMPLER_LENGTH, random.getFloat());
    this.tail.skew = this.mutateUint8(this.tail.skew, this.SAMPLER_SKEW, random.getFloat());
};