/**
 * A shadow buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const ShadowBuffer = function(gl, width, height) {
    this.gl = gl;
    this.width = Math.round(width * this.SCALE);
    this.height = Math.round(height * this.SCALE);

    this.renderTarget = new RenderTarget(gl, this.width, this.height, gl.RGBA, gl.NEAREST);
    this.intermediate = new RenderTarget(gl, this.width, this.height, gl.RGBA, gl.NEAREST);
};

ShadowBuffer.prototype.SCALE = 26;

/**
 * Target this shadow buffer
 */
ShadowBuffer.prototype.target = function() {
    this.renderTarget.target();

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

/**
 * Free all resources maintained by this shadow buffer
 */
ShadowBuffer.prototype.free = function() {
    this.renderTarget.free();
    this.intermediate.free();
};