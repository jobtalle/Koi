/**
 * A relative position in a circle constraint
 * @param {Number} angle The angle from the constraint center to the point
 * @param {Number} distance The distance from the constraint center
 * @constructor
 */
const ConstraintCirclePosition = function(angle, distance) {
    this.angle = angle;
    this.distance = distance;
}