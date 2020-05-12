/**
 * The background of the scene
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Sand} sand The sand renderer
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {Number} scale The render scale
 * @constructor
 */
const Background = function(gl, sand, width, height, scale) {
    this.bottom = new RenderTarget(gl, width, height, gl.RGB, gl.NEAREST, gl.UNSIGNED_BYTE);
    this.width = width;
    this.height = height;

    this.paintSand(sand, scale);
};

/**
 * Paint sand on the bottom
 * @param {Sand} sand The sand renderer
 * @param {Number} scale The render scale
 */
Background.prototype.paintSand = function(sand, scale) {
    this.bottom.target();

    sand.write(scale);
};

/**
 * Render the background
 * @param {Primitives} primitives The primitives renderer
 */
Background.prototype.render = function(primitives) {
    primitives.setTexture(this.bottom.texture);
    primitives.drawQuad(0, 0, this.width, this.height);
    primitives.flush();
};

/**
 * Free all resources maintained by the background
 */
Background.prototype.free = function() {
    this.bottom.free();
};