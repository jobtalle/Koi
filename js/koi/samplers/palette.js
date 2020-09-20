/**
 * A color palette
 * @param {Palette.Color[]} colors The colors on this palette
 * @constructor
 */
const Palette = function(colors) {
    this.colors = colors;
};

/**
 * A color on a palette
 * @param {Color} color The color
 * @param {Palette} [palette] A palette that may overlap this color
 * @constructor
 */
Palette.Color = function(color, palette = null) {
    this.color = color;
    this.palette = palette;
};