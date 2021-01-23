/**
 * Mutate a fin
 * @param {Fin} fin A fin
 * @constructor
 */
const MutatorFin = function(fin) {
    this.fin = fin;
};

MutatorFin.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the fin
 * @param {Random} random A randomizer
 */
MutatorFin.prototype.mutate = function(random) {
    // TODO
};