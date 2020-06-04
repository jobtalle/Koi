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
ConstraintCircle.prototype.DEPTH = 1;

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
 * Get the number of steps a mesh for this constraint should have
 * @returns {Number} The number of steps
 */
ConstraintCircle.prototype.getMeshSteps = function() {
    return Math.ceil(2 * Math.PI * this.radius / this.MESH_RESOLUTION);
};

/**
 * Append a water mesh
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 */
ConstraintCircle.prototype.appendMeshWater = function(
    vertices,
    indices,
    width,
    height) {
    const firstIndex = vertices.length >> 1;
    const steps = this.getMeshSteps();

    vertices.push(
        2 * this.position.x / width - 1,
        1 - 2 * this.position.y / height);

    for (let step = 0; step < steps; ++step) {
        const radians = Math.PI * 2 * step / steps;

        vertices.push(
            2 * (this.position.x + Math.cos(radians) * this.radius) / width - 1,
            1 - 2 * (this.position.y + Math.sin(radians) * this.radius) / height);

        indices.push(
            firstIndex,
            firstIndex + step + 1,
            firstIndex + ((step + 1) % steps) + 1);
    }
};

/**
 * Append a depth mesh
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 */
ConstraintCircle.prototype.appendMeshDepth = function(
    vertices,
    indices,
    width,
    height) {
    const firstIndex = vertices.length >> 2;
    const steps = this.getMeshSteps();

    vertices.push(
        2 * this.position.x / width - 1,
        1 - 2 * this.position.y / height,
        1,
        this.DEPTH);

    for (let step = 0; step < steps; ++step) {
        const radians = Math.PI * 2 * step / steps;
        const radius = this.radius + this.MESH_DEPTH_PADDING;

        vertices.push(
            2 * (this.position.x + Math.cos(radians) * radius) / width - 1,
            1 - 2 * (this.position.y + Math.sin(radians) * radius) / height,
            0,
            this.DEPTH);

        indices.push(
            firstIndex,
            firstIndex + step + 1,
            firstIndex + ((step + 1) % steps) + 1);
    }
};