/**
 * A blueprint for a random tail
 * @param {Sampler} samplerLength The length sampler
 * @param {Sampler} samplerSkew The skew sampler
 * @constructor
 */
const BlueprintTail = function(
    samplerLength,
    samplerSkew) {
    this.samplerLength = samplerLength;
    this.samplerSkew = samplerSkew;
};

/**
 * Spawn a tail
 * @param {Random} random A randomizer
 * @returns {Tail} A fish tail
 */
BlueprintTail.prototype.spawn = function(random) {
    return new Tail(
        Math.round(this.samplerLength.sample(random.getFloat())),
        Math.round(this.samplerSkew.sample(random.getFloat())));
};