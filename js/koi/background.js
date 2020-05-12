/**
 * The background of the scene
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @constructor
 */
const Background = function(gl, width, height) {
    this.renderTarget = new RenderTarget(gl, width, height, gl.RGB, gl.NEAREST);
};

/**
 * Free all resources maintained by the background
 */
Background.prototype.free = function() {
    this.renderTarget.free();
};