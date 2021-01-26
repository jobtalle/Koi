/**
 * A path
 * @param {Object} start The start point
 * @param {Object} end The end point
 * @param {Boolean} linear True if the path samples linearly
 * @param {Number} linearLength If the path is linear, the exact length
 * @constructor
 */
const Path = function(start, end, linear, linearLength) {
    this.start = start;
    this.end = end;
    this.linear = linear;
    this.linearLength = linearLength;
};

/**
 * Get the start point
 * @returns {Object} The start point
 */
Path.prototype.getStart = function() {
    return this.start;
};

/**
 * Get the end point
 * @returns {Object} The end point
 */
Path.prototype.getEnd = function() {
    return this.end;
};

/**
 * Check whether this path can be sampled linearly
 * @returns {Boolean} True if the path can be sampled linearly
 */
Path.prototype.isLinear = function() {
    return this.linear;
};

/**
 * Get the length of this path, if it is linear
 * @returns {Number} The path length
 */
Path.prototype.getLinearLength = function() {
    return this.linearLength;
};

/**
 * Sample the path
 * @param {Object} vector The vector to store the sample in
 * @param {Number} t The distance on the path in the range [0, 1]
 */
Path.prototype.sample = function(vector, t) {

};