/**
 * A layer in a composite fish pattern
 * @param {Number} [id] The layer ID, -1 for base layers and shapes
 * @param {Number} [paletteIndex] A palette index, if this layer samples
 * @constructor
 */
const Layer = function(
    id = -1,
    paletteIndex = -1) {
    this.id = id;
    this.paletteIndex = paletteIndex;
    this.flags = 0;
};

/**
 * Copy a layer
 * @returns {Layer} A copy of this layer
 */
Layer.prototype.copy = function() {
    return null;
};