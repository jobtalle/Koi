/**
 * A layer in a composite fish pattern
 * @param {Number} [id] The layer ID, -1 for base layers o
 * @param {Boolean} [allowOverlap] Indicates whether this layer may be overlapped
 * @param {Boolean} [overlaps] Indicates whether this layer will overlap when possible
 * @constructor
 */
const Layer = function(id = -1, allowOverlap = true, overlaps = true) {
    this.id = id;
    this.flags = 0;

    if (allowOverlap)
        this.flags |= this.FLAG_ALLOW_OVERLAP;

    if (overlaps)
        this.flags |= this.FLAG_OVERLAPS;
};

Layer.prototype.FLAG_ALLOW_OVERLAP = 0x01;
Layer.prototype.FLAG_OVERLAPS = 0x02;