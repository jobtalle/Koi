/**
 * A water plane to render waves on
 * @param {WebGLRenderingContext} gl A WebGL render context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const Water = function(gl, width, height) {
    ConvolutionalBuffer.call(this, gl, width, height, this.SCALE, new Color(.5, .5, 0), gl.RGB);
};

Water.prototype = Object.create(ConvolutionalBuffer.prototype);
Water.prototype.SCALE = 18;

/**
 * Add a flare of wave height to the water plane
 * @param {Number} x The X position of the flare
 * @param {Number} y The Y position of the flare
 * @param {Number} radius The flare radius
 * @param {Number} displacement The amount of displacement in the range [0, 1]
 */
Water.prototype.addFlare = function(x, y, radius, displacement) {
    this.influences.addFlare(x, y, radius, 0, 0, displacement);
};