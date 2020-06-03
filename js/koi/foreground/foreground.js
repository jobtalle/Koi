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
    const slots = new Slots(constellation.width, constellation.height, constellation, random);

    this.gl = gl;
    this.rocks = new Rocks(gl, constellation, slots, random);
    this.plants = new Plants(gl, constellation, slots, random);
    this.reflections = new RenderTarget(
        gl,
        Math.round(constellation.width * this.REFLECTION_SCALE),
        Math.round(constellation.height * this.REFLECTION_SCALE),
        gl.RGB,
        true,
        gl.LINEAR);
};

Foreground.prototype.REFLECTION_SCALE = 40;
Foreground.prototype.SKY_COLOR = Color.fromCSS("sky");

/**
 * Make the reflections
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Blur} blur The blur system
 * @param {Quad} quad The quad renderer
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Foreground.prototype.makeReflections = function(
    stone,
    vegetation,
    blur,
    quad,
    width,
    height,
    scale) {
    this.reflections.target();

    this.renderReflections(stone, vegetation, width, height, scale);
    this.blurReflections(blur, quad, width, height, scale);

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.reflections.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
};

/**
 * Render the reflected foreground scene
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Foreground.prototype.renderReflections = function(stone, vegetation, width, height, scale) {
    this.gl.clearColor(this.SKY_COLOR.r, this.SKY_COLOR.g, this.SKY_COLOR.b, this.SKY_COLOR.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.DEPTH_TEST);

    stone.renderReflections(width, height, scale);
    vegetation.renderReflections(width, height, scale);

    this.gl.disable(this.gl.DEPTH_TEST);
};

/**
 * Blur the reflections
 * @param {Blur} blur The blur system
 * @param {Quad} quad The quad renderer
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Foreground.prototype.blurReflections = function(blur, quad, width, height, scale) {
    const intermediate = new RenderTarget(this.gl, this.reflections.width, this.reflections.height, this.gl.RGB, false);

    intermediate.target();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.reflections.texture);

    quad.render();

    blur.applyQuad(this.reflections, intermediate);

    intermediate.free();
};

/**
 * Render foreground graphics
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Stone} stone The stone renderer
 * @param {Air} air An air object
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 * @param {Number} time The time interpolation factor
 */
Foreground.prototype.render = function(
    vegetation,
    stone,
    air,
    width,
    height,
    scale,
    time) {
    stone.render(width, height, scale);
    vegetation.render(air, width, height, scale, time);
};

/**
 * Free all resources maintained by the foreground
 */
Foreground.prototype.free = function() {
    this.plants.free();
    this.rocks.free();
    this.reflections.free();
};