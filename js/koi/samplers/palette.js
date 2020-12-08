/**
 * All palette to sample fish colors from
 * @constructor
 */
const Palette = function() {
    this.colors = [
        Color.fromCSS("--color-fish-white"),
        Color.fromCSS("--color-fish-black"),
        Color.fromCSS("--color-fish-gold"),
        Color.fromCSS("--color-fish-orange"),
        Color.fromCSS("--color-fish-red"),
        Color.fromCSS("--color-fish-brown")
    ];
};

Palette.prototype.INDEX_WHITE = 0;
Palette.prototype.INDEX_BLACK = 1;
Palette.prototype.INDEX_GOLD = 2;
Palette.prototype.INDEX_ORANGE = 3;
Palette.prototype.INDEX_RED = 4;
Palette.prototype.INDEX_BROWN = 5;
Palette.prototype.LANG_NAME_KOHAKU = "NAME_KOHAKU";
Palette.prototype.LANG_NAME_SHOWA = "NAME_SHOWA";
Palette.prototype.LANG_NAME_NEZU_OGON = "NAME_NEZU_OGON";
Palette.prototype.LANG_NAME_KUMONRYU = "NAME_KUMONRYU";
Palette.prototype.LANG_NAME_MAGOI = "NAME_MAGOI";
Palette.prototype.LANG_NAME_NISHIKIGOI = "NAME_NISHIKIGOI";

/**
 * Name a combination of layers
 * @param {LayerBase} base The base layer
 * @param {Layer[]} layers All layers on top of the base layer
 * @returns {String} A koi name
 */
Palette.prototype.makeName = function(base, layers) {
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