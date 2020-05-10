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

    // TODO: Start and end do not need to be stored if nothing is drawn
    this.start = start;
    this.end = end;

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
        capacity += this.rings[arc].getCapacity() * this.arcs[arc].radians * .5 / Math.PI;

    return Math.floor(capacity);
};

/**
 * Constrain a vector to make sure it is inside the constraint
 * @param {Vector2} vector The vector to constrain
 */
ConstraintArcPath.prototype.constrain = function(vector) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        const dx = vector.x - this.arcs[arc].center.x;
        const dy = vector.y - this.arcs[arc].center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance) {
            this.rings[arc].constrain(vector, dx, dy, distance);

            return;
        }
    }
};

/**
 * Check whether a given point is contained within this constraint
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Boolean} A boolean indicating whether the given point is inside this constraint
 */
ConstraintArcPath.prototype.contains = function(x, y) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        const dx = x - this.arcs[arc].center.x;
        const dy = y - this.arcs[arc].center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance)
            if (this.rings[arc].contains(x, y))
                return true;
    }

    return false;
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
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance) {
            const proximity = this.rings[arc].sample(dx, dy, distance);

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
        const steps = Math.floor((arc.end - arc.start) / .05);

        for (let i = 0; i < steps; ++i) {
            const radiansStart = arc.start + (arc.end - arc.start) * i / steps;
            const radiansEnd = arc.start + (arc.end - arc.start) * (i + 1) / steps;

            renderer.drawLine(
                arc.center.x + Math.cos(radiansStart) * (arc.radius - this.width * .5),
                arc.center.y + Math.sin(radiansStart) * (arc.radius - this.width * .5),
                Color.WHITE,
                arc.center.x + Math.cos(radiansEnd) * (arc.radius - this.width * .5),
                arc.center.y + Math.sin(radiansEnd) * (arc.radius - this.width * .5),
                Color.WHITE);
            renderer.drawLine(
                arc.center.x + Math.cos(radiansStart) * (arc.radius + this.width * .5),
                arc.center.y + Math.sin(radiansStart) * (arc.radius + this.width * .5),
                Color.WHITE,
                arc.center.x + Math.cos(radiansEnd) * (arc.radius + this.width * .5),
                arc.center.y + Math.sin(radiansEnd) * (arc.radius + this.width * .5),
                Color.WHITE);
        }
    }
};