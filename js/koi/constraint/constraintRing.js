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

    Constraint.call(this, Math.min(this.BORDER, this.halfWidth));
};

ConstraintRing.prototype = Object.create(Constraint.prototype);
ConstraintRing.prototype.DEPTH = .5;

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
        vector.x = this.position.x + (this.radius - this.halfWidth + this.CONSTRAIN_EPSILON) * dx / distance;
        vector.y = this.position.y + (this.radius - this.halfWidth + this.CONSTRAIN_EPSILON) * dy / distance;
    }
    else {
        vector.x = this.position.x + (this.radius + this.halfWidth - this.CONSTRAIN_EPSILON) * dx / distance;
        vector.y = this.position.y + (this.radius + this.halfWidth - this.CONSTRAIN_EPSILON) * dy / distance;
    }
};

/**
 * Constrain a vector to make sure it is at the center of the ring
 * @param {Vector2} vector The vector to constrain
 * @param {Number} dx The X distance to the center
 * @param {Number} dy The Y distance to the center
 * @param {Number} distance The distance to the ring center
 */
ConstraintRing.prototype.constrainCenter = function(vector, dx, dy, distance) {
    if (distance > this.radius - this.halfWidth && distance < this.radius + this.halfWidth)
        return;

    vector.x = this.position.x + this.radius * dx / distance;
    vector.y = this.position.y + this.radius * dy / distance;
};

/**
 * Check whether a given point is contained within this constraint
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Constraint} This constraint if it contains the coordinates, null if it does not
 */
ConstraintRing.prototype.contains = function(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.radius - this.halfWidth && distance < this.radius + this.halfWidth)
        return this;

    return null;
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