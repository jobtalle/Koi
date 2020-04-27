/**
 * The pattern renderer
 * @param {WebGLRenderingContext} gl A webGL context
 * @constructor
 */
const Patterns = function(gl) {
    this.gl = gl;
};

/**
 * Free all resources maintained by the pattern renderer
 */
Patterns.prototype.free = function() {

}