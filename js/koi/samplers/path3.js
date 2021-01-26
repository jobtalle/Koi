/**
 * A 3D path
 * @param {Vector3} start The start point
 * @param {Vector3} end The end point
 * @constructor
 */
const Path3 = function(start, end) {
    this.start = start;
    this.end = end;
};

/**
 * Get the start point of this path
 * @returns {Vector3} The start point
 */
Path3.prototype.getStart = function() {
    return this.start;
};

/**
 * Get the end point of this path
 * @returns {Vector3} The end point
 */
Path3.prototype.getEnd = function() {
    return this.end;
};

/**
 * Sample the path
 * @param {Vector3} vector The vector to store the sample in
 * @param {Number} t The distance on the path in the range [0, 1]
 */
Path3.prototype.sample = function(vector, t) {

};