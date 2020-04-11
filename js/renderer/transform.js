/**
 * A 2D transformation
 * @param {Number} [_00] The value at 0, 0
 * @param {Number} [_10] The value at 1, 0
 * @param {Number} [_20] The value at 2, 0
 * @param {Number} [_01] The value at 0, 1
 * @param {Number} [_11] The value at 1, 1
 * @param {Number} [_21] The value at 2, 2
 * @constructor
 */
const Transform = function(_00, _10, _20, _01, _11, _21) {
    if (!_00)
        this.identity();
    else {
        this._00 = _00;
        this._10 = _10;
        this._20 = _20;
        this._01 = _01;
        this._11 = _11;
        this._21 = _21;
    }
};

/**
 * Copy this transform
 * @returns {Transform} A copy of this transform
 */
Transform.prototype.copy = function() {
    return new Transform(this._00, this._10, this._20, this._01, this._11, this._21);
};

/**
 * Set this transforms values to the values of another transform
 * @param {Transform} transform The other transform
 * @returns {Transform} The modified transform
 */
Transform.prototype.set = function(transform) {
    this._00 = transform._00;
    this._10 = transform._10;
    this._20 = transform._20;
    this._01 = transform._01;
    this._11 = transform._11;
    this._21 = transform._21;

    return this;
};

/**
 * Apply this transform to a vector
 * @param {Object} vector A vector object, containing at least the "x" and "y" properties
 * @returns {Object} The changed vector object
 */
Transform.prototype.apply = function(vector) {
    const x = vector.x;
    const y = vector.y;

    vector.x = this._00 * x + this._10 * y + this._20;
    vector.y = this._01 * x + this._11 * y + this._21;

    return vector;
};

/**
 * Set this transform to the identity transform
 * @returns {Transform} The modified transform
 */
Transform.prototype.identity = function() {
    this._00 = this._11 = 1;
    this._10 = this._20 = this._01 = this._21 = 0;

    return this;
};

/**
 * Multiply this transform by another transform
 * @param {Transform} transform The other transform
 * @returns {Transform} The modified transform
 */
Transform.prototype.multiply = function(transform) {
    const _00 = this._00;
    const _10 = this._10;
    const _01 = this._01;
    const _11 = this._11;

    this._00 = _00 * transform._00 + _10 * transform._01;
    this._10 = _00 * transform._10 + _10 * transform._11;
    this._20 += _00 * transform._20 + _10 * transform._21;
    this._01 = _01 * transform._00 + _11 * transform._01;
    this._11 = _01 * transform._10 + _11 * transform._11;
    this._21 += _01 * transform._20 + _11 * transform._21;

    return this;
};

/**
 * Rotate the transformation
 * @param {Number} angle The rotation in radians
 * @returns {Transform} The modified transform
 */
Transform.prototype.rotate = function(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const _00 = this._00;
    const _01 = this._01;

    this._00 = _00 * cos - this._10 * sin;
    this._10 = _00 * sin + this._10 * cos;
    this._01 = _01 * cos - this._11 * sin;
    this._11 = _01 * sin + this._11 * cos;

    return this;
};

/**
 * Translate this transform
 * @param {Number} x The horizontal translation
 * @param {Number} y The vertical translation
 * @returns {Transform} The modified transform
 */
Transform.prototype.translate = function(x, y) {
    this._20 += this._00 * x + this._10 * y;
    this._21 += this._01 * x + this._11 * y;

    return this;
};

/**
 * Scale the transform
 * @param {Number} x The horizontal scale
 * @param {Number} y The vertical scale
 * @returns {Transform} The modified transform
 */
Transform.prototype.scale = function(x, y) {
    this._00 *= x;
    this._10 *= y;
    this._01 *= x;
    this._11 *= y;

    return this;
};

/**
 * Invert this transform
 * @returns {Transform} The modified transform
 */
Transform.prototype.invert = function() {
    const s11 = this._00;
    const s02 = this._10 * this._21 - this._11 * this._20;
    const s12 = -this._00 * this._21 + this._01 * this._20;

    const d = 1 / (this._00 * this._11 - this._10 * this._01);

    this._00 = this._11 * d;
    this._10 = -this._10 * d;
    this._20 = s02 * d;
    this._01 = -this._01 * d;
    this._11 = s11 * d;
    this._21 = s12 * d;

    return this;
};