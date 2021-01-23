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
    for (const fin of this.fins.fins)
        new MutatorFin(fin).mutate(random);
};