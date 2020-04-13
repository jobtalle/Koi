/**
 * A line segment
 * @param {Vector} a The first point
 * @param {Vector} b The second point
 * @constructor
 */
const Line = function(a, b) {
    this.a = a;
    this.b = b;
    this.direction = b.copy().subtract(a);
    this.length = this.direction.length();

    this.direction.normalize();
};