/**
 * A cubic bezier curve
 * @param {Vector2} a The start point
 * @param {Vector2} b The first control point
 * @param {Vector2} c The second control point
 * @param {Vector2} d The end point
 * @constructor
 */
const Path2CubicBezier = function(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
};

Path2CubicBezier.prototype = Object.create(Path2.prototype);

/**
 * Sample the spline
 * @param {Vector2} vector The vector to store the sample in
 * @param {Number} t The distance on the curve in the range [0, 1]
 */
Path2CubicBezier.prototype.sample = function(vector, t) {
    const it = 1 - t;
    const it2 = it * it;
    const it3 = it2 * it;
    const t2 = t * t;
    const t3 = t2 * t;

    vector.x = it3 * this.a.x + 3 * it2 * t * this.b.x + 3 * it * t2 * this.c.x + t3 * this.d.x;
    vector.y = it3 * this.a.y + 3 * it2 * t * this.b.y + 3 * it * t2 * this.c.y + t3 * this.d.y;
};