/**
 * All palettes to sample fish colors from
 * @constructor
 */
const Palettes = function() {
    const colorBaseWhite = Color.fromCSS("fish-base-white");
    const colorBaseBlack = Color.fromCSS("fish-base-black");

    const colorDetailRed = Color.fromCSS("fish-detail-red");
    const colorDetailOrange = Color.fromCSS("fish-detail-orange");
    const colorDetailGold = Color.fromCSS("fish-detail-gold");
    const colorDetailWhite = Color.fromCSS("fish-detail-white");

    const paletteDetailOnRed = new Palette([
        new Palette.Color(new Palette.Sample(8, 8), colorDetailGold)]);

    const paletteDetailOnWhite = new Palette([
        new Palette.Color(new Palette.Sample(5, 5), colorDetailRed),
        new Palette.Color(new Palette.Sample(7, 7), colorDetailGold),
        new Palette.Color(new Palette.Sample(10, 10), colorDetailOrange, paletteDetailOnRed)]);

    const paletteDetailOnBlack = new Palette([
        new Palette.Color(new Palette.Sample(0, 0), colorDetailWhite)]);

    this.base = new Palette([
        new Palette.Color(new Palette.Sample(4, 12), colorBaseWhite, paletteDetailOnWhite),
        new Palette.Color(new Palette.Sample(8, 12), colorBaseBlack, paletteDetailOnBlack)]);
};