/**
 * Mutate a fin
 * @param {Fin} fin A fin
 * @constructor
 */
const MutatorFin = function(fin) {
    this.fin = fin;
};

MutatorFin.prototype = Object.create(Mutator.prototype);
MutatorFin.prototype.SAMPLER_AT = new SamplerPlateau(-20, 0, 20, .5);
MutatorFin.prototype.SAMPLER_RADIUS = new SamplerPlateau(-25, 0, 25, .8);

/**
 * Mutate the fin
 * @param {Random} random A randomizer
 */
MutatorFin.prototype.mutate = function(random) {
    this.fin.at = this.mutateUint8(this.fin.at, this.SAMPLER_AT, random.getFloat());
    this.fin.radius = this.mutateUint8(this.fin.radius, this.SAMPLER_RADIUS, random.getFloat());
};