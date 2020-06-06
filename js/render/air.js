/**
 * An air plane to render wind on
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const Air = function(gl, width, height) {
    ConvolutionalBuffer.call(this, gl, width, height, this.SCALE, new Color(.5, 0, 0, .5), gl.RGBA);
};

Air.prototype = Object.create(ConvolutionalBuffer.prototype);
Air.prototype.SCALE = 4;

/**
 * Add displacement to the air
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} radius The displacement radius
 * @param {Number} amount The amount of displacement in the range [-1, 1]
 */
Air.prototype.addDisplacement = function(x, y, radius, amount) {
    if (amount > 0)
        this.influences.addFlare(x, y, radius, 0, 0, amount);
    else
        this.influences.addFlare(x, y, radius, 0, -amount, 0);
};