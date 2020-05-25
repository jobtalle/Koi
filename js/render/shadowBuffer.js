/**
 * A shadow buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @constructor
 */
const ShadowBuffer = function(gl, width, height) {
    this.width = Math.round(width * this.SCALE);
    this.height = Math.round(height * this.SCALE);
    this.renderTarget = new RenderTarget(gl, this.width, this.height, gl.RGB, gl.LINEAR);
};

ShadowBuffer.prototype.SCALE = .25;

/**
 * Free all resources maintained by this shadow buffer
 */
ShadowBuffer.prototype.free = function() {
    this.renderTarget.free();
};