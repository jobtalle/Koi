/**
 * A fish pattern
 * @param {Object[]} layers The layers making up this pattern
 * @param {Vector} slot A texture atlas slot for this pattern
 * @param {Vector} size The UV size of the pattern slot
 * @constructor
 */
const Pattern = function(layers, slot, size) {
    this.layers = layers;
    this.slot = slot;
    this.size = size;
};