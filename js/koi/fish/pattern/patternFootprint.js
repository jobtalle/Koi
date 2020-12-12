/**
 * A pattern footprint
 * @param {LayerFootprint[]} layers The layer footprints for this pattern
 * @constructor
 */
const PatternFootprint = function(layers) {
    this.layers = layers;
};

/**
 * Check if a pattern matches this footprint
 * @param {Pattern} pattern The pattern
 * @param {Pattern} [other] The other pattern, required if PALETTE_UNIQUE_LAYER is used
 * @param {Number[]} [colors] All palette indices occurring in both parents, required if PALETTE_UNIQUE is used
 */
PatternFootprint.prototype.matches = function(pattern, other = null, colors = null) {
    if (pattern.layers.length !== this.layers.length - 1)
        return false;

    if (!this.layers[0].matches(pattern.base, other ? other.base : null, colors))
        return false;

    for (let layer = 0, layerCount = this.layers - 1; layer < layerCount; ++layer)
        if (!this.layers[layer + 1].matches(pattern.layers[layer], other ? other.layers[layer] : null, colors))
            return false;

    return true;
};

/**
 * Check whether this footprint is equal to another given footprint
 * @param {PatternFootprint} other The other footprint
 * @returns {Boolean} True if the footprints are equal
 */
PatternFootprint.prototype.equals = function(other) {
    if (this.layers.length !== other.layers.length)
        return false;

    for (let layer = 0, layerCount = this.layers.length; layer < layerCount; ++layer)
        if (!this.layers[layer].equals(other.layers[layer]))
            return false;

    return true;
};