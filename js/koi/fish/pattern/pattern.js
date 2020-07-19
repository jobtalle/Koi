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
 * Deserialize a pattern
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @returns {Pattern} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Pattern.deserialize = function(buffer) {
    const layers = [];
    let layerID;

    while (layerID = buffer.readUint8()) {
        switch (layerID) {
            case PatternSpots.prototype.ID:
                layers.push(PatternSpots.deserialize(buffer));

                break;
            default:
                throw new RangeError();
        }
    }

    return new Pattern(
        PatternBase.deserialize(buffer),
        layers,
        PatternShapeBody.deserialize(buffer),
        PatternShapeFin.deserialize(buffer));
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Pattern.prototype.serialize = function(buffer) {
    for (const layer of this.layers) {
        buffer.writeUint8(layer.ID);

        layer.serialize(buffer);
    }

    buffer.writeUint8(0);

    this.base.serialize(buffer);
    this.shapeBody.serialize(buffer);
    this.shapeFin.serialize(buffer);
};

/**
 * Free all resources maintained by this pattern
 * @param {Atlas} atlas The texture atlas
 */
Pattern.prototype.free = function(atlas) {
    if (this.region)
        atlas.returnRegion(this.region);
};