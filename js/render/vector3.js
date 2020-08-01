/**
 * A 3D vector
 * @param {Number} [x] The X value
 * @param {Number} [y] The Y value
 * @param {Number} [z] The Z value
 * @constructor
 */
const Vector3 = function(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
};

/**
 * Serialize this vector
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Vector3.prototype.serialize = function(buffer) {
    buffer.writeFloat(this.x);
    buffer.writeFloat(this.y);
    buffer.writeFloat(this.z);
};

/**
 * Deserialize this vector
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {Vector3} This vector
 */
Vector3.prototype.deserialize = function(buffer) {
    this.x = buffer.readFloat();
    this.y = buffer.readFloat();
    this.z = buffer.readFloat();

    return this;
};

/**
 * Copy this vector
 * @returns {Vector3} A copy of this vector
 */
Vector3.prototype.copy = function() {
    return new Vector3(this.x, this.y, this.z);
};

/**
 * Create an interpolated vector from this one to another vector
 * @param {Vector3} to The vector to interpolate towards
 * @param {Number} x The interpolation factor in the range [0, 1]
 * @returns {Vector3} A new vector
 */
Vector3.prototype.interpolate = function(to, x) {
    return new Vector3(
        this.x + (to.x - this.x) * x,
        this.y + (to.y - this.y) * x,
        this.z + (to.z - this.z) * x);
};

/**
 * A function that evaluates whether this vector is a normal vector
 * @returns {Boolean} True if this vector is approximately a normal vector
 */
Vector3.prototype.isNormal = function() {
    return Math.abs(this.length() - 1) < .01;
};

/**
 * Validate whether all vector components are within the given limits
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @returns {Boolean} True if all components are within limits
 */
Vector3.prototype.withinLimits = function(min, max) {
    return this.x >= min && this.y >= min && this.z >= min && this.x <= max && this.y <= max && this.z <= max;
};

/**
 * Add a vector to this vector
 * @param {Vector3} other A vector
 * @returns {Vector3} The modified vector
 */
Vector3.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
};

/**
 * Multiply this vector by a scalar
 * @param {Number} scalar A number
 * @returns {Vector3} The modified vector
 */
Vector3.prototype.multiply = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
};

/**
 * Divide this vector by a scalar
 * @param {Number} scalar A number
 * @returns {Vector3} The modified vector
 */
Vector3.prototype.divide = function(scalar) {
    return this.multiply(1 / scalar);
};

/**
 * Get the dot product of this vector and another vector
 * @param {Vector3} other A vector
 * @returns {Number} The dot product
 */
Vector3.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
};

/**
 * Calculate the length of this vector
 * @returns {Number} The length of this vector
 */
Vector3.prototype.length = function() {
    return Math.sqrt(this.dot(this));
};

/**
 * Check whether this vector is equal to another vector
 * @param {Vector3} other The other vector
 * @returns {Boolean} A boolean indicating whether the vectors are the same
 */
Vector3.prototype.equals = function(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
};

/**
 * Normalize this vector
 * @returns {Vector3} The modified vector
 */
Vector3.prototype.normalize = function() {
    return this.divide(this.length());
};

/**
 * Get the cross product of this vector and another vector
 * @param {Vector3} other A vector
 * @returns {Vector3} The cross product of this vector and the other vector
 */
Vector3.prototype.cross  = function(other) {
    return new Vector3(
        this.y * other.z - other.y * this.z,
        this.z * other.x - other.z * this.x,
        this.x * other.y - other.x * this.y);
};