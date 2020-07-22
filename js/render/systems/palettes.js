/**
 * All palettes to sample fish colors from
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Voronoi} voronoi The voronoi renderer to initialize palette textures
 * @constructor
 */
const Palettes = function(gl, voronoi) {
    this.gl = gl;

    this.textureBase = new PaletteTexture(
        gl,
        new Palette([
            new Palette.Color(new Palette.Sample(50, 30), Color.fromCSS("fish-base-1")),
            new Palette.Color(new Palette.Sample(150, 30), Color.fromCSS("fish-base-1")),
            new Palette.Color(new Palette.Sample(200, 50), Color.fromCSS("fish-base-2")),
            new Palette.Color(new Palette.Sample(60, 20), Color.fromCSS("fish-base-3")),
            new Palette.Color(new Palette.Sample(160, 180), Color.fromCSS("fish-base-4"))
        ]),
        voronoi);

    this.textureLayer1 = new PaletteTexture(
        gl,
        new Palette([
            new Palette.Color(new Palette.Sample(128, 128), Color.fromCSS("fish-spots-1")),
            new Palette.Color(new Palette.Sample(169, 138), Color.fromCSS("fish-spots-2")),
            new Palette.Color(new Palette.Sample(25, 190), Color.fromCSS("fish-spots-3"))
        ]),
        voronoi);
};

/**
 * Bind the palette textures
 * @param {GLenum} first The first texture unit to bind at
 */
Palettes.prototype.bindTextures = function(first) {
    this.gl.activeTexture(first);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureBase.texture);
    this.gl.activeTexture(first + 1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureLayer1.texture);
};

/**
 * Free all resources maintained by this object
 */
Palettes.prototype.free = function() {
    this.textureBase.free();
    this.textureLayer1.free();
};