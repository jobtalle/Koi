/**
 * All palettes to sample fish colors from
 * @constructor
 */
const Palettes = function() {
    const colorBaseWhite = Color.fromCSS("--color-fish-base-white");
    const colorBaseBlack = Color.fromCSS("--color-fish-base-black");
    const colorBaseGold = Color.fromCSS("--color-fish-base-gold");
    const colorBaseRed = Color.fromCSS("--color-fish-base-red");
    const colorBaseBrown = Color.fromCSS("--color-fish-base-brown");

    const colorDetailWhite = Color.fromCSS("--color-fish-detail-white");
    const colorDetailBlack = Color.fromCSS("--color-fish-detail-black");
    const colorDetailRed = Color.fromCSS("--color-fish-detail-red");
    const colorDetailLightRed = Color.fromCSS("--color-fish-detail-light-red");

    const paletteDetailOnWhite = new Palette([
        new Palette.Color(colorDetailRed),
        new Palette.Color(colorDetailBlack)
    ]);

    const paletteDetailOnBlack = new Palette([
        new Palette.Color(colorDetailWhite),
        new Palette.Color(colorDetailLightRed)
    ]);

    const paletteDetailOnGold = new Palette([
        new Palette.Color(colorDetailBlack)
    ]);

    const paletteDetailOnRed = new Palette([
        new Palette.Color(colorDetailWhite)
    ]);

    this.base = new Palette([
        new Palette.Color(colorBaseWhite, paletteDetailOnWhite),
        new Palette.Color(colorBaseBlack, paletteDetailOnBlack),
        new Palette.Color(colorBaseGold, paletteDetailOnGold),
        new Palette.Color(colorBaseRed, paletteDetailOnRed),
        new Palette.Color(colorBaseBrown)]);
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