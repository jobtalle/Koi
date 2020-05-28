/**
 * The scene foreground
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 * @constructor
 */
const Foreground = function(
    gl,
    stone,
    vegetation,
    constellation,
    random) {
    this.gl = gl;
    this.plants = new Plants(gl, constellation, random);
    this.rocks = new Rocks(gl, constellation, random);
    this.reflections = new RenderTarget(
        gl,
        Math.round(constellation.width * this.REFLECTION_SCALE),
        Math.round(constellation.height * this.REFLECTION_SCALE),
        gl.RGBA,
        true,
        gl.NEAREST);
};

Foreground.prototype.REFLECTION_SCALE = 80;

/**
 * Make the reflections
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Foreground.prototype.makeReflections = function(
    stone,
    vegetation,
    width,
    height,
    scale) {
    this.reflections.target();

    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    stone.renderReflections(width, height, scale);
    vegetation.renderReflections(width, height, scale);

    this.gl.disable(this.gl.DEPTH_TEST);
};

/**
 * Render foreground graphics
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Stone} stone The stone renderer
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Foreground.prototype.render = function(vegetation, stone, width, height, scale) {
    stone.render(width, height, scale);
    vegetation.render(width, height, scale);
};

/**
 * Free all resources maintained by the foreground
 */
Foreground.prototype.free = function() {
    this.plants.free();
    this.rocks.free();
    this.reflections.free();
};