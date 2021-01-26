/**
 * A 2D path sampler
 * @param {Path2} path The path to sample
 * @constructor
 */
const Path2Sampler = function(path) {
    PathSampler.call(this, path);
};

Path2Sampler.prototype = Object.create(PathSampler.prototype);