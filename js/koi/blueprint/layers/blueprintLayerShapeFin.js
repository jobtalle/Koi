/**
 * A fin shape layer blueprint
 * @param {Sampler} samplerRoundness A roundness sampler
 * @constructor
 */
const BlueprintLayerShapeFin = function(samplerRoundness) {
    BlueprintLayer.call(this);

    this.samplerRoundness = samplerRoundness;
};

BlueprintLayerShapeFin.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a fin shape layer
 * @param {Random} random A randomizer
 * @param {Number} [paletteIndex] The palette index
 * @returns {LayerShapeFin} A fin shape layer
 */
BlueprintLayerShapeFin.prototype.spawn = function(random, paletteIndex = this.paletteIndex) {
    return new LayerShapeFin(
        Math.round(this.samplerRoundness.sample(random.getFloat())));
};