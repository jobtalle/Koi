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

Palettes.prototype.LANG_NAME_KOHAKU = "NAME_KOHAKU";
Palettes.prototype.LANG_NAME_SHOWA = "NAME_SHOWA";
Palettes.prototype.LANG_NAME_NEZU_OGON = "NAME_NEZU_OGON";
Palettes.prototype.LANG_NAME_KUMONRYU = "NAME_KUMONRYU";
Palettes.prototype.LANG_NAME_MAGOI = "NAME_MAGOI";
Palettes.prototype.LANG_NAME_NISHIKIGOI = "NAME_NISHIKIGOI";

/**
 * Name a combination of layers
 * @param {LayerBase} base The base layer
 * @param {Layer[]} layers All layers on top of the base layer
 * @returns {String} A koi name
 */
Palettes.prototype.makeName = function(base, layers) {
    switch (base.paletteIndex) {
        case 0:
            switch (layers.length) {
                case 1:
                    switch (layers[0].paletteIndex) {
                        case 0:
                            return language.get(this.LANG_NAME_KOHAKU);
                        case 1:
                            return language.get(this.LANG_NAME_SHOWA);
                    }

                    break;
                default:
                    return language.get(this.LANG_NAME_NEZU_OGON);
            }

            break;
        case 1:
            switch (layers.length) {
                case 1:
                    switch (layers[0].paletteIndex) {
                        case 0:
                            return language.get(this.LANG_NAME_KUMONRYU);
                    }

                    break;
                default:
                    return language.get(this.LANG_NAME_MAGOI);
            }

            break;
    }

    return language.get(this.LANG_NAME_NISHIKIGOI);
};