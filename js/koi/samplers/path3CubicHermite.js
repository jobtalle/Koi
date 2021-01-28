/**
 * A cubic hermite spline
 * @param {Vector3[]} points The points on this spline
 * @constructor
 */
const Path3CubicHermite = function(points) {
    this.points = points;

    Path3.call(this, points[0], points[points.length - 1]);
};

Path3CubicHermite.prototype = Object.create(Path3.prototype);

/**
 * The interpolation formula
 * @param {Number} a The first value
 * @param {Number} b The second value
 * @param {Number} c The third value
 * @param {Number} d The fourth value
 * @param {Number} t The sample to interpolate in the range [0, 1]
 * @returns {Number} The interpolated value
 */
Path3CubicHermite.prototype.interpolate = function(a, b, c, d, t) {
    const A = .5 * (3 * b - a - 3 * c + d);
    const B = a - 2.5 * b + 2 * c - .5 * d;
    const C = .5 * (c - a);

    return A * t * t * t + B * t * t + C * t + b;
};

/**
 * Sample the path
 * @param {Object} vector The vector to store the sample in
 * @param {Number} t The distance on the path in the range [0, 1]
 */
Path3CubicHermite.prototype.sample = function(vector, t) {
    const lastPoint = this.points.length - 1;
    const i1 = Math.floor(lastPoint * t);
    const i0 = Math.max(i1 - 1, 0);
    const i2 = Math.min(i1 + 1, lastPoint);
    const i3 = Math.min(i2 + 1, lastPoint);
    const f = lastPoint * t - i1;

    vector.x = this.interpolate(this.points[i0].x, this.points[i1].x, this.points[i2].x, this.points[i3].x, f);
    vector.y = this.interpolate(this.points[i0].y, this.points[i1].y, this.points[i2].y, this.points[i3].y, f);
    vector.z = this.interpolate(this.points[i0].z, this.points[i1].z, this.points[i2].z, this.points[i3].z, f);
};