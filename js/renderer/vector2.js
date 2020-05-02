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
    return this.divide(this.length());
};

/**
 * Reflect this vector
 * @param {Vector2} vector A surface normal to reflect against
 * @returns {Vector2} The modified vector
 */
Vector2.prototype.reflect = function(vector) {
    const ddot = this.dot(vector) * 2;

    this.x -= ddot * vector.x;
    this.y -= ddot * vector.y;

    return this;
};

/**
 * Negate this vector
 * @returns {Vector2} The negated vector
 */
Vector2.prototype.negate = function() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
}

/**
 * Get the angle this vector is pointing towards
 * @returns {Number} The angle in radians
 */
Vector2.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
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