/**
 * A fish pattern
 * @param {Object[]} layers The layers making up this pattern
 * @param {PatternBase} base The base color pattern, also applied to fins
 * @param {PatternShapeBody} shapeBody The body shape for this pattern
 * @param {PatternShapeFin} shapeFin The fin shape for this pattern
 * @constructor
 */
const Pattern = function(base, layers, shapeBody, shapeFin) {
    this.base = base;
    this.layers = layers;
    this.shapeBody = shapeBody;
    this.shapeFin = shapeFin;
    this.region = null;
};

/**
 * Free all resources maintained by this pattern
 * @param {Atlas} atlas The texture atlas
 */
Pattern.prototype.free = function(atlas) {
    if (this.region)
        atlas.returnRegion(this.region);
};