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
    this.width = width;

    Constraint.call(this);
};

ConstraintRing.prototype = Object.create(Constraint.prototype);

/**
 * Get the fish capacity of this constraint
 * @returns {Number} The maximum number of fish that fit within this constraint
 */
ConstraintRing.prototype.getCapacity = function() {
    const radiusInner = this.radius - this.width + this.border;
    const radiusOuter = this.radius + this.width - this.border;

    return Math.floor(Math.PI * (radiusOuter * radiusOuter - radiusInner * radiusInner) / this.AREA_PER_FISH);
};

/**
 * Sample the distance to the nearest edge of this constraint
 * @param {Vector2} position The position to sample
 * @returns {Number} The proximity
 */
ConstraintRing.prototype.sample = function(position) {
    const innerRadius = this.radius - this.width + this.border;
    const outerRadius = this.radius + this.width - this.border;
    const dx = position.x - this.position.x;
    const dy = position.y - this.position.y;
    const squaredDistance = dx * dx + dy * dy;

    if (squaredDistance < innerRadius * innerRadius) {
        const distance = Math.sqrt(squaredDistance);

        this.normal.x = dx;
        this.normal.y = dy;
        this.normal.divide(distance);

        return (innerRadius - distance) / this.border;
    }
    else if (squaredDistance > outerRadius * outerRadius) {
        const distance = Math.sqrt(squaredDistance);

        this.normal.x = dx;
        this.normal.y = dy;
        this.normal.divide(-distance);

        return (distance - outerRadius) / this.border;
    }

    return 0;
};

/**
 * Draw the arc
 * @param {Renderer} renderer The renderer
 */
ConstraintRing.prototype.render = function(renderer) {
    let x, y, xp, yp;

    for (let i = 0; i <= 64; ++i) {
        const angle = Math.PI * i / 32;

        xp = x;
        yp = y;
        x = this.position.x + Math.cos(angle) * (this.radius - this.width);
        y = this.position.y + Math.sin(angle) * (this.radius - this.width);

        if (i !== 0)
            renderer.drawLine(xp, yp, Color.WHITE, x, y, Color.WHITE);
    }

    for (let i = 0; i <= 64; ++i) {
        const angle = Math.PI * i / 32;

        xp = x;
        yp = y;
        x = this.position.x + Math.cos(angle) * (this.radius + this.width);
        y = this.position.y + Math.sin(angle) * (this.radius + this.width);

        if (i !== 0)
            renderer.drawLine(xp, yp, Color.WHITE, x, y, Color.WHITE);
    }
};