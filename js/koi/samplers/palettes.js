/**
 * All palettes to sample fish colors from
 * @constructor
 */
const Palettes = function() {
    const colorBaseWhite = Color.fromCSS("fish-base-white");
    const colorBaseBlack = Color.fromCSS("fish-base-black");
    const colorDetailRed = Color.fromCSS("fish-detail-red");
    const colorDetailOrange = Color.fromCSS("fish-detail-orange");

    const paletteDetailBright = new Palette([
        new Palette.Color(new Palette.Sample(5, 5), colorDetailRed),
        new Palette.Color(new Palette.Sample(10, 10), colorDetailOrange)]);

    this.base = new Palette([
        new Palette.Color(new Palette.Sample(4, 12), colorBaseWhite, paletteDetailBright),
        new Palette.Color(new Palette.Sample(8, 12), colorBaseBlack)]);
};