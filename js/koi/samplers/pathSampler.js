/**
 * A path sampler
 * @constructor
 */
const PathSampler = function() {
    this.length = 0;
    // TODO: more common things
};

PathSampler.prototype.EPSILON = .005;

/**
 * Get the exact length of this path
 * @returns {Number} The length
 */
PathSampler.prototype.getLength = function() {
    return this.length;
};