/**
 * A water plane to render waves on
 * @param {WebGLRenderingContext} gl A WebGL render context
 * @param {Number} width The scene width in pixels
 * @param {Number} height The scene height in pixels
 * @constructor
 */
const WaterPlane = function(gl, width, height) {
    // TODO: Use LUMINANCE_ALPHA 2 channel format, you don't need more
    this.front = 0;
    this.targets = [
        new RenderTarget(gl, width, height, gl.RGBA, gl.LINEAR),
        new RenderTarget(gl, width, height, gl.RGBA, gl.LINEAR)
    ];
};

/**
 * Return the render target currently used as the front buffer
 * @returns {RenderTarget} The current front buffer
 */
WaterPlane.prototype.getFront = function() {
    return this.targets[this.front];
};

/**
 * Return the render target currently used as the back buffer
 * @returns {RenderTarget} The current back buffer
 */
WaterPlane.prototype.getBack = function() {
    return this.targets[1 - this.front];
};

/**
 * Free all resources maintained by this water plane
 */
WaterPlane.prototype.free = function() {
    for (const target of this.targets)
        target.free();
};