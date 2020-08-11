/**
 * A shadow buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const ShadowBuffer = function(gl, width, height) {
    const widthPixels = Math.ceil(width * this.SCALE);
    const heightPixels = Math.ceil(height * this.SCALE);

    this.gl = gl;

    this.renderTarget = new RenderTarget(gl, widthPixels, heightPixels, gl.RGBA, false);
    this.intermediate = new RenderTarget(gl, widthPixels, heightPixels, gl.RGBA, false);
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
 * Blur the shadows after rendering to this buffer
 * @param {Blur} blur The blur system
 */
ShadowBuffer.prototype.blur = function(blur) {
    blur.applyMesh(this.renderTarget, this.intermediate);
};

/**
 * Free all resources maintained by this shadow buffer
 */
ShadowBuffer.prototype.free = function() {
    this.renderTarget.free();
    this.intermediate.free();
};