/**
 * A bug spawner
 * @constructor
 */
const BugSpawner = function() {
};

/**
 * Spawn a bug body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Random} random A randomizer
 * @returns {BugBody} The bug body
 */
BugSpawner.prototype.spawn = function(gl, random) {
    return random.getFloat() < .5 ? new BugBodyButterflySunny(gl) : new BugBodyButterflyRainy(gl);
};