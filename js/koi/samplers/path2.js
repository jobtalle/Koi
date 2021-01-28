/**
 * A 2D path
 * @param {Vector2} start The start point
 * @param {Vector2} end The end point
 * @param {Boolean} [linear] True if the path samples linearly, false by default
 * @param {Number} [linearLength] If the path is linear, the exact length
 * @constructor
 */
const Path2 = function(start, end, linear = false, linearLength = 0) {
    Path.call(this, start, end, linear, linearLength);
};

Path2.prototype = Object.create(Path.prototype);