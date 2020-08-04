/**
 * A 2D vector
 * @param {Number} [x] The X value
 * @param {Number} [y] The Y value
 * @constructor
 */
const Vector2 = function(x = 0, y = 0) {
    this.x = x;
    this.y = y;
};

/**
 * Serialize this vector
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Vector2.prototype.serialize = function(buffer) {
    buffer.writeFloat(this.x);
    buffer.writeFloat(this.y);
};

/**
 * Deserialize this vector
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {Vector2} This vector
 */
Vector2.prototype.deserialize = function(buffer) {
    this.x = buffer.readFloat();
    this.y = buffer.readFloat();

    return this;
};

/**
 * A function that evaluates whether this vector is a normal vector
 * @returns {Boolean} True if this vector is approximately a normal vector
 */
Vector2.prototype.isNormal = function() {
    return Math.abs(this.length() - 1) < .01;
};

/**
 * Copy this vector
 * @returns {Vector2} A copy of the vector
 */
Vector2.prototype.copy = function() {
    return new Vector2(this.x, this.y);
};

/**
 * Set this vectors contents equal to those of another vector
 * @param {Vector2} other A vector
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.set = function(other) {
    this.x = other.x;
    this.y = other.y;

    return this;
};

/**
 * Add a vector to this vector
 * @param {Vector2} vector A vector
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
};

/**
 * Subtract a vector from this vector
 * @param {Vector2} vector A vector
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
};

/**
 * Multiply this vector by a scalar
 * @param {Number} scalar A number
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.multiply = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
};

/**
 * Divide this vector by a scalar
 * @param {Number} scalar A number
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.divide = function(scalar) {
    return this.multiply(1 / scalar);
};

/**
 * Get the dot product of this vector and another vector
 * @param {Vector2} vector A vector
 * @returns {Number} The dot product
 */
Vector2.prototype.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
};

/**
 * Calculate the length of this vector
 * @returns {Number} The length of this vector
 */
Vector2.prototype.length = function() {
    return Math.sqrt(this.dot(this));
};

/**
 * Normalize this vector
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.normalize = function() {
    const length = this.length();

    if (length !== 0)
        return this.divide(length);
    else {
        this.x = 1;
        this.y = 0;

        return this;
    }
};

/**
 * Get the angle this vector is pointing towards
 * @returns {Number} The angle in radians
 */
Vector2.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
};

/**
 * Check if this vector equals another vector
 * @param {Vector2} vector Another vector
 * @returns {Boolean} True if the vectors are equal
 */
Vector2.prototype.equals = function(vector) {
    return this.x === vector.x && this.y === vector.y;
};

/**
 * Make this vector point towards a given angle
 * @param {Number} angle The angle in radians
 */
Vector2.prototype.fromAngle = function(angle) {
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);

    return this;
};