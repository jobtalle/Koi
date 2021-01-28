/**
 * A 3D path
 * @param {Vector3} start The start point
 * @param {Vector3} end The end point
 * @param {Boolean} [linear] True if the path samples linearly, false by default
 * @param {Number} [linearLength] If the path is linear, the exact length
 * @constructor
 */
const Path3 = function(start, end, linear = false, linearLength = 0) {
    Path.call(this, start, end, linear, linearLength);
};

Path3.prototype = Object.create(Path.prototype);