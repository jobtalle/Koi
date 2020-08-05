/**
 * Mutate a set of fins in place
 * @param {Fin[]} fins The fins
 * @constructor
 */
const MutatorFins = function(fins) {
    this.fins = fins;
};

MutatorFins.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the fins
 * @param {Random} random A randomizer
 */
MutatorFins.prototype.mutate = function(random) {

};