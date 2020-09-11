/**
 * A blueprint for a palette sample
 * @param {Sampler} samplerX The X sampler
 * @param {Sampler} samplerY The Y sampler;
 * @constructor
 */
const BlueprintPaletteSample = function(samplerX, samplerY) {
    this.samplerX = samplerX;
    this.samplerY = samplerY;
};

/**
 * Spawn a palette sample
 * @param {Random} random A randomizer
 * @returns {Palette.Sample} A palette sample
 */
BlueprintPaletteSample.prototype.spawn = function(random) {
    return new Palette.Sample(
        Math.round(this.samplerX.sample(random.getFloat())),
        Math.round(this.samplerY.sample(random.getFloat())));
};