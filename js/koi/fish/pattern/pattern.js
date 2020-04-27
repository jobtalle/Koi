/**
 * A fish pattern
 * @param {Object[]} layers The layers making up this pattern
 * @param {Vector} slot A texture atlas slot for this pattern
 * @constructor
 */
const Pattern = function(layers, slot) {
    this.layers = layers;
    this.slot = slot;
};