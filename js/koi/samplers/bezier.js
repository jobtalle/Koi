/**
 * A quadratic bezier curve
 * @param {Vector2} a The start point
 * @param {Vector2} b The end point
 * @param {Vector2} control The control point
 * @constructor
 */
const Bezier = function(a, b, control) {
    this.a = a;
    this.b = b;
    this.control = control;
};

/**
 * Sample the curve
 * @param {Vector2} vector The vector to store the sample in
 * @param {Number} t The part on the curve to sample in the range [0, 1]
 * @returns {Vector2} The modified vector
 */
Bezier.prototype.sample = function(vector, t) {
    vector.set(this.a).multiply((1 - t) * (1 - t));
    vector.x += t * (2 * (1 - t) * this.control.x + t * this.b.x);
    vector.y += t * (2 * (1 - t) * this.control.y + t * this.b.y);

    return vector;
};

/**
 * Get the length of this curve
 * @returns {Number} The length of the curve
 */
Bezier.prototype.length = function() {
    const a = this.a.copy().subtract(this.control).subtract(this.control).add(this.b);
    const b = this.control.copy().subtract(this.a).multiply(2);
    const A = 4 * a.dot(a);
    const B = 4 * a.dot(b);
    const C = b.dot(b);

    const ABC = 2 * Math.sqrt(A + B + C);
    const A2 = Math.sqrt(A);
    const A32 = 2 * A * A2;
    const C2 = 2 * Math.sqrt(C);
    const BA = B / A2;

    return (A32 * ABC + A2 * B * (ABC - C2) + (4 * C * A - B * B) * Math.log((2 * A2 + BA + ABC) / (BA + C2))) /
        (4 * A32);
};