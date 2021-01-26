/**
 * A quadratic bezier curve
 * @param {Vector2} start The start point
 * @param {Vector2} control The control point
 * @param {Vector2} end The end point
 * @constructor
 */
const Path2QuadraticBezier = function(start, control, end) {
    Path2.call(this, start, end);

    this.control = control;
};

Path2QuadraticBezier.prototype = Object.create(Path2.prototype);

/**
 * Sample the spline
 * @param {Object} vector The vector to store the sample in
 * @param {Number} t The distance on the curve in the range [0, 1]
 */
Path2QuadraticBezier.prototype.sample = function(vector, t) {
    vector.x = (this.getStart().x - 2 * this.control.x + this.getEnd().x) * t * t +
        2 * (this.control.x - this.getStart().x) * t + this.getStart().x;
    vector.y = (this.getStart().y - 2 * this.control.y + this.getEnd().y) * t * t +
        2 * (this.control.y - this.getStart().y) * t + this.getStart().y;
};