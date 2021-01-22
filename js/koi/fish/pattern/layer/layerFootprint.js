/**
 * A layer footprint to match a layer to
 * @param {Number} id The layer ID
 * @param {Number} paletteIndex The layer palette index
 * @constructor
 */
const LayerFootprint = function(id, paletteIndex) {
    this.id = id;
    this.paletteIndex = paletteIndex;
};

LayerFootprint.PALETTE_ANY = -1;
LayerFootprint.PALETTE_UNIQUE = -2;
LayerFootprint.PALETTE_UNIQUE_LAYER = -3;
LayerFootprint.PALETTE_SHARED = -4;

/**
 * Count the number of occurrences of a given value in an array
 * @param {Number} value The value to look for
 * @param {Number[]} array The array
 * @returns {Number} The number of occurrences of value in array
 */
LayerFootprint.prototype.occurrences = function(value, array) {
    let count = 0;

    for (const number of array)
        if (number === value)
            ++count;

    return count;
};

/**
 * Check if a layer matches this footprint
 * @param {Layer} layer A layer
 * @param {Layer} [other] The other layer, required if PALETTE_UNIQUE_LAYER is used
 * @param {Number[]} [colors] All palette indices occurring in both parents, required if PALETTE_UNIQUE is used
 * @returns {Boolean} True if the given layer matches the footprint
 */
LayerFootprint.prototype.matches = function(layer, other = null, colors = null) {
    if (this.id !== layer.id)
        return false;

    if (this.paletteIndex === LayerFootprint.PALETTE_UNIQUE_LAYER) {
        if (!other)
            return true;

        return layer.paletteIndex !== other.paletteIndex;
    }
    else if (this.paletteIndex === LayerFootprint.PALETTE_SHARED) {
        if (!other)
            return false;

        return layer.paletteIndex === other.paletteIndex;
    }

    if (colors && this.paletteIndex === LayerFootprint.PALETTE_UNIQUE)
        return this.occurrences(layer.paletteIndex, colors) === 1;

    return this.paletteIndex === LayerFootprint.PALETTE_ANY || layer.paletteIndex === this.paletteIndex;
};

/**
 * Check whether this footprint is equal to another given footprint
 * @param {LayerFootprint} other The other footprint
 * @returns {Boolean} True if the footprints are equal
 */
LayerFootprint.prototype.equals = function(other) {
    return this.id === other.id && this.paletteIndex === other.paletteIndex;
};