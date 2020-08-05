/**
 * A fish tail mutator that mutates a tail in place
 * @param {Tail} tail The tail
 * @constructor
 */
const MutatorTail = function(tail) {
    this.tail = tail;
};

MutatorTail.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the tail
 * @param {Random }random A randomizer
 */
MutatorTail.prototype.mutate = function(random) {

};