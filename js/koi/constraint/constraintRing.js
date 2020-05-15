/**
 * An arc constraint
 * @param {Vector2} position The center position
 * @param {Number} radius The arc radius
 * @param {Number} width The arc width
 * @constructor
 */
const ConstraintRing = function(position, radius, width) {
    this.position = position;
    this.radius = radius;
    this.halfWidth = width * .5;

    Constraint.call(this);
};

ConstraintRing.prototype = Object.create(Constraint.prototype);

/**
 * Constrain a vector to make sure it is inside the constraint
 * @param {Vector2} vector The vector to constrain
 * @param {Number} dx The X distance to the center
 * @param {Number} dy The Y distance to the center
 * @param {Number} distance The distance to the ring center
 */
ConstraintRing.prototype.constrain = function(vector, dx, dy, distance) {
    if (distance > this.radius - this.halfWidth && distance < this.radius + this.halfWidth)
        return;

    if (distance < this.radius - this.halfWidth) {
        vector.x = this.position.x + (this.radius - this.halfWidth) * dx / distance;
        vector.y = this.position.y + (this.radius - this.halfWidth) * dy / distance;
    }
    else {
        vector.x = this.position.x + (this.radius + this.halfWidth) * dx / distance;
        vector.y = this.position.y + (this.radius + this.halfWidth) * dy / distance;
    }
};

/**
 * Check whether a given point is contained within this constraint
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Boolean} A boolean indicating whether the given point is inside this constraint
 */
ConstraintRing.prototype.contains = function(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance > this.radius - this.halfWidth && distance < this.radius + this.halfWidth;
};

/**
 * Sample the distance to the nearest edge of this constraint
 * @param {Number} dx The X distance to the center
 * @param {Number} dy The Y distance to the center
 * @param {Number} distance The distance to the ring center
 * @returns {Number} The proximity
 */
ConstraintRing.prototype.sample = function(dx, dy, distance) {
    const innerRadius = this.radius - this.halfWidth + this.border;
    const outerRadius = this.radius + this.halfWidth - this.border;

    if (distance < innerRadius) {
        this.normal.x = dx;
        this.normal.y = dy;
        this.normal.divide(distance);

        return (innerRadius - distance) / this.border;
    }
    else if (distance > outerRadius) {
        this.normal.x = dx;
        this.normal.y = dy;
        this.normal.divide(-distance);

        return (distance - outerRadius) / this.border;
    }

    return 0;
};