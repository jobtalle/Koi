/**
 * A relative position in a circle constraint
 * @param {Number} angle The angle from the constraint center to the point
 * @param {Number} distance The distance from the constraint center
 * @constructor
 */
const ConstraintCirclePosition = function(angle, distance) {
    this.angle = angle;
    this.distance = distance;
};

/**
 * Deserialize this position
 * @param buffer A buffer to deserialize from
 * @returns {ConstraintCirclePosition} The deserialized position
 */
ConstraintCirclePosition.deserialize = function(buffer) {
    return new ConstraintCirclePosition(
        buffer.readFloat(),
        buffer.readFloat());
};

/**
 * Serialize this position
 * @param {BinBuffer} buffer A buffer to serialize to
 */
ConstraintCirclePosition.prototype.serialize = function(buffer) {
    buffer.writeFloat(this.angle);
    buffer.writeFloat(this.distance);
};