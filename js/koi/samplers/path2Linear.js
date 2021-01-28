/**
 * A line path
 * @param {Vector2} start The start point
 * @param {Vector2} end The end point
 * @constructor
 */
const Path2Linear = function(start, end) {
    Path2.call(this, start, end, true, end.copy().subtract(start).length());
};

Path2Linear.prototype = Object.create(Path2.prototype);

/**
 * Sample the path
 * @param {Object} vector The vector to store the sample in
 * @param {Number} t The distance on the curve in the range [0, 1]
 */
Path2Linear.prototype.sample = function(vector, t) {
    vector.x = this.getStart().x + (this.getEnd().x - this.getStart().x) * t;
    vector.y = this.getStart().y + (this.getEnd().y - this.getStart().y) * t;
};