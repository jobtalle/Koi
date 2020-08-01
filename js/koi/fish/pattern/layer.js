/**
 * A layer in a composite fish pattern
 * @param {Number} [id] The layer ID, -1 for base layers and shapes
 * @param {Palette.Sample} [paletteSample] A palette sample, if this layer samples
 * @param {Boolean} [allowOverlap] Indicates whether this layer may be overlapped
 * @param {Boolean} [overlaps] Indicates whether this layer will overlap when possible
 * @param {Boolean} [recessive] Indicates that this layer always loses to non recessive layers in reproduction
 * @param {Number} [dominance] The layer dominance exponent
 * @constructor
 */
const Layer = function(
    id = -1,
    paletteSample = null,
    allowOverlap = true,
    overlaps = true,
    recessive = false,
    dominance = 1) {
    this.id = id;
    this.dominance = dominance;
    this.paletteSample = paletteSample;
    this.flags = 0;

    if (allowOverlap)
        this.flags |= this.FLAG_ALLOW_OVERLAP;

    if (overlaps)
        this.flags |= this.FLAG_OVERLAPS;

    if (recessive)
        this.flags |= this.FLAG_RECESSIVE;
};

Layer.prototype.FLAG_ALLOW_OVERLAP = 0x01;
Layer.prototype.FLAG_OVERLAPS = 0x02;
Layer.prototype.FLAG_RECESSIVE = 0x04;

/**
 * Copy a layer
 * @returns {Layer} A copy of this layer
 */
Layer.prototype.copy = function() {
    return null;
};

/**
 * Find out whether this layer is recessive
 * @returns {Boolean} True if this layer is recessive
 */
Layer.prototype.isRecessive = function() {
    return (this.flags & this.FLAG_RECESSIVE) === this.FLAG_RECESSIVE;
};

/**
 * Sample a dominance score for this layer, used when competing for reproduction
 * @param {Random} random A randomizer
 * @returns {Number} A dominance factor in the range [0, 1], higher is more preferable
 */
Layer.prototype.sampleDominance = function(random) {
    return Math.pow(random.getFloat(), this.dominance);
};