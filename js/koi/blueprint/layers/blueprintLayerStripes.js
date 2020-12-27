/**
 * A blueprint for a random stripes layer
 * @param {Number} paletteIndex A palette sample index
 * @param {Sampler} samplerScale A scale sampler
 * @param {Sampler} samplerDistortion A distortion sampler
 * @param {Sampler} samplerRoughness A roughness sampler
 * @param {Sampler} samplerThreshold A threshold sampler
 * @param {Sampler} samplerSlant A slant sampler
 * @param {Sampler} samplerSuppression A suppression sampler
 * @param {Sampler} samplerFocus A focus sampler
 * @param {Sampler} samplerPower A power sampler
 * @constructor
 */
const BlueprintLayerStripes = function(
    paletteIndex,
    samplerScale,
    samplerDistortion,
    samplerRoughness,
    samplerThreshold,
    samplerSlant,
    samplerSuppression,
    samplerFocus,
    samplerPower) {
    BlueprintLayer.call(this, paletteIndex);

    this.samplerScale = samplerScale;
    this.samplerDistortion = samplerDistortion;
    this.samplerRoughness = samplerRoughness;
    this.samplerThreshold = samplerThreshold;
    this.samplerSlant = samplerSlant;
    this.samplerSuppression = samplerSuppression;
    this.samplerFocus = samplerFocus;
    this.samplerPower = samplerPower;
};

BlueprintLayerStripes.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a stripes layer
 * @param {Random} random A randomizer
 * @returns {LayerStripes} A stripes layer
 */
BlueprintLayerStripes.prototype.spawn = function(random) {
    return new LayerStripes(
        Plane.createRandom(random),
        this.paletteIndex,
        Math.round(this.samplerScale.sample(random.getFloat())),
        Math.round(this.samplerDistortion.sample(random.getFloat())),
        Math.round(this.samplerRoughness.sample(random.getFloat())),
        Math.round(this.samplerThreshold.sample(random.getFloat())),
        Math.round(this.samplerSlant.sample(random.getFloat())),
        Math.round(this.samplerSuppression.sample(random.getFloat())),
        Math.round(this.samplerFocus.sample(random.getFloat())),
        Math.round(this.samplerPower.sample(random.getFloat())));
};