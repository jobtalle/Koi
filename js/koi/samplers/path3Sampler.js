/**
 * A 3D path sampler
 * @param {Path3} path The path to sample
 * @constructor
 */
const Path3Sampler = function(path) {
    PathSampler.call(this, path);
};

Path3Sampler.prototype = Object.create(PathSampler.prototype);