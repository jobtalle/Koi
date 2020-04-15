/**
 * An arc constraint
 * @param {Vector} position The center position
 * @param {Number} radius The arc radius
 * @param {Number} width The arc width
 * @constructor
 */
const Arc = function(position, radius, width) {
    this.position = position;
    this.radius = radius;
    this.width = width;

    Constraint.call(this, 32);
};

Arc.prototype = Object.create(Constraint.prototype);