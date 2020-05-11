/**
 * A circle constraint
 * @param {Vector2} position The center position
 * @param {Number} radius The circle radius
 * @constructor
 */
const ConstraintCircle = function(position, radius) {
    this.position = position;
    this.radius = radius;

    Constraint.call(this);
};

ConstraintCircle.prototype = Object.create(Constraint.prototype);

/**
 * Get the fish capacity of this constraint
 * @returns {Number} The maximum number of fish that fit within this constraint
 */
ConstraintCircle.prototype.getCapacity = function() {
    const radiusSquared =
        (this.radius - this.border * this.BORDER_AREA_FACTOR) *
        (this.radius - this.border * this.BORDER_AREA_FACTOR);

    return Math.floor(Math.PI * radiusSquared / this.AREA_PER_FISH);
};

/**
 * Constrain a vector to make sure it is inside the constraint
 * @param {Vector2} vector The vector to constrain
 * @returns {Boolean} A boolean indicating whether the vector could be constrained, always true for circles
 */
ConstraintCircle.prototype.constrain = function(vector) {
    const dx = vector.x - this.position.x;
    const dy = vector.y - this.position.y;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < this.radius * this.radius)
        return true;

    const distance = Math.sqrt(distanceSquared);

    vector.x = this.position.x + this.radius * dx / distance;
    vector.y = this.position.y + this.radius * dy / distance;

    return true;
};

/**
 * Check whether a given point is contained within this constraint
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Boolean} A boolean indicating whether the given point is inside this constraint
 */
ConstraintCircle.prototype.contains = function(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;

    return dx * dx + dy * dy < this.radius * this.radius;
};

/**
 * Sample the distance to the nearest edge of this constraint
 * @param {Vector2} position The position to sample
 * @returns {Number} The proximity
 */
ConstraintCircle.prototype.sample = function(position) {
    const innerRadius = this.radius - this.border;
    const dx = position.x - this.position.x;
    const dy = position.y - this.position.y;
    const squaredDistance = dx * dx + dy * dy;

    if (squaredDistance < innerRadius * innerRadius)
        return 0;
    else {
        const distance = Math.sqrt(squaredDistance);

        this.normal.x = dx;
        this.normal.y = dy;
        this.normal.divide(-distance);

        return (distance - innerRadius) / this.border;
    }
};

/**
 * Draw the circle
 * @param {Renderer} renderer The renderer
 */
ConstraintCircle.prototype.render = function(renderer) {
    let x, y, xp, yp;

    for (let i = 0; i <= 64; ++i) {
        const angle = Math.PI * i / 32;

        xp = x;
        yp = y;
        x = this.position.x + Math.cos(angle) * this.radius;
        y = this.position.y + Math.sin(angle) * this.radius;

        if (i !== 0)
            renderer.drawLine(xp, yp, Color.WHITE, x, y, Color.WHITE);
    }
};