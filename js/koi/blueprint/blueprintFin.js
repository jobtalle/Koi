/**
 * A blueprint for a random fin
 * @param {Sampler} samplerAt The fin position sampler
 * @param {Sampler} samplerRadius The fin radius sampler
 * @constructor
 */
const BlueprintFin = function(samplerAt, samplerRadius) {
    this.samplerAt = samplerAt;
    this.samplerRadius = samplerRadius;
};

/**
 * Spawn a fin
 * @param {Random} random A randomizer
 * @returns {Fin} A fin
 */
BlueprintFin.prototype.spawn = function(random) {
    return new Fin(
        Math.round(this.samplerAt.sample(random.getFloat())),
        Math.round(this.samplerRadius.sample(random.getFloat())));
};