/**
 * The scene foreground
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 * @constructor
 */
const Foreground = function(gl, constellation, random) {
    this.plants = new Plants(gl, constellation, random);
};

/**
 * Render foreground graphics
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Foreground.prototype.render = function(vegetation, width, height, scale) {
    this.plants.render(vegetation, width, height, scale);
};

/**
 * Free all resources maintained by the foreground
 */
Foreground.prototype.free = function() {
    this.plants.free();
};