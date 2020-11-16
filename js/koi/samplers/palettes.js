/**
 * All palettes to sample fish colors from
 * @constructor
 */
const Palettes = function() {
    const colorBaseWhite = Color.fromCSS("--color-fish-base-white");
    const colorBaseBlack = Color.fromCSS("--color-fish-base-black");

    const colorDetailRed = Color.fromCSS("--color-fish-detail-red");
    const colorDetailOrange = Color.fromCSS("--color-fish-detail-orange");
    const colorDetailGold = Color.fromCSS("--color-fish-detail-gold");
    const colorDetailWhite = Color.fromCSS("--color-fish-detail-white");

    const paletteDetailOnRed = new Palette([
        new Palette.Color(colorDetailGold)]);

    const paletteDetailOnWhite = new Palette([
        new Palette.Color(colorDetailRed),
        new Palette.Color(colorDetailGold),
        new Palette.Color(colorDetailOrange, paletteDetailOnRed)]);

    const paletteDetailOnBlack = new Palette([
        new Palette.Color(colorDetailWhite)]);

    this.base = new Palette([
        new Palette.Color(colorBaseWhite, paletteDetailOnWhite),
        new Palette.Color(colorBaseBlack, paletteDetailOnBlack)]);
};

/**
 * Name a combination of layers
 * @param {LayerBase} base The base layer
 * @param {Layer[]} layers All layers on top of the base layer
 * @returns {String} A koi name
 */
Palettes.prototype.makeName = function(base, layers) {
    return "Asagi Magoi";
};