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
    const slots = new Slots(constellation.width, constellation.height + this.Y_OVERFLOW, constellation, random);
    const biome = new Biome(constellation, slots.width, slots.height, random);

    this.gl = gl;
    this.rocks = new Rocks(gl, constellation, slots, this.Y_SCALE, biome, random);
    this.plants = new Plants(gl, constellation, slots, biome, random);
    this.reflections = new RenderTarget(
        gl,
        Math.round(constellation.width * this.REFLECTION_SCALE),
        Math.round(constellation.height * this.REFLECTION_SCALE),
        gl.RGB,
        true,
        gl.LINEAR);
};

Foreground.prototype.REFLECTION_SCALE = 25;
Foreground.prototype.Y_SCALE = .74;
Foreground.prototype.Y_OVERFLOW = .3;
Foreground.prototype.SKY_COLOR = Color.fromCSS("sky");

/**
 * Make the reflections
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Blur} blur The blur system
 * @param {Quad} quad The quad renderer
 */
Foreground.prototype.makeReflections = function(stone, vegetation, blur, quad) {
    this.reflections.target();

    this.renderReflections(stone, vegetation);
    this.blurReflections(blur, quad);

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.reflections.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
};

/**
 * Render the reflected foreground scene
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 */
Foreground.prototype.renderReflections = function(stone, vegetation) {
    this.gl.clearColor(this.SKY_COLOR.r, this.SKY_COLOR.g, this.SKY_COLOR.b, this.SKY_COLOR.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.DEPTH_TEST);

    stone.renderReflections();
    vegetation.renderReflections();

    this.gl.disable(this.gl.DEPTH_TEST);
};

/**
 * Blur the reflections
 * @param {Blur} blur The blur system
 * @param {Quad} quad The quad renderer
 */
Foreground.prototype.blurReflections = function(blur, quad) {
    const intermediate = new RenderTarget(this.gl, this.reflections.width, this.reflections.height, this.gl.RGB, false);

    intermediate.target();

    quad.render(this.reflections.texture);

    blur.applyQuad(this.reflections, intermediate);

    intermediate.free();
};

/**
 * Render foreground graphics
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Stone} stone The stone renderer
 * @param {Air} air An air object
 * @param {Number} time The time interpolation factor
 */
Foreground.prototype.render = function(
    vegetation,
    stone,
    air,
    time) {
    stone.render();
    vegetation.render(air, time);
};

/**
 * Free all resources maintained by the foreground
 */
Foreground.prototype.free = function() {
    this.plants.free();
    this.rocks.free();
    this.reflections.free();
};