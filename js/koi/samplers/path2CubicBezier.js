/**
 * A cubic bezier curve
 * @param {Vector2} start The start point
 * @param {Vector2} c1 The first control point
 * @param {Vector2} c2 The second  control point
 * @param {Vector2} end The end point
 * @constructor
 */
const Path2CubicBezier = function(start, c1, c2, end) {
    Path2.call(this, start, end);

    this.c1 = c1;
    this.c2 = c2;
};

Path2CubicBezier.prototype = Object.create(Path2.prototype);

/**
 * Sample the spline
 * @param {Object} vector The vector to store the sample in
 * @param {Number} t The distance on the curve in the range [0, 1]
 */
Path2CubicBezier.prototype.sample = function(vector, t) {
    const it = 1 - t;
    const it2 = it * it;
    const it3 = it2 * it;
    const t2 = t * t;
    const t3 = t2 * t;

    vector.x = it3 * this.getStart().x + 3 * it2 * t * this.c1.x + 3 * it * t2 * this.c2.x + t3 * this.getEnd().x;
    vector.y = it3 * this.getStart().y + 3 * it2 * t * this.c1.y + 3 * it * t2 * this.c2.y + t3 * this.getEnd().y;
};