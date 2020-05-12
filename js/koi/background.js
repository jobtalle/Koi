/**
 * The background of the scene
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @constructor
 */
const Background = function(gl, width, height) {
    this.renderTarget = new RenderTarget(gl, width, height, gl.RGB, gl.NEAREST);
    this.width = width;
    this.height = height;
};

/**
 * Render the background
 * @param {Primitives} primitives The primitives renderer
 */
Background.prototype.render = function(primitives) {
    primitives.setTexture(this.renderTarget.texture);
    primitives.drawQuad(0, 0, this.width, this.height);
    primitives.flush();
};

/**
 * Free all resources maintained by the background
 */
Background.prototype.free = function() {
    this.renderTarget.free();
};