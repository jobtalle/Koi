/**
 * A sampling track through a palette tree
 * @param {Palette} palette The start palette
 * @constructor
 */
const PaletteTrack = function(palette) {
    this.palette = palette;
    this.lastLayer = null;
    this.sample = null;
};

/**
 * Add a layer to the palette track and sample its color
 * @param {Layer} layer The layer
 * @returns {Color} The color for this layer, or null when the tree has ended
 */
PaletteTrack.prototype.next = function(layer) {
    if (this.lastLayer) {
        if (layer.paletteSample !== null) {
            if (!(this.lastLayer.flags & this.lastLayer.FLAG_ALLOW_OVERLAP) || !(layer.flags & layer.FLAG_OVERLAPS)) {
                if ((this.palette = this.sample.palette) === null)
                    return null;

                this.sample = this.palette.sample(layer.paletteSample);
            }
        }
    }
    else
        this.sample = this.palette.sample(layer.paletteSample);

    this.lastLayer = layer;

    return this.sample.color;
};