/**
 * A blueprint for a random web layer
 * @param {Number} paletteIndex A palette sample index
 * @param {Sampler} samplerScale A scale sampler
 * @param {Sampler} samplerThickness A thickness sampler
 * @param {Sampler} samplerThreshold A threshold sampler
 * @constructor
 */
const BlueprintLayerWeb = function(
    paletteIndex,
    samplerScale,
    samplerThickness,
    samplerThreshold) {
    BlueprintLayer.call(this, paletteIndex);

    this.samplerScale = samplerScale;
    this.samplerThickness = samplerThickness;
    this.samplerThreshold = samplerThreshold;
};

BlueprintLayerWeb.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a web layer
 * @param {Random} random A randomizer
 * @param {Number} [paletteIndex] A different palette index, if applicable
 * @returns {LayerWeb} A spots layer
 */
BlueprintLayerWeb.prototype.spawn = function(random, paletteIndex = this.paletteIndex) {
    return new LayerWeb(
        Plane.createRandom(random),
        paletteIndex,
        Math.round(this.samplerScale.sample(random.getFloat())),
        Math.round(this.samplerThickness.sample(random.getFloat())),
        Math.round(this.samplerThreshold.sample(random.getFloat())));
};