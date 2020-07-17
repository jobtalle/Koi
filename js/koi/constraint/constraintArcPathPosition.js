/**
 * A relative position in an arc path constraint
 * @param {Number} index The arc index, with 0 being the spawn arc
 * @param {Number} radius The radius inside the arc ring in the range [0, 1]
 * @param {Number} progress The arc progress in the range [0, 1]
 * @constructor
 */
const ConstraintArcPathPosition = function(index, radius, progress) {
    this.index = index;
    this.radius = radius;
    this.progress = progress;
};

/**
 * Deserialize this position
 * @param buffer A buffer to deserialize from
 * @returns {ConstraintArcPathPosition} The deserialized position
 */
ConstraintArcPathPosition.deserialize = function(buffer) {
    const index = buffer.readUint8();
    const radius = buffer.readFloat();

    if (!(radius >= -1 && radius <= 2))
        throw -1;

    const progress = buffer.readFloat();

    if (!(progress >= 0 && progress <= 1))
        throw -1;

    return new ConstraintArcPathPosition(index, radius, progress);
};

/**
 * Serialize this position
 * @param {BinBuffer} buffer A buffer to serialize to
 */
ConstraintArcPathPosition.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.index);
    buffer.writeFloat(this.radius);
    buffer.writeFloat(this.progress);
};