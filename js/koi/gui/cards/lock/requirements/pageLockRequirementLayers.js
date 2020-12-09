/**
 * Aa requirement to have a fish with certain pattern layers
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const PageLockRequirementLayers = function(paletteIndex) {
    this.paletteIndex = paletteIndex;
    this.color = Palette.COLORS[paletteIndex];

    PageLockRequirement.call(this);
};

PageLockRequirementLayers.prototype = Object.create(PageLockRequirement.prototype);

/**
 * Create the icon for this requirement
 * @returns {FishIcon} A fish icon
 */
PageLockRequirementLayers.prototype.createIcon = function() {
    return new FishIcon([
        new FishIconLayerColor(this.color),
        new FishIconLayerOutline()
    ]);
};

/**
 * Validate whether this requirement is satisfied
 * @param {FishBody[]} bodies All fish bodies in the book
 */
PageLockRequirementLayers.prototype.validate = function(bodies) {
    for (const body of bodies) if (body.pattern.base.paletteIndex === this.paletteIndex)
        return true;

    return false;
};