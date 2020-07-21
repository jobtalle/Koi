/**
 * A texture for a palette sampler
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Palette} palette The palette to create this texture for
 * @param {Voronoi} voronoi The voronoi diagram renderer
 * @constructor
 */
const PaletteTexture = function(gl, palette, voronoi) {
    this.gl = gl;
    this.texture = gl.createTexture();

    this.initialize(palette, voronoi);
};

/**
 * Initialize the texture
 * @param {Palette} palette The palette to create a Voronoi diagram from
 * @param {Voronoi} voronoi The voronoi diagram renderer
 */
PaletteTexture.prototype.initialize = function(palette, voronoi) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGB,
        256,
        256,
        0,
        this.gl.RGB,
        this.gl.UNSIGNED_BYTE,
        null);

    const locations = [];
    const colors = [];

    for (const color of palette.colors) {
        locations.push(new Vector2(color.sample.x, color.sample.y));
        colors.push(color.color);
    }

    voronoi.apply(
        this.texture,
        256,
        256,
        palette.colors.length,
        locations,
        colors);
};

/**
 * Free all resources maintained by this texture
 */
PaletteTexture.prototype.free = function() {
    this.gl.deleteTexture(this.texture);
};