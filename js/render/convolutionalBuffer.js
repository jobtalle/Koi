/**
 * A buffer made for self updating, using alternating front and back buffers
 * @param {WebGLRenderingContext} gl A WebGL render context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Number} scale The scale of objects on this buffer
 * @param {Color} clearColor The default buffer color
 * @param {GLenum} format The buffer format
 * @constructor
 */
const ConvolutionalBuffer = function(
    gl,
    width,
    height,
    scale,
    clearColor,
    format) {
    this.front = 0;
    this.width = Math.ceil(width * scale);
    this.height = Math.ceil(height * scale);
    this.influences = new InfluencePainter.Influences(this.width, this.height, scale);
    this.targets = [
        new RenderTarget(gl, this.width, this.height, format, false, gl.NEAREST),
        new RenderTarget(gl, this.width, this.height, format, false, gl.NEAREST)];

    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);

    for (const target of this.targets) {
        target.target();

        gl.clear(gl.COLOR_BUFFER_BIT);
    }
};

/**
 * Flip the buffers
 */
ConvolutionalBuffer.prototype.flip = function() {
    this.front = 1 - this.front;
};

/**
 * Return the render target currently used as the front buffer
 * @returns {RenderTarget} The current front buffer
 */
ConvolutionalBuffer.prototype.getFront = function() {
    return this.targets[this.front];
};

/**
 * Return the render target currently used as the back buffer
 * @returns {RenderTarget} The current back buffer
 */
ConvolutionalBuffer.prototype.getBack = function() {
    return this.targets[1 - this.front];
};

/**
 * Free all resources
 */
ConvolutionalBuffer.prototype.free = function() {
    for (const target of this.targets)
        target.free();
};