/**
 * A fish pattern
 * @param {Object[]} layers The layers making up this pattern
 * @param {PatternShape} shape The fish shape for this pattern
 * @constructor
 */
const Pattern = function(layers, shape) {
    this.layers = layers;
    this.shape = shape;
    this.slot = null;
    this.size = null;
};

/**
 * Free all resources maintained by this pattern
 * @param {Atlas} atlas The texture atlas
 */
Pattern.prototype.free = function(atlas) {
    atlas.returnSlot(this.slot);
};