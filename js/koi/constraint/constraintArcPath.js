/**
 * A compound constraint
 * @param {ConstraintArcPath.Arc[]} arcs The arcs
 * @param {Number} width The arc ring width
 * @constructor
 */
const ConstraintArcPath = function(arcs, width) {
    this.arcs = arcs;
    this.width = width;
    this.normal = null;
    this.rings = this.makeRings(arcs);
};

/**
 * An arc of an arc path
 * @param {Vector2} center The arc center
 * @param {Number} radius The arc radius
 * @param {Number} start The start of the arc in radians
 * @param {Number} end The end of the arc in radians
 * @constructor
 */
ConstraintArcPath.Arc = function(center, radius, start, end) {
    this.center = center;
    this.radius = radius;
    this.radians = end - start;

    this.cone = Math.cos(this.radians * .5);
    this.direction = new Vector2().fromAngle(start + this.radians * .5);
};

/**
 * Make the ring constraints for given arcs
 * @param {ConstraintArcPath.Arc[]} arcs An array of arcs
 */
ConstraintArcPath.prototype.makeRings = function(arcs) {
    const rings = new Array(arcs.length);

    for (let arc = 0; arc < arcs.length; ++arc)
        rings[arc] = new ConstraintRing(arcs[arc].center, arcs[arc].radius, this.width);

    return rings;
};

/**
 * Get the fish capacity of this constraint
 * @returns {Number} The maximum number of fish that fit within this constraint
 */
ConstraintArcPath.prototype.getCapacity = function() {
    let capacity = 0;

    for (let arc = 0; arc < this.arcs.length; ++arc)
        capacity += this.rings[arc].getCapacity() * this.arcs[arc].radians / Math.PI * 2;

    return Math.floor(capacity);
};

/**
 * Sample the distance to the nearest edge of this constraint
 * @param {Vector2} position The position to sample
 * @returns {Number} The proximity
 */
ConstraintArcPath.prototype.sample = function(position) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        const dx = position.x - this.arcs[arc].center.x;
        const dy = position.y - this.arcs[arc].center.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * length) {
            const proximity = this.rings[arc].sample(position);

            this.normal = this.rings[arc].normal;

            return proximity;
        }
    }

    return -1;
};

/**
 * Draw the circle
 * @param {Renderer} renderer The renderer
 */
ConstraintArcPath.prototype.render = function(renderer) {
    for (const arc of this.arcs) {
        renderer.drawLine(
            arc.center.x,
            arc.center.y,
            Color.RED,
            arc.center.x + arc.direction.x,
            arc.center.y + arc.direction.y,
            Color.RED);
        renderer.drawLine(
            arc.center.x - .2,
            arc.center.y,
            Color.RED,
            arc.center.x + .2,
            arc.center.y,
            Color.RED);
        renderer.drawLine(
            arc.center.x,
            arc.center.y - .2,
            Color.RED,
            arc.center.x,
            arc.center.y + .2,
            Color.RED);
    }

    for (const ring of this.rings)
        ring.render(renderer);
};