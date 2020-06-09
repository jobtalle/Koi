/**
 * A relative position in a constraint
 * @param {Number} angle The angle from the constraint center to the point
 * @param {Number} distance The distance from the constraint center
 * @constructor
 */
const ConstraintPosition = function(angle, distance) {
    this.angle = angle;
    this.distance = distance;
}