/**
 * This object contains environment reflections and ambient lighting information
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Shore} shore A shore object whose values will be stored in the alpha channel
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Blur} blur The blur system
 * @param {Quad} quad The quad renderer
 * @constructor
 */
const Reflections = function(
    gl,
    width,
    height,
    shore,
    stone,
    vegetation,
    blur,
    quad) {
    this.gl = gl;
    this.texture = this.makeTextureReflections(width, height, shore, stone, vegetation, blur, quad);
};

Reflections.prototype.SCALE = 17;
Reflections.prototype.COLOR_SKY = Color.fromCSS("--color-sky");

/**
 * Make the reflections texture
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Shore} shore A shore object
 * @param {Stone} stone The stone renderer
 * @param {Vegetation} vegetation The vegetation renderer
 * @param {Blur} blur The blur system
 * @param {Quad} quad The quad renderer
 * @returns {WebGLTexture} The reflections texture
 */
Reflections.prototype.makeTextureReflections = function(
    width,
    height,
    shore,
    stone,
    vegetation,
    blur,
    quad) {
    const widthPixels = Math.ceil(width * this.SCALE);
    const heightPixels = Math.ceil(height * this.SCALE);
    const renderTarget = new RenderTarget(
        this.gl,
        widthPixels,
        heightPixels,
        this.gl.RGBA,
        true);
    const intermediate = new RenderTarget(
        this.gl,
        widthPixels,
        heightPixels,
        this.gl.RGBA,
        true);

    renderTarget.target();

    this.gl.clearColor(this.COLOR_SKY.r, this.COLOR_SKY.g, this.COLOR_SKY.b, this.COLOR_SKY.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    stone.renderReflections();
    vegetation.renderReflections();

    this.gl.disable(this.gl.DEPTH_TEST);

    blur.applyQuad(renderTarget, intermediate);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ZERO, this.gl.SRC_COLOR);

    quad.render(shore.texture);

    this.gl.disable(this.gl.BLEND);

    this.gl.bindTexture(this.gl.TEXTURE_2D, renderTarget.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    intermediate.free();

    return renderTarget.extractTexture();
};

/**
 * Free all resources maintained by the reflections object
 */
Reflections.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};