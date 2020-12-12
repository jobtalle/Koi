/**
 * A fish icon base layer
 * @param {Number} paletteIndex The palette index
 * @constructor
 */
const FishIconLayerBase = function(paletteIndex) {
    this.paletteIndex = paletteIndex;

    FishIconLayer.call(this);
};

FishIconLayerBase.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayerBase.prototype.draw = function(group) {
    group.appendChild(this.createFilledLayer(this.ID_BASE + this.paletteIndex.toString()));
};