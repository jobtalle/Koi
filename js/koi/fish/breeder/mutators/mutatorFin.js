/**
 * Mutate a fin
 * @param {Fin} fin A fin
 * @constructor
 */
const MutatorFin = function(fin) {
    this.fin = fin;
};

MutatorFin.prototype = Object.create(Mutator.prototype);
MutatorFin.prototype.SAMPLER_AT = new SamplerPlateau(-10, 0, 10, .5);
MutatorFin.prototype.SAMPLER_RADIUS = new SamplerPlateau(-11, 0, 11, .8);

/**
 * Mutate the fin
 * @param {Number} atMin The minimum at
 * @param {Number} atMax The maximum at
 * @param {Random} random A randomizer
 */
MutatorFin.prototype.mutate = function(atMin, atMax, random) {
    this.fin.at = Math.max(atMin, Math.min(atMax, this.mutateUint8(this.fin.at, this.SAMPLER_AT, random.getFloat())));
    this.fin.radius = this.mutateUint8(this.fin.radius, this.SAMPLER_RADIUS, random.getFloat());
};