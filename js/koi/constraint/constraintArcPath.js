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
    this.start = start;
    this.end = end;

    this.cone = Math.cos(this.radians * .5);
    this.direction = new Vector2().fromAngle(start + this.radians * .5);
};

/**
 * Deserialize a relative position
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {ConstraintArcPathPosition} The relative position
 * @throws {RangeError} A range error if deserialized values are not valid
 */
ConstraintArcPath.prototype.deserializeRelativePosition = function(buffer) {
    return ConstraintArcPathPosition.deserialize(buffer);
};

/**
 * Get the relative position of a position
 * @param {Vector2} position A position
 * @returns {ConstraintArcPathPosition} A relative position, or null if the position could not be constrained
 */
ConstraintArcPath.prototype.getRelativePosition = function(position) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        let dx = position.x - this.arcs[arc].center.x;
        let dy = position.y - this.arcs[arc].center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance) {
            const radius = (distance - (this.arcs[arc].radius - this.width * .5)) / this.width;
            const progress = Math.acos((
                dx * Math.cos(this.arcs[arc].start) +
                dy * Math.sin(this.arcs[arc].start)) / distance) / this.arcs[arc].radians;

            return new ConstraintArcPathPosition(arc, radius, progress);
        }
    }

    return null;
};

/**
 * Convert a relative position to an absolute position
 * @param {ConstraintArcPathPosition} position A relative position
 * @returns {Vector2} An absolute position
 */
ConstraintArcPath.prototype.getAbsolutePosition = function(position) {
    const angle = this.arcs[position.index].start +
        (this.arcs[position.index].end - this.arcs[position.index].start) * position.progress;
    const radius = this.arcs[position.index].radius + this.width * (position.radius - .5);

    return new Vector2(
        this.arcs[position.index].center.x + Math.cos(angle) * radius,
        this.arcs[position.index].center.y + Math.sin(angle) * radius);
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
 * Constrain a vector to make sure it is inside the constraint
 * @param {Vector2} vector The vector to constrain
 * @returns {Boolean} A boolean indicating whether the vector could be constrained
 */
ConstraintArcPath.prototype.constrain = function(vector) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        const dx = vector.x - this.arcs[arc].center.x;
        const dy = vector.y - this.arcs[arc].center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance) {
            this.rings[arc].constrain(vector, dx, dy, distance);

            return true;
        }
    }

    return false;
};

/**
 * Calculate the distance to the nearest point in this constraint
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The distance to the nearest point in this constraint
 */
ConstraintArcPath.prototype.distanceToWater = function(x, y) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        const dx = x - this.arcs[arc].center.x;
        const dy = y - this.arcs[arc].center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance) {
            if (distance > this.arcs[arc].radius - this.width * .5 && distance < this.arcs[arc].radius + this.width * .5)
                return 0;

            if (distance < this.arcs[arc].radius - this.width * .5)
                return this.arcs[arc].radius - this.width * .5 - distance;

            return distance - this.arcs[arc].radius - this.width * .5;
        }
    }

    return Infinity;
};

/**
 * Check whether a given point is contained within this constraint
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Constraint} This constraint if it contains the coordinates, null if it does not
 */
ConstraintArcPath.prototype.contains = function(x, y) {
    for (let arc = 0; arc < this.arcs.length; ++arc) {
        const dx = x - this.arcs[arc].center.x;
        const dy = y - this.arcs[arc].center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx * this.arcs[arc].direction.x + dy * this.arcs[arc].direction.y >= this.arcs[arc].cone * distance) {
            const contains = this.rings[arc].contains(x, y);

            if (contains)
                return contains;
        }
    }

    return null;
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
 * Get the number of steps a mesh for this constraint should have
 * @param {Number} arc The index of the arc to get the number of steps for
 */
ConstraintArcPath.prototype.getMeshSteps = function(arc) {
    return Math.ceil((this.arcs[arc].end - this.arcs[arc].start) * this.arcs[arc].radius / this.rings[arc].MESH_RESOLUTION);
};

/**
 * Append a water mesh
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
ConstraintArcPath.prototype.appendMeshWater = function(vertices, indices) {
    for (let arc = this.arcs.length; arc-- > 0;) {
        const firstIndex = vertices.length >> 1;
        const steps = this.getMeshSteps(arc);

        for (let step = 0; step <= steps; ++step) {
            const radians = this.arcs[arc].start + (this.arcs[arc].end - this.arcs[arc].start) * step / steps;
            const radiusInner = this.arcs[arc].radius - this.width * .5;
            const radiusOuter = this.arcs[arc].radius + this.width * .5;

            vertices.push(
                this.arcs[arc].center.x + Math.cos(radians) * radiusInner,
                this.arcs[arc].center.y + Math.sin(radians) * radiusInner,
                this.arcs[arc].center.x + Math.cos(radians) * radiusOuter,
                this.arcs[arc].center.y + Math.sin(radians) * radiusOuter);

            if (step !== steps)
                indices.push(
                    firstIndex + (step << 1),
                    firstIndex + (step << 1) + 1,
                    firstIndex + (step << 1) + 2,
                    firstIndex + (step << 1) + 2,
                    firstIndex + (step << 1) + 3,
                    firstIndex + (step << 1) + 1);
        }
    }
};

/**
 * Append a depth mesh
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
ConstraintArcPath.prototype.appendMeshDepth = function(vertices, indices) {
    for (let arc = this.arcs.length; arc-- > 0;) {
        const firstIndex = vertices.length >> 2;
        const steps = this.getMeshSteps(arc);

        for (let step = 0; step <= steps; ++step) {
            const radians = this.arcs[arc].start + (this.arcs[arc].end - this.arcs[arc].start) * step / steps;
            const radiusInner = this.arcs[arc].radius - this.width * .5 - this.rings[arc].MESH_DEPTH_PADDING;
            const radiusCenter = this.arcs[arc].radius;
            const radiusOuter = this.arcs[arc].radius + this.width * .5 + this.rings[arc].MESH_DEPTH_PADDING;

            vertices.push(
                this.arcs[arc].center.x + Math.cos(radians) * radiusInner,
                this.arcs[arc].center.y + Math.sin(radians) * radiusInner,
                0,
                this.rings[arc].DEPTH,
                this.arcs[arc].center.x + Math.cos(radians) * radiusCenter,
                this.arcs[arc].center.y + Math.sin(radians) * radiusCenter,
                1,
                this.rings[arc].DEPTH,
                this.arcs[arc].center.x + Math.cos(radians) * radiusOuter,
                this.arcs[arc].center.y + Math.sin(radians) * radiusOuter,
                0,
                this.rings[arc].DEPTH);

            if (step !== steps)
                indices.push(
                    firstIndex + step * 3,
                    firstIndex + step * 3 + 1,
                    firstIndex + step * 3 + 4,
                    firstIndex + step * 3 + 4,
                    firstIndex + step * 3 + 3,
                    firstIndex + step * 3,
                    firstIndex + step * 3 + 1,
                    firstIndex + step * 3 + 2,
                    firstIndex + step * 3 + 5,
                    firstIndex + step * 3 + 5,
                    firstIndex + step * 3 + 4,
                    firstIndex + step * 3 + 1);
        }
    }
};