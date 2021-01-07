/**
 * A blueprint for a random base layer
 * @param {Number} paletteIndex A palette sample index
 * @constructor
 */
const BlueprintLayerBase = function(paletteIndex) {
    BlueprintLayer.call(this, paletteIndex);
};

BlueprintLayerBase.prototype = Object.create(BlueprintLayer.prototype);

/**
 * Spawn a base layer
 * @param {Random} random A randomizer
 * @param {Number} [paletteIndex] The palette index
 * @returns {LayerBase} A base layer
 */
BlueprintLayerBase.prototype.spawn = function(random, paletteIndex = this.paletteIndex) {
    return new LayerBase(paletteIndex);
};