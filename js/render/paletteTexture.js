/**
 * A texture for a palette sampler
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Palette} palette The palette to create this texture for
 * @constructor
 */
const PaletteTexture = function(gl, palette) {
    this.gl = gl;
    this.texture = gl.createTexture();

    this.initialize(palette);
};

/**
 * Create the initial pixels
 * @param {Palette} palette The palette to create a Voronoi diagram from
 * @returns {Uint8Array} The initial pixel array
 */
PaletteTexture.prototype.createInitialPixels = function(palette) {
    const pixels = new Array(196608); // 256 * 256 * 3

    for (const color of palette.colors) {
        const index = 3 * (color.sample.x + color.sample.y * 256);

        pixels[index] = color.r;
        pixels[index] = color.g;
        pixels[index] = color.b;
    }

    return new Uint8Array(pixels);
};

/**
 * Initialize the texture
 * @param {Palette} palette The palette to create a Voronoi diagram from
 */
PaletteTexture.prototype.initialize = function(palette) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGB,
        256,
        256,
        0,
        this.gl.RGB,
        this.gl.UNSIGNED_BYTE,
        this.createInitialPixels(palette));
};

/**
 * Free all resources maintained by this texture
 */
PaletteTexture.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};