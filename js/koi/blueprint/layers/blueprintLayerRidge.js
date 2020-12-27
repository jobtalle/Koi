/**
 * A blueprint for a random ridge layer
 * @param {Number} paletteIndex A palette sample index
 * @param {Sampler} samplerScale A scale sampler
 * @param {Sampler} samplerPower A power sampler
 * @param {Sampler} samplerThreshold A threshold sampler
 * @param {Sampler} samplerFocus A focus sampler
 * @param {Sampler} samplerFocusPower A focus power sampler
 * @constructor
 */
const BlueprintLayerRidge = function(
    paletteIndex,
    samplerScale,
    samplerPower,
    samplerThreshold,
    samplerFocus,
    samplerFocusPower) {
    BlueprintLayer.call(this, paletteIndex);

    this.samplerScale = samplerScale;
    this.samplerPower = samplerPower;
    this.samplerThreshold = samplerThreshold;
    this.samplerFocus = samplerFocus;
    this.samplerFocusPower = samplerFocusPower;
};

BlueprintLayerRidge.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a ridge layer
 * @param {Random} random A randomizer
 * @returns {LayerRidge} A ridge layer
 */
BlueprintLayerRidge.prototype.spawn = function(random) {
    return new LayerRidge(
        Plane.createRandom(random),
        this.paletteIndex,
        Math.round(this.samplerScale.sample(random.getFloat())),
        Math.round(this.samplerPower.sample(random.getFloat())),
        Math.round(this.samplerThreshold.sample(random.getFloat())),
        Math.round(this.samplerFocus.sample(random.getFloat())),
        Math.round(this.samplerFocusPower.sample(random.getFloat())));
};