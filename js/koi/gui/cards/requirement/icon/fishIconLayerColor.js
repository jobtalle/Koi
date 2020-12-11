/**
 * A fish icon color layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerColor = function(paletteIndex) {
    this.paletteIndex = paletteIndex;

    FishIconLayer.call(this);
};

FishIconLayerColor.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayerColor.prototype.draw = function(group) {
    group.appendChild(this.createFilledLayer(this.ID_BASE + this.paletteIndex.toString()));
};