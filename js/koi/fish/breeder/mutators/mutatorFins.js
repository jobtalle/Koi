/**
 * Mutate a set of fins in place
 * @param {Fins} fins The fins
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
    new MutatorFin(this.fins.front).mutate(random);
    new MutatorFin(this.fins.back).mutate(random);
};