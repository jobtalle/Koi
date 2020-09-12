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
        new Palette.Color(new Palette.Sample(8, 8), colorDetailGold)]);

    const paletteDetailOnWhite = new Palette([
        new Palette.Color(new Palette.Sample(3, 5), colorDetailRed),
        new Palette.Color(new Palette.Sample(7, 7), colorDetailGold),
        new Palette.Color(new Palette.Sample(10, 10), colorDetailOrange, paletteDetailOnRed)]);

    const paletteDetailOnBlack = new Palette([
        new Palette.Color(new Palette.Sample(5, 5), colorDetailWhite)]);

    this.base = new Palette([
        new Palette.Color(new Palette.Sample(4, 11), colorBaseWhite, paletteDetailOnWhite),
        new Palette.Color(new Palette.Sample(8, 13), colorBaseBlack, paletteDetailOnBlack)]);
};