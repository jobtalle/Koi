/**
 * A blueprint for a random base layer
 * @param {Number} paletteIndex A palette sample index
 * @constructor
 */
const BlueprintLayerBase = function(paletteIndex) {
    this.paletteIndex = paletteIndex;
};

/**
 * Spawn a base layer
 * @param {Random} random A randomizer
 * @returns {LayerBase} A base layer
 */
BlueprintLayerBase.prototype.spawn = function(random) {
    return new LayerBase(this.paletteIndex);
};