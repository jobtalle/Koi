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
 * @returns {Constraint} This constraint if it contains the coordinates, null if it does not
 */
ConstraintCircle.prototype.contains = function(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;

    if (dx * dx + dy * dy < this.radius * this.radius)
        return this;

    return null;
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
 * Append a mesh
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Random} random A randomizer
 */
ConstraintCircle.prototype.appendMesh = function(vertices, indices, random) {
    const firstIndex = vertices.length >> 1;
    const steps = Math.ceil(2 * Math.PI * this.radius / this.MESH_RESOLUTION);

    for (let step = 0; step < steps; ++step) {
        const radians = Math.PI * 2 * step / steps;
        const radius = this.radius + (random.getFloat() - .5) * this.MESH_ROUGHNESS;

        vertices.push(
            this.position.x + Math.cos(radians) * radius,
            this.position.y + Math.sin(radians) * radius);

        if (step > 1)
            indices.push(
                firstIndex,
                firstIndex + step - 1,
                firstIndex + step);
    }
};