/**
 * A relative position in a circle constraint
 * @param {Number} angle The angle from the constraint center to the point
 * @param {Number} distance The distance from the constraint center in the range [0, 1]
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
 * @throws {RangeError} A range error if deserialized values are not valid
 */
ConstraintCirclePosition.deserialize = function(buffer) {
    const angle = buffer.readFloat();
    const distance = buffer.readFloat();

    if (!(distance >= 0 && distance <= 2))
        throw new RangeError();

    return new ConstraintCirclePosition(angle, distance);
};

/**
 * Serialize this position
 * @param {BinBuffer} buffer A buffer to serialize to
 */
ConstraintCirclePosition.prototype.serialize = function(buffer) {
    buffer.writeFloat(this.angle);
    buffer.writeFloat(this.distance);
};