/**
 * A blueprint for a random base layer
 * @param {BlueprintPaletteSample} blueprintPaletteSample A palette sample blueprint
 * @constructor
 */
const BlueprintLayerBase = function(blueprintPaletteSample) {
    this.blueprintPaletteSample = blueprintPaletteSample;
};

/**
 * Spawn a base layer
 * @param {Random} random A randomizer
 * @returns {LayerBase} A base layer
 */
BlueprintLayerBase.prototype.spawn = function(random) {
    return new LayerBase(this.blueprintPaletteSample.spawn(random));
};